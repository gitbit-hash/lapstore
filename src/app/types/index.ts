// app/types/index.ts
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