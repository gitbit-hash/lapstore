import Image from 'next/image'
import { Address, Order } from '../types'

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

interface UserProfileProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    emailVerified: Date | null
    image: string | null
    createdAt: Date
    updatedAt: Date
    phone?: string | null
    addresses?: Address[]
    orders?: Order[]
    reviews?: UserReview[] // Use the actual structure, not the Review type
    _count?: {
      orders: number
      reviews: number
      wishlist: number
    }
  }
}

function formatPhoneNumber(phone: string) {
  const numbers = phone.replace(/\D/g, '')
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 11)}`
  }
  return phone // Return as-is if not standard length
}

export default function UserProfile({ user }: UserProfileProps) {
  // Safely get arrays with fallbacks
  const orders = user.orders || []
  const reviews = user.reviews || []
  const addresses = user.addresses || []
  const counts = user._count || { orders: 0, reviews: 0, wishlist: 0 }

  // Safely get the most recent order and review
  const lastOrder = orders.length > 0 ? orders[0] : null
  const lastReview = reviews.length > 0 ? reviews[0] : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Full Name</span>
              <span className="text-sm text-gray-900">{user.name || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-sm text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Phone</span>
              <span className="text-sm text-gray-900">
                {user.phone ? formatPhoneNumber(user.phone) : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Member Since</span>
              <span className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Last Updated</span>
              <span className="text-sm text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Email Verified</span>
              <span className={`text-sm ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                {user.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Total Orders</span>
              <span className="text-sm text-gray-900">{counts.orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Reviews Written</span>
              <span className="text-sm text-gray-900">{counts.reviews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Wishlist Items</span>
              <span className="text-sm text-gray-900">{counts.wishlist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Saved Addresses</span>
              <span className="text-sm text-gray-900">{addresses.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Last order: {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : 'No orders yet'}</p>
          <p>• Last review: {lastReview ? new Date(lastReview.createdAt).toLocaleDateString() : 'No reviews yet'}</p>
          <p>• Account status: <span className="text-green-600">Active</span></p>
        </div>
      </div>

      {/* Profile Image (if available) */}
      {user.image && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h3>
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 relative">
            <Image
              src={user.image}
              alt={user.name || 'User profile'}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>
      )}
    </div>
  )
}