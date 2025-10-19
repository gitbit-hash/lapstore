// app/components/ProductGrid.tsx
import ProductCard from './ProductCard'
import { getProducts } from '../actions/products'

export default async function ProductGrid() {
    const { products } = await getProducts()

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}