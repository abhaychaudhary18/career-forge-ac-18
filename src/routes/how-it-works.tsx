import { createFileRoute } from "@tanstack/react-router";
import { PageCta, PageIntro, SiteChrome } from "@/components/site/SiteChrome";

const t = "How it works — CareerForge AI";
const d = "Four steps from resume upload to verified career readiness: bring evidence, get measured, close gaps, apply with proof.";
export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: t }, { name: "description", content: d },
    { property: "og:title", content: t }, { property: "og:description", content: d },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: HowPage,
});

const steps = [
  { title: "Bring your evidence", body: "Upload your resume, add your GitHub username and paste a target job description." },
  { title: "Get measured", body: "ATS scoring, project analysis, skill tests, coding tasks and adaptive interviews." },
  { title: "Close the gaps", body: "A roadmap and daily tasks generated from your actual weak areas." },
  { title: "Apply with proof", body: "Match to live jobs and export a career readiness report." },
];

function HowPage() {
  return (
    <SiteChrome>
      <PageIntro eyebrow="How it works" title="From resume to readiness in four steps" body="No guesswork — every score comes from evidence you produce." />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <ol className="relative space-y-6 border-l-2 border-border pl-8">
          {steps.map((s, i) => (
            <li key={s.title} className="surface-card relative p-6">
              <span className="absolute -left-[3.1rem] top-6 grid size-9 place-items-center rounded-full bg-foreground font-display text-sm text-background">{i + 1}</span>
              <h2 className="font-display text-lg font-semibold">{s.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <PageCta />
    </SiteChrome>
  );
}
