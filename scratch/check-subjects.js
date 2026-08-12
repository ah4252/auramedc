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

async function run() {
  const subjects = await prisma.subject.findMany({
    include: {
      category: true,
      _count: {
        select: {
          lessons: true
        }
      }
    }
  });

  console.log("Total subjects:", subjects.length);
  console.log("Subjects breakdown by category:");
  const byCat = {};
  subjects.forEach(s => {
    const catName = s.category ? s.category.name : 'NO CATEGORY';
    if (!byCat[catName]) byCat[catName] = [];
    byCat[catName].push({ name: s.name, lessonsCount: s._count.lessons });
  });
  console.log(JSON.stringify(byCat, null, 2));

  // Count subjects with at least 1 lesson
  const subjectsWithLessons = subjects.filter(s => s._count.lessons > 0);
  console.log("\nSubjects with at least 1 lesson:", subjectsWithLessons.length);

  // Count subjects with published lessons
  const subjectsWithPublishedLessons = await prisma.subject.count({
    where: {
      lessons: {
        some: {
          isPublished: true
        }
      }
    }
  });
  console.log("Subjects with at least 1 published lesson:", subjectsWithPublishedLessons);

  await prisma.$disconnect();
}

run();
