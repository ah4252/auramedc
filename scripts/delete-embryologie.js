const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Locating all QuizExams with title 'QCM Embryologie - 1ère année'...");
  
  const exams = await prisma.quizExam.findMany({
    where: {
      title: 'QCM Embryologie - 1ère année'
    }
  });

  console.log(`Found ${exams.length} exams. Deleting them...`);

  for (const exam of exams) {
    console.log(`Deleting exam ID: ${exam.id}...`);
    await prisma.quizExam.delete({
      where: {
        id: exam.id
      }
    });
  }

  console.log("All matching exams deleted successfully.");

  // Clean up orphan QuizQuestions
  console.log("Cleaning up orphan QuizQuestions...");
  const orphanQuestions = await prisma.quizQuestion.deleteMany({
    where: {
      examLinks: {
        none: {}
      }
    }
  });
  console.log(`Deleted ${orphanQuestions.count} orphan questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
