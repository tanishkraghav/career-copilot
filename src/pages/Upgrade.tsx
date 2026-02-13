import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Check, CreditCard, Upload, MessageCircle, Loader2 } from "lucide-react";

const Upgrade = () => {
  const { user, profile, refreshProfile } = useAuth();
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
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're on Pro!</h1>
          <p className="text-muted-foreground">Enjoy unlimited outreach generations.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Upgrade to Pro</h1>
          <p className="text-muted-foreground">Get unlimited outreach generations</p>
        </div>

        <Card className="border-2 border-primary shadow-glow mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <span className="text-3xl font-extrabold text-foreground">₹299</span>
              <span className="text-muted-foreground text-base">/month</span>
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">or ₹199 one-time lifetime (limited)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Unlimited generations</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> All outreach types</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Generation history</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Priority support</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary rounded-lg p-4 text-center space-y-2">
              <p className="text-sm font-medium text-foreground">Pay via UPI</p>
              <p className="text-lg font-mono font-bold text-primary">tanishk@upi</p>
              <p className="text-xs text-muted-foreground">Send ₹299 (monthly) or ₹199 (lifetime)</p>
            </div>

            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20upgrade%20to%20Pro%20on%20OutreachCopilot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="w-4 h-4" /> Contact on WhatsApp
              </Button>
            </a>

            <div className="border-t border-border pt-4">
              <Label className="text-sm font-medium mb-2 block">Upload Payment Screenshot</Label>
              {submitted ? (
                <div className="text-center py-4 bg-accent/10 rounded-lg">
                  <Check className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm text-foreground font-medium">Screenshot submitted!</p>
                  <p className="text-xs text-muted-foreground">We'll verify and activate Pro within 24 hours.</p>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Upgrade;
