import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileText, Github, Bot, Brain, Braces, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Section, Bullets } from "@/components/app/kit";
import { ScoreRing } from "@/components/ui/score-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIntelligence, useProfile, useTasks, recordReadinessSnapshot } from "@/lib/data";
import { SIGNAL_LABELS, type ReadinessSignals } from "@/lib/career-engine";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerForge AI" }, { name: "description", content: "Your live career readiness overview." }] }),
  component: DashboardPage,
});

const LINKS: Record<keyof ReadinessSignals, { to: string; icon: typeof FileText }> = {
  resume: { to: "/resume", icon: FileText },
  project: { to: "/github", icon: Github },
  technical: { to: "/skills", icon: Brain },
  coding: { to: "/assessments", icon: Braces },
  interview: { to: "/interview", icon: Bot },
  communication: { to: "/interview", icon: Bot },
  jobFit: { to: "/job-analyzer", icon: Briefcase },
};

function DashboardPage() {
  const { data: profile } = useProfile();
  const { data, isLoading } = useIntelligence();
  const { data: tasks } = useTasks();
  const snapped = useRef(false);

  useEffect(() => {
    if (!data || snapped.current) return;
    snapped.current = true;
    const last = data.history.at(-1) as Record<string, unknown> | undefined;
    const hasAny = Object.values(data.signals).some((v) => v != null);
    if (hasAny && Number(last?.["overall"] ?? -1) !== data.readiness.overall) void recordReadinessSnapshot(data.signals);
  }, [data]);

  if (isLoading || !data) return <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40" />)}</div>;

  const keys = Object.keys(SIGNAL_LABELS) as (keyof ReadinessSignals)[];
  const missing = keys.filter((k) => data.signals[k] == null);
  const weak = [...data.weakness].sort((a, b) => Number(b["weight"]) - Number(a["weight"])).slice(0, 5);
  const history = data.history.map((h, i) => ({ i: i + 1, overall: Number(h["overall"]) }));
  const open = (tasks ?? []).filter((t) => !t.done).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}`} description={`Target role: ${profile?.target_role ?? "Software Engineer"}. Every activity updates this profile.`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card flex flex-col items-center justify-center p-6 text-center">
          <ScoreRing value={data.readiness.overall} size={170} label="Readiness" />
          <p className="mt-3 text-sm text-muted-foreground">
            {missing.length === keys.length ? "No signals yet — start with your resume." : `Based on ${keys.length - missing.length} of ${keys.length} signals.`}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-2">
          {keys.map((k) => {
            const L = LINKS[k];
            const v = data.signals[k];
            return (
              <Link key={k} to={L.to} className="surface-card flex flex-col items-center gap-2 p-4 text-center transition-colors hover:border-primary/50">
                {v == null ? (
                  <div className="grid size-[84px] place-items-center rounded-full border border-dashed border-border"><L.icon className="size-5 text-muted-foreground" /></div>
                ) : (
                  <ScoreRing value={v} size={84} stroke={7} />
                )}
                <span className="text-xs text-muted-foreground">{SIGNAL_LABELS[k]}</span>
                {v == null && <span className="text-[11px] text-accent">Start →</span>}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="Readiness trend" className="lg:col-span-2">
          {history.length < 2 ? (
            <p className="text-sm text-muted-foreground">Complete a couple of activities to see your trend.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={history}>
                  <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity={0.5} /><stop offset="1" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="i" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                  <Area dataKey="overall" stroke="var(--primary)" fill="url(#g)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Section>
        <Section title="Weakest topics">
          <Bullets items={weak.map((w) => `${w["topic"]} — ${w["weight"]}% miss rate`)} empty="Take a skill test or interview to find weak spots." />
        </Section>
      </div>
      <Section title="Next tasks">
        <Bullets items={open.map((t) => t.title)} empty="No open tasks." />
        <Button asChild variant="outline" size="sm" className="mt-3"><Link to="/tasks">Open tasks</Link></Button>
      </Section>
    </div>
  );
}
