import { StatCardSkeleton, UserRowSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading skeleton للوحة تحكم الأدمن /admin
 */
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-10 pb-10 animate-pulse">

      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-48 bg-slate-100 dark:bg-slate-900 rounded-lg" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Quick actions + chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick actions */}
          <div className="space-y-4">
            <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  <div className="h-4 w-20 bg-slate-100 dark:bg-slate-900 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Chart card */}
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-2">
                <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 w-56 bg-slate-100 dark:bg-slate-900 rounded-lg" />
              </div>
              <div className="h-5 w-32 bg-slate-100 dark:bg-slate-900 rounded-lg" />
            </div>
            {/* Bar chart skeleton */}
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => {
                const heightClass = h === 40 ? "h-[40%]" : h === 70 ? "h-[70%]" : h === 45 ? "h-[45%]" : h === 90 ? "h-[90%]" : h === 65 ? "h-[65%]" : h === 85 ? "h-[85%]" : "h-full";
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div
                      className={`w-full max-w-[40px] bg-slate-200 dark:bg-slate-800 rounded-t-xl ${heightClass}`}
                    />
                    <div className="h-3 w-8 bg-slate-100 dark:bg-slate-900 rounded" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Recent activity */}
        <div>
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="h-7 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-2 flex-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <UserRowSkeleton key={i} />
              ))}
            </div>
            <div className="mt-8 h-12 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl" />
          </div>
        </div>

      </div>
    </div>
  );
}
