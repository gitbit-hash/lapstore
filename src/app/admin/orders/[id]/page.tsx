import { getServerSession } from 'next-auth'
import { authOptions } from './../../../lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from './../../../lib/prisma'
import { UserRole } from './../../../types'
import Link from 'next/link'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN)) {
    redirect('/')
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true
            }
          }
        }
      }
    }
  })

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link
          href="/admin/orders"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-2">
            Order #{order.id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>

    </div>
  )
}