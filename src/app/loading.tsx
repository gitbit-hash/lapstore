// src/app/Loading.tsx
import { ProductGridSkeleton } from './components/ProductGrid'

export default function Loading() {
  return (
    <main>
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl animate-pulse">
            <div className="h-12 bg-blue-500 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-blue-500 rounded w-full mb-2"></div>
            <div className="h-6 bg-blue-500 rounded w-5/6 mb-8"></div>
            <div className="h-12 bg-white rounded w-48"></div>
          </div>
        </div>
      </div>

      {/* Featured Products Skeleton */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>

        <ProductGridSkeleton />

        <div className="text-center mt-8">
          <div className="h-12 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </section>
    </main>
  )
}