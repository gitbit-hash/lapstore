// src/app/components/SearchBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState('')

    // Initialize search query from URL params
    useEffect(() => {
        if (searchParams) {
            const search = searchParams.get('search')
            setSearchQuery(search || '')
        }
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        const params = new URLSearchParams()

        if (searchQuery) {
            params.set('search', searchQuery)
        }

        // Preserve existing filters if searchParams exists
        if (searchParams) {
            const existingCategories = searchParams.get('categories')
            const existingMinPrice = searchParams.get('minPrice')
            const existingMaxPrice = searchParams.get('maxPrice')
            const existingSort = searchParams.get('sort')

            if (existingCategories) params.set('categories', existingCategories)
            if (existingMinPrice) params.set('minPrice', existingMinPrice)
            if (existingMaxPrice) params.set('maxPrice', existingMaxPrice)
            if (existingSort) params.set('sort', existingSort)
        }

        router.push(`/products?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for laptops, monitors, accessories..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                    Search
                </button>
            </div>
        </form>
    )
}