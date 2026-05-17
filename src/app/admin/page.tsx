import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // Directly redirect root admin path to the news admin page (/admin/news)
  redirect("/admin/news");
}
