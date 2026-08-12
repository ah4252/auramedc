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

async function audit() {
  console.log("=== 🔍 فحص شامل لقاعدة البيانات والمحتوى المستهلك للمساحة ===\n");
  
  const results = {};

  try {
    // 1. إحصائيات الجداول وعدد السجلات
    console.log("1️⃣ عدد السجلات في كل جدول:");
    const tables = [
      'user', 'category', 'subject', 'lesson', 'resource', 'tag', 'comment', 
      'favorite', 'progress', 'gPACalculation', 'siteSettings', 'timetable', 
      'gpaYear', 'gpaSubject', 'qcmsYear', 'qcmsSubject', 'qcmsExamLink', 
      'news', 'newsComment', 'forgotPasswordRequest', 'friendship', 
      'friendshipDecision', 'subscriptionRequest', 'pharmacySection', 
      'pharmacyImage', 'pushSubscription'
    ];

    const counts = {};
    for (const t of tables) {
      if (prisma[t]) {
        counts[t] = await prisma[t].count();
      }
    }
    console.table(counts);

    // 2. أحجام الجداول من PostgreSQL
    console.log("\n2️⃣ أحجام الجداول في PostgreSQL (MB/KB):");
    try {
      const tableSizes = await prisma.$queryRaw`
        SELECT 
          relname AS "table_name",
          pg_size_pretty(pg_total_relation_size(c.oid)) AS "total_size",
          pg_total_relation_size(c.oid) AS "size_bytes"
        FROM pg_class c
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
        ORDER BY pg_total_relation_size(c.oid) DESC;
      `;
      console.table(tableSizes);
    } catch (e) {
      console.log("تعذر جلب أحجام الجداول من pg_class:", e.message);
    }

    // 3. فحص البيانات اليتيمة (Orphaned Data)
    console.log("\n3️⃣ فحص البيانات والارتباطات المقطوعة / اليتيمة (Orphaned Records):");

    // أ. التعليقات بدون دروس أو بدون مستخدمين
    const orphanedComments = await prisma.comment.count({
      where: {
        OR: [
          { lessonId: { notIn: (await prisma.lesson.findMany({ select: { id: true } })).map(l => l.id) } },
          { userId: { notIn: (await prisma.user.findMany({ select: { id: true } })).map(u => u.id) } }
        ]
      }
    });
    console.log(`- التعليقات اليتيمة (لا تنتمي لدرس/مستخدم موجود): ${orphanedComments}`);

    // ب. المفضلة اليتيمة
    const orphanedFavorites = await prisma.favorite.count({
      where: {
        OR: [
          { lessonId: { notIn: (await prisma.lesson.findMany({ select: { id: true } })).map(l => l.id) } },
          { userId: { notIn: (await prisma.user.findMany({ select: { id: true } })).map(u => u.id) } }
        ]
      }
    });
    console.log(`- المفضلة اليتيمة (درس أو مستخدم محذوف): ${orphanedFavorites}`);

    // ج. تقدم المشاهدات Progress اليتيم
    const orphanedProgress = await prisma.progress.count({
      where: {
        OR: [
          { lessonId: { notIn: (await prisma.lesson.findMany({ select: { id: true } })).map(l => l.id) } },
          { userId: { notIn: (await prisma.user.findMany({ select: { id: true } })).map(u => u.id) } }
        ]
      }
    });
    console.log(`- سجلات التقدم اليتيمة (Progress): ${orphanedProgress}`);

    // د. الموارد Resources بدون درس
    const orphanedResources = await prisma.resource.count({
      where: {
        lessonId: { notIn: (await prisma.lesson.findMany({ select: { id: true } })).map(l => l.id) }
      }
    });
    console.log(`- الموارد اليتيمة (Resources بدون درس): ${orphanedResources}`);

    // هـ. الدروس بدون مادة Subject
    const orphanedLessons = await prisma.lesson.count({
      where: {
        subjectId: { notIn: (await prisma.subject.findMany({ select: { id: true } })).map(s => s.id) }
      }
    });
    console.log(`- الدروس اليتيمة (Lesson بدون مادة): ${orphanedLessons}`);

    // و. طلبات استعادة كلمة المرور المعلقة/قديمة
    const pendingPasswordRequests = await prisma.forgotPasswordRequest.count();
    console.log(`- طلبات استعادة كلمة المرور (ForgotPasswordRequest): ${pendingPasswordRequests}`);

    // ز. طلبات الاشتراكات (SubscriptionRequest)
    const subRequests = await prisma.subscriptionRequest.count();
    console.log(`- طلبات الاشتراك (SubscriptionRequest): ${subRequests}`);

    // 4. فحص الروابط والصور المخزنة بالـ Base64 أو الروابط المكسورة
    console.log("\n4️⃣ فحص الصور والنصوص الضخمة (Base64 / Large text columns):");
    
    // فحص إذا كان هناك صور مخزنة كـ base64 داخل الجداول (والتي تستهلك مساحة ضخمة جداً)
    const base64Users = await prisma.user.count({ where: { image: { startsWith: 'data:image' } } });
    const base64News = await prisma.news.count({ where: { image: { startsWith: 'data:image' } } });
    const base64Lessons = await prisma.lesson.count({ where: { thumbnail: { startsWith: 'data:image' } } });
    const base64Pharmacy = await prisma.pharmacyImage.count({ where: { url: { startsWith: 'data:image' } } });

    console.log(`- صور مستخدمين بصيغة Base64 (تستهلك مساحة عالية): ${base64Users}`);
    console.log(`- صور أخبار بصيغة Base64: ${base64News}`);
    console.log(`- صور دروس بصيغة Base64: ${base64Lessons}`);
    console.log(`- صور صيدلية بصيغة Base64: ${base64Pharmacy}`);

  } catch (err) {
    console.error("خطأ أثناء الفحص:", err);
  } finally {
    await prisma.$disconnect();
  }
}

audit();
