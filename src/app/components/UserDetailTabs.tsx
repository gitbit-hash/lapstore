'use client'

import { useState } from 'react'
import { Address, Order } from '../types'
import UserProfile from './UserProfile'
import UserOrders from './UserOrders'
import UserReviews from './UserReviews'
import UserAddresses from './UserAddresses'

// Define the actual review structure we're using
interface UserReview {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  updatedAt: Date
  product: {
    name: string
    images: string[]
    id?: string
  }
}

// Define proper types for each component
interface UserProfileData {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
  phone?: string | null
  addresses: Address[]
  orders?: Order[]
  reviews?: UserReview[]
  _count?: {
    orders: number
    reviews: number
    wishlist: number
  }
}

interface UserOrdersData {
  id: string
  name: string | null
  email: string
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
}

interface UserReviewsData {
  reviews: UserReview[]
}

interface UserAddressesData {
  addresses: Address[]
}

interface UserDetailTabsProps {
  user: UserProfileData
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
    { id: 'profile', name: 'Profile' },
    { id: 'orders', name: 'Orders' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'addresses', name: 'Addresses' },
  ]

  // Prepare user data for each component with proper typing
  const getUserForComponent = (tabId: string) => {
    switch (tabId) {
      case 'profile':
        return user as UserProfileData
      case 'orders':
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          orders: user.orders || []
        } as UserOrdersData
      case 'reviews':
        return {
          reviews: user.reviews || []
        } as UserReviewsData
      case 'addresses':
        return {
          addresses: user.addresses || []
        } as UserAddressesData
      default:
        return user
    }
  }

  const renderActiveComponent = () => {
    const userForComponent = getUserForComponent(activeTab)

    switch (activeTab) {
      case 'profile':
        return <UserProfile user={userForComponent as UserProfileData} />
      case 'orders':
        return <UserOrders user={userForComponent as UserOrdersData} />
      case 'reviews':
        return <UserReviews user={userForComponent as UserReviewsData} />
      case 'addresses':
        return <UserAddresses user={userForComponent as UserAddressesData} />
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
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {tab.id === 'orders' && userStats.totalOrders}
                {tab.id === 'reviews' && userStats.totalReviews}
                {tab.id === 'addresses' && user.addresses.length}
                {tab.id === 'profile' && ''}
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