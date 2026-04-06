import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../database/.env' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('Starting database seed...');
  
  try {
    // Create or get the default restaurant
    const restaurant = await prisma.restaurant.upsert({
      where: { id: 'default-restaurant' },
      update: {},
      create: {
        id: 'default-restaurant',
        name: 'TillCloud Demo Restaurant',
        businessType: 'Restaurant',
        streetAddress: '123 Demo Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        phone: '(02) 1234 5678',
        contactEmail: 'demo@tillcloud.local',
        timezone: 'Australia/Sydney',
        taxMode: 'INCLUSIVE',
        taxRate: new Prisma.Decimal('10.00'),
      },
    });
    console.log(`✅ Created/updated restaurant: ${restaurant.name}`);

    // Create default categories
    const categories = [
      { id: 'cat-starters', name: 'Starters' },
      { id: 'cat-mains', name: 'Mains' },
      { id: 'cat-desserts', name: 'Desserts' },
      { id: 'cat-drinks', name: 'Drinks' },
    ];

    for (const cat of categories) {
      const category = await prisma.menuCategory.upsert({
        where: { id: cat.id },
        update: {},
        create: {
          id: cat.id,
          restaurantId: 'default-restaurant',
          name: cat.name,
          isActive: true,
        },
      });
      console.log(`✅ Created/updated category: ${category.name}`);
    }

    console.log('✅ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
