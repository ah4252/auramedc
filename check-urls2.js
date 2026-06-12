const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { videoUrl: { contains: "drive.google.com" } },
        { resources: { some: { type: "VIDEO", url: { contains: "drive.google.com" } } } }
      ]
    },
  });
  console.log(JSON.stringify(lessons, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
