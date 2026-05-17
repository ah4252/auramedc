"use client";

import { Settings, Shield, Lock, Palette, Save, AlertTriangle, UserPlus, Globe, Monitor as MonitorIcon, Database, ShieldCheck, Mail, Sliders, Cpu, Users, Stethoscope, PlayCircle, ExternalLink, CheckCircle2, KeyRound, Unlock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSettings, updateSettings, changeAdminPassword, getToolsProtection, updateToolsProtection } from "@/app/actions/settings";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [siteName, setSiteName] = useState("Aura Med Elite");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [darkBg, setDarkBg] = useState("#0f172a");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{type: "success"|"error", text: string} | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Tools password states
  const [toolsEnabled, setToolsEnabled] = useState(false);
  const [toolsNewPass, setToolsNewPass] = useState("");
  const [toolsConfirmPass, setToolsConfirmPass] = useState("");
  const [toolsMsg, setToolsMsg] = useState<{type: "success"|"error", text: string} | null>(null);
  const [toolsLoading, setToolsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await getSettings();
      setMaintenanceMode(s.maintenanceMode);
      setAllowRegistration(s.allowRegistration);
      setSiteName(s.siteName || "Aura Med Elite");
      setPrimaryColor(s.primaryColor || "#0ea5e9");
      setSecondaryColor(s.secondaryColor || "#6366f1");
      setDarkBg(s.darkBg || "#0f172a");

      const tp = await getToolsProtection();
      setToolsEnabled(tp.enabled);
    }
    load();
  }, []);

  const handleToggleMaintenance = async () => {
    const newVal = !maintenanceMode;
    setMaintenanceMode(newVal);
    await updateSettings({ maintenanceMode: newVal });
  };

  const handleToggleRegistration = async () => {
    const newVal = !allowRegistration;
    setAllowRegistration(newVal);
    await updateSettings({ allowRegistration: newVal });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateSettings({ siteName, primaryColor, secondaryColor, darkBg });
    alert("تم حفظ جميع الإعدادات والمظهر بنجاح!");
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "كلمتا المرور غير متطابقتين" });
      return;
    }
    setPasswordLoading(true);
    const res = await changeAdminPassword(newPassword);
    if (res.success) {
      setPasswordMsg({ type: "success", text: "تم تغيير كلمة المرور بنجاح! ✓" });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg({ type: "error", text: res.error || "حدث خطأ" });
    }
    setPasswordLoading(false);
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const handleToggleToolsProtection = async () => {
    const newVal = !toolsEnabled;
    setToolsEnabled(newVal);
    const res = await updateToolsProtection({ enabled: newVal });
    if (!res.success) setToolsEnabled(!newVal);
  };

  const handleChangeToolsPassword = async () => {
    if (!toolsNewPass || toolsNewPass.length < 4) {
      setToolsMsg({ type: "error", text: "كلمة المرور يجب أن تكون 4 أحرف على الأقل" });
      return;
    }
    if (toolsNewPass !== toolsConfirmPass) {
      setToolsMsg({ type: "error", text: "كلمتا المرور غير متطابقتين" });
      return;
    }
    setToolsLoading(true);
    const res = await updateToolsProtection({ newPassword: toolsNewPass });
    if (res.success) {
      setToolsMsg({ type: "success", text: "تم تغيير كلمة مرور الأدوات بنجاح! ✓" });
      setToolsNewPass("");
      setToolsConfirmPass("");
    } else {
      setToolsMsg({ type: "error", text: res.error || "حدث خطأ" });
    }
    setToolsLoading(false);
    setTimeout(() => setToolsMsg(null), 4000);
  };

  const tabs = [
    { id: "general", label: "العامة", icon: Globe },
    { id: "security", label: "الأمان", icon: ShieldCheck },
    { id: "tools", label: "حماية الأدوات", icon: KeyRound },
    { id: "appearance", label: "المظهر", icon: Palette },
    { id: "system", label: "النظام", icon: Cpu },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4">
      <style dangerouslySetInnerHTML={{ __html: `
        .dynamic-primary-color { color: ${primaryColor} !important; }
        .dynamic-primary-bg { background-color: ${primaryColor} !important; }
        .dynamic-primary-border { border-color: ${primaryColor} !important; color: ${primaryColor} !important; }
        .dynamic-secondary-bg { background-color: ${secondaryColor} !important; }
        .dynamic-preview-bg { background: radial-gradient(circle at 50% 120%, ${primaryColor}20, transparent) !important; }
      `}} />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-medical-600 to-medical-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-medical-600/30">
            <Settings className="w-8 h-8 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">مركز التحكم والإعدادات</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">قم بتخصيص منصة {siteName} وإدارة الصلاحيات والأمان</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-medical-600 dark:hover:bg-medical-500 dark:hover:text-white shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border ${
                  activeTab === tab.id 
                  ? "bg-medical-600 text-white border-medical-500 shadow-lg shadow-medical-600/20" 
                  : "bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-medical-500/50 hover:bg-medical-50 dark:hover:bg-medical-900/10"
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            )
          })}
          
          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
             <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black mb-2 text-sm uppercase tracking-widest">
                   <Database className="w-4 h-4 text-medical-600" />
                   حالة النظام
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs">
                      <span className="text-slate-500">قاعدة البيانات</span>
                      <span className="text-green-500 font-bold">متصلة</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-slate-500">سعة التخزين</span>
                      <span className="text-slate-900 dark:text-white font-bold">12%</span>
                   </div>
                   <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-medical-500 h-full w-[12%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8"
            >
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h2 className="text-2xl font-black mb-2">الإعدادات العامة</h2>
                    <p className="text-slate-500 text-sm">تحكم في المعلومات الأساسية لمنصة {siteName}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="siteName" className="text-sm font-black text-slate-700 dark:text-slate-300">اسم المنصة الرسمي</label>
                      <input 
                        id="siteName"
                        title="اسم المنصة الرسمي"
                        placeholder="أدخل اسم المنصة"
                        type="text" 
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="siteDescription" className="text-sm font-black text-slate-700 dark:text-slate-300">وصف المنصة (SEO Meta Description)</label>
                      <textarea 
                        id="siteDescription"
                        title="وصف المنصة"
                        placeholder="أدخل وصف المنصة"
                        rows={4}
                        defaultValue="المنصة العربية الأولى الرائدة في مجال التعليم الطبي الرقمي. نهدف لتمكين الأطباء والطلاب العرب."
                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all font-medium leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h2 className="text-2xl font-black mb-2 text-red-600 dark:text-red-500 flex items-center gap-2">
                       <Lock className="w-6 h-6" />
                       الأمان وصلاحيات الوصول
                    </h2>
                    <p className="text-slate-500 text-sm">إدارة كلمات المرور وحماية بيانات المنصة</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 dark:text-slate-300">كلمة المرور الجديدة</label>
                          <input 
                            type="password" 
                            placeholder="أدخل كلمة مرور جديدة"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                            dir="ltr"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 dark:text-slate-300">تأكيد كلمة المرور</label>
                          <input 
                            type="password" 
                            placeholder="أعد كتابة كلمة المرور"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                            dir="ltr"
                          />
                       </div>
                       <div className="md:col-span-2">
                         {passwordMsg && (
                           <div className={`p-4 rounded-2xl text-sm font-bold mb-3 flex items-center gap-2 ${
                             passwordMsg.type === "success" 
                             ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                             : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                           }`}>
                             {passwordMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                             {passwordMsg.text}
                           </div>
                         )}
                         <button
                           type="button"
                           onClick={handleChangePassword}
                           disabled={passwordLoading || !newPassword || !confirmPassword}
                           className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold transition-all hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white shadow-lg disabled:opacity-50"
                         >
                           {passwordLoading ? (
                             <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <Lock className="w-5 h-5" />
                           )}
                           <span>حفظ كلمة المرور الجديدة</span>
                         </button>
                       </div>
                    </div>

                    <div className="space-y-4 pt-6">
                       <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Users className="w-6 h-6" />
                             </div>
                             <div>
                                <h3 className="font-black text-slate-900 dark:text-white">السماح بتسجيل الطلاب</h3>
                                <p className="text-xs text-slate-500">تمكين الزوار من إنشاء حسابات جديدة في المنصة</p>
                             </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              id="allowRegistrationToggle"
                              title="السماح بتسجيل الطلاب"
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={allowRegistration}
                              onChange={handleToggleRegistration}
                            />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-medical-600"></div>
                          </label>
                       </div>

                       <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                                <Sliders className="w-6 h-6" />
                             </div>
                             <div>
                                <h3 className="font-black text-slate-900 dark:text-white">وضع الصيانة (Maintenance)</h3>
                                <p className="text-xs text-slate-500">إغلاق المنصة مؤقتاً أمام الطلاب للصيانة</p>
                             </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              id="maintenanceModeToggle"
                              title="وضع الصيانة"
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={maintenanceMode}
                              onChange={handleToggleMaintenance}
                            />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                          </label>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tools" && (
                <div className="space-y-8">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h2 className="text-2xl font-black mb-2 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                       <KeyRound className="w-6 h-6" />
                       كلمة مرور الأدوات
                    </h2>
                    <p className="text-slate-500 text-sm">قم بحماية جميع أقسام لوحة التحكم (ما عدا إدارة الأخبار) بكلمة مرور إضافية لا يعرفها أحد سواك</p>
                  </div>

                  {/* Toggle Protection */}
                  <div className="flex items-center justify-between p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border-2 border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white">تفعيل حماية الأدوات</h3>
                        <p className="text-xs text-slate-500">عند التفعيل، سيُطلب إدخال كلمة مرور الأدوات للوصول لأي قسم ما عدا الأخبار</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        id="toolsProtectionToggle"
                        title="تفعيل حماية الأدوات"
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={toolsEnabled}
                        onChange={handleToggleToolsProtection}
                      />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {/* Status indicator */}
                  <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                    toolsEnabled 
                      ? "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" 
                      : "bg-slate-50 dark:bg-slate-800/30 text-slate-500 border border-slate-200 dark:border-slate-700"
                  }`}>
                    {toolsEnabled ? (
                      <><Lock className="w-5 h-5 text-amber-500 animate-pulse" /> الحماية مفعّلة — جميع الأقسام محمية (ما عدا إدارة الأخبار)</>
                    ) : (
                      <><Unlock className="w-5 h-5 text-slate-400" /> الحماية معطّلة — جميع الأقسام مفتوحة</>
                    )}
                  </div>

                  {/* Change tools password */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 space-y-6">
                    <h3 className="font-black text-lg flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-500" />
                      تغيير كلمة مرور الأدوات
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 dark:text-slate-300">كلمة المرور الجديدة</label>
                        <input 
                          type="password" 
                          placeholder="أدخل كلمة مرور جديدة"
                          value={toolsNewPass}
                          onChange={(e) => setToolsNewPass(e.target.value)}
                          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 dark:text-slate-300">تأكيد كلمة المرور</label>
                        <input 
                          type="password" 
                          placeholder="أعد كتابة كلمة المرور"
                          value={toolsConfirmPass}
                          onChange={(e) => setToolsConfirmPass(e.target.value)}
                          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                          dir="ltr"
                        />
                      </div>
                      <div className="md:col-span-2">
                        {toolsMsg && (
                          <div className={`p-4 rounded-2xl text-sm font-bold mb-3 flex items-center gap-2 ${
                            toolsMsg.type === "success" 
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}>
                            {toolsMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {toolsMsg.text}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={handleChangeToolsPassword}
                          disabled={toolsLoading || !toolsNewPass || !toolsConfirmPass}
                          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                        >
                          {toolsLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <KeyRound className="w-5 h-5" />
                          )}
                          <span>حفظ كلمة مرور الأدوات الجديدة</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "system" && (
                <div className="space-y-8">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h2 className="text-2xl font-black mb-2">العمليات المتقدمة</h2>
                    <p className="text-slate-500 text-sm">أدوات إدارة البيانات والتحكم العميق بالنظام</p>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                     <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="text-lg font-black underline decoration-red-200 underline-offset-4">منطقة الخطر (Danger Zone)</h3>
                     </div>
                     <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-6 font-medium">هذه العمليات لا يمكن التراجع عنها، يرجى توخي الحذر الشديد عند تنفيذها.</p>
                     
                     <div className="flex flex-wrap gap-4">

                        <button className="px-6 py-3 bg-white dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
                           تصفير إحصائيات المشاهدات
                        </button>
                        <button className="px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                           إعادة ضبط المصنع بالكامل
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Primary Color */}
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400">
                              <Palette className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="font-bold">اللون الأساسي</h3>
                              <p className="text-xs text-slate-500">لون الأزرار والروابط والعناصر المهمة</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <input 
                             id="primaryColorPicker"
                             title="اختر اللون الأساسي"
                             type="color" 
                             value={primaryColor}
                             onChange={(e) => setPrimaryColor(e.target.value)}
                             className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent"
                           />
                           <label htmlFor="primaryColorText" className="sr-only">اللون الأساسي</label>
                           <input 
                             id="primaryColorText"
                             title="اللون الأساسي"
                             placeholder="#0ea5e9"
                             type="text" 
                             value={primaryColor}
                             onChange={(e) => setPrimaryColor(e.target.value)}
                             className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center"
                           />
                        </div>
                     </div>

                     {/* Secondary Color */}
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              <Palette className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="font-bold">اللون الثانوي</h3>
                              <p className="text-xs text-slate-500">لون العناصر التكميلية والرسوم</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <input 
                             id="secondaryColorPicker"
                             title="اختر اللون الثانوي"
                             type="color" 
                             value={secondaryColor}
                             onChange={(e) => setSecondaryColor(e.target.value)}
                             className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent"
                           />
                           <label htmlFor="secondaryColorText" className="sr-only">اللون الثانوي</label>
                           <input 
                             id="secondaryColorText"
                             title="اللون الثانوي"
                             placeholder="#6366f1"
                             type="text" 
                             value={secondaryColor}
                             onChange={(e) => setSecondaryColor(e.target.value)}
                             className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center"
                           />
                        </div>
                     </div>

                     {/* Dark Mode Background */}
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-white">
                              <MonitorIcon className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="font-bold">خلفية الوضع الليلي</h3>
                              <p className="text-xs text-slate-500">اللون الأساسي لخلفية الموقع في الوضع المظلم</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <input 
                             id="darkBgPicker"
                             title="اختر خلفية الوضع الليلي"
                             type="color" 
                             value={darkBg}
                             onChange={(e) => setDarkBg(e.target.value)}
                             className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent"
                           />
                           <label htmlFor="darkBgText" className="sr-only">خلفية الوضع الليلي</label>
                           <input 
                             id="darkBgText"
                             title="خلفية الوضع الليلي"
                             placeholder="#0f172a"
                             type="text" 
                             value={darkBg}
                             onChange={(e) => setDarkBg(e.target.value)}
                             className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center"
                           />
                        </div>
                     </div>

                     {/* Comprehensive Preview Box */}
                     <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden min-h-[300px]">
                        <p className="text-sm font-black text-slate-400 mb-6 uppercase tracking-[0.2em] text-center">المعاينة الحية للنظام</p>
                        
                        <div className="space-y-6 max-w-md mx-auto">
                           {/* Mini Navbar Preview */}
                           <div className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Stethoscope className="w-5 h-5 dynamic-primary-color" />
                                 <span className="text-sm font-black italic">Aura<span className="font-light not-italic">Med</span></span>
                              </div>
                              <div className="flex gap-2">
                                 <div className="w-8 h-2 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                                 <div className="w-8 h-2 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                              </div>
                              <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white shadow-sm dynamic-primary-bg">
                                 حاسبة المعدل
                              </div>
                           </div>

                           {/* Content Mockup */}
                           <div className="space-y-4 px-4">
                              <div className="w-2/3 h-4 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                              <div className="w-full h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                 <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                                    <PlayCircle className="w-6 h-6 dynamic-primary-color" />
                                 </div>
                              </div>
                              <div className="flex gap-3">
                                 <div className="flex-1 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md transition-transform hover:scale-105 dynamic-primary-bg">
                                    اشترك الآن
                                 </div>
                                 <div className="flex-1 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-bold dynamic-primary-border">
                                    تواصل معنا
                                 </div>
                              </div>
                           </div>

                           {/* Secondary color accent */}
                           <div className="px-4">
                              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: "70%" }}
                                   className="h-full dynamic-secondary-bg" 
                                    
                                 />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 text-center">تقدم الدورة: 70%</p>
                           </div>
                        </div>

                        {/* Background effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-50 dynamic-preview-bg"></div>
                     </div>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-[2rem] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      )}
                      <span>اعتماد المظهر الجديد</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
