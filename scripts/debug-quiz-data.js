const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Check ALL quiz questions, not just by subject slug
  const allQuestions = await prisma.quizQuestion.findMany({
    select: { id: true, text: true, studyYear: true, subjectId: true, isPublished: true },
    take: 5,
  });
  console.log('First 5 quiz questions in DB:', JSON.stringify(allQuestions.map(q => ({ 
    id: q.id, 
    studyYear: q.studyYear, 
    isPublished: q.isPublished, 
    text: q.text.substring(0, 50) 
  })), null, 2));

  const count = await prisma.quizQuestion.count();
  console.log('\nTotal quiz questions:', count);

  // Check what studyYear the existing BIOCHIMIE questions use
  const biochimieQuestions = await prisma.quizQuestion.findMany({
    where: { subjectId: 'cmqusa9f10004jx042lox98a6' },
    select: { id: true, studyYear: true, isPublished: true },
    take: 3,
  });
  console.log('\nBIOCHIMIE S1 questions (first 3):', JSON.stringify(biochimieQuestions, null, 2));

  // Check what studyYear the admin panel expects - check getAvailableQuizStudyYears
  const categories = await prisma.category.findMany({
    where: { type: 'YEAR' },
    select: { id: true, name: true, slug: true },
  });
  console.log('\nYEAR categories:', JSON.stringify(categories, null, 2));

  // Check the existing EMBRYOLOGIE subject
  const embryo = await prisma.subject.findUnique({
    where: { id: 'cmqusbo08000ejx040snqoybl' },
    select: { id: true, name: true, slug: true, categoryId: true },
  });
  console.log('\nExisting EMBRYOLOGIE subject:', JSON.stringify(embryo, null, 2));

  // Check questions under existing EMBRYOLOGIE
  const embryoQuestions = await prisma.quizQuestion.findMany({
    where: { subjectId: 'cmqusbo08000ejx040snqoybl' },
    select: { id: true, studyYear: true, isPublished: true },
  });
  console.log('Questions under existing EMBRYOLOGIE:', embryoQuestions.length);

  // Check questions under my new Embryologie
  const myEmbryoQuestions = await prisma.quizQuestion.findMany({
    where: { subjectId: 'cmt1kdgdr0002umycq7h3643m' },
    select: { id: true, studyYear: true, isPublished: true },
  });
  console.log('Questions under my new Embryologie:', myEmbryoQuestions.length);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
