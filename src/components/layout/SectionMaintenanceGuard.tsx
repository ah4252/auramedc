"use client";

import { useState, useEffect } from "react";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentQuery, setCurrentQuery] = useState(searchParams.get("tab"));

  useEffect(() => {
    setCurrentQuery(searchParams.get("tab"));
  }, [searchParams]);

  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setCurrentQuery(urlParams.get("tab"));
    };
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // Determine maintenance state AFTER all hooks
  const isAdmin = pathname.startsWith("/admin");

  let isUnderMaintenance = false;
  let sectionName = "";

  if (!isAdmin) {
    // قسم الصيدلة: يشمل /pharmacy و /courses?tab=pharmacy و /courses/pharmacy/[sectionId]
    const activeTab = currentQuery || searchParams.get("tab");
    const isPharmacyTab = pathname.startsWith("/courses") && activeTab === "pharmacy";
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

  return (
    <>
      {isUnderMaintenance && (
        <div className="py-12 px-4 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center relative z-10 bg-white/50 dark:bg-slate-900/50 p-8 sm:p-12 rounded-[2.5rem] border border-red-500/20 shadow-xl backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-red-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20 rotate-12">
                  <Hammer className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-red-500 border-2 border-slate-900">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                <span className="text-red-500">{sectionName}</span> تحت الصيانة
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium">
                عذراً، هذا القسم يخضع حالياً لعملية صيانة وتحديث. يرجى العودة لاحقاً.
              </p>

              <div className="bg-slate-100 dark:bg-slate-800/80 p-5 rounded-2xl inline-block text-right border border-slate-200/50 dark:border-slate-700/50 mb-6">
                <div className="flex items-center gap-2.5 text-red-500 font-bold mb-1 text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>إشعار النظام</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                  باقي أقسام المنصة تعمل بشكل طبيعي ويمكنك تصفحها.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-black transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  العودة للصفحة السابقة
                </button>
                <a
                  href="/courses"
                  className="px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-sm font-black transition-all shadow-md shadow-medical-600/20 active:scale-95 flex items-center gap-2"
                >
                  الانتقال إلى السنوات الدراسية
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      {!isUnderMaintenance && children}
    </>
  );
}

