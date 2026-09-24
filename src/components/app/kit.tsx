import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { generateSkillTest } from "@/lib/ai.functions";
import { recordTopicOutcome, notify } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("surface-card p-5", className)}>
      <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function Bullets({ items, empty = "Nothing to show." }: { items: string[]; empty?: string }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Chips({ items, tone = "default" }: { items: string[]; tone?: "default" | "good" | "bad" }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">None.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <Badge
          key={i}
          variant="outline"
          className={cn(tone === "good" && "border-success/50 text-success", tone === "bad" && "border-destructive/50 text-destructive")}
        >
          {t}
        </Badge>
      ))}
    </div>
  );
}

export function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong. Please try again.";
}

type Q = Awaited<ReturnType<typeof generateSkillTest>>["questions"][number];

/** Generates an AI test for a skill, grades it and feeds results into readiness + heatmap. */
export function SkillQuiz({ skill, area, difficulty = "mixed", count = 6, onDone }: {
  skill: string; area: string; difficulty?: "easy" | "medium" | "hard" | "mixed"; count?: number; onDone?: () => void;
}) {
  const gen = useServerFn(generateSkillTest);
  const qc = useQueryClient();
  const [questions, setQuestions] = useState<Q[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function start() {
    setBusy(true);
    setSubmitted(false);
    setAnswers({});
    try {
      const r = await gen({ data: { skill, difficulty, count } });
      setQuestions(r.questions);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!questions) return;
    const correct = questions.filter((q, i) => answers[i] === q.answerIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    setSubmitted(true);
    const level = score >= 80 ? "Advanced" : score >= 55 ? "Intermediate" : "Beginner";
    await supabase.from("skill_results").insert({ skill, score, verified_level: level, details: { questions, answers } as never });
    for (const [i, q] of questions.entries()) await recordTopicOutcome(q.topic || skill, area, answers[i] === q.answerIndex);
    await notify(`${skill} verified: ${score}%`, `Verified level: ${level}.`);
    qc.invalidateQueries();
    toast.success(`You scored ${score}% (${level})`);
    onDone?.();
  }

  if (!questions)
    return (
      <Button onClick={start} disabled={busy}>
        {busy ? "Generating questions…" : `Start ${skill} test`}
      </Button>
    );

  const score = Math.round((questions.filter((q, i) => answers[i] === q.answerIndex).length / questions.length) * 100);
  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">{q.type}</Badge><Badge variant="outline">{q.difficulty}</Badge><span>{q.topic}</span>
          </div>
          <p className="text-sm font-medium">{i + 1}. {q.prompt}</p>
          {q.code && <pre className="mt-2 overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs">{q.code}</pre>}
          <div className="mt-3 grid gap-2">
            {q.options.map((o, oi) => {
              const picked = answers[i] === oi;
              const right = submitted && oi === q.answerIndex;
              const wrong = submitted && picked && oi !== q.answerIndex;
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers({ ...answers, [i]: oi })}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    picked ? "border-primary bg-primary/10" : "border-border hover:bg-card",
                    right && "border-success bg-success/10",
                    wrong && "border-destructive bg-destructive/10",
                  )}
                >
                  {right && <CheckCircle2 className="size-4 text-success" />}
                  {wrong && <XCircle className="size-4 text-destructive" />}
                  {o}
                </button>
              );
            })}
          </div>
          {submitted && q.explanation && <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>}
        </div>
      ))}
      {submitted ? (
        <div className="flex items-center gap-3">
          <p className="font-display text-lg">Score: {score}%</p>
          <Button variant="outline" onClick={start} disabled={busy}>{busy ? "Generating…" : "New test"}</Button>
        </div>
      ) : (
        <Button onClick={submit} disabled={Object.keys(answers).length < questions.length}>
          Submit ({Object.keys(answers).length}/{questions.length} answered)
        </Button>
      )}
    </div>
  );
}
