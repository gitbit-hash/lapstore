// src/app/components/AdminProductsSearch.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface AdminProductsSearchProps {
  initialSearch?: string
}

export default function AdminProductsSearch({ initialSearch = '' }: AdminProductsSearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    } else {
      params.delete('search')
    }

    // Remove page parameter when searching to go back to page 1
    params.delete('page')

    router.push(`/admin/products?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams()
    // Remove both search and page parameters when clearing
    params.delete('search')
    params.delete('page')
    router.push(`/admin/products?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Products</h2>

      <form onSubmit={handleSearch} className="flex space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Product Name or Product ID..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Search Products
        </button>

        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </form>

      {/* Search Tips */}
      <div className="mt-3 text-sm text-gray-500">
        <p>💡 Search tips: Use product name or product ID (full or partial)</p>
        <p className="mt-1">🔍 Search results will automatically reset to page 1</p>
      </div>
    </div>
  )
}