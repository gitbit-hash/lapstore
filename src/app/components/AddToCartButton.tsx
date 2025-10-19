// app/components/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { CartProduct } from '../types'

interface AddToCartButtonProps {
    product: CartProduct
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = async () => {
        if (product.inventory === 0) return

        setIsAdding(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // TODO: Integrate with cart store
        console.log(`Added ${quantity} of ${product.name} to cart`)

        setIsAdding(false)

        // Show success message
        alert(`Added ${product.name} to cart!`)
    }

    const incrementQuantity = () => {
        if (quantity < product.inventory) {
            setQuantity(prev => prev + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        -
                    </button>
                    <span className="px-4 py-1 text-gray-900 font-medium min-w-12 text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.inventory}
                        className="px-3 py-1 text-gray-600 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>
                <span className="text-sm text-gray-500">
                    {product.inventory} available
                </span>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0 || isAdding}
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