// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Categories
    const categories = await prisma.category.createMany({
        data: [
            { name: 'Gaming Laptops', slug: 'gaming-laptops' },
            { name: 'Business Laptops', slug: 'business-laptops' },
            { name: 'Gaming Desktops', slug: 'gaming-desktops' },
            { name: 'Workstation Desktops', slug: 'workstation-desktops' },
            { name: 'Monitors', slug: 'monitors' },
            { name: 'Keyboards', slug: 'keyboards' },
            { name: 'Mice', slug: 'mice' },
            { name: 'Components', slug: 'components' },
        ],
        skipDuplicates: true,
    });

    // Get category IDs for product creation
    const gamingLaptops = await prisma.category.findFirst({ where: { slug: 'gaming-laptops' } });
    const businessLaptops = await prisma.category.findFirst({ where: { slug: 'business-laptops' } });
    const monitors = await prisma.category.findFirst({ where: { slug: 'monitors' } });

    // Create Products
    const products = await prisma.product.createMany({
        data: [
            {
                name: 'ASUS ROG Zephyrus G14',
                description: 'Powerful 14-inch gaming laptop with AMD Ryzen 9 and RTX 4060',
                price: 1499.99,
                images: ['/images/laptop1-1.jpg', '/images/laptop1-2.jpg'],
                categoryId: gamingLaptops!.id,
                inventory: 15,
                specifications: {
                    processor: 'AMD Ryzen 9 7940HS',
                    graphics: 'NVIDIA GeForce RTX 4060',
                    memory: '16GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch QHD+ 165Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Dell XPS 13',
                description: 'Premium business laptop with stunning InfinityEdge display',
                price: 1199.99,
                images: ['/images/laptop2-1.jpg', '/images/laptop2-2.jpg'],
                categoryId: businessLaptops!.id,
                inventory: 25,
                specifications: {
                    processor: 'Intel Core i7-1355U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '512GB NVMe SSD',
                    display: '13.4-inch FHD+',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'Alienware AW3423DW',
                description: '34-inch QD-OLED gaming monitor with 175Hz refresh rate',
                price: 1299.99,
                images: ['/images/monitor1-1.jpg', '/images/monitor1-2.jpg'],
                categoryId: monitors!.id,
                inventory: 8,
                specifications: {
                    size: '34-inch',
                    resolution: '3440x1440',
                    panel: 'QD-OLED',
                    refreshRate: '175Hz',
                    responseTime: '0.1ms',
                    ports: 'HDMI 2.1, DisplayPort 1.4'
                }
            },
            {
                name: 'Lenovo Legion 5 Pro',
                description: '16-inch gaming laptop with Ryzen 7 and RTX 4070',
                price: 1699.99,
                images: ['/images/laptop3-1.jpg', '/images/laptop3-2.jpg'],
                categoryId: gamingLaptops!.id,
                inventory: 12,
                specifications: {
                    processor: 'AMD Ryzen 7 7745HX',
                    graphics: 'NVIDIA GeForce RTX 4070',
                    memory: '32GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '16-inch WQXGA 165Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Apple MacBook Pro 16"',
                description: 'Professional laptop with M3 Pro chip for extreme performance',
                price: 2499.99,
                images: ['/images/laptop4-1.jpg', '/images/laptop4-2.jpg'],
                categoryId: businessLaptops!.id,
                inventory: 10,
                specifications: {
                    processor: 'Apple M3 Pro',
                    graphics: '18-core GPU',
                    memory: '36GB Unified Memory',
                    storage: '1TB SSD',
                    display: '16.2-inch Liquid Retina XDR',
                    os: 'macOS Sonoma'
                }
            }
        ],
        skipDuplicates: true,
    });

    // Create an admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@computershop.com' },
        update: {},
        create: {
            email: 'admin@computershop.com',
            name: 'Admin User',
            role: 'ADMIN',
            // Note: For production, use proper password hashing in your auth flow
        },
    });

    console.log('✅ Database seeded successfully');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });