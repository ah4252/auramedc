const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

try {
  const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
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

async function listAllSubjects() {
  const subjects = await prisma.subject.findMany({
    include: {
      category: true,
      _count: {
        select: { lessons: true }
      }
    },
    orderBy: { categoryId: 'asc' }
  });

  console.log("=== ALL 47 SUBJECTS IN DATABASE ===");
  subjects.forEach((s, index) => {
    console.log(`${index + 1}. [${s.category ? s.category.name : 'No Category'}] ${s.name} (Slug: ${s.slug}) - Lessons count: ${s._count.lessons}`);
  });

  await prisma.$disconnect();
}

listAllSubjects();
