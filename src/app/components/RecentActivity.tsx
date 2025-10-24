// src/app/components/RecentActivity.tsx
import Link from 'next/link'

interface RecentActivityProps {
  orders: Array<{
    id: string
    total: number
    status: string
    createdAt: Date
    customer: {
      name: string | null
      email: string
    }
    orderItems: Array<{
      product: {
        name: string
      }
    }>
  }>
}

export default function RecentActivity({ orders }: RecentActivityProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {order.customer.name || order.customer.email}
              </p>
              <p className="text-xs text-gray-500">
                {order.orderItems.length} items • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href={`/admin/orders/${order.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-4"
            >
              View
            </Link>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No recent activity
          </p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/admin/orders"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View all orders →
        </Link>
      </div>
    </div>
  )
}