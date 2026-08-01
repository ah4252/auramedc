"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Trash2, Image as ImageIcon } from "lucide-react";
import { updateSubscriptionStatus, deleteSubscriptionRequests } from "@/app/actions/payment";

export default function SubscriptionsClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  const parseTransactionId = (txId: string) => {
    if (!txId) return { type: "عام", id: "" };
    if (txId.startsWith("TIMETABLE:")) {
      return { type: "جداول", id: txId.replace("TIMETABLE:", "") };
    }
    if (txId.startsWith("GPA:")) {
      return { type: "معدل", id: txId.replace("GPA:", "") };
    }
    if (txId.startsWith("SUPPORT:")) {
      return { type: "دعم", id: txId.replace("SUPPORT:", "") };
    }
    return { type: "عام", id: txId };
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setLoadingId(id);
    const res = await updateSubscriptionStatus(id, status);
    if (res.success) {
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } else {
      alert(res.error || "حدث خطأ");
    }
    setLoadingId(null);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(requests.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (idsToDelete: string[]) => {
    if (!confirm(`هل أنت متأكد من حذف ${idsToDelete.length} طلب؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    
    setIsDeleting(true);
    const res = await deleteSubscriptionRequests(idsToDelete);
    if (res.success) {
      setRequests(requests.filter(r => !idsToDelete.includes(r.id)));
      setSelectedIds(selectedIds.filter(id => !idsToDelete.includes(id)));
    } else {
      alert(res.error || "حدث خطأ أثناء الحذف");
    }
    setIsDeleting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-center justify-between">
          <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">
            تم تحديد {selectedIds.length} طلب
          </span>
          <button
            onClick={() => handleDelete(selectedIds)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> الحذف النهائي
          </button>
        </div>
      )}
      {requests.length === 0 ? (
        <div className="text-center py-12 text-slate-500">لا توجد طلبات اشتراك بعد.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 rounded-tr-xl w-12">
                  <input 
                    type="checkbox" 
                    title="تحديد الكل"
                    aria-label="تحديد الكل"
                    className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    onChange={handleSelectAll}
                    checked={requests.length > 0 && selectedIds.length === requests.length}
                  />
                </th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">المستخدم</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">رقم العملية (TX ID)</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">تاريخ الدفع</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">تاريخ الطلب</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300">الحالة</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 rounded-tl-xl text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      title="تحديد الطلب"
                      aria-label="تحديد الطلب"
                      className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      checked={selectedIds.includes(req.id)}
                      onChange={() => toggleSelect(req.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{req.user?.name || "مستخدم محذوف"}</div>
                    <div className="text-xs text-slate-500">{req.user?.email}</div>
                  </td>
                  <td className="p-4">
                    {(() => {
                      const { type, id } = parseTransactionId(req.transactionId);
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-slate-600 dark:text-slate-400 text-sm font-bold">{id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md self-start font-black ${
                            type === "جداول" 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : type === "معدل"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : type === "دعم"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                          }`}>
                            نوع الطلب: {type}
                          </span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-4 text-sm font-bold">
                    {new Date(req.paymentDate).toLocaleDateString('ar-DZ')}
                  </td>
                  <td className="p-4 text-sm font-bold">
                    {new Date(req.createdAt).toLocaleDateString('ar-DZ')}
                  </td>
                  <td className="p-4">
                    {req.status === "PENDING" && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black"><Clock className="w-3.5 h-3.5" /> قيد المراجعة</span>}
                    {req.status === "APPROVED" && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black"><CheckCircle className="w-3.5 h-3.5" /> تم التفعيل</span>}
                    {req.status === "REJECTED" && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-xs font-black"><XCircle className="w-3.5 h-3.5" /> مرفوض</span>}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {req.receiptUrl && (
                        <button 
                          onClick={() => setShowImageModal(req.receiptUrl)}
                          className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                          title="عرض الإيصال"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                      {req.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                            disabled={loadingId === req.id}
                            className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors"
                            title="تفعيل وقبول الطلب"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                            disabled={loadingId === req.id}
                            className="p-2 bg-rose-100 dark:bg-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
                            title="رفض الطلب"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {req.status !== "PENDING" && (
                        <button 
                            onClick={() => handleUpdateStatus(req.id, "PENDING")}
                            disabled={loadingId === req.id}
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors text-xs font-bold"
                          >
                            إعادة مراجعة
                          </button>
                      )}
                      <button
                        onClick={() => handleDelete([req.id])}
                        disabled={isDeleting}
                        className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                        title="حذف نهائي"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setShowImageModal(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <img 
              src={showImageModal} 
              alt="Receipt" 
              className="w-full h-auto object-contain rounded-xl max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
