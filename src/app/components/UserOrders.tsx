// src/app/components/UserOrders.tsx
import Link from 'next/link'
import { UserDetail } from '../types'

interface UserOrdersProps {
  userDetailProp: UserDetail,
}

export default function UserOrders({ userDetailProp }: UserOrdersProps) {
  if (userDetailProp.orders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-500">This user hasn't placed any orders.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Link
          href={`/admin/orders?user=${userDetailProp.id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All Orders
        </Link>
      </div>

      <div className="space-y-4">
        {userDetailProp.orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  Order #{order.id.slice(-8).toUpperCase()}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              {order.orderItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src={item.product.images[0] || '/images/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{item.product.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                  </div>
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{order.orderItems.length - 3} more items
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}