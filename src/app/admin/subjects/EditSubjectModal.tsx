"use client";

import { useState } from "react";
import { updateSubject } from "@/app/actions/content";
import { Edit2, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Subject = {
  id: string;
  name: string;
  description?: string | null;
};

export default function EditSubjectModal({ subject }: { subject: Subject }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await updateSubject(subject.id, formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        title="تعديل"
        aria-label="تعديل"
      >
        <Edit2 className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                title="إغلاق"
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold">تعديل المادة</h2>
                <p className="text-slate-500 mt-1">تحديث بيانات {subject.name}</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 text-center">
                  {error}
                </div>
              )}

              <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">اسم المادة</label>
                  <input
                    name="name"
                    defaultValue={subject.name}
                    placeholder="اسم المادة"
                    required
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">وصف المادة</label>
                  <textarea
                    name="description"
                    defaultValue={subject.description || ""}
                    placeholder="وصف المادة"
                    rows={3}
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
