import { getLessonsBySubjectSlug } from "@/app/actions/content";
import { notFound } from "next/navigation";
import SubjectContentClient from "../../components/SubjectContentClient";

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const subject = await getLessonsBySubjectSlug(decodedSlug);
  
  if (!subject) {
    notFound();
  }

  return <SubjectContentClient subject={JSON.parse(JSON.stringify(subject))} />;
}
