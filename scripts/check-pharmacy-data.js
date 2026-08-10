const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Find the pharmacy category
  const cat = await prisma.category.findUnique({ where: { slug: "pharmacy" } });
  console.log("Pharmacy category:", cat?.id, cat?.name);

  if (!cat) { console.log("NO PHARMACY CATEGORY FOUND!"); return; }

  // Get subjects with their lessons
  const subjects = await prisma.subject.findMany({
    where: { categoryId: cat.id },
    include: { lessons: true }
  });

  console.log(`\nFound ${subjects.length} subjects:`);
  for (const sub of subjects) {
    console.log(`\n  Subject: ${sub.name} (${sub.id})`);
    console.log(`  Lessons count: ${sub.lessons.length}`);
    for (const l of sub.lessons.slice(0, 2)) {
      console.log(`    - Lesson: ${l.title}`);
      console.log(`      thumbnail: ${l.thumbnail}`);
      console.log(`      pdfUrl: ${l.pdfUrl}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
