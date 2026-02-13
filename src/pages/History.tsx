import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar } from "lucide-react";

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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Generation History</h1>
        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : generations.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No generations yet. Create your first outreach pack!</p>
        ) : (
          <div className="space-y-3">
            {generations.map((g) => (
              <Card key={g.id} className="border border-border">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{g.company_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{g.tone} · {g.email_length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(g.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
