import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { tServer, type Locale } from "@/lib/i18n";
import SectionClient from "./SectionClient";

export async function generateMetadata({ params }: { params: Promise<{ sectionId: string }> }) {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as Locale) || "ar";
  const { sectionId } = await params;
  const section = await (prisma as any).pharmacySection.findUnique({
    where: { id: sectionId },
  });

  if (!section) return { title: tServer("pharmacy_section_not_found_title", siteLang, "قسم غير موجود") };

  return {
    title: `${section.name} | AuraMed Elite`,
    description: section.description || tServer("pharmacy_section_description_meta", siteLang, "قسم الصيدلة في منصة AuraMed Elite"),
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
