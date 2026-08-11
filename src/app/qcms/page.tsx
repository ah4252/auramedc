import { Suspense } from "react";
import QcmsClient from "./QcmsClient";

export const metadata = {
  title: "QCMs",
  description: "قسم اختبارات QCMs الخاص بالمنصة",
};

export default function QcmsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-400">جاري التحميل...</div>}>
      <QcmsClient />
    </Suspense>
  );
}
