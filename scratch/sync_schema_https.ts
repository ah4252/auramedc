import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function syncSchema() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL not found");

  const pool = new Pool({ connectionString });
  
  console.log("Connecting to database via HTTPS/WebSocket...");
  
  try {
    // 1. Check if categoryId exists in Discussion
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Discussion' AND column_name = 'categoryId'
    `);

    if (checkColumn.rowCount === 0) {
      console.log("Adding categoryId column to Discussion table...");
      await pool.query(`
        ALTER TABLE "Discussion" ADD COLUMN "categoryId" TEXT;
      `);
      console.log("Column added successfully.");
    } else {
      console.log("categoryId column already exists.");
    }

    // 2. Add foreign key if possible (optional but good)
    try {
      await pool.query(`
        ALTER TABLE "Discussion" 
        ADD CONSTRAINT "Discussion_categoryId_fkey" 
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log("Foreign key constraint added.");
    } catch (e) {
      console.log("Foreign key might already exist or Category table missing id.");
    }

    console.log("Schema sync complete!");
  } catch (error: any) {
    console.error("Sync failed:", error.message);
  } finally {
    await pool.end();
  }
}

syncSchema();
