import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete in order of dependencies (child records first)
    
    // 1. Delete PlayerLoadout records (this will automatically handle the junction table)
    await prisma.playerLoadout.deleteMany();
    
    // 2. Delete LoadoutElement records (now safe since no PlayerLoadouts reference them)
    await prisma.loadoutElement.deleteMany();
    
    // 3. Delete Player records (depends on rosters)
    await prisma.player.deleteMany();
    
    // 4. Delete Roster records (depends on users)
    await prisma.roster.deleteMany();
    
    // 5. Optionally delete users (if you want to clear everything)
    // await prisma.user.deleteMany();
    
    console.log('All data deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

clearDatabase().finally(() => prisma.$disconnect());
