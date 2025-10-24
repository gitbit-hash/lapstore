// src/app/components/ProductRow.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductRowProps {
  product: {
    id: string
    name: string
    price: number
    inventory: number
    isActive: boolean
    images: string[]
    category: {
      name: string
    }
    reviews: Array<{ rating: number }>
    _count: {
      orderItems: number
      reviews: number
    }
  }
}

export default function ProductRow({ product }: ProductRowProps) {
  const router = useRouter()

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
    : 0

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This will make it unavailable to customers.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh the page to show updated list
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-lg object-cover"
              src={product.images[0] || '/images/placeholder.jpg'}
              alt={product.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-xs text-gray-500 font-mono">
              ID: {product.id}
            </div>
            <div className="text-sm text-gray-500">
              {product._count.orderItems} orders • {product.reviews.length} reviews
              {averageRating > 0 && ` • ⭐ ${averageRating.toFixed(1)}`}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{product.category.name}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${product.price}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.inventory}</div>
        {product.inventory <= 10 && product.inventory > 0 && (
          <div className="text-xs text-yellow-600">Low stock</div>
        )}
        {product.inventory === 0 && (
          <div className="text-xs text-red-600">Out of stock</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <Link
            href={`/admin/products/edit/${product.id}`}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}