// src/app/components/UserAddresses.tsx
import { Address } from '../types'

interface UserAddressesProps {
  user: {
    addresses: Address[]
  },
  address: Address
}

export default function UserAddresses({ user }: UserAddressesProps) {
  if (user.addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Addresses Saved</h3>
        <p className="text-gray-500">This user hasn't saved any addresses yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
        <span className="text-sm text-gray-500">
          {user.addresses.length} address{user.addresses.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.addresses.map((address) => (
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
                  Shipping Address
                </h4>
                {address.name && (
                  <p className="text-sm text-gray-600 mt-1">{address.name}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
                {!address.isDefault && (
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
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

      {/* Add New Address Button */}
      <div className="text-center">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Address
        </button>
      </div>
    </div>
  )
}