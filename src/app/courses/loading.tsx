import { CategoryCardSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading skeleton لصفحة السنوات الدراسية /courses
 */
export default function CoursesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 animate-pulse">

      {/* Page Header Skeleton */}
      <div className="max-w-4xl mx-auto mb-16 text-center space-y-5">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
        <div className="h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
        <div className="h-14 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
        <div className="h-5 w-full max-w-lg bg-slate-100 dark:bg-slate-900 rounded-lg mx-auto" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
