import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { reviewCodeSubmission } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { notify, recordTopicOutcome } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, Bullets, SkillQuiz, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Editor = lazy(() => import("@monaco-editor/react"));

export const Route = createFileRoute("/_authenticated/assessments")({
  head: () => ({ meta: [{ title: "Assessments — CareerForge AI" }, { name: "description", content: "Coding challenges and full mock assessments." }] }),
  component: AssessmentsPage,
});

type Problem = { slug: string; title: string; topic: string; statement: string; tests: { input: string; expected: string }[] };
const PROBLEMS: Problem[] = [
  { slug: "two-sum", title: "Two Sum", topic: "Arrays & Hashing", statement: "Given an array nums and target, return indices of the two numbers that add up to target. Read nums as a space-separated line and target on the next line; print the two indices separated by a space.", tests: [{ input: "2 7 11 15\n9", expected: "0 1" }, { input: "3 2 4\n6", expected: "1 2" }, { input: "3 3\n6", expected: "0 1" }] },
  { slug: "valid-parentheses", title: "Valid Parentheses", topic: "Stack", statement: "Given a string of ()[]{} characters, print true if brackets are balanced and correctly nested, else false.", tests: [{ input: "()[]{}", expected: "true" }, { input: "(]", expected: "false" }, { input: "{[()]}", expected: "true" }] },
  { slug: "max-subarray", title: "Maximum Subarray", topic: "Dynamic Programming", statement: "Given space-separated integers, print the largest sum of a contiguous subarray.", tests: [{ input: "-2 1 -3 4 -1 2 1 -5 4", expected: "6" }, { input: "1", expected: "1" }, { input: "-3 -1 -2", expected: "-1" }] },
  { slug: "binary-search", title: "Binary Search", topic: "Binary Search", statement: "Given a sorted space-separated array and a target on the next line, print the index of target or -1.", tests: [{ input: "-1 0 3 5 9 12\n9", expected: "4" }, { input: "-1 0 3 5 9 12\n2", expected: "-1" }] },
];
const LANGS = { python: "Python", javascript: "JavaScript", java: "Java", cpp: "C++" } as const;

function Coding() {
  const review = useServerFn(reviewCodeSubmission);
  const qc = useQueryClient();
  const [p, setP] = useState(PROBLEMS[0]!);
  const [lang, setLang] = useState<keyof typeof LANGS>("python");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Awaited<ReturnType<typeof review>> | null>(null);

  async function submit() {
    setBusy(true);
    try {
      const r = await review({ data: { title: p.title, statement: p.statement, language: LANGS[lang], code, tests: p.tests } });
      setRes(r);
      await supabase.from("coding_submissions").insert({ problem_slug: p.slug, problem_title: p.title, language: lang, code, passed: r.passed, total: r.total, score: r.score, result: r as never });
      await recordTopicOutcome(p.topic, "dsa", r.passed === r.total && r.total > 0);
      await notify(`${p.title}: ${r.passed}/${r.total} tests`, `Coding score ${r.score}.`);
      qc.invalidateQueries();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-3 lg:col-span-2">
        <div className="flex flex-wrap gap-2">
          {PROBLEMS.map((x) => <button key={x.slug} onClick={() => { setP(x); setRes(null); }} className={cn("rounded-md border px-2.5 py-1 text-xs", p.slug === x.slug ? "border-primary bg-primary/10" : "border-border")}>{x.title}</button>)}
        </div>
        <Section title={p.title}>
          <p className="text-sm">{p.statement}</p>
          <p className="mt-3 text-xs text-muted-foreground">Sample: <span className="font-mono">{p.tests[0]!.input.replace("\n", " ⏎ ")}</span> → <span className="font-mono">{p.tests[0]!.expected}</span></p>
        </Section>
        {res && (
          <Section title={`Result — ${res.passed}/${res.total} passed · score ${res.score}`}>
            {!res.compiles && <p className="mb-2 text-sm text-destructive">{res.compileError}</p>}
            <div className="space-y-1">{res.results.map((t, i) => <p key={i} className="flex items-center gap-2 text-xs">{t.passed ? <CheckCircle2 className="size-3.5 text-success" /> : <XCircle className="size-3.5 text-destructive" />} Test {i + 1}{!t.passed && ` — expected ${t.expected}, got ${t.actual}`}</p>)}</div>
            <p className="mt-2 text-xs text-muted-foreground">Time {res.timeComplexity} · Space {res.spaceComplexity}</p>
            <div className="mt-2"><Bullets items={res.improvements} /></div>
          </Section>
        )}
      </div>
      <div className="space-y-3 lg:col-span-3">
        <div className="flex gap-2">
          {(Object.keys(LANGS) as (keyof typeof LANGS)[]).map((l) => <button key={l} onClick={() => setLang(l)} className={cn("rounded-md border px-2.5 py-1 text-xs", lang === l ? "border-accent text-accent" : "border-border")}>{LANGS[l]}</button>)}
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <Suspense fallback={<Skeleton className="h-[420px]" />}>
            <Editor height="420px" theme="vs-dark" language={lang} value={code} onChange={(v) => setCode(v ?? "")} options={{ minimap: { enabled: false }, fontSize: 13 }} />
          </Suspense>
        </div>
        <Button onClick={submit} disabled={busy || !code.trim()}>{busy ? "Judging…" : "Submit solution"}</Button>
        <p className="text-xs text-muted-foreground">Solutions are checked by the AI judge against hidden test cases.</p>
      </div>
    </div>
  );
}

function MockAssessment() {
  const [section, setSection] = useState<string | null>(null);
  const SECTIONS = [["Technical", "Core CS and programming fundamentals"], ["Aptitude", "Quantitative aptitude and logical reasoning"], ["Verbal", "English verbal ability and reading comprehension"]] as const;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {SECTIONS.map(([s]) => <button key={s} onClick={() => setSection(s)} className={cn("surface-card p-4 text-left", section === s && "border-primary")}><p className="font-display">{s}</p><p className="text-xs text-muted-foreground">10 questions</p></button>)}
      </div>
      {section && <Section title={`${section} section`}><SkillQuiz key={section} skill={SECTIONS.find((x) => x[0] === section)![1]} area="assessment" count={10} /></Section>}
    </div>
  );
}

function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Assessments" description="Solve coding problems in C++, Java, Python or JavaScript, or take a mock placement assessment." />
      <Tabs defaultValue="coding">
        <TabsList><TabsTrigger value="coding">Coding</TabsTrigger><TabsTrigger value="mock">Mock assessment</TabsTrigger></TabsList>
        <TabsContent value="coding" className="mt-4"><Coding /></TabsContent>
        <TabsContent value="mock" className="mt-4"><MockAssessment /></TabsContent>
      </Tabs>
    </div>
  );
}
