import { getCategories } from "@/app/actions/content";
import YearsClient from "./components/YearsClient";

export default async function CoursesPage() {
  const categories = await getCategories("YEAR");

  return <YearsClient categories={JSON.parse(JSON.stringify(categories))} />;
}
