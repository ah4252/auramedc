"use server";

import { prisma } from "@/lib/db";

export async function getSocialUsers() {
  try {
    // Use Raw SQL to bypass Prisma Client sync issues
    const users: any[] = await prisma.$queryRaw`
      SELECT id, name, email, image, telegram, instagram, facebook, "createdAt" 
      FROM "User" 
      WHERE telegram IS NOT NULL 
         OR instagram IS NOT NULL 
         OR facebook IS NOT NULL
      ORDER BY "createdAt" DESC
    `;

    // Filter out potential empty strings that SQL might not catch as NULL
    return users.filter(u => 
      (u.telegram && u.telegram.trim() !== "") || 
      (u.instagram && u.instagram.trim() !== "") || 
      (u.facebook && u.facebook.trim() !== "")
    );
  } catch (error) {
    console.error("Error fetching social users:", error);
    return [];
  }
}
