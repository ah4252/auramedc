const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const OLD_VALUE = 'السنة الاولى';
  const NEW_VALUE = 'السنة الأولى';

  const q1 = await prisma.$executeRaw`UPDATE "QuizQuestion" SET "studyYear" = ${NEW_VALUE} WHERE "studyYear" = ${OLD_VALUE}`;
  console.log('QuizQuestion rows updated:', q1);

  const q2 = await prisma.$executeRaw`UPDATE "QuizExam" SET "studyYear" = ${NEW_VALUE} WHERE "studyYear" = ${OLD_VALUE}`;
  console.log('QuizExam rows updated:', q2);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
