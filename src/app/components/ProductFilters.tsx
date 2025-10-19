// app/components/ProductFilters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '../types' // Import from shared types

interface ProductFiltersProps {
    categories: Category[]
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [sortBy, setSortBy] = useState('')

    // Initialize state from URL params
    useEffect(() => {
        if (searchParams) {
            setPriceRange({
                min: searchParams.get('minPrice') || '',
                max: searchParams.get('maxPrice') || ''
            })

            const categoriesParam = searchParams.get('categories')
            setSelectedCategories(categoriesParam ? categoriesParam.split(',') : [])

            setSortBy(searchParams.get('sort') || '')
        }
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams()

        // Price filters
        if (priceRange.min) params.set('minPrice', priceRange.min)
        if (priceRange.max) params.set('maxPrice', priceRange.max)

        // Category filters
        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','))
        }

        // Sort
        if (sortBy) params.set('sort', sortBy)

        // Search (preserve existing search)
        if (searchParams) {
            const existingSearch = searchParams.get('search')
            if (existingSearch) params.set('search', existingSearch)
        }

        router.push(`/products?${params.toString()}`)
    }

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' })
        setSelectedCategories([])
        setSortBy('')

        // Only preserve search when clearing filters
        const params = new URLSearchParams()
        if (searchParams) {
            const existingSearch = searchParams.get('search')
            if (existingSearch) params.set('search', existingSearch)
        }

        router.push(`/products?${params.toString()}`)
    }

    const toggleCategory = (categorySlug: string) => {
        setSelectedCategories(prev =>
            prev.includes(categorySlug)
                ? prev.filter(slug => slug !== categorySlug)
                : [...prev, categorySlug]
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                >
                    Clear all
                </button>
            </div>

            {/* Sort By */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                </label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                </label>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categories
                </label>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.slug)}
                                onChange={() => toggleCategory(category.slug)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Filters Button */}
            <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
                Apply Filters
            </button>
        </div>
    )
}