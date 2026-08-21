const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete the empty duplicate
  await prisma.category.delete({
    where: { id: 'cmt1kdfy50000umyc3bwey73p' }
  });
  console.log("Deleted the empty duplicate category.");

  // Update the original one to have the hamza for better presentation
  await prisma.category.update({
    where: { id: 'cmqu3tae70000kw04e6p6ormv' },
    data: { name: 'السنة الأولى' }
  });
  console.log("Updated the original category name to include the hamza.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
