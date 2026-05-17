import { prisma } from "../src/lib/db";

async function checkGPA() {
  const calculations = await (prisma as any).gPACalculation.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total Calculations: ${calculations.length}`);
  calculations.forEach((c: any) => {
    console.log(`User: ${c.userId}, GPA: ${c.gpa}, Date: ${c.createdAt}`);
  });
}

checkGPA();
