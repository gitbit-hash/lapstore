// src/app/cart/page.tsx
'use client'

import { useCartStore } from '../stores/cartStore'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any products to your cart yet. Start shopping to find amazing tech products!
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Start Shopping
          </Link>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items ({getTotalItems()})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
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

              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                <span className="text-gray-600">Total</span>
                <span className="text-gray-900">${total.toFixed(0)} EGP</span>
              </div>

              {shipping === 0 && (
                <p className="text-sm text-green-600 text-center mt-2">
                  🎉 You qualify for free shipping!
                </p>
              )}
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
            >
              Proceed to Checkout
            </Link>
          </div>

          {/* Continue Shopping */}
          <Link
            href="/products"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors block text-center"
          >
            Continue Shopping
          </Link>

          {/* Security Badges */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex justify-center space-x-6 mb-2">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-green-600 text-sm">🔒</span>
                </div>
                <span className="text-xs text-gray-600">Secure Checkout</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-xs text-gray-600">Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}