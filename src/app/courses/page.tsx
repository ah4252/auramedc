import { getCategories, getLessons } from "@/app/actions/content";
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  const categories = await getCategories("YEAR");
  const lessons = await getLessons();

  return <CoursesClient categories={categories} lessons={lessons} />;
}
