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
import { Sparkles, FileText, Building2, User, Loader2 } from "lucide-react";

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

      if (response.error) throw new Error(response.error.message);

      const data = response.data as GenerationResult;
      setResult(data);

      // Save generation
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
    }
  };

  if (result) {
    return (
      <DashboardLayout>
        <ResultsView result={result} onBack={() => setResult(null)} onRegenerate={handleGenerate} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Generate Outreach</h1>
          <p className="text-muted-foreground">Fill in the details below to get your personalized outreach pack.</p>
        </div>

        <div className="space-y-6">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume content here... Include your skills, projects, internships, education etc."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input placeholder="e.g. Razorpay" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Company Website</Label>
                  <Input placeholder="e.g. razorpay.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><User className="w-3 h-3" /> Recruiter Name (optional)</Label>
                <Input placeholder="e.g. Priya Sharma" value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full h-12 bg-gradient-hero text-primary-foreground text-base shadow-glow"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingStep}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Outreach Pack
                {profile && profile.plan_type === "free" && (
                  <span className="text-xs opacity-80">({profile.credits_remaining} credits left)</span>
                )}
              </span>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
