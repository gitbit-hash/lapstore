// src/app/admin/users/page.tsx - Updated with proper types
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { UserRole, AdminUser, UserStatsType } from '@/app/types'
import UserRow from '@/app/components/UserRow'
import UserStats from '@/app/components/UserStats'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  // Only SUPER_ADMIN can access user management
  if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
    redirect('/admin')
  }

  // Get users with proper typing
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  }) as AdminUser[]

  // Get user statistics
  const userStats: UserStatsType = {
    total: await prisma.user.count(),
    customers: await prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
    admins: await prisma.user.count({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] }
      }
    }),
    verified: await prisma.user.count({ where: { emailVerified: { not: null } } }),
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and roles</p>
        </div>
      </div>

      {/* User Statistics */}
      <UserStats stats={userStats} />

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              All Users ({users.length})
            </h2>
            <div className="text-sm text-gray-600">
              Showing last 50 users
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-500">User accounts will appear here when they register.</p>
          </div>
        )}
      </div>
    </div>
  )
}