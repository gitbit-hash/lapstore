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
import Image from 'next/image'
import { useCartStore } from '../stores/cartStore'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { UserRole, Category } from '../types'
import SearchBar from './SearchBar'
import { usePathname } from 'next/navigation'

export default function Header() {
    const { getTotalItems } = useCartStore()
    const { data: session, status } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
    const pathname = usePathname()

    const isAdmin = session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.SUPER_ADMIN
    const isCustomer = !isAdmin
    const isAdminPage = pathname?.startsWith('/admin')

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                if (response.ok) {
                    const categoriesData = await response.json()
                    setCategories(categoriesData)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setIsLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [])

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

    // Group categories by type for desktop dropdown
    const groupedCategories = categories.reduce((acc, category) => {
        const type = getCategoryType(category.name)
        if (!acc[type]) {
            acc[type] = []
        }
        acc[type].push(category)
        return acc
    }, {} as Record<string, Category[]>)

    // Main menu items
    const mainMenuItems = [
        { href: '/', icon: HomeIcon, label: 'Home' },
        { href: '/products', icon: ShoppingBagIcon, label: 'Products' },
        { href: '/about', icon: UserIcon, label: 'About' },
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
                                LapStore Admin
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
                        {!isAdmin && (<Link
                            href="/cart"
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            <ShoppingCartIcon className="h-6 w-6" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-colors duration-200">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>)}
                        {/* User Menu */}
                        {status === 'loading' ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        ) : session && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200"
                                >
                                    {session.user?.image ? (
                                        <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                fill
                                                className="object-cover transition-transform duration-200 hover:scale-105"
                                            />
                                        </div>
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
                        )}

                    </div>
                </div>
            </div>

            {/* Second Row: Mobile - Logo Only */}
            <div className="lg:hidden border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-center">
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                LapStore
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
                                    LapStore
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
                            {!isAdmin && (<Link
                                href="/cart"
                                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>)}

                            {/* User Menu */}
                            {status === 'loading' ? (
                                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                            ) : session ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200"
                                    >
                                        {session.user?.image ? (
                                            <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                                <Image
                                                    src={session.user.image}
                                                    alt={session.user.name || 'User'}
                                                    fill
                                                    className="object-cover transition-transform duration-200 hover:scale-105"
                                                />
                                            </div>
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
                                        className="text-blue-600 py-2 hover:text-blue-400 transition-colors duration-200 transform hover:scale-105"
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
                            <div className="relative">
                                <button
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm flex items-center"
                                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                >
                                    Products Categories ↓
                                </button>
                                {isCategoriesOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                                        {isLoadingCategories ? (
                                            <div className="p-4">
                                                <div className="animate-pulse">
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            Object.entries(groupedCategories).map(([type, typeCategories]) => (
                                                <div key={type}>
                                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                                                        {type}
                                                    </div>
                                                    {typeCategories.map((category) => (
                                                        <Link
                                                            key={category.id}
                                                            href={`/products?categories=${category.slug}`}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                            onClick={() => setIsCategoriesOpen(false)}
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
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
                                        {isLoadingCategories ? (
                                            // Loading skeleton for categories
                                            Array.from({ length: 8 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="py-3 px-2 animate-pulse"
                                                    style={{
                                                        animationDelay: `${index * 30 + 200}ms`,
                                                    }}
                                                >
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </div>
                                            ))
                                        ) : (
                                            categories.map((category, index) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/products?categories=${category.slug}`}
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
                                            ))
                                        )}
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
                                                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 hover:cursor-pointer"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center space-x-4">
                                        <Link
                                            href="/auth/signin"
                                            className="text-blue-600 py-2 hover:text-blue-400 transition-colors duration-200 transform hover:scale-105"
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

            {/* Close dropdowns when clicking outside */}
            {(showUserMenu || isCategoriesOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowUserMenu(false)
                        setIsCategoriesOpen(false)
                    }}
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

// Helper function to group categories by type
function getCategoryType(categoryName: string): string {
    const laptopKeywords = ['laptop', 'notebook', 'macbook', 'ultrabook']
    const desktopKeywords = ['desktop', 'pc', 'workstation', 'computer']
    const componentKeywords = ['ram', 'graphics', 'card', 'processor', 'cpu', 'gpu', 'motherboard', 'component']
    const storageKeywords = ['ssd', 'hard drive', 'storage', 'nvme', 'hdd']
    const monitorKeywords = ['monitor', 'display', 'screen']
    const accessoryKeywords = ['mouse', 'keyboard', 'headset', 'camera', 'speaker', 'accessory']

    const name = categoryName.toLowerCase()

    if (laptopKeywords.some(keyword => name.includes(keyword))) return 'Laptops'
    if (desktopKeywords.some(keyword => name.includes(keyword))) return 'Desktops & PCs'
    if (componentKeywords.some(keyword => name.includes(keyword))) return 'Components'
    if (storageKeywords.some(keyword => name.includes(keyword))) return 'Storage'
    if (monitorKeywords.some(keyword => name.includes(keyword))) return 'Monitors'
    if (accessoryKeywords.some(keyword => name.includes(keyword))) return 'Accessories'

    return 'Other Categories'
}