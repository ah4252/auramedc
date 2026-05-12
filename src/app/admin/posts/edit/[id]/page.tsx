import { prisma } from "@/lib/prisma";
import { getCategories } from "@/app/actions/content";
import { notFound } from "next/navigation";
import EditLessonForm from "./EditLessonForm";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { 
      subject: true,
      resources: true 
    }
  });

  if (!lesson) {
    notFound();
  }

  const categories = await getCategories();

  return <EditLessonForm lesson={lesson} categories={categories} />;
}
