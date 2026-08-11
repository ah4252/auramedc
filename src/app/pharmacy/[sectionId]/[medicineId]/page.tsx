import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { canAccessPharmacy } from "@/lib/auth-helpers";
import { tServer, type Locale } from "@/lib/i18n";
import MedicineDetailClient from "./MedicineDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sectionId: string; medicineId: string }>;
}) {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as Locale) || "ar";
  const { medicineId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: medicineId },
    include: { subject: true },
  });

  if (!lesson) {
    return {
      title: tServer("pharmacy_section_not_found_title", siteLang, "Medicine not found"),
    };
  }

  return {
    title: `${lesson.title} | AuraMed Elite`,
    description: lesson.description || tServer("pharmacy_section_description_meta", siteLang, "Pharmacy medicine in AuraMed Elite"),
  };
}

export default async function PharmacyMedicinePage({
  params,
}: {
  params: Promise<{ sectionId: string; medicineId: string }>;
}) {
  const userId = (await cookies()).get("user_token")?.value ?? null;
  const hasAccess = await canAccessPharmacy();

  if (!hasAccess) {
    redirect(userId ? "/courses" : "/login");
  }

  const { sectionId, medicineId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: medicineId },
    include: {
      subject: true,
      resources: true,
    },
  });

  if (!lesson || lesson.subjectId !== sectionId) {
    return notFound();
  }

  return (
    <MedicineDetailClient
      lesson={{
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        indications: lesson.indications,
        sideEffects: lesson.sideEffects,
        ageLimit: lesson.ageLimit,
        pdfUrl: lesson.pdfUrl,
        thumbnail: lesson.thumbnail,
        views: lesson.views,
        isPublished: lesson.isPublished,
        subject: {
          id: lesson.subject.id,
          name: lesson.subject.name,
        },
        resources: lesson.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          url: resource.url,
        })),
      }}
      sectionId={sectionId}
    />
  );
}

