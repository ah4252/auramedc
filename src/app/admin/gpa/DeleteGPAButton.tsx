"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteGPACalculation } from "@/app/actions/content";

export default function DeleteGPAButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذه النتيجة؟")) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteGPACalculation(id);
      if (result?.error) {
        alert(result.error);
      }
    } catch (error) {
      alert("حدث خطأ ما");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
      title="حذف النتيجة"
    >
      {isDeleting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
    </button>
  );
}
