// app/page.tsx
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'

export default function Home() {
  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Tech Haven
          </h1>
          <p className="text-xl text-gray-600">
            Discover the latest computers, components, and accessories
          </p>
        </div>
        <ProductGrid />
      </div>
    </main>
  )
}