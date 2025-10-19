// app/page.tsx
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import { getProducts } from './actions/products'
import Link from 'next/link'

export default async function Home() {
  // Get featured products for the home page
  const { products } = await getProducts({ page: 1 })

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Tech Haven</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the latest computers, high-performance components, and premium accessories.
              Everything you need for work, gaming, and creativity.
            </p>
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handpicked selection of our most popular and high-performance computers and accessories
          </p>
        </div>

        <ProductGrid products={products.slice(0, 6)} />

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            View All Products
          </Link>
        </div>
      </section>
    </main>
  )
}