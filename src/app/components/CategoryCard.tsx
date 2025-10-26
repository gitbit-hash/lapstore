// src/app/components/CategoryCard.tsx
import Link from 'next/link'

interface CategoryCardProps {
  title: string
  href: string
  description?: string
  productCount?: number
}

export default function CategoryCard({
  title,
  href,
  description,
  productCount
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group">
        {/* Category Image */}
        <div className="relative aspect-w-16 aspect-h-10 bg-gray-100 overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
            {/* Fallback gradient background if image fails */}
            <div className="absolute inset-0 bg-black opacity-10"></div>

            {/* Category Icon/Image */}
            <div className="text-white text-4xl font-bold relative z-10 text-center">
              {getCategoryIcon(title)}
            </div>

            {/* Product Count Badge */}
            {productCount !== undefined && (
              <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                {productCount} products
              </div>
            )}
          </div>
        </div>

        {/* Category Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* View Products CTA */}
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
              Shop Now
            </span>
            <svg
              className="w-4 h-4 text-blue-600 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Helper function to get icons for different categories
function getCategoryIcon(categoryTitle: string) {
  const icons: { [key: string]: string } = {
    'Laptops': '💻',
    'PC & Components': '🖥️',
    'Storage': '💾',
    'Monitors': '📺',
    'Accessories': '🎧',
    'Gaming Laptops': '🎮',
    'Business Laptops': '💼',
    'Standard Laptops': '💻',
    'Gaming Desktops': '🕹️',
    'Workstation Desktops': '⚙️',
    'Graphics Cards': '🎴',
    'PC RAM': '🧠',
    'SSD Storage': '🚀',
    'Mechanical Hard Drives': '💿',
    'Gaming Monitors': '🖥️',
    'Professional Monitors': '📊',
    'Standard Monitors': '📺',
    'Gaming Mice': '🐭',
    'Office Mice': '🖱️',
    'Mechanical Keyboards': '⌨️',
    'Membrane Keyboards': '⌨️',
  }

  return icons[categoryTitle] || '🛒'
}