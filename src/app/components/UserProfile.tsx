// src/app/components/UserProfile.tsx - Complete with proper typing
import { Address } from '../types'

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
    addresses: Address[]
    orders: Array<{
      id: string
      createdAt: Date
      total: number
      status: string
      orderItems: Array<{
        product: {
          name: string
          images: string[]
        }
      }>
    }>
    reviews: Array<{
      id: string
      createdAt: Date
      rating: number
      comment: string | null
      product: {
        name: string
        images: string[]
      }
    }>
    _count: {
      orders: number
      reviews: number
      wishlist: number
    }
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  // Get the most recent order and review
  const lastOrder = user.orders[0]
  const lastReview = user.reviews[0]

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
              <span className="text-sm font-medium text-gray-500">Role</span>
              <span className="text-sm text-gray-900 capitalize">{user.role.toLowerCase().replace('_', ' ')}</span>
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
              <span className="text-sm text-gray-900">{user._count.orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Reviews Written</span>
              <span className="text-sm text-gray-900">{user._count.reviews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Wishlist Items</span>
              <span className="text-sm text-gray-900">{user._count.wishlist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Saved Addresses</span>
              <span className="text-sm text-gray-900">{user.addresses.length}</span>
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
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
            <img
              src={user.image}
              alt={user.name || 'User profile'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  )
}