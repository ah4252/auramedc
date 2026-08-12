const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^"(.*)"$/, '$1');
      if (!process.env[key]) process.env[key] = value;
    }
  });
} catch (e) {}

const prisma = new PrismaClient();

async function testUpdate() {
  try {
    const updated = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: { maintenanceCourses: false },
      create: { id: "global", maintenanceCourses: false },
    });
    console.log("SUCCESS:", updated.maintenanceCourses);
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
