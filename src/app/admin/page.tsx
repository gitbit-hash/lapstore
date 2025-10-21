import { getServerSession } from 'next-auth'
import { authOptions } from './../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from './../lib/prisma'
import { UserRole } from './../types'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  // Basic stats for all admins
  const [totalProducts, totalOrders, lowStockProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    }),
    prisma.product.findMany({
      where: {
        inventory: {
          lte: 10 // Low stock threshold
        }
      },
      take: 5
    })
  ])

  // Super admin only stats - fetch separately
  let superAdminData = null
  if (session.user.role === UserRole.SUPER_ADMIN) {
    const [revenueData, totalUsers, adminUsers] = await Promise.all([
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          createdAt: {
            gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
          },
          status: {
            not: 'CANCELLED'
          }
        }
      }),
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: {
            in: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
          }
        }
      })
    ])

    superAdminData = {
      totalRevenue: revenueData._sum.total || 0,
      totalUsers,
      adminUsers
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-600">
          Welcome, <span className="font-medium capitalize">{session.user.role.toLowerCase().replace('_', ' ')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={totalProducts}
          description="All active products"
        />
        <StatCard
          title="Recent Orders"
          value={totalOrders}
          description="Last 30 days"
        />

        {/* Super Admin Only Stats */}
        {session.user.role === UserRole.SUPER_ADMIN && superAdminData && (
          <>
            <StatCard
              title="Total Revenue"
              value={`$${superAdminData.totalRevenue.toFixed(2)}`}
              description="Last 30 days"
              isCurrency
            />
            <StatCard
              title="Total Users"
              value={superAdminData.totalUsers}
              description={`${superAdminData.adminUsers} admins`}
            />
          </>
        )}

        {/* Admin Stats */}
        {session.user.role === UserRole.ADMIN && (
          <>
            <StatCard
              title="Low Stock"
              value={lowStockProducts.length}
              description="Products needing restock"
              variant="warning"
            />
            <StatCard
              title="Quick Actions"
              value="Manage"
              description="Products & Orders"
              variant="info"
            />
          </>
        )}
      </div>

      {/* Role-Based Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert - For all admins */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500">All products have sufficient stock.</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-yellow-700">Only {product.inventory} left in stock</p>
                    </div>
                    <a
                      href={`/admin/products/edit/${product.id}`}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
                    >
                      Restock
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Super Admin Only - Quick Analytics */}
        {session.user.role === UserRole.SUPER_ADMIN && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Analytics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Monthly Revenue</span>
                  <span className="font-semibold text-blue-600">
                    ${superAdminData?.totalRevenue.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Total Users</span>
                  <span className="font-semibold text-green-600">
                    {superAdminData?.totalUsers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Admin Users</span>
                  <span className="font-semibold text-purple-600">
                    {superAdminData?.adminUsers || 0}
                  </span>
                </div>
              </div>
              <a
                href="/admin/analytics"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                View Full Analytics
              </a>
            </div>
          </div>
        )}

        {/* Admin Only - Quick Actions */}
        {session.user.role === UserRole.ADMIN && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <a
                href="/admin/products/new"
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Add New Product</h3>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </a>
              <a
                href="/admin/orders"
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and update orders</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  variant = 'default',
  isCurrency = false
}: {
  title: string;
  value: number | string;
  description: string;
  variant?: 'default' | 'warning' | 'info';
  isCurrency?: boolean;
}) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  const valueStyles = {
    default: 'text-blue-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }

  return (
    <div className={`p-6 rounded-lg shadow-sm border ${variantStyles[variant]}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${valueStyles[variant]}`}>
        {isCurrency && typeof value === 'string' ? value : value}
      </p>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  )
}