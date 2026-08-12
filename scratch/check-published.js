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

async function checkPublished() {
  const totalLessons = await prisma.lesson.count();
  const publishedLessons = await prisma.lesson.count({ where: { isPublished: true } });
  
  const totalSubjects = await prisma.subject.count();
  const subjectsWithLessons = await prisma.subject.count({
    where: {
      lessons: {
        some: {}
      }
    }
  });

  const subjectsWithPublishedLessons = await prisma.subject.count({
    where: {
      lessons: {
        some: {
          isPublished: true
        }
      }
    }
  });

  console.log({
    totalLessons,
    publishedLessons,
    totalSubjects,
    subjectsWithLessons,
    subjectsWithPublishedLessons
  });

  // Let's also check if subjects themselves have any isPublished field or category isPublished field
  const sampleLessons = await prisma.lesson.findMany({
    take: 10,
    select: { id: true, title: true, isPublished: true, subject: { select: { name: true } } }
  });
  console.log("Sample lessons:", sampleLessons);

  await prisma.$disconnect();
}

checkPublished();
