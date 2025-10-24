// src/app/api/admin/users/[id]/detail/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import { UserRole } from '@/app/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          orderBy: { isDefault: 'desc' }
        },
        orders: {
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    price: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        wishlist: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                inventory: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate user statistics
    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = user.orders.length
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

    const userDetail = {
      ...user,
      statistics: {
        totalSpent,
        totalOrders,
        averageOrderValue,
        totalReviews: user.reviews.length,
        totalWishlistItems: user.wishlist.length
      }
    }

    return NextResponse.json(userDetail)
  } catch (error) {
    console.error('Error fetching user detail:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}