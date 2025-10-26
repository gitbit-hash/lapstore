// src/app/orders/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
    id: string
    quantity: number
    price: number
    product: {
        name: string
        images: string[]
    }
}

interface Order {
    id: string
    total: number
    status: string
    paymentMethod?: string
    createdAt: Date
    updatedAt: Date
    orderItems: OrderItem[]
}

export default async function OrdersPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth/signin')
    }

    const orders = await prisma.order.findMany({
        where: {
            customerId: session.user.id
        },
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
        orderBy: {
            createdAt: 'desc'
        }
    }) as Order[]

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">
                            When you place orders, they will appear here.
                        </p>
                        <Link
                            href="/products"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: Order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Order Placed</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="font-medium text-gray-900">{order.total.toFixed(2)} EGP</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order #</p>
                                    <p className="font-medium text-gray-900">
                                        {order.id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment</p>
                                    <p className="font-medium text-gray-900 capitalize">
                                        {order.paymentMethod?.toLowerCase() || 'cod'}
                                    </p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="space-y-4">
                                    {order.orderItems.map((item: OrderItem) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative">
                                                <Image
                                                    src={item.product.images[0] || '/images/placeholder.jpg'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover rounded"
                                                    sizes="48px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} • ${item.price} each
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {(item.price * item.quantity).toFixed(0)} EGP
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}