import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const category = await prisma.category.findFirst();
    if (!category) throw new Error("No category found");

    console.log("Creating test discussion...");
    const d = await prisma.discussion.create({
      data: {
        title: "Test Discussion",
        content: "This is a test",
        userId: user.id,
        categoryId: category.id
      }
    });
    console.log("Success:", d);
    
    // Clean up
    await prisma.discussion.delete({ where: { id: d.id } });
    console.log("Cleaned up");
  } catch (e: any) {
    console.error("Failed:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
