/**
 * Loading skeleton لصفحة الجدول الدراسي /timetable
 */
export default function TimetableLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-8 animate-pulse">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-11 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-5 w-80 bg-slate-100 dark:bg-slate-900 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-12 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>

        {/* Timetable grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 p-3"
            >
              {i % 5 === 0 && (
                <div className="h-full bg-medical-100 dark:bg-medical-900/20 rounded-xl" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom toolbar */}
        <div className="mt-8 flex gap-4 justify-end">
          <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
