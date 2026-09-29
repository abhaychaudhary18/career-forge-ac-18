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
import { SiteChrome } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <SiteChrome>
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
                <Link to="/features">Explore features</Link>
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
    </SiteChrome>
  );
}
