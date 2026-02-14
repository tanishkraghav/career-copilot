import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ResumeUploadProps {
  value: string;
  onChange: (text: string) => void;
}

const ResumeUpload = ({ value, onChange }: ResumeUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => item.str)
        .join(" ");
      pages.push(text);
    }

    return pages.join("\n\n");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const clearFile = () => {
    setFileName(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Resume
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

        {!fileName ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={parsing}
            className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
          >
            {parsing ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Extracting text from PDF...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8" />
                <span className="text-sm font-medium">Upload your resume (PDF)</span>
                <span className="text-xs">Max 10MB</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium truncate flex-1">{fileName}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Textarea
          placeholder="Or paste your resume content here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="resize-none text-sm"
        />
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
