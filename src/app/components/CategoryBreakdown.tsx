// src/app/components/CategoryBreakdown.tsx
import Link from 'next/link'

interface CategoryBreakdownProps {
  categories: Array<{
    id: string
    name: string
    productCount: number
    totalValue: number
  }>
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Calculate total products and value for percentage calculations
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0)
  const totalValue = categories.reduce((sum, cat) => sum + cat.totalValue, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h2>
      <div className="space-y-4">
        {categories.slice(0, 8).map((category) => {
          const productPercentage = totalProducts > 0 ? (category.productCount / totalProducts) * 100 : 0
          const valuePercentage = totalValue > 0 ? (category.totalValue / totalValue) * 100 : 0

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-600">{category.productCount} products</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${productPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{productPercentage.toFixed(1)}% of products</span>
                <span>{formatCurrency(category.totalValue)} value</span>
              </div>
            </div>
          )
        })}
        {categories.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No categories available
          </p>
        )}
      </div>
      {categories.length > 8 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-500">
            +{categories.length - 8} more categories
          </span>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/admin/categories"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Manage categories →
        </Link>
      </div>
    </div>
  )
} 