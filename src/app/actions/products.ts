// app/actions/products.ts
'use server'

import { prisma } from '@/app/lib/prisma'

export async function getProducts(filters?: {
    category?: string
    search?: string
    sort?: string
    page?: number
}) {
    try {
        const page = filters?.page || 1
        const pageSize = 12
        const skip = (page - 1) * pageSize

        // Build where clause
        const where: any = {
            isActive: true,
        }

        if (filters?.category) {
            where.category = {
                slug: filters.category
            }
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ]
        }

        // Build orderBy clause
        let orderBy: any = { createdAt: 'desc' }

        if (filters?.sort === 'price-asc') orderBy = { price: 'asc' }
        if (filters?.sort === 'price-desc') orderBy = { price: 'desc' }
        if (filters?.sort === 'name') orderBy = { name: 'asc' }

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

        // Calculate average rating for each product
        const productsWithRating = products.map(product => ({
            ...product,
            averageRating: product.reviews.length > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0,
            reviewCount: product.reviews.length
        }))

        return {
            products: productsWithRating,
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