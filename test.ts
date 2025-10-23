// create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSuperAdmin() {
  try {
    console.log('Creating Super Admin user...')

    const superAdmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@lapstore.com',
        phone: '1234567890',
        password: await bcrypt.hash('admin123', 12),
        role: 'SUPER_ADMIN',
        emailVerified: new Date(),
      },
    })

    console.log('✅ Super Admin created successfully!')
    console.log('Email: admin@lapstore.com')
    console.log('Password: admin123')
    console.log('Role: SUPER_ADMIN')

  } catch (error) {
    console.error('Error creating Super Admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperAdmin()