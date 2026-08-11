import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma, isDatabaseEnabled } from "@/lib/db";
import { isAdmin as checkIsAdmin } from "@/lib/auth-helpers";
import { getPharmacySections } from "@/app/actions/pharmacy";
import PharmacyClient from "./PharmacyClient";
import { tServer, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata = async (): Promise<Metadata> => {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as Locale) || "ar";

  return {
    title: tServer("pharmacy_page_title", siteLang, "Pharmacie"),
    description: tServer("pharmacy_page_description", siteLang, "Découvrez les sections et les médicaments disponibles dans AuraMed Elite"),
  };
};

export default async function PharmacyPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  const admin = await checkIsAdmin();

  let canAccessPharmacy = admin;

  if (!canAccessPharmacy && userId && isDatabaseEnabled()) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { studyYear: true },
    });
    if (user && user.studyYear && (user.studyYear.includes("الثالثة") || user.studyYear.includes("3"))) {
      canAccessPharmacy = true;
    }
  }

  if (!canAccessPharmacy) {
    redirect("/courses");
  }

  const sections = await getPharmacySections();
  return <PharmacyClient sections={sections} />;
}
