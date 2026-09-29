import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Bot, Braces, Briefcase, FileText, Github, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { PageCta, PageIntro, SiteChrome } from "@/components/site/SiteChrome";

const t = "Features — CareerForge AI";
const d = "Every CareerForge AI module: ATS resume analysis, GitHub project defense, adaptive interviews, skill verification, live jobs and roadmaps.";
export const Route = createFileRoute("/features")({
  head: () => ({ meta: [
    { title: t }, { name: "description", content: d },
    { property: "og:title", content: t }, { property: "og:description", content: d },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: FeaturesPage,
});

const features = [
  { icon: FileText, title: "ATS Resume Analyzer", body: "Upload a PDF, DOCX or TXT resume and get keyword coverage, formatting issues, missing sections and rewrite suggestions." },
  { icon: Github, title: "GitHub Project Analyzer", body: "Reads your repositories, infers the architecture and grades engineering practices like tests and CI/CD." },
  { icon: ShieldCheck, title: "AI Project Defense", body: "An interviewer that has actually read your project interrogates your design decisions." },
  { icon: Bot, title: "Adaptive Interviewer", body: "Each question depends on the quality of your last answer, not a fixed script." },
  { icon: Braces, title: "Skill Verification", body: "We don't ask if you know SQL — we test it and store claimed vs verified level." },
  { icon: Briefcase, title: "Live Job Matching", body: "Real openings scored against your resume and role with matched and missing skills." },
  { icon: RouteIcon, title: "Adaptive Roadmap", body: "30 / 60 / 90 day plans that rewrite themselves as your weaknesses shift." },
  { icon: BarChart3, title: "Weakness Heatmap", body: "Every wrong answer lands on a topic map that drives your next tasks." },
];

function FeaturesPage() {
  return (
    <SiteChrome>
      <PageIntro eyebrow="Features" title="Everything feeds one career profile" body="Connected modules, each writing signals back to the Career Intelligence Engine." />
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-16 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="surface-card flex gap-4 p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent"><f.icon className="size-5" /></span>
            <div>
              <h2 className="font-display text-lg font-semibold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          </div>
        ))}
      </section>
      <PageCta />
    </SiteChrome>
  );
}
