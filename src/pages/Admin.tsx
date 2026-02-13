import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, CreditCard, Check, X, ExternalLink, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  credits_remaining: number;
  plan_type: string;
  created_at: string;
}

interface Payment {
  id: string;
  user_id: string;
  screenshot_url: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [usersRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
      ]);
      setUsers(usersRes.data || []);
      setPayments(paymentsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  const togglePlan = async (userId: string, newPlan: string) => {
    setActionLoading(userId);
    const credits = newPlan === "pro" ? 999 : 0;
    await supabase.from("profiles").update({ plan_type: newPlan, credits_remaining: credits }).eq("user_id", userId);
    setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, plan_type: newPlan, credits_remaining: credits } : u));
    toast({ title: `User ${newPlan === "pro" ? "activated" : "deactivated"} Pro` });
    setActionLoading(null);
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    setActionLoading(paymentId);
    await supabase.from("payments").update({ status }).eq("id", paymentId);
    setPayments((prev) => prev.map((p) => p.id === paymentId ? { ...p, status } : p));
    toast({ title: `Payment ${status}` });
    setActionLoading(null);
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <p className="text-center text-muted-foreground py-12">Access denied. Admin only.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>

        {/* Payments */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment requests yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => {
                  const userEmail = users.find((u) => u.user_id === p.user_id)?.email || "Unknown";
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{userEmail}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm"><ExternalLink className="w-3.5 h-3.5" /></Button>
                        </a>
                        <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>
                          {p.status}
                        </Badge>
                        {p.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" disabled={actionLoading === p.id}
                              onClick={() => {
                                updatePaymentStatus(p.id, "approved");
                                togglePlan(p.user_id, "pro");
                              }}>
                              {actionLoading === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            </Button>
                            <Button size="sm" variant="outline" disabled={actionLoading === p.id}
                              onClick={() => updatePaymentStatus(p.id, "rejected")}>
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> All Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground">Credits: {u.credits_remaining} · Joined {new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.plan_type === "pro" ? "default" : "secondary"}>{u.plan_type}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === u.user_id}
                      onClick={() => togglePlan(u.user_id, u.plan_type === "pro" ? "free" : "pro")}
                    >
                      {actionLoading === u.user_id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : u.plan_type === "pro" ? "Deactivate" : "Activate Pro"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
