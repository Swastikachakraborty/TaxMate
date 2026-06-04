import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, X, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api, type UploadHistory } from "@/lib/api";

const PLATFORMS = ["Swiggy", "Uber", "Upwork", "Fiverr", "Bank Statement", "Other"];

export default function Upload() {
  const { userId } = useAuth();
  const uid = userId ?? "demo_user";
  const queryClient = useQueryClient();

  const [selectedPlatform, setSelectedPlatform] = useState("Upwork");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState("");

  const history = useQuery<{ uploads: UploadHistory[]; total_files: number }>({
    queryKey: ["uploads", uid],
    queryFn: () => api.getUploadHistory(uid),
    enabled: !!uid,
  });

  async function processFiles(files: FileList | File[]) {
    const pdfs = Array.from(files).filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) { setError("Please select PDF files only."); return; }
    setError("");
    setUploading(true);
    setUploadProgress(10);

    // Simulate progress ticks while uploading
    const tick = setInterval(() => {
      setUploadProgress((p) => (p < 85 ? p + 15 : p));
    }, 800);

    try {
      const result = await api.uploadPdfs(uid, pdfs);
      clearInterval(tick);
      setUploadProgress(100);
      setLastResult(result);
      // Refresh dashboard queries
      queryClient.invalidateQueries({ queryKey: ["income", uid] });
      queryClient.invalidateQueries({ queryKey: ["tax", uid] });
      queryClient.invalidateQueries({ queryKey: ["uploads", uid] });
    } catch (e: any) {
      clearInterval(tick);
      setError(e.message ?? "Upload failed. Is the backend running?");
    } finally {
      setTimeout(() => { setUploading(false); setUploadProgress(0); }, 1200);
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [uid]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const uploads = history.data?.uploads ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8">

      <header>
        <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">Documents</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">Upload Statements</h1>
        <p className="text-[#6b675d]">
          Drop your earnings PDFs from Swiggy, Uber, Upwork, or your bank. Gemini AI will extract all income automatically.
        </p>
      </header>

      {/* Platform tabs */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#8c8577] uppercase tracking-wider">Select Platform</p>
        <div className="flex border-b border-[#e8e2d5] gap-6 overflow-x-auto">
          {PLATFORMS.map((p) => {
            const active = selectedPlatform === p;
            return (
              <button key={p} onClick={() => setSelectedPlatform(p)}
                className={`text-xs font-semibold pb-2.5 whitespace-nowrap transition-all relative -mb-px ${
                  active ? "text-[#d97706] border-b-2 border-b-[#d97706]" : "text-[#8c8577] hover:text-[#1a1a2e]"
                }`}>
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drop zone */}
        <div className="lg:col-span-2">
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`h-[220px] rounded-2xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center ${
              dragging ? "border-[#d97706] bg-[#f4ebd9]/30" : "border-[#e8e2d5] hover:border-[#d97706] hover:bg-[#f4ebd9]/10"
            }`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 text-[#d97706] animate-spin" />
                <p className="text-sm font-semibold text-[#1a1a2e]">Gemini is reading your PDF… ({uploadProgress}%)</p>
                <div className="w-44 h-1.5 bg-[#f4ebd9] rounded-full overflow-hidden">
                  <motion.div className="bg-[#d97706] h-full rounded-full"
                    animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.3 }} />
                </div>
                <p className="text-xs text-[#8c8577]">Extracting income data with AI…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <UploadCloud className="w-8 h-8 text-[#8c8577]" />
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">Drop PDFs here or click to browse</p>
                  <p className="text-xs text-[#8c8577] mt-1">
                    Swiggy · Uber · Upwork · Fiverr · Bank statements · Max 10 files
                  </p>
                </div>
                <span className="mt-1 px-5 py-2 rounded-full border border-[#1a1a2e] text-xs font-medium text-[#1a1a2e]">
                  Choose Files
                </span>
              </div>
            )}
            <input type="file" accept=".pdf" multiple onChange={onFileInput} className="hidden" />
          </label>

          {/* Last upload result */}
          {lastResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-[#e8e2d5] p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577]">Last Upload Result</p>
              {lastResult.file_results?.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[#1a1a2e] font-medium">
                    {r.status === "success"
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />}
                    {r.filename}
                  </span>
                  <span className="text-[#6b675d] text-xs">
                    {r.status === "success"
                      ? `${r.records_stored} records · ${r.platform_detected}`
                      : r.error}
                  </span>
                </div>
              ))}
              {lastResult.duplicate_detection?.duplicates_flagged > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
                  ⚠️ {lastResult.duplicate_detection.duplicates_flagged} duplicate transactions detected and excluded
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Upload history sidebar */}
        <div className="rounded-2xl border border-[#e8e2d5] p-5 space-y-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577] border-b border-[#e8e2d5] pb-3">
            Uploaded Statements ({history.data?.total_files ?? 0})
          </p>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            <AnimatePresence>
              {history.isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => <div key={i} className="h-10 bg-[#f4ebd9]/40 rounded-lg animate-pulse" />)}
                </div>
              ) : uploads.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-5 h-5 mx-auto text-[#8c8577] mb-2" />
                  <p className="text-xs text-[#8c8577] font-medium">No statements uploaded yet</p>
                </div>
              ) : (
                uploads.map((u, i) => (
                  <motion.div key={u.filename} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className="space-y-1.5 border-b border-[#e8e2d5]/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                      <span className="text-xs font-medium text-[#1a1a2e] truncate">{u.filename}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8c8577]">
                      <span className="uppercase font-semibold">{u.platform}</span>
                      <span>{u.record_count} records · ₹{(u.total_amount / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="w-full bg-[#f4ebd9] h-1 rounded-full">
                      <div className="bg-[#d97706] h-full rounded-full w-full" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {uploads.length > 0 && (
            <button onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["income", uid] });
              queryClient.invalidateQueries({ queryKey: ["tax", uid] });
            }}
              className="w-full h-11 rounded-xl bg-[#d97706] hover:bg-[#b46204] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Refresh Dashboard
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
