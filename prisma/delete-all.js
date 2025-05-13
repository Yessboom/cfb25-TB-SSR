import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete records in an order that respects foreign key constraints
  await prisma.PlayerLoadoutToElement.deleteMany(); // Delete join table entries first
  await prisma.loadoutElement.deleteMany(); // Then delete loadout elements
  await prisma.playerLoadout.deleteMany(); // Then delete player loadouts
  await prisma.player.deleteMany(); // Then delete players
  await prisma.roster.deleteMany(); // Then delete rosters
  await prisma.user.deleteMany(); // Finally, delete users

  console.log('All data deleted.');
}

clearDatabase().finally(() => prisma.$disconnect());
