// src/app/admin/products/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from './../../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from './../../lib/prisma'
import { UserRole } from './../../types'
import Link from 'next/link'
import ProductRow from './../../components/ProductRow'
import AdminProductsSearch from './../../components/AdminProductsSearch'

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string
  }>
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedSearchParams = await searchParams

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  const searchQuery = resolvedSearchParams.search || ''

  // Build where clause for search
  const where: any = {}

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { id: { contains: searchQuery, mode: 'insensitive' } }
    ]
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      reviews: {
        select: {
          rating: true
        }
      },
      _count: {
        select: {
          orderItems: true,
          reviews: true
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage and search all products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </Link>
      </div>

      {/* Search Bar for Products */}
      <div className="mb-6">
        <AdminProductsSearch initialSearch={searchQuery} />
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700">
                Showing {products.length} products matching "<strong>{searchQuery}</strong>"
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Search includes: Product Name and Product ID
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Search
            </Link>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            All Products ({products.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product & ID
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Try adjusting your search criteria to find what you\'re looking for.'
                : 'Get started by adding your first product.'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/admin/products/new"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Add First Product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}