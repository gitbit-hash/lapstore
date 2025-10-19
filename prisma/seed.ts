// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

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
    const keyboards = await prisma.category.findFirst({ where: { slug: 'keyboards' } });
    const mice = await prisma.category.findFirst({ where: { slug: 'mice' } });

    // Create Products
    const createdProducts = await prisma.product.createMany({
        data: [
            {
                name: 'ASUS ROG Zephyrus G14',
                description: 'Powerful 14-inch gaming laptop with AMD Ryzen 9 and RTX 4060',
                price: 1499.99,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
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
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
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
                images: [
                    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1551645120-d5b3af3c6e49?w=500&h=300&fit=crop'
                ],
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
                images: [
                    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
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
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
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
            },
            {
                name: 'Logitech MX Mechanical',
                description: 'Wireless mechanical keyboard with smart illumination',
                price: 169.99,
                images: [
                    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=300&fit=crop'
                ],
                categoryId: keyboards!.id,
                inventory: 30,
                specifications: {
                    type: 'Mechanical',
                    connectivity: 'Bluetooth, 2.4GHz Wireless',
                    backlight: 'RGB Smart Illumination',
                    battery: 'Up to 15 days',
                    layout: 'US QWERTY'
                }
            },
            {
                name: 'Razer DeathAdder V3',
                description: 'Lightweight gaming mouse with 30K DPI optical sensor',
                price: 69.99,
                images: [
                    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500&h=300&fit=crop'
                ],
                categoryId: mice!.id,
                inventory: 40,
                specifications: {
                    sensor: 'Focus Pro 30K Optical',
                    dpi: '30000',
                    buttons: '8 Programmable',
                    weight: '59g',
                    connectivity: 'USB-C'
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
        },
    });

    // Get all products and users for creating reviews
    const allProducts = await prisma.product.findMany();
    const allUsers = await prisma.user.findMany();

    // Create sample reviews if we have products and users
    if (allProducts.length > 0 && allUsers.length > 0) {
        await prisma.review.createMany({
            data: [
                {
                    productId: allProducts[0].id,
                    userId: allUsers[0].id,
                    rating: 5,
                    comment: 'Amazing gaming laptop! Runs all my games on ultra settings.'
                },
                {
                    productId: allProducts[0].id,
                    userId: allUsers[0].id,
                    rating: 4,
                    comment: 'Great performance, but battery life could be better.'
                },
                {
                    productId: allProducts[1].id,
                    userId: allUsers[0].id,
                    rating: 5,
                    comment: 'Perfect for business trips. Lightweight and powerful.'
                },
                {
                    productId: allProducts[2].id,
                    userId: allUsers[0].id,
                    rating: 5,
                    comment: 'The OLED display is absolutely stunning! Best monitor I have ever owned.'
                },
                {
                    productId: allProducts[3].id,
                    userId: allUsers[0].id,
                    rating: 4,
                    comment: 'Solid gaming performance, but runs a bit hot under heavy load.'
                }
            ],
            skipDuplicates: true,
        });
    }

    console.log('✅ Database seeded successfully');
    console.log(`📦 Created ${allProducts.length} products`);
    console.log(`👥 Created ${allUsers.length} users`);
    console.log(`⭐ Created sample reviews`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });