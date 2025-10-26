// src/app/admin/products/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm, { ProductSubmitData } from './../../../../components/ProductForm'

// Define proper TypeScript interface for product data that matches the API response
interface Product {
  id: string
  name: string
  description: string
  price: number
  inventory: number
  categoryId: string
  images: string[]
  specifications: {
    processor: string
    memory: string
    storage: string
    display: string
    graphics: string
    os: string
    battery: string
    weight: string
    ports: string
    connectivity: string
    [key: string]: string // Allow additional custom specifications
  }
  isActive: boolean
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const productId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`)
        if (response.ok) {
          const productData = await response.json()
          setProduct(productData)
        } else {
          console.error('Failed to fetch product')
          router.push('/admin/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/admin/products')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  const handleSubmit = async (formData: ProductSubmitData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
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

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you&apos;re trying to edit doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    )
  }

  // Convert the product data to match ProductSubmitData format
  const initialFormData: ProductSubmitData = {
    name: product.name,
    description: product.description,
    price: product.price,
    inventory: product.inventory,
    categoryId: product.categoryId,
    images: product.images,
    specifications: product.specifications,
    isActive: product.isActive
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information and specifications</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        initialData={initialFormData}
      />
    </div>
  )
}