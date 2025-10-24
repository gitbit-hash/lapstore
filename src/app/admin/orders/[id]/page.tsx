// src/app/admin/orders/[id]/page
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { UserRole } from '@/app/types'
import Link from 'next/link'
import { OrderStatusUpdate } from '@/app/components/OrderStatusUpdate'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

// Define types for shipping address
interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
}

// Helper function to parse shipping address
function parseShippingAddress(address: any): ShippingAddress | null {
  if (!address || typeof address !== 'object') return null;

  return {
    firstName: address.firstName || address.firstName || '',
    lastName: address.lastName || address.lastName || '',
    email: address.email || '',
    phone: address.phone || '',
    address: address.address || address.street || '',
    city: address.city || '',
    state: address.state || '',
    postalCode: address.postalCode || address.zipCode || '',
    country: address.country || 'US',
    notes: address.notes || ''
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  const order = await prisma.order.findUnique({
    where: { id },
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
              id: true,
              name: true,
              images: true,
              price: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link
          href="/admin/orders"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  // Calculate order statistics
  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = order.total > 1000 ? 0 : 49.99
  const tax = (order.total - shipping) * 0.08

  // Parse shipping address
  const shippingAddress = parseShippingAddress(order.shippingAddress)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-2">
            Order #{order.id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Items ({totalItems})</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category.name}</p>
                        <p className="text-sm text-gray-500">SKU: {item.product.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            </div>
            <div className="p-6">
              {shippingAddress ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {shippingAddress.firstName} {shippingAddress.lastName}<br />
                      {shippingAddress.address}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
                      {shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-gray-600">
                      Email: {shippingAddress.email}<br />
                      Phone: {shippingAddress.phone}
                    </p>
                    {shippingAddress.notes && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 mb-1">Delivery Notes</h4>
                        <p className="text-gray-600 text-sm">{shippingAddress.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No shipping information available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                  }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">{new Date(order.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900 capitalize">{order.paymentMethod?.toLowerCase() || 'cod'}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">
                  {order.customer?.name ||
                    (shippingAddress
                      ? `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim()
                      : 'Guest Customer'
                    )
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {order.customer?.email ||
                    (shippingAddress ? shippingAddress.email : 'No email')
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">
                  {order.customer?.phone ||
                    (shippingAddress ? shippingAddress.phone : 'No phone')
                  }
                </p>
              </div>
              {order.customer && (
                <Link
                  href={`/admin/users/${order.customer.id}`}
                  className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Customer Profile →
                </Link>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <OrderStatusUpdate order={order} />
        </div>
      </div>
    </div>
  )
}