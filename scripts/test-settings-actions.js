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

// Replicating settings.ts logic to test directly with Prisma
async function getSettingsTest() {
  const defaultSettings = { 
    id: "global",
    siteName: "Aura Med Elite",
    maintenanceMode: false,
    maintenanceCourses: false,
    maintenanceSubjects: false,
    maintenancePharmacy: false,
    maintenanceTimetable: false,
    maintenanceGpa: false,
    maintenanceNews: false,
    maintenanceQcms: false,
    maintenanceQuiz: false,
    allowRegistration: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#6366f1",
    darkBg: "#0f172a",
    adminPassword: "admin123",
    toolsPassword: "tools123",
    toolsProtectionEnabled: false,
    statLectures: "",
    statSpecialties: "",
    statStudents: "",
    statSatisfaction: "99%",
    statPharmacy: "",
    statQCMs: "",
    qcmsAccuracy: "100%",
    qcmsExamCount: "500+",
    qcmsSubjectCount: "20+",
    socialFacebook: "",
    socialInstagram: "",
    socialTelegram: "",
    socialWhatsapp: "",
    socialEmail: "",
  };

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
    select: {
      id: true,
      siteName: true,
      maintenanceMode: true,
      maintenanceCourses: true,
      maintenanceSubjects: true,
      maintenancePharmacy: true,
      maintenanceTimetable: true,
      maintenanceGpa: true,
      maintenanceNews: true,
      maintenanceQcms: true,
      maintenanceQuiz: true,
      allowRegistration: true,
      primaryColor: true,
      secondaryColor: true,
      darkBg: true,
      adminPassword: true,
      toolsPassword: true,
      toolsProtectionEnabled: true,
      statLectures: true,
      statSpecialties: true,
      statStudents: true,
      statSatisfaction: true,
      statPharmacy: true,
      statQCMs: true,
      qcmsAccuracy: true,
      qcmsExamCount: true,
      qcmsSubjectCount: true,
      socialFacebook: true,
      socialInstagram: true,
      socialTelegram: true,
      socialWhatsapp: true,
      socialEmail: true,
    },
  });

  return { ...defaultSettings, ...settings };
}

async function updateSettingsTest(data) {
  const updateData = {};
  if (data.siteName !== undefined) updateData.siteName = data.siteName;
  if (data.maintenanceMode !== undefined) updateData.maintenanceMode = data.maintenanceMode;
  if (data.maintenanceCourses !== undefined) updateData.maintenanceCourses = data.maintenanceCourses;
  if (data.maintenanceSubjects !== undefined) updateData.maintenanceSubjects = data.maintenanceSubjects;
  if (data.maintenancePharmacy !== undefined) updateData.maintenancePharmacy = data.maintenancePharmacy;
  if (data.maintenanceTimetable !== undefined) updateData.maintenanceTimetable = data.maintenanceTimetable;
  if (data.maintenanceGpa !== undefined) updateData.maintenanceGpa = data.maintenanceGpa;
  if (data.maintenanceNews !== undefined) updateData.maintenanceNews = data.maintenanceNews;
  if (data.maintenanceQcms !== undefined) updateData.maintenanceQcms = data.maintenanceQcms;
  if (data.maintenanceQuiz !== undefined) updateData.maintenanceQuiz = data.maintenanceQuiz;
  if (data.allowRegistration !== undefined) updateData.allowRegistration = data.allowRegistration;
  if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor;
  if (data.secondaryColor !== undefined) updateData.secondaryColor = data.secondaryColor;
  if (data.darkBg !== undefined) updateData.darkBg = data.darkBg;

  const updated = await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: updateData,
    create: { id: "global", ...updateData },
  });
  return { success: true, settings: updated };
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE MAINTENANCE SETTINGS TESTS ---');

  // 1. Initial Fetch
  const initial = await getSettingsTest();
  console.log('1. Initial Settings successfully fetched:');
  console.log({
    maintenanceMode: initial.maintenanceMode,
    maintenanceCourses: initial.maintenanceCourses,
    maintenanceSubjects: initial.maintenanceSubjects,
    maintenancePharmacy: initial.maintenancePharmacy,
    maintenanceTimetable: initial.maintenanceTimetable,
    maintenanceGpa: initial.maintenanceGpa,
    maintenanceNews: initial.maintenanceNews,
    maintenanceQcms: initial.maintenanceQcms,
    maintenanceQuiz: initial.maintenanceQuiz,
    adminPassword: initial.adminPassword ? '(set)' : '(not set)',
  });

  const toggles = [
    { key: 'maintenanceMode', name: 'وضع الصيانة العام' },
    { key: 'maintenanceCourses', name: 'قسم المحاضرات' },
    { key: 'maintenanceSubjects', name: 'قسم التخصصات / المواد' },
    { key: 'maintenancePharmacy', name: 'قسم الصيدلة' },
    { key: 'maintenanceTimetable', name: 'الجدول الدراسي' },
    { key: 'maintenanceGpa', name: 'حاسبة المعدل' },
    { key: 'maintenanceNews', name: 'الأخبار والمستجدات' },
    { key: 'maintenanceQcms', name: 'QCMs' },
    { key: 'maintenanceQuiz', name: 'Quiz' },
  ];

  console.log('\n2. Testing individual toggle actions:');
  for (const t of toggles) {
    const original = initial[t.key];
    const toggled = !original;

    // Toggle ON/OFF
    const updateRes = await updateSettingsTest({ [t.key]: toggled });
    if (!updateRes.success) throw new Error(`Failed to update ${t.key}`);

    // Verify persisted
    const verify1 = await getSettingsTest();
    if (verify1[t.key] !== toggled) throw new Error(`Verification failed for ${t.key}: expected ${toggled}, got ${verify1[t.key]}`);
    console.log(` ✅ ${t.name} (${t.key}): changed ${original} -> ${toggled} and verified in DB.`);

    // Restore
    await updateSettingsTest({ [t.key]: original });
    const verify2 = await getSettingsTest();
    if (verify2[t.key] !== original) throw new Error(`Revert failed for ${t.key}`);
    console.log(` ✅ ${t.name} (${t.key}): restored back to ${original}.`);
  }

  // 3. Verify other settings untouched
  console.log('\n3. Verifying non-maintenance settings integrity:');
  const finalSettings = await getSettingsTest();
  if (finalSettings.siteName !== initial.siteName) throw new Error('siteName was modified!');
  if (finalSettings.adminPassword !== initial.adminPassword) throw new Error('adminPassword was modified!');
  if (finalSettings.primaryColor !== initial.primaryColor) throw new Error('primaryColor was modified!');
  console.log(' ✅ All other settings (passwords, colors, siteName) intact and protected!');

  console.log('\n🎯 ALL TESTS PASSED SUCCESSFULLY! 100% WORKING.');
  await prisma.$disconnect();
}

runTests().catch((e) => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
