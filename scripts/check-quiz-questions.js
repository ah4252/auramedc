const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.quizQuestion.findMany({
    where: {
      isPublished: true,
      studyYear: 'السنة الاولى',
      subject: { name: { contains: 'EMBRYOLOGIE', mode: 'insensitive' } }
    },
    include: { subject: true, options: true },
    take: 3,
  });
  console.log(`Found ${questions.length} published questions for السنة الاولى / EMBRYOLOGIE`);
  if (questions.length > 0) {
    console.log('Sample:', questions[0].text.substring(0, 80), '...');
    console.log('Options count:', questions[0].options.length);
    console.log('isPublished:', questions[0].isPublished);
    console.log('studyYear:', questions[0].studyYear);
  }

  // Total count
  const total = await prisma.quizQuestion.count({
    where: {
      isPublished: true,
      studyYear: 'السنة الاولى',
    }
  });
  console.log('\nTotal published questions for السنة الاولى:', total);
}

main().catch(console.error).finally(() => prisma.$disconnect());
