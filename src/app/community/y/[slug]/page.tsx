import CommunityClient from "../../CommunityClient";
import CommunityAccessClient from "../../CommunityAccessClient";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getDiscussions } from "@/app/actions/community";

export const dynamic = "force-dynamic";

export default async function CommunityYearPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug },
    include: {
      subjects: {
        select: { id: true }
      }
    }
  });

  if (!category) {
    notFound();
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  
  // Fetch discussions for this specific category (Year)
  const [discussions, subjects] = await Promise.all([
    getDiscussions(undefined, category.id),
    prisma.subject.findMany({
        where: { categoryId: category.id },
        select: { id: true, name: true }
    })
  ]);

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true }
    });
  }

  return (
    <CommunityAccessClient categorySlug={category.slug} requiredPassword={category.communityPassword}>
      <CommunityClient 
        initialDiscussions={JSON.parse(JSON.stringify(discussions))} 
        subjects={JSON.parse(JSON.stringify(subjects))} 
        user={user}
        categoryId={category.id}
        categoryName={category.name}
      />
    </CommunityAccessClient>
  );
}
