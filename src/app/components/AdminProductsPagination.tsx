// src/app/components/AdminProductsPagination.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface AdminProductsPaginationProps {
  currentPage: number
  totalPages: number
  totalProducts: number
  searchQuery?: string
}

export default function AdminProductsPagination({
  currentPage,
  totalPages,
  totalProducts,
  searchQuery
}: AdminProductsPaginationProps) {
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')

    if (pageNumber === 1) {
      params.delete('page')
    } else {
      params.set('page', pageNumber.toString())
    }

    // Preserve search query
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }

    return `/admin/products?${params.toString()}`
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 2)
      let end = Math.min(totalPages - 1, currentPage + 2)

      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        end = 5
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 4
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalProducts)} of {totalProducts} products
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Link
          href={createPageURL(currentPage - 1)}
          className={`flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage <= 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </Link>

        {/* Page Numbers */}
        <div className="hidden sm:flex space-x-1">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <Link
                  href={createPageURL(page as number)}
                  className={`px-3 py-2 border text-sm font-medium rounded-md ${currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Page Info */}
        <div className="sm:hidden text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <Link
          href={createPageURL(currentPage + 1)}
          className={`flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage >= totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Page Info for Desktop */}
      <div className="hidden sm:block text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}