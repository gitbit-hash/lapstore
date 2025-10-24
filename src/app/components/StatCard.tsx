// src/app/components/StatCard.tsx
interface StatCardProps {
  title: string
  value: string
  change?: number
  description: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'teal' | 'pink' | 'yellow'
  size?: 'normal' | 'small'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600'
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-600'
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-600'
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600'
  }
}

export default function StatCard({
  title,
  value,
  change,
  description,
  color,
  size = 'normal'
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-${size === 'normal' ? '6' : '4'}`}>
      <h3 className={`text-${size === 'normal' ? 'lg' : 'sm'} font-medium text-gray-900 mb-2`}>
        {title}
      </h3>
      <div className="flex items-baseline justify-between">
        <p className={`text-${size === 'normal' ? '3xl' : '2xl'} font-bold ${colors.text}`}>
          {value}
        </p>
        {change !== undefined && (
          <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  )
}