"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Stethoscope, ArrowLeft, Dna, Activity, Brain, Bone, Eye } from "lucide-react";

// Helper function to pick a random medical icon based on index
const getCategoryIcon = (idx: number) => {
  const icons = [Stethoscope, Dna, Activity, Brain, Bone, Eye, BookOpen];
  return icons[idx % icons.length];
};

// Helper function to get gradient colors based on index
const getCategoryGradient = (idx: number) => {
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-emerald-500 to-teal-400",
    "from-violet-500 to-purple-400",
    "from-rose-500 to-pink-400",
    "from-amber-500 to-orange-400",
    "from-indigo-500 to-blue-400",
  ];
  return gradients[idx % gradients.length];
};

export default function SubjectsClient({ categories }: { categories: any[] }) {
  return (
    <div className="relative min-h-screen py-20 overflow-hidden bg-slate-50 dark:bg-dark-bg">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-medical-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-40 w-[30rem] h-[30rem] bg-blue-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-dark-card shadow-xl shadow-medical-600/10 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Activity className="w-10 h-10 text-medical-600 dark:text-medical-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
            دليلك نحو <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-600 to-blue-500">التخصص</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            استكشف عالم الطب بجميع تخصصاته. صممنا هذه الأقسام بعناية لتوفير مسار تعليمي منظم لكل مرحلة من مراحل دراستك.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {categories.map((cat, idx) => {
            const Icon = getCategoryIcon(idx);
            const gradient = getCategoryGradient(idx);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link 
                  href={`/courses`} // For now it leads to courses, can be /courses?category=cat.name
                  className="group relative block bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                >
                  {/* Glowing Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Top Bar with Icon and Stats */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold px-4 py-1.5 rounded-full mb-2">
                        {cat.lessonCount} محاضرة
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-medical-50 group-hover:text-medical-600 transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-3xl font-extrabold mb-4 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-medical-600 group-hover:to-blue-500 transition-all">
                      {cat.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {cat.description || "مسار تعليمي متكامل يحتوي على كافة المراجع، الشروحات والفيديوهات الأكاديمية المصممة خصيصاً لطلاب هذا التخصص."}
                    </p>
                  </div>

                  {/* Decorative faint icon in background */}
                  <Icon className="absolute -bottom-10 -left-10 w-48 h-48 text-slate-50 dark:text-slate-800/50 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none" />
                </Link>
              </motion.div>
            );
          })}

          {categories.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-24 bg-white dark:bg-dark-card rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <div className="w-24 h-24 bg-medical-50 dark:bg-medical-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-medical-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4">قسم التخصصات الطبية</h3>
              <p className="text-xl text-slate-500 max-w-lg mx-auto">سيتم إضافة التخصصات الطبية الدقيقة (مثل الباطنة، الجراحة، إلخ) في هذا القسم قريباً لتكون منفصلة عن السنوات الدراسية.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
