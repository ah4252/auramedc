import CommunityClient from "@/app/community/CommunityClient";
import CommunityAccessClient from "@/app/community/CommunityAccessClient";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getDiscussions } from "@/app/actions/community";
import CommunityLoginRequired from "@/app/community/CommunityLoginRequired";

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
  const adminToken = cookieStore.get("admin_token")?.value;

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true, role: true }
    });
  }

  if (!user && adminToken === "secure_session_token") {
    user = {
      id: "secure_session_token",
      name: "المشرف العام",
      image: null,
      role: "ADMIN"
    };
  }

  if (!user) {
    return <CommunityLoginRequired />;
  }
  
  // Fetch discussions for this specific category (Year)
  const [discussions, subjects] = await Promise.all([
    getDiscussions(undefined, category.id),
    prisma.subject.findMany({
        where: { categoryId: category.id },
        select: { id: true, name: true }
    })
  ]);

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
