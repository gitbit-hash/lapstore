// src/app/components/Pagination.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNext: boolean
  hasPrev: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  totalProducts,
  hasNext,
  hasPrev
}: PaginationProps) {
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')

    if (pageNumber === 1) {
      params.delete('page')
    } else {
      params.set('page', pageNumber.toString())
    }

    return `/products?${params.toString()}`
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
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
        Showing {(currentPage - 1) * 12 + 1} to {Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Link
          href={createPageURL(currentPage - 1)}
          className={`flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${!hasPrev
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          aria-disabled={!hasPrev}
          tabIndex={!hasPrev ? -1 : undefined}
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
          className={`flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${!hasNext
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          aria-disabled={!hasNext}
          tabIndex={!hasNext ? -1 : undefined}
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