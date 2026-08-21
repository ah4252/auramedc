const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const qResult = await prisma.quizQuestion.updateMany({
    where: { studyYear: 'السنة الاولى' },
    data: { studyYear: 'السنة الأولى' }
  });
  console.log(`Updated ${qResult.count} quiz questions.`);

  const eResult = await prisma.quizExam.updateMany({
    where: { studyYear: 'السنة الاولى' },
    data: { studyYear: 'السنة الأولى' }
  });
  console.log(`Updated ${eResult.count} quiz exams.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
