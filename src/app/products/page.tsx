// app/products/page.tsx
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import SearchBar from '../components/SearchBar'
import { getProducts } from '../actions/products'
import { getCategories } from '../actions/categories'

interface ProductsPageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    // Safely handle searchParams
    const safeSearchParams = searchParams || {}

    // Convert searchParams to the expected filters with proper null checks
    const category = Array.isArray(safeSearchParams.category) ? safeSearchParams.category[0] : safeSearchParams.category
    const search = Array.isArray(safeSearchParams.search) ? safeSearchParams.search[0] : safeSearchParams.search
    const sort = Array.isArray(safeSearchParams.sort) ? safeSearchParams.sort[0] : safeSearchParams.sort
    const page = Array.isArray(safeSearchParams.page) ? safeSearchParams.page[0] : safeSearchParams.page
    const minPrice = Array.isArray(safeSearchParams.minPrice) ? safeSearchParams.minPrice[0] : safeSearchParams.minPrice
    const maxPrice = Array.isArray(safeSearchParams.maxPrice) ? safeSearchParams.maxPrice[0] : safeSearchParams.maxPrice
    const categories = Array.isArray(safeSearchParams.categories) ? safeSearchParams.categories[0] : safeSearchParams.categories

    const [productsData, categoriesData] = await Promise.all([
        getProducts({
            category: category || undefined,
            search: search || undefined,
            sort: sort || undefined,
            page: page ? parseInt(page) : 1,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            categories: categories || undefined
        }),
        getCategories()
    ])

    // Count active filters safely
    const activeFilterCount = [
        safeSearchParams.search,
        safeSearchParams.categories,
        safeSearchParams.minPrice,
        safeSearchParams.maxPrice,
        safeSearchParams.sort
    ].filter(Boolean).length

    return (
        <main>
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
                        <SearchBar />
                    </div>

                    {/* Active Filters */}
                    {activeFilterCount > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing results with {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <ProductFilters categories={categoriesData} />
                    </div>

                    {/* Main Content - Products */}
                    <div className="flex-1">
                        <ProductGrid products={productsData.products} />

                        {/* Pagination */}
                        {productsData.pagination && productsData.pagination.totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-700">
                                        Page {productsData.pagination.currentPage} of {productsData.pagination.totalPages}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}