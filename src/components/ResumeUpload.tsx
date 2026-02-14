import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ResumeUploadProps {
  value: string;
  onChange: (text: string) => void;
}

const ResumeUpload = ({ value, onChange }: ResumeUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");
      pages.push(text);
    }
    return pages.join("\n\n");
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }

    setParsing(true);
    setFileName(file.name);
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        toast({ title: "No text found", description: "The PDF appears to be image-based. Please paste your resume text instead.", variant: "destructive" });
        setFileName(null);
      } else {
        onChange(text);
        toast({ title: "Resume parsed!", description: "Text extracted successfully from your PDF." });
      }
    } catch (err) {
      console.error("PDF parse error:", err);
      toast({ title: "Parse failed", description: "Could not read the PDF. Try pasting your resume text instead.", variant: "destructive" });
      setFileName(null);
    } finally {
      setParsing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearFile = () => {
    setFileName(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="border border-border rounded-2xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {!fileName ? (
            <motion.button
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              disabled={parsing}
              className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {parsing ? (
                <>
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <span className="text-sm font-medium">Extracting text from PDF...</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload className="w-10 h-10" />
                  </motion.div>
                  <span className="text-sm font-medium">Drop your resume here or click to upload</span>
                  <span className="text-xs text-muted-foreground">PDF only · Max 10MB</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl"
            >
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span className="text-sm font-medium truncate flex-1 text-foreground">{fileName}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={clearFile}>
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Textarea
          placeholder="Or paste your resume content here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="resize-none text-sm rounded-xl"
        />
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
