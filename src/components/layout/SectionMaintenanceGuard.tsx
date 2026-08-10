"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Hammer, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function SectionMaintenanceGuard({
  settings,
  children,
}: {
  settings: any;
  children: React.ReactNode;
}) {
  // ✅ Hooks are always called unconditionally - no early returns before this line
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine maintenance state AFTER all hooks
  const isAdmin = pathname.startsWith("/admin");

  let isUnderMaintenance = false;
  let sectionName = "";

  if (!isAdmin) {
    // قسم الصيدلة: يشمل /pharmacy و /courses?tab=pharmacy و /courses/pharmacy/[sectionId]
    const isPharmacyTab =
      pathname.startsWith("/courses") && searchParams.get("tab") === "pharmacy";
    const isPharmacyPage =
      pathname.startsWith("/pharmacy") || pathname.startsWith("/courses/pharmacy");

    if ((isPharmacyTab || isPharmacyPage) && settings.maintenancePharmacy) {
      isUnderMaintenance = true;
      sectionName = "قسم الصيدلة";
    } else if (pathname.startsWith("/courses") && !isPharmacyTab && settings.maintenanceCourses) {
      isUnderMaintenance = true;
      sectionName = "قسم المحاضرات";
    } else if (pathname.startsWith("/subjects") && settings.maintenanceSubjects) {
      isUnderMaintenance = true;
      sectionName = "قسم التخصصات";
    } else if (pathname.startsWith("/timetable") && settings.maintenanceTimetable) {
      isUnderMaintenance = true;
      sectionName = "الجدول الدراسي";
    } else if (pathname.startsWith("/gpa-calculator") && settings.maintenanceGpa) {
      isUnderMaintenance = true;
      sectionName = "حاسبة المعدل";
    } else if (pathname.startsWith("/news") && settings.maintenanceNews) {
      isUnderMaintenance = true;
      sectionName = "الأخبار والمستجدات";
    }
  }

  // ✅ Single return point — no conditional hooks violation
  return (
    <>
      {isUnderMaintenance ? (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 inline-block"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-red-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-600/20 rotate-12">
                  <Hammer className="w-10 h-10" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-red-500 border-4 border-slate-900">
                  <Clock className="w-5 h-5 animate-spin-slow" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
                <span className="text-red-500">{sectionName}</span> تحت الصيانة
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                عذراً، هذا القسم يخضع حالياً لعملية صيانة وتحديث. يرجى العودة
                لاحقاً.
              </p>

              <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-[2rem] inline-block text-right">
                <div className="flex items-center gap-3 text-red-500 font-bold mb-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>إشعار النظام</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  باقي أقسام المنصة تعمل بشكل طبيعي ويمكنك تصفحها.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

