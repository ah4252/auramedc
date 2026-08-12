"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Users
} from "lucide-react";

interface StatsData {
  qcmsAccuracy: string;
  qcmsExamCount: string;
  qcmsSubjectCount: string;
}

export default function QcmsStatsClient() {
  const [stats, setStats] = useState<StatsData>({
    qcmsAccuracy: "100%",
    qcmsExamCount: "500+",
    qcmsSubjectCount: "20+",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      
      if (data) {
        setStats({
          qcmsAccuracy: data.qcmsAccuracy || "100%",
          qcmsExamCount: data.qcmsExamCount || "500+",
          qcmsSubjectCount: data.qcmsSubjectCount || "20+",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleChange = (field: keyof StatsData, value: string) => {
    setStats((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stats),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "تم حفظ الإحصائيات بنجاح" });
      } else {
        setMessage({ type: "error", text: data.error || "حدث خطأ أثناء الحفظ" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطأ في الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-violet-400" />
            إدارة إحصائيات QCMs
          </h1>
          <p className="text-slate-400">قم بتحديث الإحصائيات المعروضة في قسم الاختبارات</p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-200"
                : "bg-rose-500/20 border border-rose-400/30 text-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Accuracy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">دقة المناهج</h3>
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <input
              type="text"
              value={stats.qcmsAccuracy}
              onChange={(e) => handleChange("qcmsAccuracy", e.target.value)}
              placeholder="مثال: 100%"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-lg font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-3">
              أدخل نسبة دقة المناهج (مثل 100%, 98%, إلخ)
            </p>
          </motion.div>

          {/* Exam Count Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">نماذج الاختبارات</h3>
              <div className="p-2.5 rounded-lg bg-violet-500/20 border border-violet-400/30">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <input
              type="text"
              value={stats.qcmsExamCount}
              onChange={(e) => handleChange("qcmsExamCount", e.target.value)}
              placeholder="مثال: 500+"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-lg font-bold placeholder-slate-500 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-3">
              أدخل عدد نماذج الاختبارات (مثل 500+, 1000+, إلخ)
            </p>
          </motion.div>

          {/* Subject Count Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">المواد والتخصصات</h3>
              <div className="p-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <input
              type="text"
              value={stats.qcmsSubjectCount}
              onChange={(e) => handleChange("qcmsSubjectCount", e.target.value)}
              placeholder="مثال: 20+"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-lg font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-3">
              أدخل عدد المواد والتخصصات (مثل 20+, 50+, إلخ)
            </p>
          </motion.div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-violet-400 to-cyan-400 rounded-full"></span>
            معاينة الإحصائيات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Accuracy Preview */}
            <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 p-6 overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                METRIC
              </div>
              <div className="mb-2 text-4xl font-black text-white">
                {stats.qcmsAccuracy}
              </div>
              <div className="text-sm text-emerald-200">دقة المناهج</div>
            </div>

            {/* Exam Count Preview */}
            <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-violet-600/5 p-6 overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-6 w-24 h-24 bg-violet-500/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-violet-200">
                <BookOpen className="h-3 w-3 text-violet-400" />
                METRIC
              </div>
              <div className="mb-2 text-4xl font-black text-white">
                {stats.qcmsExamCount}
              </div>
              <div className="text-sm text-violet-200">نماذج الاختبارات</div>
            </div>

            {/* Subject Count Preview */}
            <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 p-6 overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-200">
                <Users className="h-3 w-3 text-cyan-400" />
                METRIC
              </div>
              <div className="mb-2 text-4xl font-black text-white">
                {stats.qcmsSubjectCount}
              </div>
              <div className="text-sm text-cyan-200">المواد والتخصصات</div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 hover:from-violet-500 hover:via-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            {loading ? "جاري الحفظ..." : "حفظ الإحصائيات"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
