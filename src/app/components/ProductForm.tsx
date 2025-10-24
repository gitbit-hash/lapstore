// src/app/components/ProductForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { Category } from '../types'

interface ProductFormProps {
  onSubmit: (data: any) => void
  isLoading?: boolean
  initialData?: any
}

// Default empty specifications
const defaultSpecifications = {
  processor: '',
  memory: '',
  storage: '',
  display: '',
  graphics: '',
  os: '',
  battery: '',
  weight: '',
  ports: '',
  connectivity: ''
}

export default function ProductForm({ onSubmit, isLoading = false, initialData }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    inventory: initialData?.inventory || 0,
    categoryId: initialData?.categoryId || '',
    images: initialData?.images || [''],
    specifications: initialData?.specifications || defaultSpecifications,
    isActive: initialData?.isActive ?? true
  })
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true)
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: parseInt(formData.inventory.toString()),
      specifications: formData.specifications
    }

    onSubmit(submitData)
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
  }

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index)
    }))
  }

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const addCustomSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      const key = newSpecKey.trim()
      handleSpecificationChange(key, newSpecValue.trim())
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return {
        ...prev,
        specifications: newSpecs
      }
    })
  }

  // Get all specification keys from current specifications
  const specificationKeys = Object.keys(formData.specifications)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                Inventory *
              </label>
              <input
                type="number"
                id="inventory"
                required
                min="0"
                value={formData.inventory}
                onChange={(e) => setFormData(prev => ({ ...prev, inventory: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>

        <div className="space-y-4">
          {formData.images.map((image: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="https://example.com/image.jpg"
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addImageField}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Add Another Image
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>

        {initialData?.specifications && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              Editing specifications for: <strong>{initialData.name}</strong>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specificationKeys.map((key) => (
            <div key={key} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={formData.specifications[key] || ''}
                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 pr-10"
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
              />
              {/* Remove button for custom specifications that aren't in default set */}
              {!Object.keys(defaultSpecifications).includes(key) && (
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="absolute right-2 top-7 text-red-500 hover:text-red-700"
                  title="Remove this specification"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Specification Field */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Add Custom Specification</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="Specification name (e.g., Warranty)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <input
              type="text"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Specification value"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <button
              type="button"
              onClick={addCustomSpecification}
              disabled={!newSpecKey.trim() || !newSpecValue.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Product is active and visible to customers
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
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
          {isLoading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}