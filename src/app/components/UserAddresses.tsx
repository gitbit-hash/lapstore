// src/app/components/UserAddresses.tsx
'use client'

import { useState } from 'react'
import { Address } from '../types'
import AddressForm from './AddressForm'

interface UserAddressesProps {
  user: {
    addresses: Address[]
  }
}

export default function UserAddresses({ user }: UserAddressesProps) {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>(user.addresses)

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsFormOpen(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/addresses/${addressId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Failed to delete address')
    }
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = editingAddress
        ? `/api/admin/addresses/${editingAddress.id}`
        : '/api/admin/addresses'

      const method = editingAddress ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedAddress = await response.json()

        if (editingAddress) {
          setAddresses(prev => prev.map(addr =>
            addr.id === editingAddress.id ? updatedAddress : addr
          ))
        } else {
          setAddresses(prev => [...prev, updatedAddress])
        }

        setIsFormOpen(false)
        setEditingAddress(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Failed to save address')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingAddress(null)
  }

  if (addresses.length === 0 && !isFormOpen) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Addresses Saved</h3>
        <p className="text-gray-500 mb-6">This user hasn't saved any addresses yet.</p>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add First Address
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {addresses.length} address{addresses.length !== 1 ? 'es' : ''}
          </span>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Address
          </button>
        </div>
      </div>

      {/* Address Form Modal */}
      {isFormOpen && (
        <AddressForm
          address={editingAddress || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 ${address.isDefault
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white'
              }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      Default
                    </span>
                  )}
                </h4>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
            </div>

            {/* Address Usage */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {new Date(address.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(address.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}