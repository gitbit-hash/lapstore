// src/app/components/UserReviews.tsx
import Link from 'next/link'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

interface UserReviewsProps {
  user: {
    reviews: Array<{
      id: string
      rating: number
      comment: string | null
      createdAt: Date
      updatedAt: Date
      product: {
        name: string
        images: string[]
        id?: string // Make id optional
      }
    }>
  }
}

export default function UserReviews({ user }: UserReviewsProps) {
  const reviews = user.reviews || []

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">This user hasn't written any reviews.</p>
      </div>
    )
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Review Summary</h3>
            <p className="text-gray-600">{reviews.length} total reviews</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.floor(averageRating)
                    ? <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                    : <StarOutline key={star} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={review.product.images[0] || '/images/placeholder.jpg'}
                    alt={review.product.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                </div>
                <div>
                  {review.product.id ? (
                    <Link
                      href={`/products/${review.product.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {review.product.name}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-900">
                      {review.product.name}
                    </span>
                  )}
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= review.rating
                          ? <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                          : <StarOutline key={star} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {review.rating}.0
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {review.comment && (
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                {review.comment}
              </p>
            )}

            <div className="flex justify-end mt-3 space-x-2">
              {review.product.id && (
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Product
                </button>
              )}
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Delete Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}