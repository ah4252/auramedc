import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  // Fetch real stats from database (Server-side)
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const [totalUsers, totalLessons, lessonsWithFiles, allLessons, recentUsers, onlineUsers] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count(),
    prisma.lesson.count({
      where: {
        OR: [
          { pdfUrl: { not: "" } },
          { summaryUrl: { not: "" } }
        ]
      }
    }),
    prisma.lesson.findMany({ select: { views: true } }),
    prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: { name: true, createdAt: true, image: true, email: true }
    }),
    prisma.progress.groupBy({
      by: ['userId'],
      where: {
        updatedAt: { gte: fifteenMinutesAgo }
      }
    })
  ]);

  const totalViews = allLessons.reduce((sum, lesson) => sum + lesson.views, 0);

  return (
    <DashboardClient 
      stats={{
        totalUsers,
        totalLessons,
        totalViews,
        lessonsWithFiles,
        onlineCount: onlineUsers.length || 0
      }}
      recentUsers={recentUsers}
    />
  );
}
