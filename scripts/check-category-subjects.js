const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cat1 = await prisma.category.findUnique({
    where: { id: 'cmqu3tae70000kw04e6p6ormv' },
    include: { subjects: true }
  });
  
  const cat2 = await prisma.category.findUnique({
    where: { id: 'cmt1kdfy50000umyc3bwey73p' },
    include: { subjects: true }
  });

  console.log("السنة الاولى (No hamza):", cat1.subjects.length, "subjects");
  console.log("السنة الأولى (With hamza):", cat2.subjects.length, "subjects");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
