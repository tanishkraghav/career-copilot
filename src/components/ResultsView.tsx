import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, RefreshCw, Check, Mail, FileText, MessageSquare, Clock, Mic, TrendingUp, Lightbulb } from "lucide-react";

interface GenerationResult {
  cold_email: string;
  cover_letter: string;
  linkedin_dm: string;
  follow_ups: string[];
  interview_pitch: string;
  reply_probability: number;
  improvement_suggestions: string;
}

interface Props {
  result: GenerationResult;
  onBack: () => void;
  onRegenerate: () => void;
}

const ResultsView = ({ result, onBack, onRegenerate }: Props) => {
  const { toast } = useToast();
  const [editedResult, setEditedResult] = useState(result);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied!`, description: "Pasted to clipboard" });
  };

  const sections = [
    { key: "cold_email", title: "Cold Email", icon: Mail, content: editedResult.cold_email },
    { key: "cover_letter", title: "Cover Letter", icon: FileText, content: editedResult.cover_letter },
    { key: "linkedin_dm", title: "LinkedIn DM", icon: MessageSquare, content: editedResult.linkedin_dm },
    { key: "interview_pitch", title: "30-Sec Interview Pitch", icon: Mic, content: editedResult.interview_pitch },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Your Outreach Pack</h1>
        </div>
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate
        </Button>
      </div>

      {/* Reply Probability */}
      <Card className="border border-border mb-6">
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">Reply Probability</span>
            </div>
            <span className="text-2xl font-bold text-primary">{result.reply_probability}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-gradient-hero h-3 rounded-full transition-all duration-1000"
              style={{ width: `${result.reply_probability}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((s) => (
          <Card key={s.key} className="border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <s.icon className="w-4 h-4 text-primary" /> {s.title}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(s.content, s.title)}>
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={s.content}
                onChange={(e) => setEditedResult({ ...editedResult, [s.key]: e.target.value })}
                rows={6}
                className="resize-none text-sm"
              />
            </CardContent>
          </Card>
        ))}

        {/* Follow-ups */}
        {editedResult.follow_ups?.map((fu, i) => (
          <Card key={`followup-${i}`} className="border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Follow-up #{i + 1}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(fu, `Follow-up #${i + 1}`)}>
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={fu}
                onChange={(e) => {
                  const newFollowUps = [...editedResult.follow_ups];
                  newFollowUps[i] = e.target.value;
                  setEditedResult({ ...editedResult, follow_ups: newFollowUps });
                }}
                rows={4}
                className="resize-none text-sm"
              />
            </CardContent>
          </Card>
        ))}

        {/* Suggestions */}
        {editedResult.improvement_suggestions && (
          <Card className="border border-border bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-warning" /> Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{editedResult.improvement_suggestions}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
