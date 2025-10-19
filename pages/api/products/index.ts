// pages/api/products/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { category, search, sort, page = '1' } = req.query

        const pageNumber = parseInt(page as string)
        const pageSize = 12
        const skip = (pageNumber - 1) * pageSize

        // Build where clause
        const where: any = {
            isActive: true,
        }

        if (category) {
            where.category = {
                slug: category as string
            }
        }

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ]
        }

        // Build orderBy clause
        let orderBy: any = { createdAt: 'desc' }

        if (sort === 'price-asc') orderBy = { price: 'asc' }
        if (sort === 'price-desc') orderBy = { price: 'desc' }
        if (sort === 'name') orderBy = { name: 'asc' }

        // Get products and total count
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

        res.json({
            products: productsWithRating,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCount / pageSize),
                totalProducts: totalCount,
                hasNext: pageNumber < Math.ceil(totalCount / pageSize),
                hasPrev: pageNumber > 1
            }
        })

    } catch (error) {
        console.error('Products API error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}