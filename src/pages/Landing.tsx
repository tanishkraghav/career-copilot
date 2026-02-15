import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Mail, FileText, MessageSquare, TrendingUp, Check, Star, Users, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const Landing = () => {
  const { user } = useAuth();

  const features = [
    { icon: Mail, title: "Cold Emails", desc: "Highly personalized recruiter emails that get replies", color: "bg-blue-500/10 text-blue-600" },
    { icon: FileText, title: "Cover Letters", desc: "Tailored cover letters matching JD requirements", color: "bg-emerald-500/10 text-emerald-600" },
    { icon: MessageSquare, title: "LinkedIn DMs", desc: "Crisp, professional LinkedIn messages", color: "bg-violet-500/10 text-violet-600" },
    { icon: TrendingUp, title: "Reply Score", desc: "AI-predicted reply probability for your outreach", color: "bg-amber-500/10 text-amber-600" },
  ];

  const steps = [
    { num: "01", title: "Upload Your Resume", desc: "Drop your PDF and we extract everything automatically", emoji: "📄" },
    { num: "02", title: "Add Job Description", desc: "Paste the JD you're targeting for best results", emoji: "🎯" },
    { num: "03", title: "Get Outreach Pack", desc: "Receive personalized emails, DMs, pitch & more", emoji: "🚀" },
  ];

  const stats = [
    { value: "10K+", label: "Messages Generated" },
    { value: "85%", label: "Avg Reply Rate" },
    { value: "500+", label: "Students Helped" },
    { value: "30s", label: "Generation Time" },
  ];

  const testimonials = [
    { name: "Priya S.", role: "IIT Delhi, Final Year", text: "Got 3 interview calls in a week using these cold emails. The personalization is unreal!", rating: 5 },
    { name: "Arjun M.", role: "NIT Trichy, CS Graduate", text: "Landed my dream internship at a YC startup. The LinkedIn DMs worked like magic.", rating: 5 },
    { name: "Sneha R.", role: "BITS Pilani, ECE", text: "Finally stopped sending generic applications. My response rate went from 2% to 35%.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center"
            >
              <Zap className="w-5 h-5 text-primary-foreground" />
            </motion.div>
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
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="bg-gradient-hero text-primary-foreground">
                      Start Free <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 lg:py-36 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-[10%] w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Built for Indian Students & Freshers
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]"
          >
            Stop Sending{" "}
            <span className="text-gradient-hero relative">
              Generic
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-hero rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>{" "}
            <br className="hidden sm:block" />
            Job Applications
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Generate personalized recruiter emails, cover letters, and LinkedIn DMs in seconds.
            Powered by AI that understands the Indian hiring landscape.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={user ? "/dashboard" : "/auth"}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow px-8 h-14 text-base rounded-xl">
                  {user ? "Go to Dashboard" : "Start Free — 5 Credits"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            {!user && <p className="text-sm text-muted-foreground">No credit card required</p>}
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i + 4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-gradient-hero">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-surface relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything You Need to Land That Role</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">One click generates your entire outreach pack, customized for every application.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleIn}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-default group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleIn}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-5 shadow-glow text-3xl"
                >
                  {s.emoji}
                </motion.div>
                <span className="text-xs font-mono text-primary font-semibold tracking-wider">{s.num}</span>
                <h3 className="font-bold text-foreground mt-1 mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Loved by Students</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Join hundreds of students who landed their dream roles.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground">Start free, upgrade when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-8 transition-shadow hover:shadow-lg"
            >
              <h3 className="font-semibold text-lg text-foreground mb-1">Free</h3>
              <p className="text-4xl font-extrabold text-foreground mb-6">₹0</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> 5 generations total</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> All outreach types</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Copy & edit results</li>
              </ul>
              <Link to="/auth">
                <Button variant="outline" className="w-full rounded-xl h-11">Get Started</Button>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="bg-card border-2 border-primary rounded-2xl p-8 relative shadow-glow transition-shadow hover:shadow-xl"
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-hero text-primary-foreground text-xs font-semibold rounded-full"
              >
                ✨ Most Popular
              </motion.div>
              <h3 className="font-semibold text-lg text-foreground mb-1">Pro</h3>
              <p className="text-4xl font-extrabold text-foreground mb-1">₹299<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <p className="text-xs text-muted-foreground mb-6">or ₹199 lifetime (limited offer)</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Unlimited generations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> All outreach types</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Priority support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Generation history</li>
              </ul>
              <Link to="/auth">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="w-full bg-gradient-hero text-primary-foreground rounded-xl h-11">Upgrade to Pro</Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-surface">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Stand Out?</h2>
            <p className="text-muted-foreground mb-8">Your personalized outreach pack is just one click away.</p>
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow px-10 h-14 text-base rounded-xl">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 OutreachCopilot. Built with ❤️ for Indian students & freshers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
