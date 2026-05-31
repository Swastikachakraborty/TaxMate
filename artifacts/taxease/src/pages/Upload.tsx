import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, CheckCircle2, X } from "lucide-react";

const platforms = ["Swiggy", "Upwork", "Uber", "Bank Statement", "Other"];

export default function Upload() {
  const [selectedPlatform, setSelectedPlatform] = useState("Upwork");
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      <header>
        <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">FY 2024–2025</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">Upload Income Data</h1>
        <p className="text-[#6b675d] leading-relaxed">
          Securely upload your invoices, payout statements, or bank PDFs. Our AI will extract the necessary data.
        </p>
      </header>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider">Select Source Platform</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              data-testid={`platform-${p.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedPlatform === p
                  ? "bg-[#d97706] text-white border-[#d97706]"
                  : "bg-transparent text-[#6b675d] border-[#e8e2d5] hover:text-[#1a1a2e] hover:border-[#1a1a2e]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        animate={{ scale: isHovering ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`rounded-2xl border-2 border-dashed transition-colors duration-300 cursor-pointer ${
          isHovering ? "border-[#d97706] bg-[#f4ebd9]/30" : "border-[#e8e2d5] bg-transparent"
        }`}
      >
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${isHovering ? "bg-[#d97706]/15" : "bg-[#f4ebd9]/40"}`}>
            <UploadCloud className={`w-8 h-8 ${isHovering ? "text-[#d97706]" : "text-[#8c8577]"}`} />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-1">Drop your income PDFs here</h3>
          <p className="text-sm text-[#8c8577] mb-6">or click to browse from your computer</p>
          <button className="px-5 py-2 rounded-full border border-[#1a1a2e] text-sm font-medium text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all">
            Select Files
          </button>
        </div>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider">Uploaded Files</h3>
        <div className="space-y-3">
          {[
            { name: "Upwork_April_2025.pdf", size: "1.2 MB", platform: "Upwork" },
            { name: "Swiggy_March_2025.pdf", size: "845 KB", platform: "Swiggy" },
          ].map((file, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-[#e8e2d5] group hover:bg-[#fdfbf7] transition-colors"
            >
              <div className="p-2 rounded-lg bg-[#f4ebd9]/50 text-[#d97706]">
                <File className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a2e] truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#8c8577]">{file.size}</span>
                  <span className="text-[#e8e2d5]">·</span>
                  <span className="text-xs text-[#8c8577]">{file.platform}</span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <button
                className="p-1.5 text-[#8c8577] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`remove-file-${i}`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          data-testid="parse-with-ai"
          className="w-full h-14 rounded-2xl bg-[#d97706] hover:bg-[#b46204] text-white text-base font-semibold transition-all shadow-sm"
        >
          Parse with AI
        </button>
      </div>
    </motion.div>
  );
}
