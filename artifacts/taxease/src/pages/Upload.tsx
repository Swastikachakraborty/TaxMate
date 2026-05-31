import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const platforms = ["Swiggy", "Upwork", "Uber", "Bank Statement", "Other"];

export default function Upload() {
  const [selectedPlatform, setSelectedPlatform] = useState("Upwork");
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Upload Income Data</h1>
        <p className="text-muted-foreground">Securely upload your invoices, payout statements, or bank PDFs. Our AI will extract the necessary data.</p>
      </header>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Select Source Platform</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <Badge 
              key={p} 
              variant={selectedPlatform === p ? "default" : "outline"}
              className={`cursor-pointer px-4 py-1.5 text-sm transition-all ${
                selectedPlatform === p 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-transparent text-muted-foreground hover:text-white border-border hover:border-muted-foreground"
              }`}
              onClick={() => setSelectedPlatform(p)}
              data-testid={`platform-${p.toLowerCase()}`}
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      <motion.div
        className="w-full"
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        animate={{ scale: isHovering ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className={`border-2 border-dashed transition-colors duration-300 ${isHovering ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
          <CardContent className="flex flex-col items-center justify-center py-20 px-4 text-center cursor-pointer">
            <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${isHovering ? "bg-primary/20" : "bg-white/5"}`}>
              <UploadCloud className={`w-8 h-8 ${isHovering ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Drop your income PDFs here</h3>
            <p className="text-sm text-muted-foreground mb-6">or click to browse from your computer</p>
            <Button variant="secondary" className="pointer-events-none">Select Files</Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Uploaded Files</h3>
        
        <div className="space-y-3">
          {[
            { name: "Upwork_April_2025.pdf", size: "1.2 MB", platform: "Upwork" },
            { name: "Swiggy_March_2025.pdf", size: "845 KB", platform: "Swiggy" }
          ].map((file, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border group"
            >
              <div className="p-2 rounded bg-primary/10">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <span className="text-xs text-muted-foreground">{file.platform}</span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <button className="p-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 shadow-lg shadow-primary/20 text-white border-0">
          Parse with AI
        </Button>
      </div>
    </motion.div>
  );
}
