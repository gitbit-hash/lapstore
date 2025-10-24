import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Categories with new structure
    const categories = await prisma.category.createMany({
        data: [
            // Laptops
            { name: 'Gaming Laptops', slug: 'gaming-laptops' },
            { name: 'Business Laptops', slug: 'business-laptops' },
            { name: 'Standard Laptops', slug: 'standard-laptops' },

            // PC & Components
            { name: 'Gaming Desktops', slug: 'gaming-desktops' },
            { name: 'Workstation Desktops', slug: 'workstation-desktops' },
            { name: 'Graphics Cards', slug: 'graphics-cards' },
            { name: 'PC RAM', slug: 'pc-ram' },

            // Storage
            { name: 'SSD Storage', slug: 'ssd-storage' },
            { name: 'Mechanical Hard Drives', slug: 'mechanical-hard-drives' },

            // Monitors
            { name: 'Gaming Monitors', slug: 'gaming-monitors' },
            { name: 'Professional Monitors', slug: 'professional-monitors' },
            { name: 'Standard Monitors', slug: 'standard-monitors' },

            // Accessories
            { name: 'Gaming Mice', slug: 'gaming-mice' },
            { name: 'Office Mice', slug: 'office-mice' },
            { name: 'Mechanical Keyboards', slug: 'mechanical-keyboards' },
            { name: 'Membrane Keyboards', slug: 'membrane-keyboards' },
        ],
        skipDuplicates: true,
    });

    // Get category IDs for product creation
    const gamingLaptops = await prisma.category.findFirst({ where: { slug: 'gaming-laptops' } });
    const businessLaptops = await prisma.category.findFirst({ where: { slug: 'business-laptops' } });
    const gamingDesktops = await prisma.category.findFirst({ where: { slug: 'gaming-desktops' } });
    const workstationDesktops = await prisma.category.findFirst({ where: { slug: 'workstation-desktops' } });
    const graphicsCards = await prisma.category.findFirst({ where: { slug: 'graphics-cards' } });
    const pcRam = await prisma.category.findFirst({ where: { slug: 'pc-ram' } });
    const ssdStorage = await prisma.category.findFirst({ where: { slug: 'ssd-storage' } });
    const mechanicalHD = await prisma.category.findFirst({ where: { slug: 'mechanical-hard-drives' } });
    const gamingMonitors = await prisma.category.findFirst({ where: { slug: 'gaming-monitors' } });
    const professionalMonitors = await prisma.category.findFirst({ where: { slug: 'professional-monitors' } });
    const gamingMice = await prisma.category.findFirst({ where: { slug: 'gaming-mice' } });
    const mechanicalKeyboards = await prisma.category.findFirst({ where: { slug: 'mechanical-keyboards' } });

    // Create Products for all categories
    const createdProducts = await prisma.product.createMany({
        data: [
            // Gaming Laptops
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

            // Business Laptops
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

            // Gaming Desktops
            {
                name: 'Alienware Aurora R15',
                description: 'High-performance gaming desktop with RTX 4080',
                price: 2899.99,
                images: [
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=300&fit=crop'
                ],
                categoryId: gamingDesktops!.id,
                inventory: 8,
                specifications: {
                    processor: 'Intel Core i9-13900KF',
                    graphics: 'NVIDIA GeForce RTX 4080',
                    memory: '32GB DDR5',
                    storage: '2TB NVMe SSD',
                    powerSupply: '1000W',
                    cooling: 'Liquid Cooling'
                }
            },

            // Graphics Cards
            {
                name: 'NVIDIA GeForce RTX 4090',
                description: 'Flagship graphics card for extreme gaming performance',
                price: 1599.99,
                images: [
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'
                ],
                categoryId: graphicsCards!.id,
                inventory: 5,
                specifications: {
                    memory: '24GB GDDR6X',
                    coreClock: '2235 MHz',
                    memoryInterface: '384-bit',
                    powerConnectors: '3x 8-pin',
                    recommendedPSU: '850W'
                }
            },

            // PC RAM
            {
                name: 'Corsair Vengeance RGB 32GB DDR5',
                description: 'High-performance DDR5 memory with RGB lighting',
                price: 149.99,
                images: [
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=300&fit=crop'
                ],
                categoryId: pcRam!.id,
                inventory: 30,
                specifications: {
                    capacity: '32GB (2x16GB)',
                    speed: '5600MHz',
                    type: 'DDR5',
                    latency: 'CL36',
                    voltage: '1.25V'
                }
            },

            // SSD Storage
            {
                name: 'Samsung 980 Pro 2TB NVMe SSD',
                description: 'High-speed PCIe 4.0 NVMe SSD for gaming and productivity',
                price: 199.99,
                images: [
                    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'
                ],
                categoryId: ssdStorage!.id,
                inventory: 40,
                specifications: {
                    capacity: '2TB',
                    interface: 'PCIe 4.0 NVMe',
                    readSpeed: '7000 MB/s',
                    writeSpeed: '5000 MB/s',
                    endurance: '1200 TBW'
                }
            },

            // Gaming Monitors
            {
                name: 'Alienware AW3423DW',
                description: '34-inch QD-OLED gaming monitor with 175Hz refresh rate',
                price: 1299.99,
                images: [
                    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1551645120-d5b3af3c6e49?w=500&h=300&fit=crop'
                ],
                categoryId: gamingMonitors!.id,
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

            // Gaming Mice
            {
                name: 'Razer DeathAdder V3 Pro',
                description: 'Wireless gaming mouse with 30K DPI optical sensor',
                price: 149.99,
                images: [
                    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500&h=300&fit=crop'
                ],
                categoryId: gamingMice!.id,
                inventory: 25,
                specifications: {
                    sensor: 'Focus Pro 30K Optical',
                    dpi: '30000',
                    buttons: '8 Programmable',
                    weight: '63g',
                    connectivity: '2.4GHz Wireless, Bluetooth'
                }
            },

            // Mechanical Keyboards
            {
                name: 'Logitech MX Mechanical',
                description: 'Wireless mechanical keyboard with smart illumination',
                price: 169.99,
                images: [
                    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=300&fit=crop'
                ],
                categoryId: mechanicalKeyboards!.id,
                inventory: 30,
                specifications: {
                    type: 'Mechanical',
                    connectivity: 'Bluetooth, 2.4GHz Wireless',
                    backlight: 'RGB Smart Illumination',
                    battery: 'Up to 15 days',
                    layout: 'US QWERTY'
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

    console.log('✅ Database seeded successfully');
    console.log(`📦 Created products across all categories`);
    console.log(`👥 Created admin user`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });