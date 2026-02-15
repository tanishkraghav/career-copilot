import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ResultsView from "@/components/ResultsView";
import ResumeUpload from "@/components/ResumeUpload";
import { Sparkles, FileText, Building2, User, Loader2, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

interface GenerationResult {
  cold_email: string;
  cover_letter: string;
  linkedin_dm: string;
  follow_ups: string[];
  interview_pitch: string;
  reply_probability: number;
  improvement_suggestions: string;
}

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [tone, setTone] = useState("professional");
  const [emailLength, setEmailLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim() || !companyName.trim()) {
      toast({ title: "Missing fields", description: "Please fill in resume, job description, and company name.", variant: "destructive" });
      return;
    }

    if (profile && profile.plan_type === "free" && profile.credits_remaining <= 0) {
      navigate("/upgrade");
      return;
    }

    setGenerating(true);
    setResult(null);

    const steps = ["Analyzing resume...", "Matching skills with JD...", "Crafting personalized outreach..."];
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 1200));
    }

    try {
      const response = await supabase.functions.invoke("generate-outreach", {
        body: {
          resume_text: resumeText,
          job_description: jobDescription,
          company_name: companyName,
          company_website: companyWebsite,
          recruiter_name: recruiterName,
          tone,
          email_length: emailLength,
        },
      });

      if (response.error) {
        // Try to extract the actual error message from the response data
        const errorMsg = response.data?.error || response.error.message;
        throw new Error(errorMsg);
      }

      const data = response.data as GenerationResult;
      setResult(data);

      await supabase.from("generations").insert({
        user_id: user!.id,
        company_name: companyName,
        job_description: jobDescription,
        resume_text: resumeText,
        tone,
        email_length: emailLength,
        result: data as any,
      });

      await refreshProfile();
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setGenerating(false);
      setLoadingStep("");
      setCurrentStep(0);
    }
  };

  if (result) {
    return (
      <DashboardLayout>
        <ResultsView result={result} onBack={() => setResult(null)} onRegenerate={handleGenerate} />
      </DashboardLayout>
    );
  }

  const formSections = [
    { id: 1, label: "Resume", filled: !!resumeText.trim() },
    { id: 2, label: "Job Description", filled: !!jobDescription.trim() },
    { id: 3, label: "Company", filled: !!companyName.trim() },
    { id: 4, label: "Preferences", filled: true },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Generate Outreach</h1>
          <p className="text-muted-foreground">Fill in the details below to get your personalized outreach pack.</p>

          {/* Progress indicator */}
          <div className="mt-6 flex items-center gap-2">
            {formSections.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${s.filled ? "bg-primary" : "bg-secondary"}`} />
                {i < formSections.length - 1 && <div className="w-1" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {formSections.map(s => (
              <span key={s.id} className={`text-[10px] font-medium ${s.filled ? "text-primary" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <ResumeUpload value={resumeText} onChange={setResumeText} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border border-border rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="resize-none rounded-xl"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border border-border rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-600" />
                  </div>
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input placeholder="e.g. Razorpay" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Website</Label>
                    <Input placeholder="e.g. razorpay.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><User className="w-3 h-3" /> Recruiter Name (optional)</Label>
                  <Input placeholder="e.g. Priya Sharma" value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)} className="rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border border-border rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Settings2 className="w-4 h-4 text-amber-600" />
                  </div>
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="confident">Confident</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Length</Label>
                    <Select value={emailLength} onValueChange={setEmailLength}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <motion.div whileHover={{ scale: generating ? 1 : 1.02 }} whileTap={{ scale: generating ? 1 : 0.98 }}>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full h-14 bg-gradient-hero text-primary-foreground text-base shadow-glow rounded-xl"
              >
                {generating ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold">{loadingStep}</span>
                      <span className="text-[10px] opacity-70">Step {currentStep + 1} of 3</span>
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Outreach Pack
                    {profile && profile.plan_type === "free" && (
                      <span className="text-xs opacity-80 ml-1">({profile.credits_remaining} credits left)</span>
                    )}
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
