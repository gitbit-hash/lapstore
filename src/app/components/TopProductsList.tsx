// src/app/components/TopProductsList.tsx
import Link from 'next/link'
import Image from 'next/image'

interface TopProductsListProps {
  products: Array<{
    productId: string
    productName: string
    category: string
    image: string
    quantitySold: number
    revenue: number
  }>
}

export default function TopProductsList({ products }: TopProductsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.productId} className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
              {index + 1}
            </div>
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.productName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.productName}
              </p>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-xs text-gray-600">
                {product.quantitySold} sold • {formatCurrency(product.revenue)}
              </p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No sales data available
          </p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/admin/products"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View all products →
        </Link>
      </div>
    </div>
  )
}