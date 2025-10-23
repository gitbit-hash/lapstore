// src/app/api/auth/register/route.ts - Strict phone validation
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, phone } = await request.json()

        // Validate required fields - phone is now required
        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields: name, email, password, and phone are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Strict phone validation - numbers only, 10-15 digits
        const phoneRegex = /^[0-9]{10,15}$/
        const cleanPhone = phone.replace(/\D/g, '') // Remove all non-digit characters

        if (!phoneRegex.test(cleanPhone)) {
            return NextResponse.json(
                { error: 'Phone number must contain 10-15 digits only' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Check if phone number already exists
        const existingPhoneUser = await prisma.user.findFirst({
            where: { phone: cleanPhone }
        })

        if (existingPhoneUser) {
            return NextResponse.json(
                { error: 'User with this phone number already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user with cleaned phone number
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: cleanPhone, // Store cleaned phone number
                password: hashedPassword,
            }
        })

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            message: 'User created successfully'
        }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}