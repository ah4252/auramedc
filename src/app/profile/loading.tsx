export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto mb-6" />
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 mx-auto mb-2 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 dark:bg-slate-900 mx-auto mb-6 rounded-lg" />
            
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 w-full space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 h-32" />
            ))}
          </div>

          {/* Large Card Skeleton */}
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 h-64" />
          
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 h-48" />
        </main>
      </div>
    </div>
  );
}
