import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { UserRole } from '@/app/types'
import Link from 'next/link'
import OrderRow from '@/app/components/OrderRow'
import SearchOrders from '@/app/components/SearchOrders'

interface AdminOrdersPageProps {
  searchParams: Promise<{
    search?: string
    filter?: string
  }>
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedSearchParams = await searchParams

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  const searchQuery = resolvedSearchParams.search || ''
  const statusFilter = resolvedSearchParams.filter || ''

  // Build where clause for filtering
  const where: any = {}

  // Search functionality - search by order ID or customer phone
  if (searchQuery) {
    where.OR = [
      // Search by order ID (partial match)
      { id: { contains: searchQuery, mode: 'insensitive' } },
      // Search by customer phone number
      { customer: { phone: { contains: searchQuery } } },
      // Search by customer name
      { customer: { name: { contains: searchQuery, mode: 'insensitive' } } },
      // Search by customer email
      { customer: { email: { contains: searchQuery, mode: 'insensitive' } } },
    ]
  }

  // Status filter
  if (statusFilter && statusFilter !== 'all') {
    where.status = statusFilter
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
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
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limit to recent orders for performance
  })

  // Calculate order statistics
  const orderStats = {
    total: await prisma.order.count({ where: searchQuery ? where : {} }),
    pending: await prisma.order.count({
      where: {
        ...(searchQuery ? where : {}),
        status: 'PENDING'
      }
    }),
    processing: await prisma.order.count({
      where: {
        ...(searchQuery ? where : {}),
        status: 'PROCESSING'
      }
    }),
    shipped: await prisma.order.count({
      where: {
        ...(searchQuery ? where : {}),
        status: 'SHIPPED'
      }
    }),
    delivered: await prisma.order.count({
      where: {
        ...(searchQuery ? where : {}),
        status: 'DELIVERED'
      }
    }),
    cancelled: await prisma.order.count({
      where: {
        ...(searchQuery ? where : {}),
        status: 'CANCELLED'
      }
    }),
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/admin/orders?filter=pending"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Pending Orders
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchOrders initialSearch={searchQuery} />
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700">
                Showing {orders.length} orders matching "<strong>{searchQuery}</strong>"
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Search includes: Order ID, Customer Name, Email, and Phone Number
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Search
            </Link>
          </div>
        </div>
      )}

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total"
          value={orderStats.total}
          color="gray"
          isActive={!statusFilter && !searchQuery}
        />
        <StatCard
          title="Pending"
          value={orderStats.pending}
          color="yellow"
          isActive={statusFilter === 'pending'}
          href="/admin/orders?filter=pending"
        />
        <StatCard
          title="Processing"
          value={orderStats.processing}
          color="blue"
          isActive={statusFilter === 'processing'}
          href="/admin/orders?filter=processing"
        />
        <StatCard
          title="Shipped"
          value={orderStats.shipped}
          color="purple"
          isActive={statusFilter === 'shipped'}
          href="/admin/orders?filter=shipped"
        />
        <StatCard
          title="Delivered"
          value={orderStats.delivered}
          color="green"
          isActive={statusFilter === 'delivered'}
          href="/admin/orders?filter=delivered"
        />
        <StatCard
          title="Cancelled"
          value={orderStats.cancelled}
          color="red"
          isActive={statusFilter === 'cancelled'}
          href="/admin/orders?filter=cancelled"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders ({orders.length})
            </h2>
            <div className="text-sm text-gray-600">
              Showing last 50 orders
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Try adjusting your search criteria to find what you\'re looking for.'
                : 'Customer orders will appear here when they start shopping.'
              }
            </p>
            {searchQuery && (
              <Link
                href="/admin/orders"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Orders
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  color,
  isActive = false,
  href
}: {
  title: string;
  value: number;
  color: string;
  isActive?: boolean;
  href?: string;
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800'
  }

  const activeBorder = isActive ? 'ring-2 ring-blue-500' : ''

  const content = (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 text-center transition-all hover:shadow-md ${activeBorder}`}>
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]} mb-2`}>
        {title}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    )
  }

  return content
}