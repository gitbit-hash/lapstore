// src/app/components/UserDetailTabs.tsx
'use client'

import { useState } from 'react'
import { Address } from '../types'
import UserProfile from './UserProfile'
import UserOrders from './UserOrders'
import UserReviews from './UserReviews'
import UserAddresses from './UserAddresses'
interface BaseUserInfo {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
  phone?: string | null
}
interface UserDetailTabsProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    emailVerified: Date | null
    image: string | null
    createdAt: Date
    updatedAt: Date
    addresses: Address[]
    phone: string | null
    orders: Array<{
      id: string
      total: number
      status: string
      paymentMethod?: string
      createdAt: Date
      updatedAt: Date
      orderItems: Array<{
        id: string
        quantity: number
        price: number
        product: {
          name: string
          images: string[]
        }
      }>
    }>
    reviews: Array<{
      id: string
      rating: number
      comment: string | null
      createdAt: Date
      updatedAt: Date
      product: {
        name: string
        images: string[]
        // Make id optional since Prisma might not include it
        id?: string
      }
    }>
    _count: {
      orders: number
      reviews: number
      wishlist: number
    }
  }
  userStats: {
    totalSpent: number
    totalOrders: number
    averageOrderValue: number
    totalReviews: number
    totalWishlist: number
  }
}

export default function UserDetailTabs({ user, userStats }: UserDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', component: UserProfile },
    { id: 'orders', name: 'Orders', component: UserOrders },
    { id: 'reviews', name: 'Reviews', component: UserReviews },
    { id: 'addresses', name: 'Addresses', component: UserAddresses },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  // Render the appropriate component with the right props
  const renderActiveComponent = () => {
    if (!ActiveComponent) return null

    switch (activeTab) {
      case 'profile':
        return <ActiveComponent user={user} />
      case 'orders':
        return <ActiveComponent user={user} />
      case 'reviews':
        return <ActiveComponent user={user} />
      case 'addresses':
        return <ActiveComponent user={user} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <span>{tab.name}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600'
                }`}>
                {tab.id === 'orders' && userStats.totalOrders}
                {tab.id === 'reviews' && userStats.totalReviews}
                {tab.id === 'addresses' && user.addresses.length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderActiveComponent()}
      </div>
    </div>
  )
}