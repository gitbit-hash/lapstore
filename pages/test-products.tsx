// pages/test-products.tsx
import { useEffect, useState } from 'react'

interface Product {
    id: string
    name: string
    price: number
    inventory: number
    category: {
        name: string
    }
}

export default function TestProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products')
                const data = await response.json()
                setProducts(data.products)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div style={{ padding: '20px' }}>
            <h1>Products Test Page</h1>
            <p>Total products: {products.length}</p>

            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Category: {product.category.name}</p>
                        <p>In Stock: {product.inventory}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}