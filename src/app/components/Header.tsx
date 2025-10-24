'use client'

import { ShoppingCartIcon, UserCircleIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCartStore } from '../stores/cartStore'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { UserRole } from '../types'
import SearchBar from './SearchBar'

export default function Header() {
    const { toggleCart, getTotalItems } = useCartStore()
    const { data: session, status } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const isAdmin = session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.SUPER_ADMIN
    const isCustomer = !isAdmin // Regular customer

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            {/* First Row: Logo, Search, User Actions */}
            <div className="border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - Left */}
                        <div className="flex items-center">
                            <Link href="/">
                                <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                    TechHaven
                                </h1>
                            </Link>
                        </div>

                        {/* Search Bar - Middle */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <SearchBar />
                        </div>

                        {/* User Actions - Right */}
                        <div className="flex items-center space-x-4">
                            {/* Cart Link */}
                            <Link
                                href="/cart"
                                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors group"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>

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
                                                <p className="text-xs text-gray-400 capitalize mt-1">
                                                    {session.user?.role?.toLowerCase().replace('_', ' ')}
                                                </p>
                                            </div>

                                            {/* Profile Link */}
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Your Profile
                                            </Link>

                                            {/* Orders Link - Only show for regular customers */}
                                            {isCustomer && (
                                                <Link
                                                    href="/orders"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Your Orders
                                                </Link>
                                            )}

                                            {/* Admin Dashboard Link - Show for all admins */}
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            {/* Sign Out */}
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
            </div>

            {/* Second Row: Navigation & Contact */}
            <div className="bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-12">
                        {/* Navigation Links - Left */}
                        <nav className="flex items-center space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                                Home
                            </Link>
                            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                                Products
                            </Link>

                            {/* Products Categories Dropdown */}
                            <div className="relative group">
                                <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm flex items-center">
                                    Products Categories ↓
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    {/* Laptops */}
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        Laptops
                                    </div>
                                    <Link href="/products?categories=gaming-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Gaming Laptops
                                    </Link>
                                    <Link href="/products?categories=business-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Business Laptops
                                    </Link>
                                    <Link href="/products?categories=standard-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Standard Laptops
                                    </Link>

                                    {/* PC & Components */}
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        PC & Components
                                    </div>
                                    <Link href="/products?categories=gaming-desktops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Gaming Desktops
                                    </Link>
                                    <Link href="/products?categories=workstation-desktops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Workstation Desktops
                                    </Link>
                                    <Link href="/products?categories=graphics-cards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Graphics Cards
                                    </Link>
                                    <Link href="/products?categories=pc-ram" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        PC RAM
                                    </Link>

                                    {/* Storage */}
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        Storage
                                    </div>
                                    <Link href="/products?categories=ssd-storage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        SSD Storage
                                    </Link>
                                    <Link href="/products?categories=mechanical-hard-drives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Mechanical Hard Drives
                                    </Link>

                                    {/* Monitors */}
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        Monitors
                                    </div>
                                    <Link href="/products?categories=gaming-monitors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Gaming Monitors
                                    </Link>
                                    <Link href="/products?categories=professional-monitors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Professional Monitors
                                    </Link>
                                    <Link href="/products?categories=standard-monitors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Standard Monitors
                                    </Link>

                                    {/* Accessories */}
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        Accessories
                                    </div>
                                    <Link href="/products?categories=gaming-mice" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Gaming Mice
                                    </Link>
                                    <Link href="/products?categories=office-mice" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Office Mice
                                    </Link>
                                    <Link href="/products?categories=mechanical-keyboards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Mechanical Keyboards
                                    </Link>
                                    <Link href="/products?categories=membrane-keyboards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Membrane Keyboards
                                    </Link>
                                </div>
                            </div>

                            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                                About
                            </Link>
                        </nav>

                        {/* Contact Number - Right */}
                        <div className="flex items-center space-x-2">
                            <PhoneIcon className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">
                                (123) 456-7890
                            </span>
                        </div>
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