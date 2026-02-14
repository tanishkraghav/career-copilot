import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, RefreshCw, Check, Mail, FileText, MessageSquare, Clock, Mic, TrendingUp, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({ title: `${label} copied!`, description: "Pasted to clipboard" });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections = [
    { key: "cold_email", title: "Cold Email", icon: Mail, content: editedResult.cold_email, color: "bg-blue-500/10 text-blue-600" },
    { key: "cover_letter", title: "Cover Letter", icon: FileText, content: editedResult.cover_letter, color: "bg-emerald-500/10 text-emerald-600" },
    { key: "linkedin_dm", title: "LinkedIn DM", icon: MessageSquare, content: editedResult.linkedin_dm, color: "bg-violet-500/10 text-violet-600" },
    { key: "interview_pitch", title: "30-Sec Interview Pitch", icon: Mic, content: editedResult.interview_pitch, color: "bg-rose-500/10 text-rose-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Your Outreach Pack</h1>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="sm" onClick={onRegenerate} className="rounded-xl">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate
          </Button>
        </motion.div>
      </motion.div>

      {/* Reply Probability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border border-border mb-6 rounded-2xl overflow-hidden">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Reply Probability</span>
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-3xl font-extrabold text-gradient-hero"
              >
                {result.reply_probability}%
              </motion.span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-hero h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.reply_probability}%` }}
                transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            <Card className="border border-border rounded-2xl hover:shadow-md transition-shadow group">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  {s.title}
                </CardTitle>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(s.content, s.title, s.key)}
                    className="rounded-lg"
                  >
                    <AnimatePresence mode="wait">
                      {copiedKey === s.key ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 text-accent">
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={s.content}
                  onChange={(e) => setEditedResult({ ...editedResult, [s.key]: e.target.value })}
                  rows={6}
                  className="resize-none text-sm rounded-xl border-border/50 focus:border-primary/30"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Follow-ups */}
        {editedResult.follow_ups?.map((fu, i) => (
          <motion.div
            key={`followup-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
          >
            <Card className="border border-border rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  Follow-up #{i + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(fu, `Follow-up #${i + 1}`, `followup-${i}`)}
                  className="rounded-lg"
                >
                  {copiedKey === `followup-${i}` ? (
                    <span className="flex items-center gap-1 text-accent"><Check className="w-3.5 h-3.5" /> Copied!</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy</span>
                  )}
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
                  className="resize-none text-sm rounded-xl"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Suggestions */}
        {editedResult.improvement_suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border border-warning/30 bg-warning/5 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-warning/20 text-warning flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{editedResult.improvement_suggestions}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultsView;
