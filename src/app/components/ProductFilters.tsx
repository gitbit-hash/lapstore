// src/app/components/ProductFilters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '../types'

interface ProductFiltersProps {
    categories: Category[]
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    // Initialize state from URL params
    useEffect(() => {
        if (searchParams) {
            const categoriesParam = searchParams.get('categories')
            setSelectedCategories(categoriesParam ? categoriesParam.split(',') : [])
        }
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams()

        // Category filters
        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','))
        }

        // Search (preserve existing search)
        if (searchParams) {
            const existingSearch = searchParams.get('search')
            if (existingSearch) params.set('search', existingSearch)

            // Preserve sort
            const existingSort = searchParams.get('sort')
            if (existingSort) params.set('sort', existingSort)
        }

        // Remove page parameter when changing filters
        params.delete('page')

        router.push(`/products?${params.toString()}`)
    }

    const clearFilters = () => {
        setSelectedCategories([])

        // Only preserve search and sort when clearing filters
        const params = new URLSearchParams()
        if (searchParams) {
            const existingSearch = searchParams.get('search')
            if (existingSearch) params.set('search', existingSearch)

            const existingSort = searchParams.get('sort')
            if (existingSort) params.set('sort', existingSort)
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