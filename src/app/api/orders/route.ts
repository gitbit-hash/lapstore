// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        console.log('🛒 Starting order creation...')
        const session = await getServerSession(authOptions)

        if (!session) {
            console.log('❌ No session found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('👤 User session:', session.user.id)

        const { items, shippingInfo, paymentMethod, total } = await request.json()
        console.log('📦 Order items:', items)
        console.log('🏠 Shipping info:', shippingInfo)

        if (!items || items.length === 0) {
            console.log('❌ No items in cart')
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
        }

        // Validate inventory and calculate total
        let calculatedTotal = 0
        const orderItemsData = []

        console.log('🔍 Validating inventory...')
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id }
            })

            console.log(`📋 Product ${item.id}:`, product)

            if (!product) {
                console.log(`❌ Product ${item.id} not found`)
                return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 })
            }

            if (product.inventory < item.quantity) {
                console.log(`❌ Not enough inventory for ${product.name}. Requested: ${item.quantity}, Available: ${product.inventory}`)
                return NextResponse.json(
                    { error: `Not enough inventory for ${product.name}. Only ${product.inventory} available` },
                    { status: 400 }
                )
            }

            calculatedTotal += product.price * item.quantity
            console.log(`💰 Running total: ${calculatedTotal}`)

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
            console.log(`📦 Updated inventory for ${product.name}: ${product.inventory - item.quantity} remaining`)
        }

        // Add shipping cost
        const shippingCost = calculatedTotal > 1000 ? 0 : 49.99
        calculatedTotal += shippingCost

        // Add tax (8%)
        const taxAmount = calculatedTotal * 0.08
        calculatedTotal += taxAmount

        console.log('🧾 Final calculated total:', calculatedTotal)
        console.log('🚚 Shipping cost:', shippingCost)
        console.log('🏛️ Tax amount:', taxAmount)

        // Create order
        console.log('💾 Creating order in database...')
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

        console.log('✅ Order created successfully:', order.id)
        return NextResponse.json(order)

    } catch (error) {
        console.error('❌ Order creation error:', error)
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