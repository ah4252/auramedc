const { PrismaClient } = require('@prisma/client');

// تحميل متغيرات البيئة يدوياً
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
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  console.log('✅ تم تحميل ملف .env');
} catch (e) {
  console.log('⚠️ لم يتم العثور على ملف .env');
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 60) + '...' : 'غير موجود');
console.log('DIRECT_URL:', process.env.DIRECT_URL ? process.env.DIRECT_URL.substring(0, 60) + '...' : 'غير موجود');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function testConnection() {
  try {
    console.log('\n🔄 جاري الاتصال بقاعدة البيانات Neon...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ الاتصال بقاعدة البيانات نجح!');
  } catch (error) {
    console.error('❌ خطأ في الاتصال:');
    console.error('  رسالة الخطأ:', error.message);
    console.error('  رمز الخطأ:', error.code || 'غير معروف');
    
    // تحليل نوع الخطأ
    if (error.message.includes('Connection refused')) {
      console.log('\n📋 التشخيص: رُفض الاتصال - تحقق من أن الخادم يعمل');
    } else if (error.message.includes('authentication failed') || error.message.includes('password')) {
      console.log('\n📋 التشخيص: بيانات المصادقة خاطئة - تحقق من اسم المستخدم وكلمة المرور');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      console.log('\n📋 التشخيص: انتهى وقت الاتصال - تحقق من الاتصال بالإنترنت والـ host');
    } else if (error.message.includes('SSL') || error.message.includes('TLS') || error.message.includes('channel_binding')) {
      console.log('\n📋 التشخيص: مشكلة في SSL/TLS أو channel_binding');
    } else if (error.message.includes('does not exist') || error.message.includes('not found')) {
      console.log('\n📋 التشخيص: قاعدة البيانات أو الـ schema غير موجودة');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
