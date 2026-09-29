import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageCta, PageIntro, SiteChrome } from "@/components/site/SiteChrome";

const t = "FAQ — CareerForge AI";
const d = "Answers about CareerForge AI: readiness scoring, GitHub privacy, resume formats and adaptive roadmaps.";
export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: t }, { name: "description", content: d },
    { property: "og:title", content: t }, { property: "og:description", content: d },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: FaqPage,
});

const faqs = [
  { q: "Is this just a resume checker?", a: "No. Resume scoring is one of seven signals. GitHub projects, verified skills, coding results, interview performance, communication and job fit all feed the same readiness engine." },
  { q: "Which resume formats can I upload?", a: "PDF (text-based), DOCX and TXT files up to 10 MB." },
  { q: "Do I need to connect a private GitHub account?", a: "No. Public repository URLs or a username are enough, and private repository contents are never displayed publicly." },
  { q: "How is the readiness score calculated?", a: "A weighted model, not an average. Signals you haven't produced yet are excluded rather than assumed, so the score only rises with real evidence." },
  { q: "What happens when I fail a topic?", a: "The topic's weakness weight increases, a revision task is created, your roadmap is adjusted and future interview questions target it." },
];

function FaqPage() {
  return (
    <SiteChrome>
      <PageIntro eyebrow="FAQ" title="Questions, answered" body="Everything you need to know before your first analysis." />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Accordion type="single" collapsible className="surface-card px-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <PageCta />
    </SiteChrome>
  );
}
