// /src/app/actions/products.ts
'use server'

import { prisma } from '@/app/lib/prisma'
import { Product, ProductFilters } from '../types'
import { Prisma } from '@prisma/client'

export async function getProducts(filters?: ProductFilters): Promise<{
    products: Product[]
    pagination: {
        currentPage: number
        totalPages: number
        totalProducts: number
        hasNext: boolean
        hasPrev: boolean
    } | null
}> {
    try {
        const page = filters?.page || 1
        const pageSize = 12
        const skip = (page - 1) * pageSize

        // Build where clause
        const where: Prisma.ProductWhereInput = {
            isActive: true,
        }

        // Category filter (multiple categories)
        if (filters?.categories) {
            const categorySlugs = filters.categories.split(',')
            where.category = {
                slug: { in: categorySlugs }
            }
        } else if (filters?.category) {
            // Single category (backward compatibility)
            where.category = {
                slug: filters.category
            }
        }

        // Search filter
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ]
        }

        // Price range filter
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            where.price = {}
            if (filters.minPrice !== undefined) {
                where.price.gte = parseFloat(filters.minPrice.toString())
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = parseFloat(filters.maxPrice.toString())
            }
        }

        // Build orderBy clause
        let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }

        switch (filters?.sort) {
            case 'price-asc':
                orderBy = { price: 'asc' }
                break
            case 'price-desc':
                orderBy = { price: 'desc' }
                break
            case 'name':
                orderBy = { name: 'asc' }
                break
            case 'newest':
                orderBy = { createdAt: 'desc' }
                break
            case 'rating':
                // We'll handle rating sorting separately since it's computed
                orderBy = { createdAt: 'desc' } // Default for now
                break
        }

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    reviews: {
                        select: {
                            rating: true
                        }
                    }
                },
                orderBy,
                skip,
                take: pageSize,
            }),
            prisma.product.count({ where })
        ])

        // Calculate average rating for each product and transform to our Product type
        const productsWithRating: Product[] = products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0,
            reviewCount: product.reviews.length
        }))

        // Apply rating sort if needed
        let sortedProducts = productsWithRating
        if (filters?.sort === 'rating') {
            sortedProducts = productsWithRating.sort((a, b) => b.averageRating - a.averageRating)
        }

        return {
            products: sortedProducts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / pageSize),
                totalProducts: totalCount,
                hasNext: page < Math.ceil(totalCount / pageSize),
                hasPrev: page > 1
            }
        }
    } catch (error) {
        console.error('Error fetching products:', error)
        return { products: [], pagination: null }
    }
}