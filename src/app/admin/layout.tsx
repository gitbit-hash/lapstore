// src/app/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import { redirect } from 'next/navigation'
import { UserRole } from '../types'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Allow both ADMIN and SUPER_ADMIN
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar userRole={session.user.role} />
      <div className="lg:ml-64">
        <AdminHeader userRole={session.user.role} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Updated sidebar with role-based navigation
function AdminSidebar({ userRole }: { userRole: UserRole }) {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:flex flex-col hidden">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
          {userRole.toLowerCase().replace('_', ' ')}
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink href="/admin">Dashboard</SidebarLink>
        <SidebarLink href="/admin/products">Products</SidebarLink>
        <SidebarLink href="/admin/orders">Orders</SidebarLink>

        {/* Only show for SUPER_ADMIN */}
        {userRole === UserRole.SUPER_ADMIN && (
          <>
            <SidebarLink href="/admin/analytics">Analytics</SidebarLink>
            <SidebarLink href="/admin/users">User Management</SidebarLink>
            <SidebarLink href="/admin/system">System Settings</SidebarLink>
          </>
        )}

        {/* Show for both ADMIN and SUPER_ADMIN */}
        <SidebarLink href="/admin/categories">Categories</SidebarLink>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <SidebarLink href="/">Back to Store</SidebarLink>
        </div>
      </nav>
    </div>
  )
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
    >
      {children}
    </a>
  )
}

function AdminHeader({ userRole }: { userRole: UserRole }) {
  return (
    <header className="bg-white border-b border-gray-200 lg:ml-64">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
          <p className="text-sm text-gray-600">
            Role: <span className="capitalize">{userRole.toLowerCase().replace('_', ' ')}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* User menu */}
        </div>
      </div>
    </header>
  )
}