"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Camera, ArrowRight, CheckCircle, X } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider.client";
import { updateProfileImage } from "@/app/actions/auth";
import { compressImage } from "@/lib/utils";

export default function RegisterCompletePage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  async function handleUploadImage(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("imageFile", file);

    const res = await updateProfileImage(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-slate-900/95 shadow-2xl p-10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-medical-500/10 text-medical-400">
            <Camera className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-3">{t("register_complete_title", "مرحبا بك في AuraMed")}</h1>
          <p className="text-slate-400 max-w-xl mx-auto">{t("register_complete_description", "يمكنك رفع صورة حسابك الآن لتظهر للطلاب الآخرين، أو تخطّي هذه الخطوة والدخول مباشرة إلى الموقع.")}</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleUploadImage} className="space-y-6">
            <div className="flex flex-col items-center gap-5">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-slate-800/90 border-4 border-white/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt={t("register_complete_preview_alt", "معاينة الصورة")} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-slate-500">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto mb-4 rounded-full bg-black/50 px-4 py-2 text-xs text-slate-200 backdrop-blur-sm">
                  {previewUrl
                    ? t("register_complete_preview_label", "هذه هي صورة الحساب التي سيتم رفعها")
                    : t("register_complete_empty_preview", "اختر صورة لتظهر هنا")}
                </div>
              </div>

              <label className="flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-slate-200 transition hover:border-medical-500/40 hover:bg-slate-900">
                <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-slate-100">
                  <Camera className="w-4 h-4" />
                  {t("register_complete_choose_label", "اختر صورة شخصية")}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    if (selectedFile) {
                      try {
                        const compressedFile = await compressImage(selectedFile);
                        setFile(compressedFile);
                      } catch (err) {
                        console.error("Error compressing image:", err);
                        setFile(selectedFile);
                      }
                    } else {
                      setFile(null);
                    }
                  }}
                  className="sr-only"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full rounded-3xl bg-medical-500 py-4 text-black font-black transition hover:bg-medical-400 disabled:opacity-50"
            >
              {loading ? t("register_complete_uploading", "جار رفع الصورة...") : t("register_complete_upload_button", "رفع الصورة والانتقال")}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 text-slate-400">
            <span>{t("register_complete_skip_text", "أو")}</span>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="font-black text-white underline underline-offset-4"
            >
              {t("register_complete_skip_button", "تخطي والذهاب للموقع")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
