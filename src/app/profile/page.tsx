import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { getUserIdFromCookies } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { getNews } from "@/app/actions/news";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = getUserIdFromCookies(cookieStore);

  if (!userId) {
    redirect("/login");
  }

  const [user, progress, favorites, gpaCalculations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        studyYear: true,
        wilaya: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        facebook: true,
        instagram: true,
        telegram: true,
        passwordChangedAt: true,
        lastActiveAt: true,
        lastReadNewsAt: true,
      },
    }),
    prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
      },
    }),
    (prisma as any).gpaCalculation 
      ? (prisma as any).gpaCalculation.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  if (user) {
    (user as any).progress = progress;
    (user as any).favorites = favorites;
    (user as any).gpaCalculations = gpaCalculations;
  }

  if (!user) {
    redirect("/login");
  }


  const news = await getNews(true);

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 max-w-5xl flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto mb-6" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto" />
          </div>
        </div>
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-pulse" />)}
          </div>
          <div className="h-64 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
        </div>
      </div>
    }>
      <ProfileClient user={JSON.parse(JSON.stringify(user))} news={news} />
    </Suspense>
  );
}
