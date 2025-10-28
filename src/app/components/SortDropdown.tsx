// src/app/components/SortDropdown.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface SortDropdownProps {
  initialValue?: string
}

export default function SortDropdown({ initialValue }: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value
    const params = new URLSearchParams(searchParams?.toString() || '')

    if (sortValue) {
      params.set('sort', sortValue)
    } else {
      params.delete('sort')
    }

    // Remove page parameter when changing sort to avoid out-of-bounds pages
    params.delete('page')

    router.push(`/products?${params.toString()}`)
  }

  return (
    <select
      defaultValue={initialValue || ''}
      onChange={handleSortChange}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="">Recommended</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name">Name A-Z</option>
      <option value="newest">Newest First</option>
      <option value="rating">Highest Rated</option>
    </select>
  )
}