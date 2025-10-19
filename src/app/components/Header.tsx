// app/components/Header.tsx
'use client'

import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-blue-600">TechHaven</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                            Home
                        </a>
                        <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                            All Products
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                            Categories
                        </a>
                    </nav>

                    {/* Cart & Actions */}
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-700 hover:text-blue-600">
                            <ShoppingCartIcon className="h-6 w-6" />
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}