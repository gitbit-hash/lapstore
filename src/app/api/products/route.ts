// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const page = searchParams.get('page') || '1'

    const pageNumber = parseInt(page)
    const pageSize = 12
    const skip = (pageNumber - 1) * pageSize

    // Build where clause
    const where: any = {
        isActive: true,
    }

    if (category) {
        where.category = {
            slug: category
        }
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ]
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }

    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'name') orderBy = { name: 'asc' }

    try {
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

        return NextResponse.json({
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
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}