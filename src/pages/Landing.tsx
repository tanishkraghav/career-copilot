import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Mail, FileText, MessageSquare, TrendingUp, Check } from "lucide-react";

const Landing = () => {
  const { user } = useAuth();

  const features = [
    { icon: Mail, title: "Cold Emails", desc: "Highly personalized recruiter emails that get replies" },
    { icon: FileText, title: "Cover Letters", desc: "Tailored cover letters matching JD requirements" },
    { icon: MessageSquare, title: "LinkedIn DMs", desc: "Crisp, professional LinkedIn messages" },
    { icon: TrendingUp, title: "Reply Score", desc: "AI-predicted reply probability for your outreach" },
  ];

  const steps = [
    { num: "01", title: "Paste Your Resume", desc: "Upload or paste your resume content" },
    { num: "02", title: "Add Job Description", desc: "Paste the JD you're applying for" },
    { num: "03", title: "Get Outreach Pack", desc: "Receive personalized emails, DMs & more" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">OutreachCopilot</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-gradient-hero text-primary-foreground">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-hero text-primary-foreground">
                    Start Free <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Zap className="w-3.5 h-3.5" /> Built for Indian Students & Freshers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 animate-slide-up">
            Stop Sending{" "}
            <span className="text-gradient-hero">Generic</span>{" "}
            Job Applications
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Generate personalized recruiter emails, cover letters, and LinkedIn DMs in seconds.
            Powered by AI that understands the Indian hiring landscape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow px-8 h-12 text-base">
                Start Free — 5 Credits <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">Everything You Need to Land That Role</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">One click generates your entire outreach pack, customized for every application.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-4xl font-extrabold text-gradient-hero mb-3">{s.num}</div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-surface">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="font-semibold text-lg text-foreground mb-1">Free</h3>
              <p className="text-3xl font-extrabold text-foreground mb-4">₹0</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> 5 generations total</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> All outreach types</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Copy & edit results</li>
              </ul>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
            <div className="bg-card border-2 border-primary rounded-xl p-8 relative shadow-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-hero text-primary-foreground text-xs font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">Pro</h3>
              <p className="text-3xl font-extrabold text-foreground mb-1">₹299<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <p className="text-xs text-muted-foreground mb-4">or ₹199 lifetime (limited offer)</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Unlimited generations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> All outreach types</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Priority support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Generation history</li>
              </ul>
              <Link to="/auth">
                <Button className="w-full bg-gradient-hero text-primary-foreground">Upgrade to Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 OutreachCopilot. Built for Indian students & freshers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
