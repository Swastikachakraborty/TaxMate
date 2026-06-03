import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, X, RefreshCw, Sparkles } from "lucide-react";

const platforms = ["Swiggy", "Upwork", "Uber", "Bank Statement", "Other"];

interface UploadedFile {
  name: string;
  size: string;
  progress: number;
  platform: string;
}

const INITIAL_FILES: UploadedFile[] = [
  { name: "swiggy_earnings_jan.pdf", size: "2.4 MB", progress: 100, platform: "Swiggy" },
  { name: "upwork_invoice_q1.pdf", size: "1.8 MB", progress: 100, platform: "Upwork" },
];

export default function Upload() {
  const [selectedPlatform, setSelectedPlatform] = useState("Upwork");
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleMockUpload() {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const n = files.length + 1;
          setFiles((f) => [
            { name: `${selectedPlatform.toLowerCase()}_statement_${n}.pdf`, size: "240 KB", progress: 100, platform: selectedPlatform },
            ...f,
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 120);
  }

  function removeFile(idx: number) {
    setFiles((f) => f.filter((_, i) => i !== idx));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      <header>
        <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">Documents</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">Upload Invoices</h1>
        <p className="text-[#6b675d]">Upload your monthly statements. AI will extract and parse the necessary data.</p>
      </header>

      {/* Platform tabs */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#8c8577] uppercase tracking-wider">Platform Context</p>
        <div className="flex border-b border-[#e8e2d5] gap-6">
          {platforms.map((p) => {
            const active = selectedPlatform === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                data-testid={`platform-${p.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-xs font-semibold pb-2.5 transition-all relative -mb-px ${
                  active
                    ? "text-[#d97706] border-b-2 border-b-[#d97706]"
                    : "text-[#8c8577] hover:text-[#1a1a2e]"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drop zone */}
        <div className="lg:col-span-2">
          <div
            onClick={handleMockUpload}
            className="h-[200px] rounded-2xl border-2 border-dashed border-[#e8e2d5] hover:border-[#d97706] hover:bg-[#f4ebd9]/20 transition-colors cursor-pointer flex flex-col items-center justify-center"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 text-[#d97706] animate-spin" />
                <p className="text-sm font-semibold text-[#1a1a2e]">Parsing Statement ({uploadProgress}%)</p>
                <div className="w-40 h-1.5 bg-[#f4ebd9] rounded-full overflow-hidden">
                  <div className="bg-[#d97706] h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <UploadCloud className="w-8 h-8 text-[#8c8577]" />
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">Drop PDFs here</p>
                  <p className="text-xs text-[#8c8577] mt-1">or click to browse statements</p>
                </div>
                <button className="mt-1 px-5 py-2 rounded-full border border-[#1a1a2e] text-xs font-medium text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all pointer-events-none">
                  Select Files
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Files sidebar */}
        <div className="rounded-2xl border border-[#e8e2d5] p-5 space-y-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577] border-b border-[#e8e2d5] pb-3">
            Uploaded Statements
          </p>

          <div className="space-y-4 max-h-[260px] overflow-y-auto">
            <AnimatePresence>
              {files.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-5 h-5 mx-auto text-[#8c8577] mb-2" />
                  <p className="text-xs text-[#8c8577] font-medium">No files uploaded</p>
                </div>
              ) : (
                files.map((file, i) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="space-y-1.5 border-b border-[#e8e2d5]/60 pb-3 last:border-0 last:pb-0 group"
                    data-testid={`file-${i}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                        <span className="text-xs font-medium text-[#1a1a2e] truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="text-[#8c8577] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8c8577] font-medium">
                      <span>{file.size} · {file.platform}</span>
                      <div className="flex items-center gap-1 text-[#d97706]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Parsed</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#f4ebd9] h-1 rounded-full overflow-hidden">
                      <div className="bg-[#d97706] h-full rounded-full" style={{ width: `${file.progress}%` }} />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {files.length > 0 && (
            <button
              data-testid="parse-with-ai"
              className="w-full h-11 rounded-xl bg-[#d97706] hover:bg-[#b46204] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Parse With AI
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
