const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting pharmacy data migration...");

  // 1. Find or create the Pharmacy Category
  const pharmacyCategory = await prisma.category.upsert({
    where: { slug: "pharmacy" },
    update: {
      type: "PHARMACY"
    },
    create: {
      name: "الصيدلة",
      slug: "pharmacy",
      type: "PHARMACY",
      description: "قسم الصيدلة والأدوية والمستندات الطبية"
    }
  });

  console.log(`Pharmacy category verified: ID = ${pharmacyCategory.id}`);

  // 2. Fetch all existing pharmacy sections and their images
  const sections = await prisma.pharmacySection.findMany({
    include: {
      images: true
    }
  });

  console.log(`Found ${sections.length} pharmacy sections to migrate.`);

  let migratedSectionsCount = 0;
  let migratedImagesCount = 0;

  for (const sec of sections) {
    // Generate a unique and safe slug
    const baseSlug = sec.name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
    const subjectSlug = `${baseSlug}-${sec.id.substring(0, 8)}`;

    // Create Subject
    const subject = await prisma.subject.upsert({
      where: { id: sec.id },
      update: {
        name: sec.name,
        description: sec.description,
        categoryId: pharmacyCategory.id,
      },
      create: {
        id: sec.id,
        name: sec.name,
        slug: subjectSlug,
        description: sec.description,
        categoryId: pharmacyCategory.id,
      }
    });

    migratedSectionsCount++;

    // Create Lessons for each image
    for (const img of sec.images) {
      const imgBaseSlug = (img.title || "image").toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
      const lessonSlug = `${imgBaseSlug}-${img.id.substring(0, 8)}`;

      const lesson = await prisma.lesson.upsert({
        where: { id: img.id },
        update: {
          title: img.title || "صورة / ملف",
          description: img.description,
          thumbnail: img.url,
          pdfUrl: img.url,
          subjectId: subject.id,
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

      // Also ensure a Resource record exists for it
      await prisma.resource.upsert({
        where: { id: `res-${img.id}` },
        update: {
          title: img.title || "ملف",
          url: img.url,
        },
        create: {
          id: `res-${img.id}`,
          title: img.title || "ملف",
          type: "IMAGE",
          url: img.url,
          lessonId: lesson.id
        }
      });

      migratedImagesCount++;
    }
  }

  console.log(`Migration completed successfully! 🎉`);
  console.log(`Migrated ${migratedSectionsCount} sections to Subjects.`);
  console.log(`Migrated ${migratedImagesCount} images to Lessons.`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
