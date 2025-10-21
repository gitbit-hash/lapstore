import ProductCard from './ProductCard'
import { Product } from '../types'
import Loading from '../loading'

interface ProductGridProps {
    products: Product[]
    isLoading?: boolean
}

// Skeleton component in the same file
export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex justify-between items-center">
                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
    if (isLoading) {
        return <Loading />
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">
                        Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}