// src/app/components/MobileFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '../types'

interface MobileFiltersProps {
  categories: Category[]
}

export default function MobileFilters({ categories }: MobileFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const currentCategories = searchParams?.get('categories')?.split(',') || []
  const activeFilterCount = currentCategories.length

  const handleCategoryChange = (categorySlug: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams?.toString() || '')

    let updatedCategories: string[]
    if (isChecked) {
      // Add category
      updatedCategories = [...currentCategories, categorySlug]
    } else {
      // Remove category
      updatedCategories = currentCategories.filter(slug => slug !== categorySlug)
    }

    if (updatedCategories.length > 0) {
      params.set('categories', updatedCategories.join(','))
    } else {
      params.delete('categories')
    }

    // Remove page parameter when changing filters to avoid out-of-bounds pages
    params.delete('page')

    router.push(`/products?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()

    // Preserve search if it exists
    if (searchParams?.get('search')) {
      params.set('search', searchParams.get('search')!)
    }

    router.push(`/products?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <div className="relative lg:hidden">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="p-4 max-h-60 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((category) => {
                const isChecked = currentCategories.includes(category.slug)
                return (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}