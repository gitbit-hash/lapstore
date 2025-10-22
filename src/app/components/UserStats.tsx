// src/app/components/UserStats.tsx
interface UserStatsProps {
  stats: {
    total: number
    customers: number
    admins: number
    verified: number
  }
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Users"
        value={stats.total}
        description="All registered users"
        color="blue"
      />
      <StatCard
        title="Customers"
        value={stats.customers}
        description="Regular customers"
        color="green"
      />
      <StatCard
        title="Admins"
        value={stats.admins}
        description="Admin & Super Admin"
        color="purple"
      />
      <StatCard
        title="Verified"
        value={stats.verified}
        description="Email verified users"
        color="orange"
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  color
}: {
  title: string
  value: number
  description: string
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  )
}