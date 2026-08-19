import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPharmacySections } from "@/app/actions/pharmacy";
import PharmacyClient from "./PharmacyClient";
import { canAccessPharmacy, getCurrentUserId } from "@/lib/auth-helpers";
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
  const userId = await getCurrentUserId();
  const hasAccess = await canAccessPharmacy();

  if (!hasAccess) {
    redirect(userId ? "/courses" : "/login");
  }

  const sections = await getPharmacySections();
  return <PharmacyClient sections={sections} />;
}
