import { Suspense } from "react";
import { getCategories } from "@/app/actions/content";
import { getPharmacySections } from "@/app/actions/pharmacy";
import { getQcmsYears, getDevFeaturedYears } from "@/app/actions/qcmsAdmin";
import { canAccessPharmacy } from "@/lib/auth-helpers";
import YearsClient from "./components/YearsClient";

export default async function CoursesPage() {
  const canViewPharmacy = await canAccessPharmacy();
  const [yearCategories, pharmacyCategories, qcmsYears, devFeaturedYears] = await Promise.all([
    getCategories("YEAR"),
    canViewPharmacy ? getPharmacySections() : Promise.resolve([]),
    getQcmsYears(),
    getDevFeaturedYears(),
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-slate-400 font-bold">جاري التحميل...</div>}>
      <YearsClient 
        yearCategories={JSON.parse(JSON.stringify(yearCategories))} 
        pharmacyCategories={JSON.parse(JSON.stringify(pharmacyCategories))} 
        qcmsYears={JSON.parse(JSON.stringify(qcmsYears))}
        devFeaturedYears={JSON.parse(JSON.stringify(devFeaturedYears))}
        canViewPharmacy={canViewPharmacy}
      />
    </Suspense>
  );
}
