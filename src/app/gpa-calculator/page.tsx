import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import GPACalculatorClient from "./GPACalculatorClient";

export default async function GPACalculatorPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  
  let initialData = null;
  if (userId) {
    try {
      const saved = await (prisma as any).gPACalculation.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });
      if (saved) {
        initialData = {
          gpa: saved.gpa,
          subjects: JSON.parse(saved.subjects)
        };
      }
    } catch (error) {
      console.error("Database connection failed, using offline mode:", error);
      // Fail silently for user to still use the calculator
    }
  }

  return <GPACalculatorClient userId={userId || null} initialData={initialData} />;
}
