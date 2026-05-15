import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'Discussion'
  `;
  console.log("Columns:", result);

  const rows = await prisma.$queryRaw`
    SELECT id, title, "subjectId", "categoryId", "createdAt" 
    FROM "Discussion" 
    ORDER BY "createdAt" DESC 
    LIMIT 5
  `;
  console.log("Rows:", rows);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
