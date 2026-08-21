const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Check all distinct studyYear values
  const rows = await prisma.$queryRaw`SELECT DISTINCT "studyYear" FROM "QuizQuestion"`;
  console.log('Distinct studyYear values in QuizQuestion:', JSON.stringify(rows, null, 2));

  const exams = await prisma.$queryRaw`SELECT DISTINCT "studyYear" FROM "QuizExam"`;
  console.log('Distinct studyYear values in QuizExam:', JSON.stringify(exams, null, 2));

  // Check categories
  const cats = await prisma.category.findMany({ select: { id: true, name: true, slug: true } });
  console.log('\nAll Categories:', JSON.stringify(cats, null, 2));

  // Check subjects
  const subjects = await prisma.subject.findMany({ select: { id: true, name: true, slug: true, categoryId: true } });
  console.log('\nAll Subjects:', JSON.stringify(subjects, null, 2));

  // Check quiz questions
  const questions = await prisma.quizQuestion.findMany({ 
    where: { subject: { slug: 'embryologie' } },
    select: { id: true, text: true, studyYear: true, subjectId: true, isPublished: true },
  });
  console.log('\nEmbryologie questions:', JSON.stringify(questions.map(q => ({ id: q.id, studyYear: q.studyYear, isPublished: q.isPublished, text: q.text.substring(0, 60) })), null, 2));

  // Check quiz exams
  const examsList = await prisma.quizExam.findMany({
    where: { subject: { slug: 'embryologie' } },
    select: { id: true, title: true, studyYear: true, isPublished: true },
  });
  console.log('\nEmbryologie exams:', JSON.stringify(examsList, null, 2));

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
