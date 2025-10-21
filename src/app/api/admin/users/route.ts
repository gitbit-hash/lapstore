import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { UserRole } from '../../../types'

// Only SUPER_ADMIN can manage users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, role } = await request.json()

    // Prevent demoting the last SUPER_ADMIN
    if (role !== UserRole.SUPER_ADMIN) {
      const superAdminCount = await prisma.user.count({
        where: { role: UserRole.SUPER_ADMIN }
      })

      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot demote the last super admin' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    return NextResponse.json({ message: 'User role updated', user })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}