import { cookies } from "next/headers";
import { prisma, isDatabaseEnabled } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { tServer, type Locale } from "@/lib/i18n";
import SectionClient from "./SectionClient";

export async function generateMetadata({ params }: { params: Promise<{ sectionId: string }> }) {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as Locale) || "ar";
  const { sectionId } = await params;
  const section = await prisma.subject.findUnique({
    where: { id: sectionId },
  });

  if (!section) return { title: tServer("pharmacy_section_not_found_title", siteLang, "Section not found") };

  return {
    title: `${section.name} | AuraMed Elite`,
    description: section.description || tServer("pharmacy_section_description_meta", siteLang, "Pharmacy section in AuraMed Elite"),
  };
}

export default async function PharmacySectionPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  const isAdmin = !!cookieStore.get("admin_token");

  let canAccessPharmacy = isAdmin;

  if (!canAccessPharmacy && userId && isDatabaseEnabled()) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { studyYear: true },
    });
    if (user && user.studyYear && user.studyYear.trim().includes("الثالثة")) {
      canAccessPharmacy = true;
    }
  }

  if (!canAccessPharmacy) {
    redirect("/courses");
  }

  const { sectionId } = await params;
  const section = await prisma.subject.findUnique({
    where: { id: sectionId },
    include: {
      lessons: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!section) return notFound();

  // Map to old PharmacySection/PharmacyImage shape for the client component
  const mappedSection = {
    id: section.id,
    name: section.name,
    description: section.description,
    imageUrl: section.lessons[0]?.thumbnail || null,
    order: 0,
    images: section.lessons.map(l => ({
      id: l.id,
      title: l.title,
      url: l.pdfUrl || l.thumbnail || "",
      description: l.description,
      order: 0
    }))
  };

  return <SectionClient section={mappedSection} />;
}
