// src/app/components/SearchBar.tsx - Mobile optimized
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

    const handleIconClick = () => {
        // Trigger form submission when icon is clicked
        const form = document.querySelector('form') as HTMLFormElement
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                {/* Clickable magnifying glass icon */}
                <button
                    type="button"
                    onClick={handleIconClick}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center focus:outline-none"
                    aria-label="Search"
                >
                    <MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        // Handle Enter key press
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSearch(e)
                        }
                    }}
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 lg:pl-10 lg:pr-3 py-2 lg:py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                />
                {/* Search button removed */}
            </div>
        </form>
    )
}