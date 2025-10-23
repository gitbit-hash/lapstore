'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '../../stores/cartStore'
import { CheckCircleIcon, TruckIcon } from '@heroicons/react/24/outline'

interface Product {
    name: string
    images: string[]
    price: number
}

interface OrderItem {
    id: string
    quantity: number
    price: number
    product: Product
}

interface Order {
    id: string
    total: number
    status: string
    paymentMethod: string
    createdAt: string
    orderItems: OrderItem[]
    shippingAddress?: {
        firstName?: string
        lastName?: string
        email?: string
        phone?: string
        address?: string
        city?: string
        state?: string
        postalCode?: string
        country?: string
    }
}

export default function CheckoutSuccess() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const isGuest = searchParams.get('guest') === 'true'
    const { clearCart } = useCartStore()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Clear cart on success
        clearCart()

        // Fetch order details if we have an orderId
        if (orderId) {
            fetchOrderDetails()
        } else {
            setIsLoading(false)
        }
    }, [orderId, clearCart])

    const fetchOrderDetails = async () => {
        try {
            // For now, we'll create a mock order since the API might not be ready
            // In production, you would call your actual API
            const mockOrder: Order = {
                id: orderId || 'mock-order-id',
                total: 1579.97, // Example total
                status: 'PENDING',
                paymentMethod: 'COD',
                createdAt: new Date().toISOString(),
                orderItems: [
                    {
                        id: 'item-1',
                        quantity: 1,
                        price: 1499.99,
                        product: {
                            name: 'ASUS ROG Zephyrus G14',
                            images: ['/images/products/gaming-laptops.jpg'],
                            price: 1499.99
                        }
                    },
                    {
                        id: 'item-2',
                        quantity: 1,
                        price: 79.98,
                        product: {
                            name: 'Gaming Mouse',
                            images: ['/images/products/mice.jpg'],
                            price: 79.98
                        }
                    }
                ],
                shippingAddress: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                    country: 'US'
                }
            }

            // Simulate API call delay
            setTimeout(() => {
                setOrder(mockOrder)
                setIsLoading(false)
            }, 1000)

            // Uncomment this when your API is ready:

            const endpoint = isGuest ? `/api/orders/guest/${orderId}` : `/api/orders/${orderId}`
            const response = await fetch(endpoint)

            if (response.ok) {
                const orderData = await response.json()
                setOrder(orderData)
            } else {
                console.error('Failed to fetch order details')
            }
            setIsLoading(false)


        } catch (error) {
            console.error('Error fetching order details:', error)
            setIsLoading(false)
        }
    }

    // Calculate order totals from order items
    const calculateTotals = () => {
        if (!order) return { subtotal: 0, shipping: 0, tax: 0, total: 0 }

        const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shipping = subtotal > 1000 ? 0 : 49.99
        const tax = subtotal * 0.08
        const total = subtotal + shipping + tax

        return { subtotal, shipping, tax, total }
    }

    const totals = calculateTotals()

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your order. We're getting it ready for you.
                    </p>
                    {isGuest && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                            <p className="text-blue-700 text-sm">
                                <strong>Guest Order:</strong> You can track your order using your email and order number.
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            {order ? (
                                <div className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-3">
                                        {order.orderItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={item.product.images[0] || '/images/placeholder.jpg'}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">`${(item.price * item.quantity).toFixed(0)} EGP`</p>
                                                    <p className="text-sm text-gray-500">{item.price.toFixed(0)} EGP each</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="text-gray-900">{totals.subtotal.toFixed(0)} EGP</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-gray-900">
                                                {totals.shipping === 0 ? 'FREE' : `${totals.shipping.toFixed(0)} EGP`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="text-gray-900">{totals.tax.toFixed(0)} EGP</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                            <span>Total Paid</span>
                                            <span>{order.total.toFixed(0)} EGP</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Unable to load order details.</p>
                                    <p className="text-sm text-gray-400">
                                        Order #{orderId} has been placed successfully.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Shipping Address */}
                        {order?.shippingAddress && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                                <div className="text-gray-600">
                                    <p className="font-medium">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    </p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                    <p className="mt-2">
                                        <strong>Email:</strong> {order.shippingAddress.email}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong> {order.shippingAddress.phone}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Information & Actions */}
                    <div className="space-y-6">
                        {/* Order Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <p className="font-semibold text-gray-900">{orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {order?.status || 'PENDING'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-semibold text-gray-900 capitalize">
                                        {order?.paymentMethod?.toLowerCase() || 'Cash on Delivery'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {order ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* COD Instructions */}
                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                            <div className="flex items-start space-x-3">
                                <TruckIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Cash on Delivery Instructions</h3>
                                    <ul className="text-blue-700 space-y-2">
                                        <li className="flex items-center">
                                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                                            Your order will be prepared and shipped within 24 hours
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                                            You'll receive a confirmation email with tracking information
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                                            Have the exact amount ready in cash for the delivery agent
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-sm">4</span>
                                            Inspect your items before making payment
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="text-center space-y-4">
                            <p className="text-gray-600">
                                {isGuest
                                    ? "We've sent a confirmation email with your order details. You can track your order using your email and order number."
                                    : "We've sent a confirmation email with your order details. You can also track your order status from your account."
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/products"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                                {!isGuest && (
                                    <Link
                                        href="/orders"
                                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        View Orders
                                    </Link>
                                )}
                                {isGuest && (
                                    <Link
                                        href="/auth/signup"
                                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                )}
                            </div>

                            <p className="text-sm text-gray-500">
                                Need help? <a href="mailto:support@techhaven.com" className="text-blue-600 hover:underline">Contact our support team</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}