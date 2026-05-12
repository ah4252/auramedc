"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const SETTINGS_PATH = path.join(process.cwd(), "src/lib/settings.json");

function readSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      const defaultSettings = { maintenanceMode: false, allowRegistration: true, siteName: "MedGpa" };
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const data = fs.readFileSync(SETTINGS_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { maintenanceMode: false, allowRegistration: true, siteName: "MedGpa" };
  }
}

function writeSettings(settings: any) {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

export async function getSettings() {
  const defaultSettings = { 
    maintenanceMode: false, 
    allowRegistration: true, 
    siteName: "Aura Med Elite",
    primaryColor: "#0ea5e9", // medical-500
    secondaryColor: "#6366f1",
    darkBg: "#0f172a",
    lightBg: "#f8fafc"
  };

  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const data = fs.readFileSync(SETTINGS_PATH, "utf8");
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    return defaultSettings;
  }
}

export async function updateSettings(data: any) {
  try {
    const current = await getSettings();
    const updated = { ...current, ...data };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2));
    
    revalidatePath("/", "layout");
    return { success: true, settings: updated };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث الإعدادات" };
  }
}

export async function changeAdminPassword(newPassword: string) {
  try {
    const current = await getSettings();
    const updated = { ...current, adminPassword: newPassword };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2));
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}
