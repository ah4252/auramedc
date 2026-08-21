const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exams = await prisma.quizExam.findMany({
    include: {
      subject: true
    }
  });
  console.log("ALL EXAMS IN DATABASE:");
  console.log(JSON.stringify(exams, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
