import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [latestNews, latestLesson] = await Promise.all([
      prisma.news.findFirst({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.lesson.findFirst({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
      }),
    ]);

    const items = [
      latestNews
        ? { id: `news_${latestNews.id}`, title: "خبر جديد 📰", body: latestNews.title, url: "/news", createdAt: latestNews.createdAt }
        : null,
      latestLesson
        ? { id: `lesson_${latestLesson.id}`, title: "درس جديد 📚", body: latestLesson.title, url: "/courses", createdAt: latestLesson.createdAt }
        : null,
    ].filter(Boolean) as { id: string; title: string; body: string; url: string; createdAt: Date }[];

    if (items.length === 0) {
      return NextResponse.json({ id: null });
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latest = items[0];

    return NextResponse.json(latest);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
