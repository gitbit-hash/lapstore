// src/app/components/Header.tsx
'use client'

import {
    ShoppingCartIcon,
    UserCircleIcon,
    PhoneIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ShoppingBagIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCartStore } from '../stores/cartStore'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { UserRole } from '../types'
import SearchBar from './SearchBar'
import { usePathname } from 'next/navigation'

export default function Header() {
    const { toggleCart, getTotalItems } = useCartStore()
    const { data: session, status } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const pathname = usePathname()

    const isAdmin = session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.SUPER_ADMIN
    const isCustomer = !isAdmin
    const isAdminPage = pathname?.startsWith('/admin')

    // Close mobile menu when route changes
    useEffect(() => {
        setShowMobileMenu(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [showMobileMenu])

    const handleMobileMenuToggle = () => {
        if (showMobileMenu) {
            // Start closing animation
            setIsAnimating(true)
            setTimeout(() => {
                setShowMobileMenu(false)
                setIsAnimating(false)
            }, 300) // Match this with CSS transition duration
        } else {
            setShowMobileMenu(true)
        }
    }

    const handleMobileMenuClose = () => {
        setIsAnimating(true)
        setTimeout(() => {
            setShowMobileMenu(false)
            setIsAnimating(false)
        }, 300)
    }

    // Main menu items
    const mainMenuItems = [
        { href: '/', icon: HomeIcon, label: 'Home' },
        { href: '/products', icon: ShoppingBagIcon, label: 'Products' },
        { href: '/about', icon: UserIcon, label: 'About' },
    ]

    // Main categories for mobile menu
    const mainCategories = [
        { name: 'Gaming Laptops', href: '/products?categories=gaming-laptops' },
        { name: 'Business Laptops', href: '/products?categories=business-laptops' },
        { name: 'Standard Laptops', href: '/products?categories=standard-laptops' },
        { name: 'Gaming Desktops', href: '/products?categories=gaming-desktops' },
        { name: 'Workstation Desktops', href: '/products?categories=workstation-desktops' },
        { name: 'Graphics Cards', href: '/products?categories=graphics-cards' },
        { name: 'PC RAM', href: '/products?categories=pc-ram' },
        { name: 'SSD Storage', href: '/products?categories=ssd-storage' },
        { name: 'Gaming Monitors', href: '/products?categories=gaming-monitors' },
        { name: 'Gaming Mice', href: '/products?categories=gaming-mice' },
        { name: 'Mechanical Keyboards', href: '/products?categories=mechanical-keyboards' },
    ]

    // Don't show regular header on admin pages
    if (isAdminPage) {
        return (
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/admin">
                            <h1 className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                TechHaven Admin
                            </h1>
                        </Link>

                        {/* User Menu - Simplified for admin */}
                        {session && (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    Welcome, {session.user?.name || session.user?.email}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            {/* First Row: Mobile - Hamburger, Search, Cart */}
            <div className="lg:hidden border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Hamburger Button - Left */}
                        <button
                            onClick={handleMobileMenuToggle}
                            className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {showMobileMenu ? (
                                <XMarkIcon className="h-6 w-6 transition-transform duration-300" />
                            ) : (
                                <Bars3Icon className="h-6 w-6 transition-transform duration-300" />
                            )}
                        </button>

                        {/* Search Bar - Middle */}
                        <div className="flex-1 mx-4">
                            <SearchBar />
                        </div>

                        {/* Cart Icon - Right */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            <ShoppingCartIcon className="h-6 w-6" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-colors duration-200">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Second Row: Mobile - Logo Only */}
            <div className="lg:hidden border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-center">
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                TechHaven
                            </h1>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - Left */}
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
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
                                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
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
                                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-105"
                                            />
                                        ) : (
                                            <UserCircleIcon className="w-8 h-8 text-gray-400 transition-colors duration-200" />
                                        )}
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-in fade-in-80 slide-in-from-top-5 duration-200">
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

                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Your Profile
                                            </Link>

                                            {isCustomer && (
                                                <Link
                                                    href="/orders"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Your Orders
                                                </Link>
                                            )}

                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100 transition-colors duration-150"
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
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100 transition-colors duration-150"
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
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation Bar */}
            <div className="hidden lg:block bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-12">
                        {/* Navigation Links - Left */}
                        <nav className="flex items-center space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
                                Home
                            </Link>
                            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
                                Products
                            </Link>

                            {/* Products Categories Dropdown */}
                            <div className="relative group">
                                <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm flex items-center">
                                    Products Categories ↓
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform group-hover:translate-y-0 translate-y-1">
                                    {/* Categories dropdown content remains the same but with transitions */}
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        Laptops
                                    </div>
                                    <Link href="/products?categories=gaming-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                                        Gaming Laptops
                                    </Link>
                                    <Link href="/products?categories=business-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                                        Business Laptops
                                    </Link>
                                    <Link href="/products?categories=standard-laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                                        Standard Laptops
                                    </Link>

                                    {/* Add transitions to all dropdown items */}
                                    {/* ... rest of categories with transition-colors duration-150 ... */}
                                </div>
                            </div>

                            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm">
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

            {/* Mobile Menu Overlay */}
            {(showMobileMenu || isAnimating) && (
                <>
                    {/* Backdrop with fade-in animation */}
                    <div
                        className={`fixed inset-0 bg-black z-40 lg:hidden transition-opacity duration-300 ${showMobileMenu && !isAnimating ? 'opacity-50' : 'opacity-0'
                            }`}
                        onClick={handleMobileMenuClose}
                    />

                    {/* Mobile Menu Panel with slide-in animation */}
                    <div className={`
                        fixed top-0 left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto
                        transform transition-transform duration-300 ease-in-out
                        ${showMobileMenu && !isAnimating ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="container mx-auto px-4 py-6">
                            {/* Close Button */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 transition-colors duration-200">
                                    Menu
                                </h2>
                                <button
                                    onClick={handleMobileMenuClose}
                                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-100 rounded-lg"
                                >
                                    <XMarkIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
                                </button>
                            </div>

                            {/* Two Column Layout with staggered animation */}
                            <div className="grid grid-cols-2 gap-8">
                                {/* Column 1: Main Menu */}
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 transition-colors duration-200">
                                        Main Menu
                                    </h3>
                                    <nav className="space-y-2">
                                        {mainMenuItems.map((item, index) => {
                                            const Icon = item.icon
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="flex items-center space-x-3 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                                                    onClick={handleMobileMenuClose}
                                                    style={{
                                                        animationDelay: `${index * 50}ms`,
                                                        animation: showMobileMenu && !isAnimating ?
                                                            'slideInLeft 0.3s ease-out forwards' : 'none'
                                                    }}
                                                >
                                                    <Icon className="h-5 w-5 transition-colors duration-200" />
                                                    <span className="font-medium transition-colors duration-200">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            )
                                        })}

                                        {/* Products Categories in main menu too */}
                                        <div className="pt-2 border-t border-gray-100">
                                            <Link
                                                href="/products"
                                                className="flex items-center space-x-3 py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                                                onClick={handleMobileMenuClose}
                                            >
                                                <ShoppingBagIcon className="h-5 w-5 transition-colors duration-200" />
                                                <span className="font-medium transition-colors duration-200">
                                                    All Categories
                                                </span>
                                            </Link>
                                        </div>
                                    </nav>
                                </div>

                                {/* Column 2: Main Categories */}
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 transition-colors duration-200">
                                        Main Categories
                                    </h3>
                                    <nav className="space-y-2">
                                        {mainCategories.map((category, index) => (
                                            <Link
                                                key={category.href}
                                                href={category.href}
                                                className="block py-3 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                                                onClick={handleMobileMenuClose}
                                                style={{
                                                    animationDelay: `${index * 30 + 200}ms`,
                                                    animation: showMobileMenu && !isAnimating ?
                                                        'slideInRight 0.3s ease-out forwards' : 'none'
                                                }}
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* User Section at Bottom with fade-in */}
                            <div
                                className="mt-8 pt-6 border-t border-gray-200"
                                style={{
                                    animationDelay: '400ms',
                                    animation: showMobileMenu && !isAnimating ?
                                        'fadeInUp 0.4s ease-out forwards' : 'none'
                                }}
                            >
                                {status === 'loading' ? (
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                                    </div>
                                ) : session ? (
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <p className="font-medium text-gray-900 transition-colors duration-200">
                                                {session.user?.name || 'Welcome back'}
                                            </p>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                        <div className="flex justify-center space-x-4">
                                            <Link
                                                href="/profile"
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                                                onClick={handleMobileMenuClose}
                                            >
                                                Profile
                                            </Link>
                                            {isCustomer && (
                                                <Link
                                                    href="/orders"
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                                                    onClick={handleMobileMenuClose}
                                                >
                                                    Orders
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    signOut()
                                                    handleMobileMenuClose()
                                                }}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center space-x-4">
                                        <Link
                                            href="/auth/signin"
                                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                            onClick={handleMobileMenuClose}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                                            onClick={handleMobileMenuClose}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Contact Info with fade-in */}
                            <div
                                className="mt-6 pt-6 border-t border-gray-200 text-center"
                                style={{
                                    animationDelay: '500ms',
                                    animation: showMobileMenu && !isAnimating ?
                                        'fadeInUp 0.4s ease-out forwards' : 'none'
                                }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <PhoneIcon className="h-4 w-4 text-green-600 transition-colors duration-200" />
                                    <span className="text-sm font-medium text-gray-700 transition-colors duration-200">
                                        (123) 456-7890
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Close user menu when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </header>
    )
}