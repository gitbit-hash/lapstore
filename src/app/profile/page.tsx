// app/profile/page.tsx - Updated with proper types
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import { UserWithOrders, Order } from '../types'

export default async function Profile() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth/signin')
    }

    // Get user data with additional info
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            addresses: {
                orderBy: { isDefault: 'desc' }
            },
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    images: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }) as UserWithOrders | null

    if (!user) {
        redirect('/auth/signin')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <p className="text-gray-900">{user.name || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Type
                                </label>
                                <p className="text-gray-900 capitalize">{user.role.toLowerCase()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Member Since
                                </label>
                                <p className="text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                        {user.orders.length === 0 ? (
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.orders.map((order: Order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Order #{order.id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">${order.total}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Account Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-medium text-gray-900">{user.orders.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Member Since</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(user.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                Edit Profile
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                Change Password
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                View All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}