// src/app/profile/page.tsx - Updated for all admins
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import { UserRole } from '../types'
import Link from 'next/link'

export default async function Profile() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth/signin')
    }

    const isAdmin = session.user.role === UserRole.ADMIN || session.user.role === UserRole.SUPER_ADMIN
    const isCustomer = !isAdmin

    // Get user data with proper includes
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            addresses: {
                orderBy: { isDefault: 'desc' }
            },
            ...(isCustomer ? { // Only include orders if customer (not admin)
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
            } : {}),
            _count: {
                select: {
                    orders: true,
                    reviews: true,
                    wishlist: true
                }
            }
        }
    })

    if (!user) {
        redirect('/auth/signin')
    }

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return 'Super Administrator'
            case UserRole.ADMIN:
                return 'Administrator'
            default:
                return 'Customer'
        }
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
                                    Phone Number
                                </label>
                                <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Type
                                </label>
                                <p className="text-gray-900">{getRoleDisplay(user.role)}</p>
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

                    {/* Recent Orders - Only show for customers */}
                    {isCustomer && 'orders' in user && user.orders && user.orders.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                            <div className="space-y-4">
                                {user.orders.map((order) => (
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
                                                <p className="font-medium text-gray-900">{order.total.toFixed(0)} EGP</p>
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
                                            {'orderItems' in order ? order.orderItems.length : 0} item{('orderItems' in order ? order.orderItems.length : 0) !== 1 ? 's' : ''}
                                        </div>
                                        {'orderItems' in order && order.orderItems.length > 0 && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                {order.orderItems.slice(0, 2).map((item) => (
                                                    <div key={item.id}>
                                                        {item.product.name} × {item.quantity}
                                                    </div>
                                                ))}
                                                {order.orderItems.length > 2 && (
                                                    <div>+{order.orderItems.length - 2} more items</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Orders Message for customers */}
                    {isCustomer && 'orders' in user && (!user.orders || user.orders.length === 0) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                            <Link
                                href="/products"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {/* Admin Notice */}
                    {isAdmin && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-blue-900 mb-2">Administrator Account</h2>
                            <p className="text-blue-700">
                                As an administrator, you have access to the admin dashboard where you can manage products, orders, and users.
                            </p>
                            <Link
                                href="/admin"
                                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Go to Admin Dashboard
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Account Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                        <div className="space-y-3">
                            {isCustomer && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Orders</span>
                                    <span className="font-medium text-gray-900">{user._count.orders}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Member Since</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(user.createdAt).getFullYear()}
                                </span>
                            </div>
                            {isAdmin && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role</span>
                                    <span className={`font-medium ${user.role === UserRole.SUPER_ADMIN ? 'text-purple-600' : 'text-blue-600'
                                        }`}>
                                        {getRoleDisplay(user.role)}
                                    </span>
                                </div>
                            )}
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
                            {isCustomer && (
                                <Link
                                    href="/orders"
                                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    View All Orders
                                </Link>
                            )}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}