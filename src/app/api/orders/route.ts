// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { items, shippingInfo, paymentMethod, total } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
        }

        // Validate inventory and calculate total
        let calculatedTotal = 0
        const orderItemsData = []

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id }
            })

            if (!product) {
                return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 })
            }

            if (product.inventory < item.quantity) {
                return NextResponse.json(
                    { error: `Not enough inventory for ${product.name}. Only ${product.inventory} available` },
                    { status: 400 }
                )
            }

            calculatedTotal += product.price * item.quantity

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            })

            // Update product inventory
            await prisma.product.update({
                where: { id: product.id },
                data: { inventory: product.inventory - item.quantity }
            })
        }

        // Add shipping cost
        const shippingCost = calculatedTotal > 1000 ? 0 : 49.99
        calculatedTotal += shippingCost

        // Add tax (8%)
        const taxAmount = calculatedTotal * 0.08
        calculatedTotal += taxAmount

        // Create order
        const order = await prisma.order.create({
            data: {
                customerId: session.user.id,
                total: calculatedTotal,
                status: 'PENDING',
                paymentMethod: paymentMethod,
                shippingAddress: shippingInfo,
                orderItems: {
                    create: orderItemsData
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// GET all orders for the current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: {
                customerId: session.user.id
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error('Orders fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}