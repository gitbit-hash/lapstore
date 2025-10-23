// src/app/components/UserRow.tsx - Updated interface
'use client'

import { useState } from 'react'
import { UserRole } from '../types'
import Link from 'next/link'

interface UserRowProps {
  user: {
    id: string
    name: string | null
    email: string
    phone: string,
    role: UserRole
    emailVerified: Date | null
    createdAt: Date
    _count: {
      orders: number
      reviews: number
    }
  }
}

export default function UserRow({ user }: UserRowProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(user.role)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleUpdate = async (newRole: UserRole) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setCurrentRole(newRole)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update user role')
        setCurrentRole(user.role) // Revert on error
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
      setCurrentRole(user.role) // Revert on error
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800'
      case UserRole.ADMIN:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function formatPhoneNumber(phone: string) {
    const numbers = phone.replace(/\D/g, '')
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 11)}`
    }
    return phone // Return as-is if not standard length
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {user.name || 'No Name'}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
          {user.phone && (
            <div className="text-sm text-gray-400">
              {formatPhoneNumber(user.phone)}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={currentRole}
          onChange={(e) => handleRoleUpdate(e.target.value as UserRole)}
          disabled={isUpdating}
          className={`text-xs font-medium py-1 px-2 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getRoleColor(currentRole)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {Object.values(UserRole).map((role) => (
            <option key={role} value={role} className="bg-white text-gray-900">
              {role.replace('_', ' ')}
            </option>
          ))}
        </select>
        {isUpdating && (
          <div className="mt-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user._count.orders} orders
        </div>
        <div className="text-sm text-gray-500">
          {user._count.reviews} reviews
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          {user.emailVerified ? 'Verified' : 'Not verified'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link
          href={`/admin/users/${user.id}`}
          className="text-blue-600 hover:text-blue-900 font-medium"
        >
          View Details
        </Link>
      </td>
    </tr>
  )
}