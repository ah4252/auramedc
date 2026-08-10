const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting pharmacy fix migration...");

  const cat = await prisma.category.findUnique({ where: { slug: "pharmacy" } });
  if (!cat) { console.error("Pharmacy category not found!"); return; }

  // Fetch all existing pharmacy sections + images from the OLD tables
  const sections = await (prisma).pharmacySection.findMany({
    include: { images: { orderBy: { order: "asc" } } }
  });

  console.log(`Found ${sections.length} pharmacy sections in old tables.`);

  let migratedImages = 0;
  let skippedImages = 0;

  for (const sec of sections) {
    // Find the corresponding subject (was created with id: sec.id)
    const subject = await prisma.subject.findUnique({ where: { id: sec.id } });

    if (!subject) {
      console.warn(`No subject found for section: ${sec.name} (${sec.id})`);
      continue;
    }

    console.log(`\nSection: ${sec.name} (${sec.images.length} images)`);

    for (const img of sec.images) {
      // Check if a lesson already exists for this image
      const existing = await prisma.lesson.findUnique({ where: { id: img.id } });

      if (existing && existing.subjectId === subject.id) {
        console.log(`  ✓ Already migrated: ${img.title || img.id}`);
        skippedImages++;
        continue;
      }

      const imgBaseSlug = (img.title || "image").toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
      const lessonSlug = `${imgBaseSlug}-${img.id.substring(0, 8)}-fix`;

      try {
        await prisma.lesson.upsert({
          where: { id: img.id },
          update: {
            title: img.title || "صورة / ملف",
            description: img.description,
            thumbnail: img.url,
            pdfUrl: img.url,
            subjectId: subject.id,
            isPublished: true,
          },
          create: {
            id: img.id,
            title: img.title || "صورة / ملف",
            slug: lessonSlug,
            description: img.description,
            thumbnail: img.url,
            pdfUrl: img.url,
            videoUrl: "",
            isPublished: true,
            subjectId: subject.id,
          }
        });
        console.log(`  ✅ Migrated: ${img.title || img.id} → ${img.url.substring(0, 50)}...`);
        migratedImages++;
      } catch (err) {
        // slug conflict? try with more random suffix
        const altSlug = `img-${img.id.substring(0, 12)}-${Date.now()}`;
        try {
          await prisma.lesson.upsert({
            where: { id: img.id },
            update: {
              title: img.title || "صورة / ملف",
              description: img.description,
              thumbnail: img.url,
              pdfUrl: img.url,
              subjectId: subject.id,
              isPublished: true,
            },
            create: {
              id: img.id,
              title: img.title || "صورة / ملف",
              slug: altSlug,
              description: img.description,
              thumbnail: img.url,
              pdfUrl: img.url,
              videoUrl: "",
              isPublished: true,
              subjectId: subject.id,
            }
          });
          console.log(`  ✅ Migrated (alt slug): ${img.title || img.id}`);
          migratedImages++;
        } catch(err2) {
          console.error(`  ❌ Failed: ${img.id} - ${err2.message}`);
        }
      }
    }
  }

  console.log(`\n✅ Fix complete! Migrated: ${migratedImages}, Skipped (already OK): ${skippedImages}`);
}

main()
  .catch(e => { console.error("Migration failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
