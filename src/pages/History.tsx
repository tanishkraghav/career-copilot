import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Generation {
  id: string;
  company_name: string;
  tone: string;
  email_length: string;
  created_at: string;
}

const History = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("generations")
        .select("id, company_name, tone, email_length, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      setGenerations(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-foreground mb-6">Generation History</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Loading history...</p>
          </div>
        ) : generations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No generations yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first outreach pack!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {generations.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border border-border rounded-2xl hover:shadow-md hover:border-primary/20 transition-all cursor-default group">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{g.company_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{g.tone} · {g.email_length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {new Date(g.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
