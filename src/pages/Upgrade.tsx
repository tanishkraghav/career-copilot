import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Check, CreditCard, Upload, MessageCircle, Loader2, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

const Upgrade = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(filePath);

      await supabase.from("payments").insert({
        user_id: user.id,
        screenshot_url: publicUrl,
        status: "pending",
      });

      setSubmitted(true);
      toast({ title: "Screenshot uploaded!", description: "We'll verify your payment and activate Pro shortly." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (profile?.plan_type === "pro") {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow"
          >
            <Crown className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're on Pro!</h1>
          <p className="text-muted-foreground">Enjoy unlimited outreach generations. 🎉</p>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow"
          >
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Upgrade to Pro</h1>
          <p className="text-muted-foreground">Get unlimited outreach generations</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-primary shadow-glow mb-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-center">
                <span className="text-4xl font-extrabold text-foreground">₹299</span>
                <span className="text-muted-foreground text-base">/month</span>
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">or ₹199 one-time lifetime (limited)</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                {["Unlimited generations", "All outreach types", "Generation history", "Priority support"].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-accent" /> {item}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                Payment Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 rounded-xl p-5 text-center space-y-2 border border-border">
                <p className="text-sm font-medium text-foreground">Pay via UPI</p>
                <p className="text-xl font-mono font-bold text-primary">tanishk@upi</p>
                <p className="text-xs text-muted-foreground">Send ₹299 (monthly) or ₹199 (lifetime)</p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20upgrade%20to%20Pro%20on%20OutreachCopilot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full gap-2 rounded-xl h-11">
                    <MessageCircle className="w-4 h-4" /> Contact on WhatsApp
                  </Button>
                </a>
              </motion.div>

              <div className="border-t border-border pt-4">
                <Label className="text-sm font-medium mb-3 block">Upload Payment Screenshot</Label>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-5 bg-accent/10 border border-accent/20 rounded-xl"
                  >
                    <Check className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-sm text-foreground font-medium">Screenshot submitted!</p>
                    <p className="text-xs text-muted-foreground mt-1">We'll verify and activate Pro within 24 hours.</p>
                  </motion.div>
                ) : (
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      disabled={uploading}
                      className="cursor-pointer rounded-xl"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Upgrade;
