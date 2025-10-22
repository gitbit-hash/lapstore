// src/app/types/index.ts - Update with more specific types
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            role: string
        } & DefaultSession['user']
    }

    interface User {
        role: UserRole
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: UserRole
        id: string
    }
}

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface Product {
    id: string
    name: string
    description: string | null
    price: number
    images: string[]
    category: {
        id: string
        name: string
        slug: string
    }
    averageRating: number
    reviewCount: number
    inventory: number
    specifications?: any
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface ProductDetail extends Product {
    reviews: Review[]
}

export interface Review {
    id: string
    productId: string
    userId: string
    rating: number
    comment: string | null
    createdAt: Date
    updatedAt: Date
    user: {
        name: string | null
        image: string | null
    }
}

interface ProductWithReviews extends Product {
    reviews: Array<{
        rating: number
        // other review fields you're selecting
    }>
}

export interface Category {
    id: string
    name: string
    slug: string
}

export interface ProductFilters {
    category?: string
    search?: string
    sort?: string
    page?: number
    minPrice?: number
    maxPrice?: number
    categories?: string
}

// Simple product type for cart and listings
export interface CartProduct {
    id: string
    name: string
    price: number
    images: string[]
    inventory: number
}

export interface OrderItem {
    id: string
    quantity: number
    price: number
    product: {
        name: string
        images: string[]
    }
}

export interface Order {
    id: string
    total: number
    status: string
    paymentMethod?: string
    createdAt: Date
    updatedAt: Date
    orderItems: OrderItem[]
}

export interface UserWithOrders {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
    updatedAt: Date
    addresses: any[] // We can define Address type later if needed
    orders: Order[]
}

export interface AdminUser {
    id: string
    name: string | null
    email: string
    role: UserRole
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
    _count: {
        orders: number
        reviews: number
    }
}

export interface UserStatsType {
    total: number
    customers: number
    admins: number
    verified: number
}