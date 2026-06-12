const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: {
      resources: {
        some: {}
      }
    },
    include: {
      resources: true
    },
    take: 5
  });
  console.log(JSON.stringify(lessons, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
