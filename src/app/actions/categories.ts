// src/app/actions/categories.ts
'use server'

import { prisma } from '@/app/lib/prisma'
import { Category } from '../types'

export async function getCategories(): Promise<Category[]> {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        })
        return categories
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}