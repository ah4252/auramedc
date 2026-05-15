import { getDiscussions } from "@/app/actions/community";
import CommunityAdminClient from "../../CommunityAdminClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CommunityAdminYearPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug }
  });

  if (!category) {
    notFound();
  }
  
  // Fetch discussions for this specific category (Year)
  const discussions = await getDiscussions(undefined, category.id);

  return (
    <div className="animate-fade-in">
       <CommunityAdminClient 
          initialDiscussions={JSON.parse(JSON.stringify(discussions))} 
          categoryName={category.name} 
       />
    </div>
  );
}
