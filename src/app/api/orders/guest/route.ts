// src/app/api/orders/guest/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🛒 Starting guest order creation...')
    const { items, shippingInfo, paymentMethod, total } = await request.json()

    console.log('📦 Guest order items:', items)
    console.log('🏠 Guest shipping info:', shippingInfo)

    if (!items || items.length === 0) {
      console.log('❌ No items in guest cart')
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Validate required guest information
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.phone) {
      console.log('❌ Missing required guest information')
      return NextResponse.json({ error: 'Missing required information' }, { status: 400 })
    }

    // Validate phone format
    const cleanPhone = shippingInfo.phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      console.log('❌ Invalid phone number')
      return NextResponse.json({ error: 'Phone number must be at least 10 digits' }, { status: 400 })
    }

    // Validate inventory and calculate total
    let calculatedTotal = 0
    const orderItemsData = []

    console.log('🔍 Validating inventory for guest order...')
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

    // Create a guest user for the order
    console.log('👤 Creating guest user...')
    const guestUser = await prisma.user.create({
      data: {
        email: `guest_${Date.now()}@temp.com`, // Unique temporary email
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        phone: cleanPhone,
        role: 'CUSTOMER',
      }
    })

    console.log('✅ Guest user created:', guestUser.id)

    // Create guest order with the actual user ID
    console.log('💾 Creating guest order in database...')
    const order = await prisma.order.create({
      data: {
        customerId: guestUser.id, // Use the actual guest user ID
        total: calculatedTotal,
        status: 'PENDING',
        paymentMethod: paymentMethod,
        shippingAddress: {
          ...shippingInfo,
          phone: cleanPhone,
        },
        orderItems: {
          create: orderItemsData
        },
        // Add guest information to the order
        guestInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: cleanPhone,
          isGuest: true // Mark as guest order
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

    console.log('✅ Guest order created successfully:', order.id)
    return NextResponse.json(order)

  } catch (error) {
    console.error('❌ Guest order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
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
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching guest order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}