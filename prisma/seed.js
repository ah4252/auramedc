const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // 1. Create Categories (Years)
  const years = [
    { name: "السنة الأولى", slug: "year-1", description: "المواد الأساسية للسنة الأولى طب" },
    { name: "السنة الثانية", slug: "year-2", description: "المواد الأساسية للسنة الثانية طب" },
    { name: "السنة الثالثة", slug: "year-3", description: "المواد الأساسية للسنة الثالثة طب" },
  ];

  for (const y of years) {
    await prisma.category.upsert({
      where: { slug: y.slug },
      update: {},
      create: y,
    });
  }

  const cat1 = await prisma.category.findUnique({ where: { slug: "year-1" } });

  // 2. Create Subjects
  const subjects = [
    { name: "علم التشريح (Anatomy)", slug: "anatomy", categoryId: cat1.id, description: "دراسة هيكل جسم الإنسان" },
    { name: "علم وظائف الأعضاء (Physiology)", slug: "physiology", categoryId: cat1.id, description: "دراسة وظائف أعضاء الجسم" },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  const subAnatomy = await prisma.subject.findUnique({ where: { slug: "anatomy" } });

  // 3. Create Lessons
  const lessons = [
    { 
      title: "مقدمة في علم التشريح", 
      slug: "intro-to-anatomy", 
      description: "نظرة عامة على المصطلحات التشريحية والمستويات الجسمية.",
      subjectId: subAnatomy.id,
      videoUrl: "https://www.youtube.com/watch?v=uBGl2BujkPQ",
      isPublished: true
    },
    { 
      title: "الجهاز الهيكلي - الجزء الأول", 
      slug: "skeletal-system-1", 
      description: "شرح مفصل للعظام وأنواعها في جسم الإنسان.",
      subjectId: subAnatomy.id,
      videoUrl: "https://www.youtube.com/watch?v=f-V-W-P7K8U",
      isPublished: true
    }
  ];

  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {},
      create: l,
    });
  }

  console.log("Seeding finished successfully! ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
