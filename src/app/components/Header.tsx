// app/components/Header.tsx - Updated with auth
'use client'

import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCartStore } from '../stores/cartStore'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
    const { toggleCart, getTotalItems } = useCartStore()
    const { data: session, status } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                TechHaven
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            All Products
                        </Link>
                        <Link href="/products?categories=gaming-laptops" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Gaming
                        </Link>
                        <Link href="/products?categories=business-laptops" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Business
                        </Link>
                    </nav>

                    {/* Cart & Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                            <ShoppingCartIcon className="h-6 w-6" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        {status === 'loading' ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        ) : session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {session.user?.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Your Orders
                                        </Link>
                                        {session.user?.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                signOut()
                                                setShowUserMenu(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/auth/signin"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Close user menu when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    )
}