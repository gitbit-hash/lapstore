// src/app/products/[id]/page.tsx - Updated with awaited params
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { prisma } from '@/app/lib/prisma'
import ProductGrid from '@/app/components/ProductGrid'
import AddToCartButton from '../../components/AddToCartButton'
import { ProductDetail, CartProduct, Product } from '../../types'

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

type ProductWithRelations = Product & {
    category: {
        id: string
        name: string
        slug: string
    }
    reviews: Array<{
        rating: number
    }>
}

async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (!product) return null

        // Calculate average rating with proper typing
        const averageRating = product.reviews.length > 0
            ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
            : 0

        const productDetail: ProductDetail = {
            ...product,
            averageRating,
            reviewCount: product.reviews.length
        }

        return productDetail
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId,
                id: { not: currentProductId },
                isActive: true
            },
            include: {
                category: true,
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
            take: 4
        })

        // Calculate average ratings with proper typing
        const productsWithRatings = products.map((product: ProductWithRelations) => ({
            ...product,
            averageRating: product.reviews.length > 0
                ? product.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / product.reviews.length
                : 0,
            reviewCount: product.reviews.length
        }))

        return productsWithRatings
    } catch (error) {
        console.error('Error fetching related products:', error)
        return []
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    // Await the params promise
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    // Create cart product for AddToCartButton
    const cartProduct: CartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        inventory: product.inventory
    }

    const relatedProducts = await getRelatedProducts(product.category.id, product.id)

    return (
        <main>
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex text-sm">
                        <Link href="/" className="text-blue-600 hover:text-blue-700">
                            Home
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href="/products" className="text-blue-600 hover:text-blue-700">
                            Products
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href={`/products?categories=${product.category.slug}`} className="text-blue-600 hover:text-blue-700">
                            {product.category.name}
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-600">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                            <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={product.images[0] || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-96 object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-1 cursor-pointer hover:border-blue-500">
                                        <Image
                                            src={image}
                                            alt={`${product.name} - View ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-20 object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            {/* Category & Rating */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {product.category.name}
                                </span>
                                <div className="flex items-center">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            star <= Math.floor(product.averageRating)
                                                ? <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                                                : <StarOutline key={star} className="h-5 w-5 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        ({product.reviewCount} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    {product.price} EGP
                                </span>
                                <div className={`text-sm ${product.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Specifications */}
                            {product.specifications && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                                                <span className="font-medium text-gray-700 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                </span>
                                                <span className="text-gray-600">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="mb-6">
                                <AddToCartButton product={cartProduct} />
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">SKU:</span>
                                        {product.id.slice(-8).toUpperCase()}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">Category:</span>
                                        {product.category.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {product.reviews.length > 0 && (
                    <div className="mt-12">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        star <= review.rating
                                                            ? <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                                                            : <StarOutline key={star} className="h-4 w-4 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm font-medium text-gray-900">
                                                    {review.user.name || 'Anonymous'}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <ProductGrid products={relatedProducts} />
                    </div>
                )}
            </div>
        </main>
    )
}

// Generate static params for better performance
export async function generateStaticParams() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { id: true }
    })

    return products.map((product: ProductWithRelations) => ({
        id: product.id
    }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return {
            title: 'Product Not Found'
        }
    }

    return {
        title: product.name,
        description: product.description || `Buy ${product.name} at Tech Haven`,
        openGraph: {
            title: product.name,
            description: product.description || `Buy ${product.name} at Tech Haven`,
            images: product.images,
        },
    }
}