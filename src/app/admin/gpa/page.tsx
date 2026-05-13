import { Calculator } from "lucide-react";
import { getAllGPACalculations } from "@/app/actions/content";
import GPAListClient from "./GPAListClient";

export default async function AdminGPAPage() {
  const calculations = await getAllGPACalculations();

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold">إدارة حسابات المعدل</h1>
      </div>

      <GPAListClient initialCalculations={calculations} />
    </div>
  );
}
