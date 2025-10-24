// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;

    // Create Categories
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

    // Get category IDs
    const gamingLaptops = await prisma.category.findFirst({ where: { slug: 'gaming-laptops' } });
    const businessLaptops = await prisma.category.findFirst({ where: { slug: 'business-laptops' } });
    const standardLaptops = await prisma.category.findFirst({ where: { slug: 'standard-laptops' } });
    const gamingDesktops = await prisma.category.findFirst({ where: { slug: 'gaming-desktops' } });
    const workstationDesktops = await prisma.category.findFirst({ where: { slug: 'workstation-desktops' } });
    const graphicsCards = await prisma.category.findFirst({ where: { slug: 'graphics-cards' } });
    const pcRam = await prisma.category.findFirst({ where: { slug: 'pc-ram' } });
    const ssdStorage = await prisma.category.findFirst({ where: { slug: 'ssd-storage' } });
    const mechanicalHD = await prisma.category.findFirst({ where: { slug: 'mechanical-hard-drives' } });
    const gamingMonitors = await prisma.category.findFirst({ where: { slug: 'gaming-monitors' } });
    const professionalMonitors = await prisma.category.findFirst({ where: { slug: 'professional-monitors' } });
    const standardMonitors = await prisma.category.findFirst({ where: { slug: 'standard-monitors' } });
    const gamingMice = await prisma.category.findFirst({ where: { slug: 'gaming-mice' } });
    const officeMice = await prisma.category.findFirst({ where: { slug: 'office-mice' } });
    const mechanicalKeyboards = await prisma.category.findFirst({ where: { slug: 'mechanical-keyboards' } });
    const membraneKeyboards = await prisma.category.findFirst({ where: { slug: 'membrane-keyboards' } });

    // Create Products (3 per category)
    const products = await prisma.product.createMany({
        data: [
            // ========== GAMING LAPTOPS (3 products) ==========
            {
                name: 'ASUS ROG Zephyrus G14',
                description: 'Powerful 14-inch gaming laptop with AMD Ryzen 9 and RTX 4060.',
                price: 1499.99,
                images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop'],
                categoryId: gamingLaptops!.id,
                inventory: 15,
                specifications: {
                    processor: 'AMD Ryzen 9 7940HS',
                    graphics: 'NVIDIA GeForce RTX 4060',
                    memory: '16GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch QHD+ 165Hz'
                }
            },

            {
                name: 'Lenovo Legion 5 Pro',
                description: '16-inch gaming laptop with Ryzen 7 and RTX 4070.',
                price: 1699.99,
                images: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop'],
                categoryId: gamingLaptops!.id,
                inventory: 12,
                specifications: {
                    processor: 'AMD Ryzen 7 7745HX',
                    graphics: 'NVIDIA GeForce RTX 4070',
                    memory: '32GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '16-inch WQXGA 165Hz'
                }
            },
            {
                name: 'MSI Katana 15',
                description: 'Affordable gaming laptop with Intel i7 and RTX 4050.',
                price: 1199.99,
                images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop'],
                categoryId: gamingLaptops!.id,
                inventory: 20,
                specifications: {
                    processor: 'Intel Core i7-13620H',
                    graphics: 'NVIDIA GeForce RTX 4050',
                    memory: '16GB DDR5',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD 144Hz'
                }
            },

            // ========== BUSINESS LAPTOPS (3 products) ==========
            {
                name: 'Dell XPS 13',
                description: 'Premium business laptop with stunning InfinityEdge display.',
                price: 1199.99,
                images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'],
                categoryId: businessLaptops!.id,
                inventory: 25,
                specifications: {
                    processor: 'Intel Core i7-1355U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '512GB NVMe SSD',
                    display: '13.4-inch FHD+'
                }
            },
            {
                name: 'Apple MacBook Pro 16"',
                description: 'Professional laptop with M3 Pro chip for extreme performance.',
                price: 2499.99,
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop'],
                categoryId: businessLaptops!.id,
                inventory: 10,
                specifications: {
                    processor: 'Apple M3 Pro',
                    graphics: '18-core GPU',
                    memory: '36GB Unified Memory',
                    storage: '1TB SSD',
                    display: '16.2-inch Liquid Retina XDR'
                }
            },
            {
                name: 'Lenovo ThinkPad X1 Carbon',
                description: 'Legendary business laptop with military-grade durability.',
                price: 1699.99,
                images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'],
                categoryId: businessLaptops!.id,
                inventory: 18,
                specifications: {
                    processor: 'Intel Core i7-1365U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch WUXGA'
                }
            },

            // ========== STANDARD LAPTOPS (3 products) ==========
            {
                name: 'Acer Aspire 5',
                description: 'Affordable everyday laptop with solid performance.',
                price: 599.99,
                images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'],
                categoryId: standardLaptops!.id,
                inventory: 30,
                specifications: {
                    processor: 'AMD Ryzen 5 5500U',
                    graphics: 'AMD Radeon Graphics',
                    memory: '8GB DDR4',
                    storage: '256GB NVMe SSD',
                    display: '15.6-inch FHD'
                }
            },
            {
                name: 'HP Pavilion 15',
                description: 'Versatile laptop with balanced performance for work and play.',
                price: 699.99,
                images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'],
                categoryId: standardLaptops!.id,
                inventory: 25,
                specifications: {
                    processor: 'Intel Core i5-1235U',
                    graphics: 'Intel Iris Xe',
                    memory: '12GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD'
                }
            },
            {
                name: 'Dell Inspiron 15',
                description: 'Family-friendly laptop with reliable performance.',
                price: 649.99,
                images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'],
                categoryId: standardLaptops!.id,
                inventory: 28,
                specifications: {
                    processor: 'Intel Core i5-1335U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD'
                }
            },

            // ========== GAMING DESKTOPS (3 products) ==========
            {
                name: 'Alienware Aurora R15',
                description: 'High-performance gaming desktop with RTX 4080.',
                price: 2899.99,
                images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'],
                categoryId: gamingDesktops!.id,
                inventory: 8,
                specifications: {
                    processor: 'Intel Core i9-13900KF',
                    graphics: 'NVIDIA GeForce RTX 4080',
                    memory: '32GB DDR5',
                    storage: '2TB NVMe SSD',
                    powerSupply: '1000W'
                }
            },
            {
                name: 'MSI Aegis ZS',
                description: 'Compact gaming desktop with powerful components.',
                price: 1899.99,
                images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'],
                categoryId: gamingDesktops!.id,
                inventory: 12,
                specifications: {
                    processor: 'Intel Core i7-13700F',
                    graphics: 'NVIDIA GeForce RTX 4070',
                    memory: '32GB DDR5',
                    storage: '1TB NVMe SSD + 2TB HDD'
                }
            },
            {
                name: 'HP Omen 45L',
                description: 'Gaming desktop with innovative cooling system.',
                price: 2299.99,
                images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'],
                categoryId: gamingDesktops!.id,
                inventory: 6,
                specifications: {
                    processor: 'AMD Ryzen 9 7900X',
                    graphics: 'NVIDIA GeForce RTX 4080',
                    memory: '32GB DDR5',
                    storage: '2TB NVMe SSD'
                }
            },

            // ========== WORKSTATION DESKTOPS (3 products) ==========
            {
                name: 'Dell Precision 7865 Tower',
                description: 'Professional workstation for CAD and 3D rendering.',
                price: 3899.99,
                images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'],
                categoryId: workstationDesktops!.id,
                inventory: 5,
                specifications: {
                    processor: 'AMD Ryzen Threadripper PRO 5995WX',
                    graphics: 'NVIDIA RTX A6000',
                    memory: '128GB DDR4 ECC',
                    storage: '4TB NVMe SSD + 8TB HDD'
                }
            },
            {
                name: 'Apple Mac Studio',
                description: 'Compact workstation with M2 Ultra chip.',
                price: 3999.99,
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop'],
                categoryId: workstationDesktops!.id,
                inventory: 8,
                specifications: {
                    processor: 'Apple M2 Ultra',
                    graphics: '76-core GPU',
                    memory: '128GB Unified Memory',
                    storage: '4TB SSD'
                }
            },
            {
                name: 'HP Z8 G4 Workstation',
                description: 'Enterprise-grade workstation for demanding applications.',
                price: 4299.99,
                images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'],
                categoryId: workstationDesktops!.id,
                inventory: 4,
                specifications: {
                    processor: 'Intel Xeon W-3375',
                    graphics: 'NVIDIA RTX A5000',
                    memory: '256GB DDR4 ECC',
                    storage: '2TB NVMe SSD + 12TB HDD'
                }
            },

            // ========== GRAPHICS CARDS (3 products) ==========
            {
                name: 'NVIDIA GeForce RTX 4090',
                description: 'Flagship graphics card for extreme gaming performance.',
                price: 1599.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: graphicsCards!.id,
                inventory: 5,
                specifications: {
                    memory: '24GB GDDR6X',
                    coreClock: '2235 MHz',
                    memoryInterface: '384-bit',
                    powerConnectors: '3x 8-pin'
                }
            },
            {
                name: 'AMD Radeon RX 7900 XTX',
                description: 'AMD flagship graphics card with advanced ray tracing.',
                price: 999.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: graphicsCards!.id,
                inventory: 12,
                specifications: {
                    memory: '24GB GDDR6',
                    coreClock: '2300 MHz',
                    memoryInterface: '384-bit',
                    powerConnectors: '2x 8-pin'
                }
            },
            {
                name: 'NVIDIA GeForce RTX 4070 Ti',
                description: 'High-end graphics card for 1440p and 4K gaming.',
                price: 799.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: graphicsCards!.id,
                inventory: 15,
                specifications: {
                    memory: '12GB GDDR6X',
                    coreClock: '2310 MHz',
                    memoryInterface: '192-bit',
                    powerConnectors: '2x 8-pin'
                }
            },

            // ========== PC RAM (3 products) ==========
            {
                name: 'Corsair Vengeance RGB 32GB DDR5',
                description: 'High-performance DDR5 memory with RGB lighting.',
                price: 149.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: pcRam!.id,
                inventory: 30,
                specifications: {
                    capacity: '32GB (2x16GB)',
                    speed: '5600MHz',
                    type: 'DDR5',
                    latency: 'CL36'
                }
            },
            {
                name: 'G.Skill Trident Z5 RGB 64GB DDR5',
                description: 'Premium DDR5 memory with aggressive timings.',
                price: 249.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: pcRam!.id,
                inventory: 15,
                specifications: {
                    capacity: '64GB (2x32GB)',
                    speed: '6000MHz',
                    type: 'DDR5',
                    latency: 'CL30'
                }
            },
            {
                name: 'Kingston Fury Beast 16GB DDR4',
                description: 'Reliable DDR4 memory for gaming and productivity.',
                price: 59.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: pcRam!.id,
                inventory: 50,
                specifications: {
                    capacity: '16GB (2x8GB)',
                    speed: '3200MHz',
                    type: 'DDR4',
                    latency: 'CL16'
                }
            },

            // ========== SSD STORAGE (3 products) ==========
            {
                name: 'Samsung 980 Pro 2TB NVMe SSD',
                description: 'High-speed PCIe 4.0 NVMe SSD for gaming and productivity.',
                price: 199.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: ssdStorage!.id,
                inventory: 40,
                specifications: {
                    capacity: '2TB',
                    interface: 'PCIe 4.0 NVMe',
                    readSpeed: '7000 MB/s',
                    writeSpeed: '5000 MB/s'
                }
            },
            {
                name: 'WD Black SN850X 1TB NVMe SSD',
                description: 'Premium gaming SSD with heatsink option.',
                price: 129.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: ssdStorage!.id,
                inventory: 35,
                specifications: {
                    capacity: '1TB',
                    interface: 'PCIe 4.0 NVMe',
                    readSpeed: '7300 MB/s',
                    writeSpeed: '6300 MB/s'
                }
            },
            {
                name: 'Crucial P5 Plus 2TB NVMe SSD',
                description: 'High-performance NVMe SSD with excellent value.',
                price: 169.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: ssdStorage!.id,
                inventory: 45,
                specifications: {
                    capacity: '2TB',
                    interface: 'PCIe 4.0 NVMe',
                    readSpeed: '6600 MB/s',
                    writeSpeed: '5000 MB/s'
                }
            },

            // ========== MECHANICAL HARD DRIVES (3 products) ==========
            {
                name: 'Seagate IronWolf Pro 16TB NAS HDD',
                description: 'High-capacity NAS hard drive for 24/7 operation.',
                price: 349.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: mechanicalHD!.id,
                inventory: 25,
                specifications: {
                    capacity: '16TB',
                    interface: 'SATA III',
                    rpm: '7200',
                    cache: '256MB'
                }
            },
            {
                name: 'WD Red Pro 14TB NAS HDD',
                description: 'NAS-optimized hard drive with enhanced reliability.',
                price: 299.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: mechanicalHD!.id,
                inventory: 30,
                specifications: {
                    capacity: '14TB',
                    interface: 'SATA III',
                    rpm: '7200',
                    cache: '512MB'
                }
            },
            {
                name: 'Seagate BarraCuda 4TB Desktop HDD',
                description: 'Reliable desktop hard drive for everyday computing.',
                price: 89.99,
                images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=300&fit=crop'],
                categoryId: mechanicalHD!.id,
                inventory: 65,
                specifications: {
                    capacity: '4TB',
                    interface: 'SATA III',
                    rpm: '5400',
                    cache: '256MB'
                }
            },

            // ========== GAMING MONITORS (3 products) ==========
            {
                name: 'Alienware AW3423DW',
                description: '34-inch QD-OLED gaming monitor with 175Hz refresh rate.',
                price: 1299.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: gamingMonitors!.id,
                inventory: 8,
                specifications: {
                    size: '34-inch',
                    resolution: '3440x1440',
                    panel: 'QD-OLED',
                    refreshRate: '175Hz',
                    responseTime: '0.1ms'
                }
            },
            {
                name: 'ASUS ROG Swift PG279QM',
                description: '27-inch IPS gaming monitor with 240Hz refresh rate.',
                price: 899.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: gamingMonitors!.id,
                inventory: 12,
                specifications: {
                    size: '27-inch',
                    resolution: '2560x1440',
                    panel: 'IPS',
                    refreshRate: '240Hz',
                    responseTime: '1ms'
                }
            },
            {
                name: 'Samsung Odyssey G9',
                description: '49-inch super ultrawide gaming monitor with 240Hz.',
                price: 1499.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: gamingMonitors!.id,
                inventory: 6,
                specifications: {
                    size: '49-inch',
                    resolution: '5120x1440',
                    panel: 'QLED',
                    refreshRate: '240Hz',
                    responseTime: '1ms'
                }
            },

            // ========== PROFESSIONAL MONITORS (3 products) ==========
            {
                name: 'Dell UltraSharp U4320Q',
                description: '43-inch 4K USB-C Hub Monitor with exceptional color accuracy.',
                price: 1099.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: professionalMonitors!.id,
                inventory: 10,
                specifications: {
                    size: '43-inch',
                    resolution: '3840x2160',
                    panel: 'IPS',
                    refreshRate: '60Hz',
                    colorGamut: 'sRGB 99%'
                }
            },
            {
                name: 'LG UltraFine 5K Display',
                description: '27-inch 5K monitor optimized for Mac users.',
                price: 1299.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: professionalMonitors!.id,
                inventory: 8,
                specifications: {
                    size: '27-inch',
                    resolution: '5120x2880',
                    panel: 'IPS',
                    refreshRate: '60Hz',
                    colorGamut: 'P3 99%'
                }
            },
            {
                name: 'BenQ PD3220U',
                description: '32-inch 4K USB-C Monitor with Thunderbolt 3.',
                price: 999.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: professionalMonitors!.id,
                inventory: 12,
                specifications: {
                    size: '32-inch',
                    resolution: '3840x2160',
                    panel: 'IPS',
                    refreshRate: '60Hz',
                    colorGamut: 'P3 95%'
                }
            },

            // ========== STANDARD MONITORS (3 products) ==========
            {
                name: 'Dell S2721HS',
                description: '27-inch Full HD Monitor with thin bezels.',
                price: 199.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: standardMonitors!.id,
                inventory: 40,
                specifications: {
                    size: '27-inch',
                    resolution: '1920x1080',
                    panel: 'IPS',
                    refreshRate: '75Hz',
                    responseTime: '4ms'
                }
            },
            {
                name: 'HP M24fw',
                description: '23.8-inch Full HD Monitor with ultra-slim design.',
                price: 159.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: standardMonitors!.id,
                inventory: 35,
                specifications: {
                    size: '23.8-inch',
                    resolution: '1920x1080',
                    panel: 'IPS',
                    refreshRate: '75Hz',
                    responseTime: '5ms'
                }
            },
            {
                name: 'ASUS VA24EHE',
                description: '23.8-inch Full HD Monitor with 75Hz refresh rate.',
                price: 139.99,
                images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=300&fit=crop'],
                categoryId: standardMonitors!.id,
                inventory: 45,
                specifications: {
                    size: '23.8-inch',
                    resolution: '1920x1080',
                    panel: 'IPS',
                    refreshRate: '75Hz',
                    responseTime: '5ms'
                }
            },

            // ========== GAMING MICE (3 products) ==========
            {
                name: 'Razer DeathAdder V3 Pro',
                description: 'Wireless gaming mouse with 30K DPI optical sensor.',
                price: 149.99,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop'],
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
            {
                name: 'Logitech G Pro X Superlight',
                description: 'Ultra-lightweight wireless gaming mouse.',
                price: 159.99,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop'],
                categoryId: gamingMice!.id,
                inventory: 30,
                specifications: {
                    sensor: 'HERO 25K',
                    dpi: '25600',
                    buttons: '5 Programmable',
                    weight: '63g',
                    connectivity: 'LIGHTSPEED Wireless'
                }
            },
            {
                name: 'SteelSeries Rival 3',
                description: 'Affordable gaming mouse with TrueMove Core sensor.',
                price: 29.99,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop'],
                categoryId: gamingMice!.id,
                inventory: 60,
                specifications: {
                    sensor: 'TrueMove Core',
                    dpi: '8500',
                    buttons: '6 Programmable',
                    weight: '77g',
                    connectivity: 'Wired USB'
                }
            },

            // ========== OFFICE MICE (3 products) ==========
            {
                name: 'Logitech MX Master 3S',
                description: 'Advanced wireless mouse with MagSpeed scrolling.',
                price: 99.99,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop'],
                categoryId: officeMice!.id,
                inventory: 40,
                specifications: {
                    sensor: 'Darkfield 4000 DPI',
                    dpi: '4000',
                    buttons: '7 Programmable',
                    connectivity: 'Bluetooth, USB Receiver'
                }
            },
            {
                name: 'Microsoft Sculpt Ergonomic Mouse',
                description: 'Ergonomic mouse designed for comfort.',
                price: 59.99,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop'],
                categoryId: officeMice!.id,
                inventory: 35,
                specifications: {
                    sensor: 'BlueTrack Technology',
                    dpi: '1000',
                    buttons: '4 Programmable',
                    connectivity: 'Wireless 2.4GHz'
                }
            },
            {
                name: 'Logitech M720 Triathlon',
                description: 'Multi-device mouse for productivity.',
                price: 49.99,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop'],
                categoryId: officeMice!.id,
                inventory: 45,
                specifications: {
                    sensor: 'Optical Tracking',
                    dpi: '1000',
                    buttons: '8 Programmable',
                    connectivity: 'Bluetooth, USB Receiver'
                }
            },

            // ========== MECHANICAL KEYBOARDS (3 products) ==========
            {
                name: 'Logitech MX Mechanical',
                description: 'Wireless mechanical keyboard with smart illumination.',
                price: 169.99,
                images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop'],
                categoryId: mechanicalKeyboards!.id,
                inventory: 30,
                specifications: {
                    type: 'Mechanical',
                    connectivity: 'Bluetooth, 2.4GHz Wireless',
                    backlight: 'RGB Smart Illumination',
                    battery: 'Up to 15 days'
                }
            },
            {
                name: 'Razer BlackWidow V3 Pro',
                description: 'Wireless mechanical gaming keyboard.',
                price: 229.99,
                images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop'],
                categoryId: mechanicalKeyboards!.id,
                inventory: 25,
                specifications: {
                    type: 'Mechanical',
                    connectivity: '2.4GHz, Bluetooth, Wired',
                    backlight: 'Razer Chroma RGB',
                    battery: 'Up to 200 hours'
                }
            },
            {
                name: 'Corsair K95 RGB Platinum XT',
                description: 'Premium mechanical keyboard with Cherry MX switches.',
                price: 199.99,
                images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop'],
                categoryId: mechanicalKeyboards!.id,
                inventory: 28,
                specifications: {
                    type: 'Mechanical',
                    connectivity: 'Wired USB',
                    backlight: 'Per-key RGB',
                    switches: 'Cherry MX Speed'
                }
            },

            // ========== MEMBRANE KEYBOARDS (3 products) ==========
            {
                name: 'Logitech K380 Multi-Device',
                description: 'Compact Bluetooth keyboard for multiple devices.',
                price: 39.99,
                images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop'],
                categoryId: membraneKeyboards!.id,
                inventory: 55,
                specifications: {
                    type: 'Membrane',
                    connectivity: 'Bluetooth',
                    battery: '24 months',
                    devices: '3 devices'
                }
            },
            {
                name: 'Microsoft Sculpt Ergonomic Keyboard',
                description: 'Ergonomic keyboard with split design.',
                price: 79.99,
                images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop'],
                categoryId: membraneKeyboards!.id,
                inventory: 40,
                specifications: {
                    type: 'Membrane',
                    connectivity: 'Wireless 2.4GHz',
                    layout: 'Split Design',
                    features: 'Cushioned Palm Rest'
                }
            },
            {
                name: 'Logitech K120 Wired Keyboard',
                description: 'Reliable wired keyboard for everyday use.',
                price: 19.99,
                images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=300&fit=crop'],
                categoryId: membraneKeyboards!.id,
                inventory: 80,
                specifications: {
                    type: 'Membrane',
                    connectivity: 'Wired USB',
                    layout: 'Full Size',
                    spillResistant: 'Yes'
                }
            },
            {
                name: 'ASUS ROG Zephyrus G14',
                description: 'Powerful 14-inch gaming laptop with AMD Ryzen 9 and RTX 4060. Perfect for gaming and content creation.',
                price: 1499.99,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 15,
                specifications: {
                    processor: 'AMD Ryzen 9 7940HS',
                    graphics: 'NVIDIA GeForce RTX 4060',
                    memory: '16GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch QHD+ 165Hz',
                    os: 'Windows 11 Home',
                    battery: '76Wh',
                    weight: '1.72kg'
                }
            },
            {
                name: 'Lenovo Legion 5 Pro',
                description: '16-inch gaming laptop with Ryzen 7 and RTX 4070. High-performance gaming machine.',
                price: 1699.99,
                images: [
                    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
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
                name: 'MSI Katana 15',
                description: 'Affordable gaming laptop with Intel i7 and RTX 4050. Great value for budget gamers.',
                price: 1199.99,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 20,
                specifications: {
                    processor: 'Intel Core i7-13620H',
                    graphics: 'NVIDIA GeForce RTX 4050',
                    memory: '16GB DDR5',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD 144Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Acer Predator Helios 300',
                description: 'High-performance gaming laptop with Intel i9 and RTX 4060. Built for serious gaming.',
                price: 1599.99,
                images: [
                    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 8,
                specifications: {
                    processor: 'Intel Core i9-13900HX',
                    graphics: 'NVIDIA GeForce RTX 4060',
                    memory: '32GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '16-inch QHD+ 165Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Razer Blade 15',
                description: 'Premium gaming laptop with sleek design and powerful performance.',
                price: 2499.99,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 6,
                specifications: {
                    processor: 'Intel Core i9-13950HX',
                    graphics: 'NVIDIA GeForce RTX 4070',
                    memory: '32GB DDR5',
                    storage: '2TB NVMe SSD',
                    display: '15.6-inch QHD 240Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'HP Omen 16',
                description: 'Reliable gaming laptop with AMD Ryzen and RTX graphics.',
                price: 1399.99,
                images: [
                    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 14,
                specifications: {
                    processor: 'AMD Ryzen 7 7840HS',
                    graphics: 'NVIDIA GeForce RTX 4060',
                    memory: '16GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '16.1-inch FHD 165Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Dell G15 Gaming Laptop',
                description: 'Entry-level gaming laptop with great performance for the price.',
                price: 999.99,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 25,
                specifications: {
                    processor: 'Intel Core i5-13450HX',
                    graphics: 'NVIDIA GeForce RTX 3050',
                    memory: '16GB DDR5',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD 120Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'ASUS TUF Gaming A15',
                description: 'Durable gaming laptop built to last with military-grade standards.',
                price: 1099.99,
                images: [
                    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 18,
                specifications: {
                    processor: 'AMD Ryzen 5 7640HS',
                    graphics: 'NVIDIA GeForce RTX 4050',
                    memory: '16GB DDR5',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD 144Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Gigabyte AORUS 15',
                description: 'Feature-packed gaming laptop with advanced cooling system.',
                price: 1799.99,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 10,
                specifications: {
                    processor: 'Intel Core i7-13700H',
                    graphics: 'NVIDIA GeForce RTX 4070',
                    memory: '32GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '15.6-inch QHD 165Hz',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Alienware m16',
                description: 'Premium gaming laptop with Alienware signature design and performance.',
                price: 2299.99,
                images: [
                    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: gamingLaptops!.id,
                inventory: 5,
                specifications: {
                    processor: 'Intel Core i9-13900HX',
                    graphics: 'NVIDIA GeForce RTX 4080',
                    memory: '32GB DDR5',
                    storage: '2TB NVMe SSD',
                    display: '16-inch QHD+ 165Hz',
                    os: 'Windows 11 Home'
                }
            },

            // ========== BUSINESS LAPTOPS (10 products) ==========
            {
                name: 'Dell XPS 13',
                description: 'Premium business laptop with stunning InfinityEdge display and compact design.',
                price: 1199.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 25,
                specifications: {
                    processor: 'Intel Core i7-1355U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '512GB NVMe SSD',
                    display: '13.4-inch FHD+',
                    os: 'Windows 11 Pro',
                    battery: '52Wh',
                    weight: '1.27kg'
                }
            },
            {
                name: 'Apple MacBook Pro 16"',
                description: 'Professional laptop with M3 Pro chip for extreme performance and battery life.',
                price: 2499.99,
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 10,
                specifications: {
                    processor: 'Apple M3 Pro',
                    graphics: '18-core GPU',
                    memory: '36GB Unified Memory',
                    storage: '1TB SSD',
                    display: '16.2-inch Liquid Retina XDR',
                    os: 'macOS Sonoma',
                    battery: '100Wh',
                    weight: '2.15kg'
                }
            },
            {
                name: 'Lenovo ThinkPad X1 Carbon',
                description: 'Legendary business laptop with military-grade durability and excellent keyboard.',
                price: 1699.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 18,
                specifications: {
                    processor: 'Intel Core i7-1365U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch WUXGA',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'HP EliteBook 840 G9',
                description: 'Business laptop with enterprise-grade security and manageability.',
                price: 1399.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 22,
                specifications: {
                    processor: 'Intel Core i5-1335U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB DDR5',
                    storage: '512GB NVMe SSD',
                    display: '14-inch FHD',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'Microsoft Surface Laptop 5',
                description: 'Elegant business laptop with premium build quality and touchscreen.',
                price: 1299.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 15,
                specifications: {
                    processor: 'Intel Core i7-1255U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '512GB NVMe SSD',
                    display: '13.5-inch PixelSense Touch',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'Apple MacBook Air 15"',
                description: 'Thin and light laptop with M2 chip and large display.',
                price: 1299.99,
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 20,
                specifications: {
                    processor: 'Apple M2',
                    graphics: '10-core GPU',
                    memory: '16GB Unified Memory',
                    storage: '512GB SSD',
                    display: '15.3-inch Liquid Retina',
                    os: 'macOS Ventura'
                }
            },
            {
                name: 'Dell Latitude 7440',
                description: 'Business laptop with advanced security features and reliable performance.',
                price: 1499.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 16,
                specifications: {
                    processor: 'Intel Core i7-1365U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch FHD+',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'ASUS ExpertBook B9',
                description: 'Ultra-light business laptop with military-grade durability.',
                price: 1599.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 12,
                specifications: {
                    processor: 'Intel Core i7-1355U',
                    graphics: 'Intel Iris Xe',
                    memory: '32GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch FHD',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'Lenovo Yoga 9i',
                description: '2-in-1 business laptop with premium sound and versatile form factor.',
                price: 1399.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 14,
                specifications: {
                    processor: 'Intel Core i7-1360P',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch OLED Touch',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'HP Spectre x360',
                description: 'Convertible business laptop with premium design and performance.',
                price: 1499.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: businessLaptops!.id,
                inventory: 11,
                specifications: {
                    processor: 'Intel Core i7-1355U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '13.5-inch OLED Touch',
                    os: 'Windows 11 Pro'
                }
            },

            // ========== STANDARD LAPTOPS (10 products) ==========
            {
                name: 'Acer Aspire 5',
                description: 'Affordable everyday laptop with solid performance for work and entertainment.',
                price: 599.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 30,
                specifications: {
                    processor: 'AMD Ryzen 5 5500U',
                    graphics: 'AMD Radeon Graphics',
                    memory: '8GB DDR4',
                    storage: '256GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Lenovo IdeaPad 3',
                description: 'Reliable laptop for everyday computing tasks and multimedia.',
                price: 499.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 35,
                specifications: {
                    processor: 'Intel Core i3-1215U',
                    graphics: 'Intel UHD Graphics',
                    memory: '8GB DDR4',
                    storage: '256GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'HP Pavilion 15',
                description: 'Versatile laptop with balanced performance for work and play.',
                price: 699.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 25,
                specifications: {
                    processor: 'Intel Core i5-1235U',
                    graphics: 'Intel Iris Xe',
                    memory: '12GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Dell Inspiron 15',
                description: 'Family-friendly laptop with reliable performance and large display.',
                price: 649.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 28,
                specifications: {
                    processor: 'Intel Core i5-1335U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'ASUS VivoBook 15',
                description: 'Slim and lightweight laptop with vibrant display and fast performance.',
                price: 579.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 32,
                specifications: {
                    processor: 'AMD Ryzen 5 5600H',
                    graphics: 'AMD Radeon Graphics',
                    memory: '8GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Lenovo ThinkBook 15',
                description: 'Business-ready laptop with professional features at an affordable price.',
                price: 749.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 20,
                specifications: {
                    processor: 'Intel Core i5-1340P',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'Acer Swift 3',
                description: 'Ultra-thin laptop with premium aluminum chassis and long battery life.',
                price: 799.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 18,
                specifications: {
                    processor: 'Intel Core i7-1355U',
                    graphics: 'Intel Iris Xe',
                    memory: '16GB LPDDR5',
                    storage: '1TB NVMe SSD',
                    display: '14-inch QHD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'HP 15-dw3000',
                description: 'Budget-friendly laptop for everyday computing and entertainment.',
                price: 449.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 40,
                specifications: {
                    processor: 'Intel Celeron N4500',
                    graphics: 'Intel UHD Graphics',
                    memory: '4GB DDR4',
                    storage: '128GB eMMC',
                    display: '15.6-inch HD',
                    os: 'Windows 11 Home'
                }
            },
            {
                name: 'Dell Vostro 15',
                description: 'Small business laptop with essential features and reliable performance.',
                price: 699.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 22,
                specifications: {
                    processor: 'Intel Core i5-1335U',
                    graphics: 'Intel Iris Xe',
                    memory: '8GB DDR4',
                    storage: '512GB NVMe SSD',
                    display: '15.6-inch FHD',
                    os: 'Windows 11 Pro'
                }
            },
            {
                name: 'ASUS Chromebook Flip',
                description: 'Convertible Chromebook with touchscreen and Google ecosystem.',
                price: 399.99,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: standardLaptops!.id,
                inventory: 26,
                specifications: {
                    processor: 'MediaTek Kompanio 500',
                    graphics: 'ARM Mali-G72',
                    memory: '4GB LPDDR4',
                    storage: '64GB eMMC',
                    display: '14-inch FHD Touch',
                    os: 'Chrome OS'
                }
            },

            // ========== GAMING DESKTOPS (10 products) ==========
            {
                name: 'Alienware Aurora R15',
                description: 'High-performance gaming desktop with RTX 4080 and liquid cooling.',
                price: 2899.99,
                images: [
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=300&fit=crop'
                ],
                categoryId: gamingDesktops!.id,
                inventory: 8,
                specifications: {
                    processor: 'Intel Core i9-13900KF',
                    graphics: 'NVIDIA GeForce RTX 4080',
                    memory: '32GB DDR5',
                    storage: '2TB NVMe SSD',
                    powerSupply: '1000W',
                    cooling: 'Liquid Cooling',
                    case: 'Alienware Legend 3.0'
                }
            },
            {
                name: 'MSI Aegis ZS',
                description: 'Compact gaming desktop with powerful components and RGB lighting.',
                price: 1899.99,
                images: [
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=300&fit=crop'
                ],
                categoryId: gamingDesktops!.id,
                inventory: 12,
                specifications: {
                    processor: 'Intel Core i7-13700F',
                    graphics: 'NVIDIA GeForce RTX 4070',
                    memory: '32GB DDR5',
                    storage: '1TB NVMe SSD + 2TB HDD',
                    powerSupply: '750W',
                    cooling: 'Air Cooling'
                }
            },
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