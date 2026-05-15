import { prisma } from "@/lib/prisma";
import SubjectsClient from "./SubjectsClient";

export default async function SubjectsPage() {
  // Fetch only categories of type SPECIALTY
  const categoriesRaw = await prisma.category.findMany({
    where: { type: "SPECIALTY" },
    include: {
      subjects: {
        include: {
          _count: {
            select: { lessons: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Map to a simpler structure for the client
  const categories = categoriesRaw.map(cat => {
    const totalLessons = cat.subjects.reduce((sum, subject) => sum + subject._count.lessons, 0);
    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
      lessonCount: totalLessons
    };
  });

  return <SubjectsClient categories={categories} />;
}
