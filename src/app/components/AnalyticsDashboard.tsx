// src/app/components/AnalyticsDashboard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevenueChart from './RevenueChart'
import StatCard from './StatCard'
import TopProductsList from './TopProductsList'
import RecentActivity from './RecentActivity'
import CategoryBreakdown from './CategoryBreakdown'

interface AnalyticsDashboardProps {
  data: {
    period: string
    revenueData: any
    orderStats: any
    userStats: any
    productStats: any
    categoryStats: any
    recentOrders: any[]
    topProducts: any[]
    dateRange: {
      startDate: Date
      endDate: Date
    }
  }
}

const periodOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
]

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(data.period)

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    // This would typically trigger a page refresh with new query params
    window.location.href = `/admin/analytics?period=${period}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive overview of your store performance
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.revenueData.total)}
          change={data.revenueData.growth}
          description={`vs previous period`}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(data.orderStats.total)}
          description={`${data.orderStats.completed} completed`}
          color="green"
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(data.orderStats.averageValue)}
          description="Per completed order"
          color="purple"
        />
        <StatCard
          title="Conversion Rate"
          value={`${data.orderStats.conversionRate.toFixed(1)}%`}
          description="Order completion rate"
          color="orange"
        />
      </div>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart - Full width on large screens, 2/3 on xl */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <div className="text-sm text-gray-500">
                {periodOptions.find(p => p.value === selectedPeriod)?.label}
              </div>
            </div>
            <RevenueChart data={data.revenueData.daily} />
          </div>
        </div>

        {/* Top Products */}
        <div className="xl:col-span-1">
          <TopProductsList products={data.topProducts} />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={formatNumber(data.userStats.total)}
          description={`${data.userStats.new} new this period`}
          color="indigo"
          size="small"
        />
        <StatCard
          title="Active Products"
          value={formatNumber(data.productStats.active)}
          description={`${data.productStats.outOfStock} out of stock`}
          color="teal"
          size="small"
        />
        <StatCard
          title="Returning Customers"
          value={formatNumber(data.userStats.returning)}
          description="Customers with orders"
          color="pink"
          size="small"
        />
        <StatCard
          title="Low Stock Items"
          value={formatNumber(data.productStats.lowStock)}
          description="Need restocking"
          color="yellow"
          size="small"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <RecentActivity orders={data.recentOrders} />
        </div>

        {/* Category Breakdown */}
        <div>
          <CategoryBreakdown categories={data.categoryStats} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/admin/users"
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/categories"
            className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  )
}