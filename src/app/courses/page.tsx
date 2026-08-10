import { Suspense } from "react";
import { getCategories } from "@/app/actions/content";
import { getPharmacySections } from "@/app/actions/pharmacy";
import YearsClient from "./components/YearsClient";

export default async function CoursesPage() {
  const [yearCategories, pharmacyCategories] = await Promise.all([
    getCategories("YEAR"),
    getPharmacySections()
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-slate-400 font-bold">جاري التحميل...</div>}>
      <YearsClient 
        yearCategories={JSON.parse(JSON.stringify(yearCategories))} 
        pharmacyCategories={JSON.parse(JSON.stringify(pharmacyCategories))} 
      />
    </Suspense>
  );
}
