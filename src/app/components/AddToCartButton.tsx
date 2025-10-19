// app/components/AddToCartButton.tsx - Updated with cart store
'use client'

import { useState } from 'react'
import { CartProduct } from '../types'
import { useCartStore } from '../stores/cartStore'

interface AddToCartButtonProps {
    product: CartProduct
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const { addItem, getItemCount } = useCartStore()

    const currentCartQuantity = getItemCount(product.id)

    const handleAddToCart = async () => {
        if (product.inventory === 0) return

        setIsAdding(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Add to cart store
        addItem(product, quantity)

        setIsAdding(false)

        // Reset quantity
        setQuantity(1)
    }

    const incrementQuantity = () => {
        if (quantity < (product.inventory - currentCartQuantity)) {
            setQuantity(prev => prev + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const availableQuantity = product.inventory - currentCartQuantity

    return (
        <div className="space-y-4">
            {/* Cart Status */}
            {currentCartQuantity > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                        <strong>{currentCartQuantity}</strong> in cart •{' '}
                        <strong>{availableQuantity}</strong> available
                    </p>
                </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1 || availableQuantity === 0}
                        className="px-3 py-1 text-gray-600 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        -
                    </button>
                    <span className="px-4 py-1 text-gray-900 font-medium min-w-12 text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={incrementQuantity}
                        disabled={quantity >= availableQuantity || availableQuantity === 0}
                        className="px-3 py-1 text-gray-600 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>
                <span className="text-sm text-gray-500">
                    {availableQuantity} available
                </span>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={availableQuantity === 0 || isAdding}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                {isAdding ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding to Cart...
                    </>
                ) : availableQuantity === 0 ? (
                    'Out of Stock'
                ) : (
                    `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                )}
            </button>

            {/* Quick Actions */}
            <div className="flex space-x-4">
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    Add to Wishlist
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    Compare
                </button>
            </div>
        </div>
    )
}