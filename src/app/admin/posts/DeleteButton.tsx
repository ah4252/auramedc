"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteLesson, deleteCategory } from "@/app/actions/content";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, type }: { id: string, type: "lesson" | "category" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذه الخطوة.")) return;

    setLoading(true);
    let res;
    if (type === "lesson") {
      res = await deleteLesson(id);
    } else {
      res = await deleteCategory(id);
    }

    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
      title="حذف"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
