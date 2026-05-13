"use client";

import { Users, Mail, Clock, ShieldCheck, Search, Download, Filter, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import DeleteUserButton from "./DeleteUserButton";

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => {
      const matchesSearch = 
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || "");
      
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter, initialUsers]);

  const handleExport = () => {
    // Dynamically load html2pdf from CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      const element = document.createElement("div");
      element.dir = "rtl";
      element.className = "p-10 font-sans";
      element.innerHTML = `
        <div style="padding: 40px; font-family: 'Cairo', sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
              <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin: 0;">تقرير شؤون الطلاب</h1>
              <p style="color: #64748b; font-weight: 600; margin-top: 5px;">كشف بيانات الطلاب المسجلين في المنصة</p>
            </div>
            <div style="text-align: left;">
              <h2 style="font-size: 24px; font-weight: 900; color: #0ea5e9; margin: 0;">AuraMed Elite</h2>
              <p style="color: #94a3b8; font-size: 12px; font-weight: bold;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 15px; text-align: right; font-size: 14px; color: #475569;">الاسم</th>
                <th style="padding: 15px; text-align: right; font-size: 14px; color: #475569;">البريد الإلكتروني</th>
                <th style="padding: 15px; text-align: center; font-size: 14px; color: #475569;">كلمة المرور</th>
                <th style="padding: 15px; text-align: center; font-size: 14px; color: #475569;">الصلاحية</th>
                <th style="padding: 15px; text-align: center; font-size: 14px; color: #475569;">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.map(user => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 15px; font-size: 13px; font-weight: 800; color: #1e293b;">${user.name || "بدون اسم"}</td>
                  <td style="padding: 15px; font-size: 13px; color: #64748b;">${user.email}</td>
                  <td style="padding: 15px; font-size: 13px; text-align: center; font-family: monospace; color: #0ea5e9;">${user.password || "---"}</td>
                  <td style="padding: 15px; font-size: 11px; text-align: center; font-weight: 900;">${user.role}</td>
                  <td style="padding: 15px; font-size: 12px; text-align: center; color: #94a3b8;">${new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 50px; text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9;">
            <p style="font-size: 10px; color: #cbd5e1; font-weight: bold;">هذا التقرير تم إنشاؤه تلقائياً بواسطة نظام AuraMed الإداري</p>
          </div>
        </div>
      `;

      const opt = {
        margin: 0,
        filename: `AuraMed_Students_Report_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };

      (window as any).html2pdf().from(element).set(opt).save();
    };
    document.head.appendChild(script);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5">
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">إجمالي الطلاب</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">{initialUsers.length}</h4>
            </div>
         </div>
         <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">المتواجدون حالياً</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">{filteredUsers.length}</h4>
            </div>
         </div>
         <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5">
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">آخر المسجلين</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">+{initialUsers.slice(0,1).length}</h4>
            </div>
         </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم أو البريد..." 
              className="w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <select 
               title="تصفية حسب الصلاحية"
               value={roleFilter}
               onChange={(e) => setRoleFilter(e.target.value)}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none cursor-pointer"
             >
               <option value="ALL">جميع الرتب</option>
               <option value="USER">طلاب (USER)</option>
               <option value="ADMIN">مديرين (ADMIN)</option>
             </select>
             <button 
               onClick={handleExport}
               className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-medical-600 hover:bg-medical-50 transition-all"
               title="تصدير للبيانات"
             >
                <Download className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/30 dark:bg-slate-800/10 text-slate-400 text-[10px] uppercase tracking-[2px] font-black">
                <th className="px-8 py-6 font-black text-right">المعلومات الشخصية</th>
                <th className="px-8 py-6 font-black text-right">البريد والحالة</th>
                <th className="px-8 py-6 font-black text-center">كلمة المرور</th>
                <th className="px-8 py-6 font-black text-center">الصلاحية</th>
                <th className="px-8 py-6 font-black text-center">تاريخ الانضمام</th>
                <th className="px-8 py-6 font-black text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-400 font-black text-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md transition-transform group-hover:scale-110">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.name ? user.name.charAt(0).toUpperCase() : "?"
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-dark-card rounded-full" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 dark:text-white group-hover:text-medical-600 transition-colors">{user.name || "بدون اسم"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ID: {user.id.slice(0, 12)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                        <Mail className="w-4 h-4 text-medical-600" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">حساب مفعل</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-medical-600">
                      {user.password || "---"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      user.role === "ADMIN" 
                        ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800" 
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-black text-sm">
                        <Clock className="w-4 h-4 text-slate-300" />
                        <span dir="ltr">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 opacity-50 uppercase tracking-tighter">
                        {new Date(user.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteUserButton id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                       <Users className="w-24 h-24 text-slate-300" />
                       <div>
                         <p className="text-2xl font-black text-slate-500">لا يوجد نتائج تطابق بحثك</p>
                         <p className="text-sm font-bold mt-1">تأكد من كتابة الاسم أو البريد بشكل صحيح.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
           <p className="text-sm font-bold text-slate-400">عرض {filteredUsers.length} من {initialUsers.length} نتيجة</p>
           <div className="flex gap-2">
              <button disabled className="px-5 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-sm font-bold opacity-50">السابق</button>
              <button disabled className="px-5 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-sm font-bold opacity-50">التالي</button>
           </div>
        </div>
      </div>
    </div>
  );
}
