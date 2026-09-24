import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, SkillQuiz } from "@/components/app/kit";
import { useIntelligence } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dsa")({
  head: () => ({ meta: [{ title: "DSA & CS Prep — CareerForge AI" }, { name: "description", content: "DSA patterns and CS fundamentals with adaptive quizzes." }] }),
  component: DsaPage,
});

const DSA = ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search", "Linked List", "Trees", "Tries", "Heap / Priority Queue", "Backtracking", "Graphs", "Dynamic Programming", "Greedy", "Intervals", "Bit Manipulation"];
const CS = ["Operating Systems", "DBMS", "SQL", "OOP", "Computer Networks", "System Design"];

function DsaPage() {
  const { data } = useIntelligence();
  const [topic, setTopic] = useState<{ name: string; area: string } | null>(null);
  const weight = (t: string) => {
    const w = (data?.weakness ?? []).find((x) => String(x["topic"]).toLowerCase() === t.toLowerCase());
    return w ? Number(w["weight"]) : null;
  };
  const tile = (t: string, area: string) => {
    const w = weight(t);
    return (
      <button key={t} onClick={() => setTopic({ name: t, area })} className={cn("rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary/60", topic?.name === t ? "border-primary bg-primary/10" : "border-border")}>
        <p className="font-medium">{t}</p>
        <p className={cn("text-xs", w == null ? "text-muted-foreground" : w >= 50 ? "text-destructive" : "text-success")}>{w == null ? "Not practiced" : w >= 50 ? `Needs revision (${w}% misses)` : `Solid (${w}% misses)`}</p>
      </button>
    );
  };
  return (
    <div className="space-y-6">
      <PageHeader title="DSA & CS Fundamentals" description="Pick a topic to take a quick adaptive quiz. Weak topics are flagged in red and feed your roadmap." />
      <Section title="DSA patterns"><div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">{DSA.map((t) => tile(t, "dsa"))}</div></Section>
      <Section title="CS subjects"><div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{CS.map((t) => tile(t, "cs"))}</div></Section>
      {topic && <Section title={`${topic.name} quiz`}><SkillQuiz key={topic.name} skill={topic.name} area={topic.area} count={6} /></Section>}
    </div>
  );
}
