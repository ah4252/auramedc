import { getPharmacySections } from "@/app/actions/pharmacy";
import PharmacyClient from "./PharmacyClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصيدلة",
  description: "استعرض أقسام الصيدلة والمواد الدوائية المتاحة في منصة AuraMed Elite",
};

export default async function PharmacyPage() {
  const sections = await getPharmacySections();
  return <PharmacyClient sections={sections} />;
}
