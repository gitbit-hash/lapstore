// src/app/admin/categories/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '@/app/components/CategoryForm'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categoryId = params.id as string

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`)
        if (response.ok) {
          const categoryData = await response.json()
          setCategory(categoryData)
        } else {
          console.error('Failed to fetch category')
          router.push('/admin/categories')
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        router.push('/admin/categories')
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId, router])

  const handleSubmit = async (formData: { name: string; slug: string; description?: string }) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/categories')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-6">
          The category you&apos;re trying to edit doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push('/admin/categories')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Categories
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-2">Update category information</p>
      </div>

      <CategoryForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        initialData={category}
      />
    </div>
  )
}