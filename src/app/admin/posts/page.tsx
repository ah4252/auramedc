import { getLessons, getCategories, getSubjects } from "@/app/actions/content";
import ContentManagerClient from "./ContentManagerClient";

export default async function AdminPostsPage() {
  const lessons = await getLessons();
  const categories = await getCategories();
  const subjects = await getSubjects();

  return (
    <ContentManagerClient 
      initialLessons={JSON.parse(JSON.stringify(lessons))} 
      categories={JSON.parse(JSON.stringify(categories))} 
      initialSubjects={JSON.parse(JSON.stringify(subjects))} 
    />
  );
}
