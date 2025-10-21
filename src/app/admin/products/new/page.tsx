// src/app/admin/products/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from './../../../components/ProductForm'

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
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
        alert(error.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product listing for your store</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}