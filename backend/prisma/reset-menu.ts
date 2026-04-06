import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurantId = 'default-restaurant';
  
  console.log('Starting menu reset...');
  
  try {
    // Delete all inventory items first (to avoid foreign key constraints)
    const inventoryDeleted = await prisma.inventoryItem.deleteMany({
      where: {
        restaurant: {
          id: restaurantId,
        },
      },
    });
    console.log(`Deleted ${inventoryDeleted.count} inventory items`);
    
    // Delete all menu items
    const itemsDeleted = await prisma.menuItem.deleteMany({
      where: {
        restaurantId,
      },
    });
    console.log(`Deleted ${itemsDeleted.count} menu items`);
    
    // Optionally delete all categories
    const categoriesDeleted = await prisma.menuCategory.deleteMany({
      where: {
        restaurantId,
      },
    });
    console.log(`Deleted ${categoriesDeleted.count} menu categories`);
    
    console.log('✅ Menu reset completed successfully!');
  } catch (error) {
    console.error('❌ Error resetting menu:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
