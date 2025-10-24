'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  status: string
}

interface OrderStatusUpdateProps {
  order: Order
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
]

export function OrderStatusUpdate({ order }: OrderStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      setMessage('Status is already set to this value.')
      return
    }

    setIsUpdating(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (response.ok) {
        setMessage('Order status updated successfully!')
        // Refresh the page to show updated status
        router.refresh()

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage('')
        }, 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      setMessage('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getCurrentStatusColor = () => {
    const currentStatus = statusOptions.find(option => option.value === order.status)
    return currentStatus?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Order Status</h2>

      {/* Current Status Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Current Status:</p>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCurrentStatusColor()}`}>
          {order.status}
        </span>
      </div>

      {/* Status Selector */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          New Status
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={isUpdating}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Update Button */}
      <button
        onClick={handleStatusUpdate}
        disabled={isUpdating || selectedStatus === order.status}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isUpdating ? 'Updating...' : 'Update Status'}
      </button>

      {/* Message Display */}
      {message && (
        <div className={`mt-3 p-3 rounded-md text-sm ${message.includes('successfully')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {message}
        </div>
      )}

      {/* Status Descriptions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status Descriptions:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Pending:</strong> Order received, awaiting confirmation</li>
          <li>• <strong>Confirmed:</strong> Order verified and being prepared</li>
          <li>• <strong>Processing:</strong> Order is being processed for shipping</li>
          <li>• <strong>Shipped:</strong> Order has been shipped to customer</li>
          <li>• <strong>Delivered:</strong> Order successfully delivered</li>
          <li>• <strong>Cancelled:</strong> Order has been cancelled</li>
        </ul>
      </div>
    </div>
  )
}