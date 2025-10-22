// src/app/admin/users/[id]/page.tsx - Fixed data fetching
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { UserRole } from '@/app/types'
import Link from 'next/link'
import UserDetailTabs from '@/app/components/UserDetailTabs'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
    redirect('/admin')
  }

  // Fetch user details with proper error handling
  try {
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
                    name: true,
                    images: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
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
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true
          }
        }
      }
    })

    if (!user) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <Link
            href="/admin/users"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Users
          </Link>
        </div>
      )
    }

    // Calculate user statistics with safe defaults
    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = user._count.orders > 0 ? totalSpent / user._count.orders : 0

    const userStats = {
      totalSpent,
      totalOrders: user._count.orders,
      averageOrderValue,
      totalReviews: user._count.reviews,
      totalWishlist: user._count.wishlist
    }

    // Debug: Log user data to see what's being fetched
    console.log('User data:', {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })

    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back to Users
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                <p className="text-gray-600 mt-2">
                  {user.name || 'No Name'} • {user.email || 'No Email'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === UserRole.SUPER_ADMIN ? 'bg-purple-100 text-purple-800' :
              user.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
              {user.role.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
              {user.emailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Spent"
            value={`$${userStats.totalSpent.toFixed(2)}`}
            description="Lifetime value"
          />
          <StatCard
            title="Total Orders"
            value={userStats.totalOrders}
            description="All time"
          />
          <StatCard
            title="Avg Order"
            value={`$${userStats.averageOrderValue.toFixed(2)}`}
            description="Average order value"
          />
          <StatCard
            title="Reviews"
            value={userStats.totalReviews}
            description="Product reviews"
          />
          <StatCard
            title="Wishlist"
            value={userStats.totalWishlist}
            description="Saved items"
          />
        </div>

        {/* User Detail Tabs */}
        <UserDetailTabs user={user} userStats={userStats} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching user details:', error)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading User</h2>
        <p className="text-gray-600 mb-6">There was an error loading the user details.</p>
        <Link
          href="/admin/users"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Users
        </Link>
      </div>
    )
  }
}

function StatCard({ title, value, description }: { title: string; value: string | number; description: string }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  )
}