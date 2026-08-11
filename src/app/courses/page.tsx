import { Suspense } from "react";
import { cookies } from "next/headers";
import { prisma, isDatabaseEnabled } from "@/lib/db";
import { getCategories } from "@/app/actions/content";
import { getPharmacySections } from "@/app/actions/pharmacy";
import YearsClient from "./components/YearsClient";

export default async function CoursesPage() {
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

  const [yearCategories, pharmacyCategories] = await Promise.all([
    getCategories("YEAR"),
    canAccessPharmacy ? getPharmacySections() : Promise.resolve([])
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-slate-400 font-bold">جاري التحميل...</div>}>
      <YearsClient 
        yearCategories={JSON.parse(JSON.stringify(yearCategories))} 
        pharmacyCategories={JSON.parse(JSON.stringify(pharmacyCategories))}
        canAccessPharmacy={canAccessPharmacy}
      />
    </Suspense>
  );
}
