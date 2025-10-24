// src/app/checkout/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '../stores/cartStore'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function CheckoutPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { items, getTotalPrice, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isGuest, setIsGuest] = useState(false)

    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        notes: '',
    })

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart')
            return
        }
    }, [items.length, router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleGuestCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            console.log('🛒 Starting guest checkout...')
            console.log('📦 Cart items:', items)
            console.log('🏠 Shipping info:', shippingInfo)

            const response = await fetch('/api/orders/guest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    shippingInfo,
                    paymentMethod: 'COD',
                    total: getTotalPrice(),
                }),
            })

            console.log('📡 Response status:', response.status)

            const data = await response.json()
            console.log('📦 Response data:', data)

            if (!response.ok) {
                throw new Error(data.error || `Failed to create order: ${response.status}`)
            }

            console.log('✅ Guest order created successfully:', data.id)

            // Clear cart and redirect to success page
            clearCart()
            console.log('🛒 Cart cleared, redirecting to success page...')

            window.location.href = `/checkout/success?orderId=${data.id}&guest=true`

        } catch (error) {
            console.error('❌ Guest checkout error:', error)
            alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAuthenticatedCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            console.log('🛒 Starting authenticated checkout...')

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    shippingInfo,
                    paymentMethod: 'COD',
                    total: getTotalPrice(),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || `Failed to create order: ${response.status}`)
            }

            console.log('✅ Order created successfully:', data.id)
            clearCart()
            window.location.href = `/checkout/success?orderId=${data.id}`

        } catch (error) {
            console.error('❌ Checkout error:', error)
            alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading' || items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading checkout...</p>
                </div>
            </div>
        )
    }

    const subtotal = getTotalPrice()
    const shipping = subtotal > 1000 ? 0 : 49.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {/* Checkout Type Selection */}
            {!session && !isGuest && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">How would you like to checkout?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Guest Checkout */}
                        <div
                            className="border-2 border-blue-500 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => setIsGuest(true)}
                        >
                            <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-sm">1</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Guest Checkout</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Checkout quickly without creating an account. We'll only ask for essential information.
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                                <li>✓ No password required</li>
                                <li>✓ Faster checkout process</li>
                                <li>✓ Order tracking available</li>
                            </ul>
                        </div>

                        {/* Sign In Checkout */}
                        <Link
                            href="/auth/signin?callbackUrl=/checkout"
                            className="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors block"
                        >
                            <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-sm">2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Sign In & Checkout</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Sign in to your account for faster checkout and order history.
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                                <li>✓ Save shipping addresses</li>
                                <li>✓ Track order history</li>
                                <li>✓ Faster future checkouts</li>
                            </ul>
                        </Link>
                    </div>
                </div>
            )}

            {(session || isGuest) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipping Form */}
                    <div className="space-y-8">
                        <form onSubmit={session ? handleAuthenticatedCheckout : handleGuestCheckout} className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    {session ? 'Shipping Information' : 'Your Information'}
                                </h2>
                                {!session && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        We'll use this information to process your order and send updates.
                                    </p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={shippingInfo.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={shippingInfo.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={shippingInfo.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="number"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={shippingInfo.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="1234567890"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Numbers only, 10-15 digits. Used for delivery updates.
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            required
                                            value={shippingInfo.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            required
                                            value={shippingInfo.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            required
                                            value={shippingInfo.state}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                            ZIP/Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            required
                                            value={shippingInfo.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country *
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            required
                                            value={shippingInfo.country}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                            Delivery Notes (Optional)
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={3}
                                            value={shippingInfo.notes}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Any special delivery instructions..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method and Submit Button remain the same */}
                            {/* ... existing payment method and submit button code ... */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

                                <div className="flex items-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                                    <input
                                        id="cod"
                                        name="paymentMethod"
                                        type="radio"
                                        value="cod"
                                        checked
                                        readOnly
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                        <span className="flex items-center">
                                            Cash on Delivery
                                            <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                                Recommended
                                            </span>
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Pay when you receive your order
                                        </span>
                                    </label>
                                </div>

                                {/* COD Instructions */}
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-800 mb-2">Cash on Delivery Instructions</h3>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Pay with cash when your order is delivered</li>
                                        <li>• Have exact change ready if possible</li>
                                        <li>• Delivery agent will provide a receipt</li>
                                        <li>• Standard delivery: 3-5 business days</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
                                >
                                    {isLoading ? 'Placing Order...' : `Place Order - ${total.toFixed(0)} EGP`}
                                </button>

                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    By placing your order, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary remains the same */}
                    {/* ... existing order summary code ... */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <img
                                                src={item.images[0] || '/images/placeholder.jpg'}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                ${(item.price * item.quantity).toFixed(0)} EGP
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${subtotal.toFixed(0)} EGP</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">
                                        {shipping === 0 ? 'FREE' : `${shipping.toFixed(0)} EGP`}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">${tax.toFixed(0)} EGP</span>
                                </div>

                                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-gray-900">${total.toFixed(0)} EGP</span>
                                </div>

                                {shipping === 0 && (
                                    <p className="text-sm text-green-600 text-center mt-2">
                                        🎉 You qualify for free shipping!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* COD Benefits */}
                        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-800 mb-3">Why Choose Cash on Delivery?</h3>
                            <ul className="space-y-2 text-sm text-orange-700">
                                <li className="flex items-center">
                                    <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-2">✓</span>
                                    No upfront payment required
                                </li>
                                <li className="flex items-center">
                                    <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-2">✓</span>
                                    Pay only when you receive the order
                                </li>
                                <li className="flex items-center">
                                    <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-2">✓</span>
                                    Inspect products before payment
                                </li>
                                <li className="flex items-center">
                                    <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-2">✓</span>
                                    100% secure and trusted
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}