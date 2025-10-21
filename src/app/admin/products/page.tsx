// src/app/admin/products/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from './../../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from './../../lib/prisma'
import { UserRole } from './../../types'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: {
        select: {
          rating: true
        }
      },
      _count: {
        select: {
          orderItems: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Products ({products.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first product.</p>
            <Link
              href="/admin/products/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Add First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductRow({ product }: { product: any }) {
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
    : 0

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
            <div className="text-sm text-gray-500">
              {product._count.orderItems} orders
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
        <div className="flex space-x-2">
          <Link
            href={`/admin/products/edit/${product.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            Edit
          </Link>
          <button
            className="text-red-600 hover:text-red-900"
          // We'll add delete functionality later
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}