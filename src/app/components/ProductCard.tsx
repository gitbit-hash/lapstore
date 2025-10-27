// src/app/components/ProductCard.tsx
'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../types'
import { useCartStore } from '../stores/cartStore'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isAdding, setIsAdding] = useState(false)
    const { addItem } = useCartStore()

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            i < Math.floor(rating)
                ? <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                : <StarOutline key={i} className="h-4 w-4 text-yellow-400" />
        ))
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (product.inventory === 0) return

        setIsAdding(true)
        await new Promise(resolve => setTimeout(resolve, 300))

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            inventory: product.inventory
        })

        setIsAdding(false)
    }

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        )
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        )
    }

    return (
        <Link href={`/products/${product.id}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group">
                {/* Product Image with Navigation */}
                <div className="relative aspect-w-16 aspect-h-10 bg-gray-100">
                    {product.images.length > 0 ? (
                        <>
                            <Image
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                priority={currentImageIndex === 0}
                            />

                            {/* Image Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ›
                                    </button>
                                </>
                            )}

                            {/* Image Dots Indicator */}
                            {product.images.length > 1 && (
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                    {product.images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setCurrentImageIndex(index)
                                            }}
                                            className={`w-2 h-2 rounded-full ${index === currentImageIndex
                                                ? 'bg-white'
                                                : 'bg-white bg-opacity-50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image Available</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <div className="mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {product.category.name}
                        </span>
                    </div>

                    <h3 className="font-semibold text-lg text-blue-400 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description || 'No description available.'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex items-center">
                            {renderStars(product.averageRating)}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">
                            ({product.reviewCount})
                        </span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-gray-900">
                                {(product.price).toFixed(0)} EGP
                            </span>
                            <div className={`text-xs ${product.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}