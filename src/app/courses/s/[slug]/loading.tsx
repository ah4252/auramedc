import { LessonListItemSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading skeleton لصفحة قائمة الدروس /courses/s/[slug]
 * يعكس تصميم LessonsClient بدقة
 */
export default function SubjectLessonsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 animate-pulse" dir="rtl">
      {/* Back button */}
      <div className="mb-10 flex items-center justify-between">
        <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main lessons list */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-11 w-full sm:max-w-xs bg-slate-100 dark:bg-slate-900 rounded-2xl" />
          </div>

          {/* Lesson items */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <LessonListItemSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 order-1 lg:order-2 sticky top-24">
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
              <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
              <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-900 rounded-lg" />
              <div className="w-full space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                  <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
