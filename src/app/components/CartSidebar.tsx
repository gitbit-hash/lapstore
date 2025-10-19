// app/components/CartSidebar.tsx
'use client'

import { useCartStore } from '../stores/cartStore'
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import CartItem from './CartItem'
import { useEffect } from 'react'

export default function CartSidebar() {
    const {
        items,
        isOpen,
        closeCart,
        getTotalPrice,
        getTotalItems,
        clearCart
    } = useCartStore()

    // Close cart on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden' // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, closeCart])

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Your Cart ({getTotalItems()})
                            </h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                                <p className="text-gray-400 text-sm">
                                    Add some products to get started!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t bg-gray-50 p-4 space-y-4">
                            {/* Total */}
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <button
                                    onClick={clearCart}
                                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: Implement checkout
                                        alert('Proceeding to checkout!')
                                    }}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>

                            {/* Free shipping notice */}
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Free shipping on orders over $1000
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}