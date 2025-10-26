// src/app/components/CategoryForm.tsx
'use client'

import { useState, useEffect } from 'react'

// Define proper TypeScript interfaces
interface CategoryFormData {
  name: string
  slug: string
}

interface Category {
  name: string
  slug: string
}

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void
  isLoading?: boolean
  initialData?: Category
}

export default function CategoryForm({ onSubmit, isLoading = false, initialData }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
  })

  const [slugError, setSlugError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(formData.slug)) {
      setSlugError('Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with hyphen.')
      return
    }

    setSlugError('')
    onSubmit(formData)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name: name,
      // Auto-generate slug from name if slug is empty or matches the auto-generated pattern
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase()
    setFormData(prev => ({ ...prev, slug }))

    // Clear error when user starts typing
    if (slugError) {
      setSlugError('')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleGenerateSlug = () => {
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(prev.name)
    }))
    setSlugError('')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter category name (e.g., Gaming Laptops)"
          />
        </div>

        {/* Category Slug */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL Slug *
            </label>
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Generate from name
            </button>
          </div>
          <input
            type="text"
            id="slug"
            required
            value={formData.slug}
            onChange={handleSlugChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${slugError ? 'border-red-300' : 'border-gray-300'
              }`}
            placeholder="Enter URL slug (e.g., gaming-laptops)"
          />
          {slugError && (
            <p className="mt-1 text-sm text-red-600">{slugError}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Used in URLs. Must be unique and contain only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        {/* Preview */}
        {formData.slug && !slugError && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">URL Preview:</h4>
            <p className="text-sm text-gray-600">
              https://techhaven.com/products?categories=<span className="font-mono text-blue-600">{formData.slug}</span>
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
          </button>
        </div>
      </div>
    </form>
  )
}