// src/app/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '../types'

// Define a type for user with password
type UserWithPassword = {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    role: string
    password: string | null
    createdAt: Date
    updatedAt: Date
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // GoogleProvider({
        //   clientId: process.env.GOOGLE_CLIENT_ID!,
        //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log('Missing credentials')
                        return null
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email.toLowerCase()
                        }
                    }) as UserWithPassword | null

                    if (!user) {
                        console.log('No user found with email:', credentials.email)
                        return null
                    }

                    if (!user.password) {
                        console.log('User has no password set (OAuth user)')
                        return null
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        console.log('Invalid password')
                        return null
                    }

                    console.log('User authenticated successfully:', user.email)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role as UserRole
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin',
        // signUp is not a valid NextAuth pages option, so we remove it
    },
    debug: process.env.NODE_ENV === 'development',
}