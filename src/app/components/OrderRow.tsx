'use client'

import { useState } from 'react'

interface OrderRowProps {
  order: {
    id: string
    total: number
    status: string
    paymentMethod?: string
    createdAt: Date
    customer: {
      id: string
      phone: string
      name: string | null
      email: string
    }
    orderItems: Array<{
      id: string
      quantity: number
      price: number
      product: {
        name: string
        images: string[]
      }
    }>
  }
}

const statusColors: { [key: string]: string } = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusOptions = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
]

export default function OrderRow({ order }: OrderRowProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setCurrentStatus(newStatus)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update order status')
        setCurrentStatus(order.status) // Revert on error
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
      setCurrentStatus(order.status) // Revert on error
    } finally {
      setIsUpdating(false)
    }
  }

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {order.customer.name || 'No Name'}
          </div>
        </div>
      </td>

      {/* Add Contact Information Column */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {order.customer.email}
        </div>
        <div className="text-sm text-gray-500">
          {order.customer.phone || 'No phone'}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </div>
        <div className="text-sm text-gray-500">
          {order.orderItems[0]?.product.name}
          {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
        </div>
      </td>

      {/* ... rest of the existing columns ... */}
    </tr>
  )
}