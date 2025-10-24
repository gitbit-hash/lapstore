// src/app/admin/analytics/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { UserRole } from '@/app/types'
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard'

interface AnalyticsPageProps {
  searchParams: Promise<{
    period?: string
  }>
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedSearchParams = await searchParams

  if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
    redirect('/admin')
  }

  const period = resolvedSearchParams.period || '30d' // 7d, 30d, 90d, 1y

  // Calculate date ranges based on period
  const getDateRange = () => {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default: // 30d
        startDate.setDate(now.getDate() - 30)
    }

    return { startDate, endDate: now }
  }

  const { startDate, endDate } = getDateRange()

  // Fetch all analytics data in parallel
  const [
    revenueData,
    orderStats,
    userStats,
    productStats,
    categoryStats,
    recentOrders,
    topProducts
  ] = await Promise.all([
    // Revenue data for charts
    getRevenueData(startDate, endDate),
    // Order statistics
    getOrderStats(startDate, endDate),
    // User statistics
    getUserStats(startDate, endDate),
    // Product statistics
    getProductStats(),
    // Category statistics
    getCategoryStats(),
    // Recent orders for activity feed
    getRecentOrders(),
    // Top performing products
    getTopProducts(startDate, endDate)
  ])

  const analyticsData = {
    period,
    revenueData,
    orderStats,
    userStats,
    productStats,
    categoryStats,
    recentOrders,
    topProducts,
    dateRange: { startDate, endDate }
  }

  return <AnalyticsDashboard data={analyticsData} />
}

// Helper functions to fetch analytics data
async function getRevenueData(startDate: Date, endDate: Date) {
  // Get daily revenue for the period
  const dailyRevenue = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      status: {
        not: 'CANCELLED'
      }
    },
    _sum: {
      total: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Format for chart
  const revenueByDay = dailyRevenue.map(day => ({
    date: day.createdAt.toISOString().split('T')[0],
    revenue: day._sum.total || 0
  }))

  // Calculate total revenue
  const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0)

  // Calculate previous period for comparison
  const previousStartDate = new Date(startDate)
  const previousEndDate = new Date(endDate)
  const periodDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  previousStartDate.setDate(previousStartDate.getDate() - periodDays)
  previousEndDate.setDate(previousEndDate.getDate() - periodDays)

  const previousRevenueData = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: previousStartDate,
        lte: previousEndDate
      },
      status: {
        not: 'CANCELLED'
      }
    },
    _sum: {
      total: true
    }
  })

  const previousRevenue = previousRevenueData._sum.total || 0
  const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

  return {
    daily: revenueByDay,
    total: totalRevenue,
    growth: revenueGrowth,
    previousPeriod: previousRevenue
  }
}

async function getOrderStats(startDate: Date, endDate: Date) {
  const [
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    averageOrderValue,
    orderStatusCounts
  ] = await Promise.all([
    // Total orders
    prisma.order.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    // Completed orders
    prisma.order.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'DELIVERED'
      }
    }),
    // Pending orders
    prisma.order.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] }
      }
    }),
    // Cancelled orders
    prisma.order.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'CANCELLED'
      }
    }),
    // Average order value
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' }
      },
      _avg: {
        total: true
      }
    }),
    // Order status breakdown
    prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: {
        id: true
      }
    })
  ])

  // Calculate conversion rate (completed / total)
  const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  return {
    total: totalOrders,
    completed: completedOrders,
    pending: pendingOrders,
    cancelled: cancelledOrders,
    averageValue: averageOrderValue._avg.total || 0,
    conversionRate,
    statusBreakdown: orderStatusCounts
  }
}

async function getUserStats(startDate: Date, endDate: Date) {
  const [
    totalUsers,
    newUsers,
    returningUsers,
    userRoles
  ] = await Promise.all([
    // Total users
    prisma.user.count(),
    // New users in period
    prisma.user.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    // Returning users (users with orders in period)
    prisma.user.count({
      where: {
        orders: {
          some: {
            createdAt: { gte: startDate, lte: endDate }
          }
        }
      }
    }),
    // User roles breakdown
    prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })
  ])

  return {
    total: totalUsers,
    new: newUsers,
    returning: returningUsers,
    roles: userRoles
  }
}

async function getProductStats() {
  const [
    totalProducts,
    activeProducts,
    outOfStock,
    lowStock,
    totalInventory
  ] = await Promise.all([
    // Total products
    prisma.product.count(),
    // Active products
    prisma.product.count({
      where: { isActive: true }
    }),
    // Out of stock products
    prisma.product.count({
      where: { inventory: 0 }
    }),
    // Low stock products (less than 10)
    prisma.product.count({
      where: {
        inventory: { lt: 10, gt: 0 }
      }
    }),
    // Total inventory value
    prisma.product.aggregate({
      _sum: {
        inventory: true
      }
    })
  ])

  return {
    total: totalProducts,
    active: activeProducts,
    outOfStock,
    lowStock,
    totalInventory: totalInventory._sum.inventory || 0
  }
}

async function getCategoryStats() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      },
      products: {
        select: {
          price: true,
          inventory: true
        }
      }
    }
  })

  const categoryStats = categories.map(category => {
    const totalValue = category.products.reduce((sum, product) =>
      sum + (product.price * product.inventory), 0
    )

    return {
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      totalValue
    }
  })

  // Sort by product count descending
  categoryStats.sort((a, b) => b.productCount - a.productCount)

  return categoryStats
}

async function getRecentOrders() {
  const orders = await prisma.order.findMany({
    where: {
      status: { not: 'CANCELLED' }
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true
        }
      },
      orderItems: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  return orders
}

async function getTopProducts(startDate: Date, endDate: Date) {
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: {
        createdAt: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' }
      }
    },
    _sum: {
      quantity: true,
      price: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 10
  })

  // Get product details for the top products
  const productDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          name: true,
          images: true,
          category: {
            select: {
              name: true
            }
          }
        }
      })

      return {
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        category: product?.category.name || 'Uncategorized',
        image: product?.images[0] || '/images/placeholder.jpg',
        quantitySold: item._sum.quantity || 0,
        revenue: (item._sum.price || 0) * (item._sum.quantity || 0)
      }
    })
  )

  return productDetails
}