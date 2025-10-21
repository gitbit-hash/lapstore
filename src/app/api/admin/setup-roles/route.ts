
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// DEVELOPMENT ONLY - Remove in production
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    const { email, role } = await request.json()

    const user = await prisma.user.update({
      where: { email },
      data: { role }
    })

    return NextResponse.json({
      message: `User ${email} updated to ${role}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error setting user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}