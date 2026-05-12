import { getLessons, getCategories } from "@/app/actions/content";
import DeleteButton from "./DeleteButton";
import { FileEdit, BookOpen, Video } from "lucide-react";
import Link from "next/link";
import EditCategoryModal from "../subjects/EditCategoryModal";

export default async function AdminPostsPage() {
  const lessons = await getLessons();
  const categories = await getCategories();

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 rounded-xl">
          <FileEdit className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold">إدارة المنشورات (تعديل / حذف)</h1>
      </div>
      
      {/* Lessons Section */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Video className="w-5 h-5 text-medical-600" />
            الدروس والمحاضرات المنشورة
          </h2>
          <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 text-sm font-bold px-3 py-1 rounded-full">
            {lessons.length} درس
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 text-sm">
                <th className="p-4 font-medium">عنوان الدرس والموارد</th>
                <th className="p-4 font-medium">السنة الدراسية</th>
                <th className="p-4 font-medium">تاريخ النشر</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lessons.map((lesson: any) => (
                <tr key={lesson.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <Link href={`/courses/${lesson.slug}`} target="_blank" className="font-bold text-slate-900 dark:text-white hover:text-medical-600 transition-colors mb-1">
                        {lesson.title}
                      </Link>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                          <Video className="w-3 h-3" />
                          {lesson.resources?.filter((r: any) => r.type === "VIDEO").length || 0} فيديو
                        </div>
                        <div className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                          <BookOpen className="w-3 h-3" />
                          {lesson.resources?.filter((r: any) => r.type === "PDF" || r.type === "SUMMARY").length || 0} ملفات
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold">
                      {lesson.subject?.category?.name || "عام"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm" dir="ltr">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/posts/edit/${lesson.id}`}
                        className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        title="تعديل"
                      >
                        <FileEdit className="w-5 h-5" />
                      </Link>
                      <DeleteButton id={lesson.id} type="lesson" />
                    </div>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    لا توجد دروس منشورة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-medical-600" />
            السنوات الدراسية (الأقسام)
          </h2>
          <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 text-sm font-bold px-3 py-1 rounded-full">
            {categories.length} قسم
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 text-sm">
                <th className="p-4 font-medium">اسم السنة الدراسية</th>
                <th className="p-4 font-medium">الوصف</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {cat.description || "-"}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <EditCategoryModal category={cat} />
                    <DeleteButton id={cat.id} type="category" />
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    لا توجد سنوات دراسية منشورة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
