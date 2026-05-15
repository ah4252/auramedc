"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const defaultSettings = { 
    id: "global",
    siteName: "Aura Med Elite",
    maintenanceMode: false,
    allowRegistration: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#6366f1",
    darkBg: "#0f172a",
    adminPassword: "admin"
  };

  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {},
      create: defaultSettings,
    });

    return settings;
  } catch (error) {
    console.error("Local Settings Error:", error);
    return defaultSettings;
  }
}

export async function updateSettings(data: any) {
  try {
    const updated = await prisma.siteSettings.update({
      where: { id: "global" },
      data: {
        siteName: data.siteName,
        maintenanceMode: data.maintenanceMode,
        allowRegistration: data.allowRegistration,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        darkBg: data.darkBg,
      }
    });
    
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, settings: updated };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { error: "حدث خطأ أثناء تحديث الإعدادات في قاعدة البيانات" };
  }
}

export async function changeAdminPassword(newPassword: string) {
  try {
    await prisma.siteSettings.update({
      where: { id: "global" },
      data: { adminPassword: newPassword }
    });
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}
