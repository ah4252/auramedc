/**
 * Loading skeleton لصفحة حاسبة المعدل /gpa-calculator
 */
export default function GPACalculatorLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-12 animate-pulse">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Page header */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl mx-auto" />
          <div className="h-12 w-72 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
          <div className="h-5 w-96 bg-slate-100 dark:bg-slate-900 rounded-lg mx-auto" />
        </div>

        {/* Main calculator card */}
        <div className="bg-white dark:bg-dark-card rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">

          {/* Subject rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex-1 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="w-24 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="w-28 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl" />
            </div>
          ))}

          {/* Add row button */}
          <div className="h-14 w-48 bg-slate-100 dark:bg-slate-900 rounded-2xl" />

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Result area */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8">
            <div className="space-y-3">
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-20 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-14 w-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
