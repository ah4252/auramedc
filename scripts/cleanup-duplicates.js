const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete the duplicate category I created (year-1 with hamza)
  const dupCat = await prisma.category.delete({ where: { id: 'cmt1kdfy50000umyc3bwey73p' } }).catch(() => null);
  console.log('Deleted duplicate category:', dupCat ? 'yes' : 'not found');

  // Delete the duplicate Embryologie subject I created
  const dupSub = await prisma.subject.delete({ where: { id: 'cmt1kdgdr0002umycq7h3643m' } }).catch(() => null);
  console.log('Deleted duplicate Embryologie subject:', dupSub ? 'yes' : 'not found');

  // Delete any orphan QuizExam from my previous run
  const dupExam = await prisma.quizExam.delete({ where: { id: 'cmt1kdtkg0040umycg1j348fn' } }).catch(() => null);
  console.log('Deleted duplicate QuizExam:', dupExam ? 'yes' : 'not found');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
