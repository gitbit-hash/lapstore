// src/app/types/index.ts
import { DefaultSession } from 'next-auth'
import { User, Prisma } from '@prisma/client'

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
    specifications?: Prisma.JsonValue | null
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
    addresses: Address[] // We can define Address type later if needed
    orders: Order[]
}

export interface AdminUser {
    id: string
    name: string | null
    email: string
    role: UserRole
    phone: string
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

// Add to src/app/types/index.ts
export interface UserDetail {
    id: string
    name: string | null
    email: string
    phone: string | null
    role: UserRole
    emailVerified: Date | null
    image: string | null
    createdAt: Date
    updatedAt: Date
    addresses: Address[]
    orders: Order[]
    reviews: Review[]
    wishlist: WishlistItem[]
    statistics: {
        totalSpent: number
        totalOrders: number
        averageOrderValue: number
        totalReviews: number
        totalWishlistItems: number
    }
    _count?: {
        orders: number
        reviews: number
        wishlist: number
    }
}

export interface WishlistItem {
    id: string
    userId: string
    productId: string
    createdAt: Date
    product: {
        id: string
        name: string
        images: string[]
        price: number
        inventory: number
    }
}

export interface UserReview {
    id: string
    rating: number
    comment: string | null
    createdAt: Date
    updatedAt: Date
    product: {
        id: string
        name: string
        images: string[]
    }
}

export interface UserAddress {
    id: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
    name?: string
    createdAt: Date
    updatedAt: Date
}

export interface Address {
    id: string
    userId: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
}

export type ProfileUser = User & {
    addresses: Address[]
    orders?: (Order & {
        orderItems: (OrderItem & {
            product: {
                id: string
                name: string
                images: string[]
                price: number
                category: {
                    name: string
                }
            }
        })[]
    })[]
    _count: {
        orders: number
        reviews: number
        wishlist: number
    }
}