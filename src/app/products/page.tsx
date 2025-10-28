// src/app/products/page.tsx
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import MobileFilters from '../components/MobileFilters'
import Pagination from '../components/Pagination'
import { getProducts } from '../actions/products'
import { getCategories } from '../actions/categories'
import SortDropdown from '../components/SortDropdown'

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    // Await the searchParams promise
    const resolvedSearchParams = await searchParams

    // Safely handle searchParams
    const safeSearchParams = resolvedSearchParams || {}

    // Convert searchParams to the expected filters with proper null checks
    const category = Array.isArray(safeSearchParams.category) ? safeSearchParams.category[0] : safeSearchParams.category
    const search = Array.isArray(safeSearchParams.search) ? safeSearchParams.search[0] : safeSearchParams.search
    const sort = Array.isArray(safeSearchParams.sort) ? safeSearchParams.sort[0] : safeSearchParams.sort
    const page = Array.isArray(safeSearchParams.page) ? safeSearchParams.page[0] : safeSearchParams.page
    const minPrice = Array.isArray(safeSearchParams.minPrice) ? safeSearchParams.minPrice[0] : safeSearchParams.minPrice
    const maxPrice = Array.isArray(safeSearchParams.maxPrice) ? safeSearchParams.maxPrice[0] : safeSearchParams.maxPrice
    const categories = Array.isArray(safeSearchParams.categories) ? safeSearchParams.categories[0] : safeSearchParams.categories

    const currentPage = page ? parseInt(page) : 1

    const [productsData, categoriesData] = await Promise.all([
        getProducts({
            category: category || undefined,
            search: search || undefined,
            sort: sort || undefined,
            page: currentPage,
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
                <div className="container mx-auto px-4 py-4">
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
                    {/* Sidebar - Filters - Hidden on mobile */}
                    <div className="hidden lg:block lg:w-64 flex-shrink-0">
                        <ProductFilters categories={categoriesData} />
                    </div>

                    {/* Main Content - Products */}
                    <div className="flex-1">
                        {/* Mobile Layout - Filters Dropdown and Sort Dropdown */}
                        <div className="lg:hidden mb-6">
                            <div className="flex space-x-4 items-center">
                                {/* Mobile Filters Dropdown */}
                                <div className="flex-1">
                                    <MobileFilters categories={categoriesData} />
                                </div>

                                {/* Sort Dropdown */}
                                <div className="flex-1">
                                    <SortDropdown initialValue={sort} />
                                </div>
                            </div>

                            {/* Results info below for mobile */}
                            {productsData.pagination && (
                                <div className="mt-4">
                                    <p className="text-gray-600 text-sm">
                                        Showing {(productsData.pagination.currentPage - 1) * 12 + 1} to{' '}
                                        {Math.min(productsData.pagination.currentPage * 12, productsData.pagination.totalProducts)} of{' '}
                                        {productsData.pagination.totalProducts} products
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Desktop Layout - Sort and Results Info */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            {/* Sort dropdown on left for desktop */}
                            <div className="w-64">
                                <SortDropdown initialValue={sort} />
                            </div>
                            {/* Results info on right for desktop */}
                            {productsData.pagination && (
                                <div>
                                    <p className="text-gray-600">
                                        Showing {(productsData.pagination.currentPage - 1) * 12 + 1} to{' '}
                                        {Math.min(productsData.pagination.currentPage * 12, productsData.pagination.totalProducts)} of{' '}
                                        {productsData.pagination.totalProducts} products
                                    </p>
                                </div>
                            )}
                        </div>

                        <ProductGrid products={productsData.products} />

                        {/* Pagination */}
                        {productsData.pagination && productsData.pagination.totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={productsData.pagination.currentPage}
                                    totalPages={productsData.pagination.totalPages}
                                    totalProducts={productsData.pagination.totalProducts}
                                    hasNext={productsData.pagination.hasNext}
                                    hasPrev={productsData.pagination.hasPrev}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}