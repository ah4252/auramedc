import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SectionClient from "./SectionClient";

export async function generateMetadata({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params;
  const section = await (prisma as any).pharmacySection.findUnique({
    where: { id: sectionId },
  });

  if (!section) return { title: "قسم غير موجود" };

  return {
    title: `${section.name} | AuraMed Elite`,
    description: section.description || "قسم الصيدلة في منصة AuraMed Elite",
  };
}

export default async function PharmacySectionPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params;
  const section = await (prisma as any).pharmacySection.findUnique({
    where: { id: sectionId },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!section) return notFound();

  return <SectionClient section={section} />;
}
