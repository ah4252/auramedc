import { LessonCardSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading skeleton للصفحة الرئيسية
 * يُعرض تلقائياً بواسطة Next.js أثناء تحميل البيانات من DB
 */
export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">

      {/* Hero Section Skeleton */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded-full" />
          {/* Headline */}
          <div className="space-y-3 w-full max-w-3xl">
            <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-14 w-4/5 mx-auto bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          {/* Subtitle */}
          <div className="space-y-2 w-full max-w-xl">
            <div className="h-5 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
            <div className="h-5 w-5/6 mx-auto bg-slate-100 dark:bg-slate-900 rounded-lg" />
          </div>
          {/* CTA Buttons */}
          <div className="flex gap-4 mt-2">
            <div className="h-14 w-44 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="h-14 w-44 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Bar Skeleton */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4">
              <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-20 bg-slate-100 dark:bg-slate-900 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Feature Block Skeleton */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 dark:bg-dark-card rounded-[3rem] p-8 md:p-16 border border-slate-800 flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <div className="h-8 w-40 bg-slate-800 rounded-xl" />
              <div className="h-12 w-full bg-slate-800 rounded-2xl" />
              <div className="h-12 w-3/4 bg-slate-800 rounded-2xl" />
              <div className="h-5 w-full bg-slate-700 rounded-lg" />
              <div className="h-5 w-5/6 bg-slate-700 rounded-lg" />
              <div className="h-14 w-52 bg-slate-700 rounded-2xl mt-4" />
            </div>
            <div className="flex-1">
              <div className="w-full aspect-video bg-slate-800 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Lessons Skeleton */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <div className="h-9 w-52 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-5 w-72 bg-slate-100 dark:bg-slate-900 rounded-lg" />
          </div>
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg hidden md:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <LessonCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
