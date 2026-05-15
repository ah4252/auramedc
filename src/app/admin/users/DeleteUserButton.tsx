"use client";

import { deleteUser } from "@/app/actions/content";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteUserButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا الطالب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    
    setLoading(true);
    const res = await deleteUser(id);
    if (res.error) alert(res.error);
    setLoading(false);
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
      title="حذف المستخدم"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
    </button>
  );
}
