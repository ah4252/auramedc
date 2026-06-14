import { getSubjectsByCategorySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";
import SpecialtyDetailClient from "./SpecialtyDetailClient";

export default async function SpecialtyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const specialty = await getSubjectsByCategorySlug(decodedSlug);
  
  if (!specialty || specialty.type !== "SPECIALTY") {
    notFound();
  }

  return <SpecialtyDetailClient specialty={JSON.parse(JSON.stringify(specialty))} />;
}
