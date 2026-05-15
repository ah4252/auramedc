import { CategoryCardSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading skeleton لصفحة التخصصات /subjects
 */
export default function SubjectsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg animate-pulse">
      {/* Hero header skeleton */}
      <section className="py-20 bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center space-y-5 max-w-3xl">
          <div className="h-9 w-52 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
          <div className="h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
          <div className="h-5 w-full bg-slate-100 dark:bg-slate-900 rounded-lg mx-auto" />
          <div className="h-5 w-4/5 bg-slate-100 dark:bg-slate-900 rounded-lg mx-auto" />
        </div>
      </section>

      {/* Filter tabs skeleton */}
      <section className="py-8 bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 flex gap-3 justify-center flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </section>

      {/* Cards grid skeleton */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
