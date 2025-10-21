import { withAuth } from 'next-auth/middleware'
import { UserRole } from './app/types'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes - require at least ADMIN role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === UserRole.ADMIN || token?.role === UserRole.SUPER_ADMIN
        }

        // Protect super admin only routes
        if (req.nextUrl.pathname.startsWith('/admin/analytics')) {
          return token?.role === UserRole.SUPER_ADMIN
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/profile']
}