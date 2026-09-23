import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Braces,
  Briefcase,
  CheckCircle2,
  FileText,
  Github,
  Gauge,
  MessageSquare,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerForge AI — Know exactly how ready you are for your next tech role" },
      {
        name: "description",
        content:
          "CareerForge AI analyses your resume, GitHub projects, verified skills and interview performance to produce one continuously updated career readiness score.",
      },
      { property: "og:title", content: "CareerForge AI — Turn Your Resume Into Career Readiness" },
      {
        property: "og:description",
        content:
          "Resume and ATS analysis, GitHub project defense, adaptive AI interviews, skill verification and live job matching in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: FileText, title: "ATS Resume Analyzer", body: "Upload a resume and get keyword coverage, formatting issues, missing sections and rewrite suggestions." },
  { icon: Github, title: "GitHub Project Analyzer", body: "Reads your repositories, infers the architecture and grades engineering practices." },
  { icon: ShieldCheck, title: "AI Project Defense", body: "An interviewer that has actually read your project interrogates your design decisions." },
  { icon: Bot, title: "Adaptive Interviewer", body: "Each question depends on the quality of your last answer, not a fixed script." },
  { icon: Braces, title: "Skill Verification", body: "We don't ask if you know SQL — we test it and store claimed vs verified level." },
  { icon: Briefcase, title: "Live Job Matching", body: "Real openings scored against your verified profile with matched and missing skills." },
  { icon: RouteIcon, title: "Adaptive Roadmap", body: "30 / 60 / 90 day plans that rewrite themselves as your weaknesses shift." },
  { icon: BarChart3, title: "Weakness Heatmap", body: "Every wrong answer lands on a topic map that drives your next tasks." },
];

const steps = [
  { title: "Bring your evidence", body: "Resume, GitHub username and a target job description." },
  { title: "Get measured", body: "ATS scoring, project analysis, skill tests, coding tasks and adaptive interviews." },
  { title: "Close the gaps", body: "A roadmap and daily tasks generated from your actual weak areas." },
  { title: "Apply with proof", body: "Match to live jobs and export a career readiness report." },
];

const faqs = [
  { q: "Is this just a resume checker?", a: "No. Resume scoring is one of seven signals. GitHub projects, verified skills, coding results, interview performance, communication and job fit all feed the same readiness engine." },
  { q: "Do I need to connect a private GitHub account?", a: "No. Public repository URLs or a username are enough, and private repository contents are never displayed publicly." },
  { q: "How is the readiness score calculated?", a: "A configurable weighted model, not an average. Signals you haven't produced yet are excluded rather than assumed, so the score only rises with real evidence." },
  { q: "What happens when I fail a topic?", a: "The topic's weakness weight increases, a revision task is created, your roadmap is adjusted and future interview questions target it." },
];

function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#intelligence" className="transition-colors hover:text-foreground">Intelligence</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm"><Link to="/dashboard">Open dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
                <Button asChild size="sm"><Link to="/auth" search={{ mode: "signup" }}>Get started</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="grid-backdrop relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-accent" /> Career intelligence, not another checklist
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Know exactly how ready you are for your{" "}
              <span className="text-gradient">next tech role.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              CareerForge AI combines resume and ATS analysis, GitHub project review, practical skill
              verification, adaptive AI interviews and live job matching into a single readiness profile
              that updates every time you practise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start career analysis <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features">Explore features</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {["Resume → ATS", "GitHub → Project defense", "Skills → Verified", "Jobs → Matched"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-success" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass-panel rounded-3xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Career readiness</p>
                <p className="font-display text-lg font-semibold">Software Engineer track</p>
              </div>
              <Gauge className="size-5 text-accent" />
            </div>
            <div className="mt-4 flex items-center gap-5">
              <ScoreRing value={86} label="Overall" />
              <div className="grid flex-1 grid-cols-2 gap-2 text-xs">
                {[
                  ["ATS", 84],
                  ["GitHub", 91],
                  ["Technical", 78],
                  ["Interview", 82],
                  ["Coding", 88],
                  ["Job fit", 88],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-lg border border-border bg-surface px-3 py-2">
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-display text-base font-semibold">{value}%</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["DBMS weakness increased after mock interview", "warning"],
                ["New 92% matching backend role found", "success"],
                ["Project defense complete — architecture depth 78%", "accent"],
              ].map(([text, tone]) => (
                <div key={text as string} className="flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: `var(--${tone === "accent" ? "accent" : tone})` }}
                  />
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative preview — your dashboard starts empty.</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-3xl font-semibold">Everything feeds one profile</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Nine connected modules. Each one writes signals back to the Career Intelligence Engine.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="surface-card p-5"
            >
              <f.icon className="size-5 text-accent" />
              <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border bg-surface/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="surface-card p-5">
                <span className="font-display text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-2 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence loop */}
      <section id="intelligence" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold">The feedback loop is the product</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Fail a few database questions in a mock interview and CareerForge doesn't just print a score.
              It raises your DBMS weakness weight, schedules revision tasks, adds SQL practice, reshapes your
              roadmap, targets future interview questions and lowers the technical component of your readiness
              score until you prove the gap is closed.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {["Resume", "Skills", "GitHub", "Verified skills", "Job requirements", "Skill gap", "Roadmap", "Tasks", "Coding", "Interview", "Project defense", "Readiness score"].map((node) => (
                <div key={node} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <Target className="size-3.5 text-accent" /> {node}
                </div>
              ))}
            </div>
          </div>
          <div className="surface-card p-6">
            <h3 className="font-display text-lg font-semibold">Project defense, in practice</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground">Interviewer</p>
                <p className="mt-1">Your API writes to the database inside the request handler. What happens under a burst of 500 concurrent writes?</p>
              </div>
              <div className="rounded-xl border border-border bg-surface/60 p-3">
                <p className="text-xs text-muted-foreground">You</p>
                <p className="mt-1 text-muted-foreground">I'd add a queue…</p>
              </div>
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
                <p className="text-xs text-muted-foreground">Adaptive follow-up</p>
                <p className="mt-1">Good instinct — which consistency guarantee do you lose, and how would the client know its write succeeded?</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="size-3.5" /> Questions are generated from your repository, not a question bank.
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-surface/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-semibold">Built for candidates who want proof</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["“The project defense round found three things in my own repo I couldn't explain. That was the whole point.”", "Final-year CS student"],
              ["“Claimed advanced Python, verified intermediate. Harsh, useful, and it fixed my resume.”", "Backend developer"],
              ["“The roadmap actually changed after I failed DBMS twice instead of staying a static checklist.”", "Career switcher"],
            ].map(([quote, who]) => (
              <div key={who} className="surface-card p-5">
                <p className="text-sm">{quote}</p>
                <p className="mt-3 text-xs text-muted-foreground">{who}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Illustrative quotes shown while the platform is in early access.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="font-display text-3xl font-semibold">Questions</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="surface-card grid-backdrop flex flex-col items-center gap-4 p-12 text-center">
          <h2 className="font-display text-3xl font-semibold">Turn your resume into career readiness.</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Start with one resume and one GitHub repository. The score builds from there.
          </p>
          <Button asChild size="lg">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start career analysis <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p>© {new Date().getFullYear()} CareerForge AI. Turn Your Resume Into Career Readiness.</p>
        </div>
      </footer>
    </div>
  );
}
