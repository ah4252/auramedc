import { getLessons, getCategories, getSubjects } from "@/app/actions/content";
import ContentManagerClient from "./ContentManagerClient";

export default async function AdminPostsPage() {
  const lessons = await getLessons();
  const categories = await getCategories();
  const subjects = await getSubjects();

  return (
    <ContentManagerClient 
      initialLessons={lessons} 
      categories={categories} 
      initialSubjects={subjects} 
    />
  );
}
