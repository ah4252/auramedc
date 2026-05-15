/**
 * Loading skeleton لصفحة مشاهدة الدرس /courses/v/[slug]
 * يعكس تصميم LessonDetailsPage بدقة
 */
export default function LessonVideoLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-4 sm:py-8 animate-pulse">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Breadcrumb skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
          <div className="h-10 w-44 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-4 bg-slate-100 dark:bg-slate-900 rounded" />
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Main video + info column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video player skeleton */}
            <div className="w-full aspect-video bg-slate-300 dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl" />

            {/* Lesson info card skeleton */}
            <div className="bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="h-9 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-10 w-28 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-28 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                <div className="h-7 w-24 bg-slate-100 dark:bg-slate-900 rounded-lg" />
              </div>
              {/* Description lines */}
              <div className="space-y-2 pt-2">
                <div className="h-5 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
                <div className="h-5 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
                <div className="h-5 w-3/4 bg-slate-100 dark:bg-slate-900 rounded-lg" />
              </div>
              {/* Author row */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-3 w-24 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — attachments skeleton */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                      <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
