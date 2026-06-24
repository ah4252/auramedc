import { getPharmacySections } from "@/app/actions/pharmacy";
import PharmacyAdminClient from "./PharmacyAdminClient";

export const metadata = {
  title: "إدارة الصيدلة",
};

export default async function PharmacyAdminPage() {
  const sections = await getPharmacySections();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PharmacyAdminClient sections={sections} />
    </div>
  );
}
