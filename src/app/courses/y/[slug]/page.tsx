import { getSubjectsByCategorySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";
import SubjectsClient from "../../components/SubjectsClient";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const category = await getSubjectsByCategorySlug(decodedSlug);
  
  if (!category) {
    notFound();
  }

  return <SubjectsClient category={category} />;
}
