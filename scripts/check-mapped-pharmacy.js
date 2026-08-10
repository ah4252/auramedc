const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "pharmacy" },
    update: { type: "PHARMACY" },
    create: { name: "الصيدلة", slug: "pharmacy", type: "PHARMACY", description: "قسم الصيدلة" }
  });

  const subjects = await prisma.subject.findMany({
    where: { categoryId: cat.id },
    include: { lessons: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  const mapped = subjects.map(sub => ({
    id: sub.id,
    name: sub.name,
    description: sub.description,
    imageUrl: sub.lessons[0]?.thumbnail || null,
    order: 0,
    images: sub.lessons.map(l => ({
      id: l.id,
      title: l.title,
      url: l.pdfUrl || l.thumbnail || "",
      description: l.description,
      order: 0
    }))
  }));

  console.log(`\nTotal sections: ${mapped.length}`);
  for (const sec of mapped) {
    console.log(`\n  [${sec.name}]`);
    console.log(`    imageUrl: ${sec.imageUrl ? "✅ " + sec.imageUrl.substring(0, 60) : "❌ null"}`);
    console.log(`    images count: ${sec.images.length}`);
    for (const img of sec.images) {
      console.log(`      - ${img.title}: ${img.url ? "✅" : "❌ EMPTY"} ${img.url.substring(0, 60)}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
