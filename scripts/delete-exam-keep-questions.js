const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete the QuizExam only (cascade will handle QuizExamQuestion and QuizAttempt)
  // The individual QuizQuestion records will be preserved
  const deleted = await prisma.quizExam.deleteMany({
    where: {
      title: 'QCM Embryologie - 1ère année'
    }
  });
  console.log(`Deleted ${deleted.count} exam(s). Individual questions are preserved.`);

  // Verify questions still exist
  const count = await prisma.quizQuestion.count({
    where: { isPublished: true, studyYear: 'السنة الاولى' }
  });
  console.log(`✅ ${count} individual questions still available in "اختر مسارك التعليمي".`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
