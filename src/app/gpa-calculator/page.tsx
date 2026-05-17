import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import GPACalculatorClient from "./GPACalculatorClient";

export default async function GPACalculatorPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  
  let initialData = null;
  if (userId) {
    try {
      const saved = await (prisma as any).gPACalculation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });
      if (saved && saved.length > 0) {
        initialData = saved.map((s: any) => ({
          gpa: s.gpa,
          data: JSON.parse(s.subjects),
          createdAt: s.createdAt
        }));
      }
    } catch (error) {
      console.error("Database connection failed, using offline mode:", error);
      // Fail silently for user to still use the calculator
    }
  }

  let gpaYears = [];
  try {
    gpaYears = await (prisma as any).gpaYear.findMany({
      include: { subjects: true },
      orderBy: { createdAt: "asc" }
    });
  } catch (error) {
    console.error("Error fetching GPA years:", error);
  }

  return <GPACalculatorClient userId={userId || null} initialData={JSON.parse(JSON.stringify(initialData))} gpaYears={JSON.parse(JSON.stringify(gpaYears))} />;
}
