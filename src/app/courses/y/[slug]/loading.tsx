/**
 * Loading skeleton لصفحة المواد في سنة دراسية /courses/y/[slug]
 * يعكس تصميم SubjectsClient بدقة
 */
export default function YearSubjectsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 animate-pulse">

      {/* Back button skeleton */}
      <div className="mb-10">
        <div className="h-9 w-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      {/* Page header */}
      <div className="mb-12 space-y-3">
        <div className="h-11 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-5 w-96 bg-slate-100 dark:bg-slate-900 rounded-lg" />
      </div>

      {/* Subject cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Icon */}
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            {/* Title */}
            <div className="h-7 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            {/* Desc lines */}
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
            <div className="h-4 w-4/5 bg-slate-100 dark:bg-slate-900 rounded-lg" />
            {/* Meta */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-5 w-16 bg-slate-100 dark:bg-slate-900 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
