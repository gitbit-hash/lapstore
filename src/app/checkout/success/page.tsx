// src/app/checkout/success/page.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '../../stores/cartStore'
import { CheckCircleIcon, TruckIcon } from '@heroicons/react/24/outline'

export default function CheckoutSuccess() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const { clearCart } = useCartStore()

    useEffect(() => {
        // Clear cart on success
        clearCart()
    }, [clearCart])

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
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
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Order Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <p className="font-semibold text-gray-900">{orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        PENDING
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Delivery Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Delivery Method</p>
                                    <p className="font-semibold text-gray-900">Standard Shipping (3-5 days)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COD Instructions */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
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
                        We've sent a confirmation email with your order details. You can also track your order status from your account.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/orders"
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            View Orders
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500">
                        Need help? <a href="mailto:support@techhaven.com" className="text-blue-600 hover:underline">Contact our support team</a>
                    </p>
                </div>
            </div>
        </div>
    )
}