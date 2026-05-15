"use client";

import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
}

/** المكون الأساسي مع shimmer effect */
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg",
        className
      )}
    />
  );
}

/** بطاقة درس skeleton — Grid layout */
export function LessonCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="h-48 w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-full animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
        <div className="h-4 w-2/3 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <div className="h-9 w-28 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** بطاقة سنة دراسية / تخصص skeleton */
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="w-16 h-16 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-7 w-2/3 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="h-4 w-full animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
      <div className="h-4 w-5/6 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
      <div className="h-4 w-4/6 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="h-5 w-40 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

/** إحصائية skeleton */
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-[2rem] p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-6 w-16 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
        <div className="h-10 w-20 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

/** عنصر درس في القائمة skeleton */
export function LessonListItemSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-4 sm:p-6 border border-slate-200 dark:border-slate-800 flex gap-6">
      <div className="w-48 h-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl shrink-0 hidden sm:block" />
      <div className="flex-1 space-y-3 py-2">
        <div className="h-6 w-3/4 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-full animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
        <div className="h-4 w-2/3 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
        <div className="flex gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
          <div className="h-5 w-20 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
          <div className="h-5 w-24 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** مستخدم في قائمة الأدمن */
export function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl">
      <div className="w-12 h-12 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-3 w-48 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" />
      </div>
      <div className="h-8 w-20 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-full" />
    </div>
  );
}
