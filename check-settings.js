const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// قراءة ملف .env يدوياً
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

const prisma = new PrismaClient({ log: ['error'] });

async function check() {
  try {
    console.log('🔍 البحث عن siteSettings...');
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });
    
    if (settings) {
      console.log('✅ سجل siteSettings موجود!');
      console.log('   adminPassword:', settings.adminPassword);
      console.log('   maintenanceMode:', settings.maintenanceMode);
    } else {
      console.log('❌ سجل siteSettings غير موجود في قاعدة البيانات!');
      console.log('   يجب إنشاؤه. كلمة المرور الافتراضية ستكون: admin123');
      
      // إنشاء السجل
      const created = await prisma.siteSettings.create({
        data: { id: 'global' }
      });
      console.log('✅ تم إنشاء سجل siteSettings بنجاح!');
    }
    
    // اختبار query مباشرة
    const raw = await prisma.$queryRaw`SELECT * FROM "SiteSettings" WHERE id = 'global'`;
    console.log('\n📊 Raw query result:', JSON.stringify(raw, null, 2));
    
  } catch (err) {
    console.error('❌ خطأ:', err.message);
    console.error('   Code:', err.code);
  } finally {
    await prisma.$disconnect();
  }
}

check();
