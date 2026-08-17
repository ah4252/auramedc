const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Read .env manually if needed
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

const prisma = new PrismaClient({ log: ['error', 'warn'] });

async function main() {
  try {
    console.log('1. Checking existing columns in SiteSettings table...');
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'SiteSettings'
      ORDER BY ordinal_position;
    `);
    console.log('Current columns in DB:');
    columns.forEach(c => console.log(` - ${c.column_name} (${c.data_type}, default: ${c.column_default})`));

    console.log('\n2. Ensuring maintenanceQuiz column exists...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "SiteSettings" 
      ADD COLUMN IF NOT EXISTS "maintenanceQuiz" BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Column maintenanceQuiz created or already exists.');

    console.log('\n3. Testing prisma.siteSettings.findUnique for "global"...');
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      console.log('Creating global settings record...');
      settings = await prisma.siteSettings.create({
        data: { id: 'global' }
      });
    }
    console.log('✅ Settings loaded successfully:');
    console.log({
      maintenanceMode: settings.maintenanceMode,
      maintenanceCourses: settings.maintenanceCourses,
      maintenanceSubjects: settings.maintenanceSubjects,
      maintenancePharmacy: settings.maintenancePharmacy,
      maintenanceTimetable: settings.maintenanceTimetable,
      maintenanceGpa: settings.maintenanceGpa,
      maintenanceNews: settings.maintenanceNews,
      maintenanceQcms: settings.maintenanceQcms,
      maintenanceQuiz: settings.maintenanceQuiz,
    });

    console.log('\n4. Testing update of each maintenance toggle in database...');
    const fieldsToTest = [
      'maintenanceMode',
      'maintenanceCourses',
      'maintenanceSubjects',
      'maintenancePharmacy',
      'maintenanceTimetable',
      'maintenanceGpa',
      'maintenanceNews',
      'maintenanceQcms',
      'maintenanceQuiz',
    ];

    for (const field of fieldsToTest) {
      const originalValue = settings[field];
      const testVal = !originalValue;
      
      // Update with new value
      const updated = await prisma.siteSettings.update({
        where: { id: 'global' },
        data: { [field]: testVal }
      });
      console.log(` - Updated ${field} -> ${updated[field]}`);

      // Revert back to original value
      const reverted = await prisma.siteSettings.update({
        where: { id: 'global' },
        data: { [field]: originalValue }
      });
      console.log(` - Reverted ${field} -> ${reverted[field]}`);
    }

    console.log('\n🎉 ALL 9 MAINTENANCE SETTINGS VERIFIED AND WORKING IN DATABASE!');
  } catch (err) {
    console.error('❌ Error during schema update/test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
