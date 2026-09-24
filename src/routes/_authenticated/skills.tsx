import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, SkillQuiz } from "@/components/app/kit";
import { useIntelligence, useProfile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({ meta: [{ title: "Skill Verification — CareerForge AI" }, { name: "description", content: "Prove the skills you claim with practical AI tests." }] }),
  component: SkillsPage,
});

const CATEGORIES = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "Git", "Docker", "System Design", "Operating Systems", "Computer Networks"];

function SkillsPage() {
  const { data: profile } = useProfile();
  const { data } = useIntelligence();
  const [skill, setSkill] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const all = [...new Set([...(profile?.skills ?? []), ...CATEGORIES])];
  const results = data?.skills ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Practical Skill Verification" description="Claimed skills vs verified skills. Pick a skill and prove it with MCQs, output prediction, debugging and scenarios." />
      <Section title="Choose a skill">
        <div className="flex flex-wrap gap-2">
          {all.map((s) => (
            <button key={s} onClick={() => setSkill(s)} className={cn("rounded-full border px-3 py-1 text-sm", skill === s ? "border-primary bg-primary/15" : "border-border hover:bg-card")}>{s}</button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          {(["easy", "medium", "hard", "mixed"] as const).map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} className={cn("rounded-md border px-3 py-1 text-xs capitalize", difficulty === d ? "border-accent text-accent" : "border-border text-muted-foreground")}>{d}</button>
          ))}
        </div>
      </Section>
      {skill && <Section title={`${skill} test`}><SkillQuiz key={`${skill}-${difficulty}`} skill={skill} area="skills" difficulty={difficulty} count={8} /></Section>}
      <Section title="Verified results">
        {!results.length ? <p className="text-sm text-muted-foreground">No verified skills yet.</p> : (
          <div className="divide-y divide-border">
            {results.map((r) => {
              const claimed = (profile?.skills ?? []).includes(String(r["skill"]));
              return (
                <div key={String(r["id"])} className="flex items-center justify-between py-2 text-sm">
                  <span>{String(r["skill"])} {claimed && <Badge variant="outline" className="ml-2">claimed</Badge>}</span>
                  <span className="text-muted-foreground">{String(r["verified_level"])} · <span className="text-foreground">{String(r["score"])}%</span></span>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
