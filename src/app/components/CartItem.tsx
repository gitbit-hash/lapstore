// app/components/CartItem.tsx
'use client'

import Image from 'next/image'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../stores/cartStore'
import { CartItem as CartItemType } from '../stores/cartStore'

interface CartItemProps {
    item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore()

    const handleDecrement = () => {
        updateQuantity(item.id, item.quantity - 1)
    }

    const handleIncrement = () => {
        updateQuantity(item.id, item.quantity + 1)
    }

    const handleRemove = () => {
        removeItem(item.id)
    }

    return (
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
            {/* Product Image */}
            <div className="flex-shrink-0">
                <Image
                    src={item.images[0] || '/images/placeholder.jpg'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    ${item.price} × {item.quantity}
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-end space-y-2">
                {/* Remove Button */}
                <button
                    onClick={handleRemove}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        onClick={handleDecrement}
                        disabled={item.quantity <= 1}
                        className="p-1 text-gray-600 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-8 text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={handleIncrement}
                        disabled={item.quantity >= item.inventory}
                        className="p-1 text-gray-600 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}