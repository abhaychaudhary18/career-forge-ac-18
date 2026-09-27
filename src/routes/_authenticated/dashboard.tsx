import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowRight,
  Bot,
  Braces,
  Brain,
  Briefcase,
  CalendarCheck,
  Download,
  FileText,
  Flame,
  Github,
  Sparkles,
} from "lucide-react";
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

function StatChip({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-[var(--shadow-card)]">
      <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function RingCard({ label, value, to, icon: Icon }: { label: string; value: number | null; to: string; icon: typeof FileText }) {
  return (
    <Link to={to} className="surface-card flex flex-col items-center gap-3 p-5 text-center transition-transform hover:-translate-y-0.5">
      {value == null ? (
        <div className="grid size-[110px] place-items-center rounded-full border-2 border-dashed border-border"><Icon className="size-6 text-muted-foreground" /></div>
      ) : (
        <ScoreRing value={value} size={110} stroke={9} />
      )}
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {value == null && <span className="text-[11px] font-semibold text-primary">Start →</span>}
    </Link>
  );
}

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
  const openCount = (tasks ?? []).filter((t) => !t.done).length;

  return (
    <div className="space-y-6">
      {/* Welcome row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""} <span className="text-primary">—</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Target role: {profile?.target_role ?? "Software Engineer"}. Every activity updates this profile.</p>
        </div>
        <div className="flex gap-3">
          <StatChip icon={Sparkles} label="Readiness" value={`${data.readiness.overall}/100`} />
          <StatChip icon={CalendarCheck} label="Open tasks" value={String(openCount)} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left column — profile + actions */}
        <div className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-ink text-lg font-bold text-ink-foreground">
                {(profile?.name ?? "U").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{profile?.name ?? "Your profile"}</p>
                <p className="truncate text-xs text-muted-foreground">{profile?.target_role ?? "Set your target role"}</p>
              </div>
              <Link to="/profile" className="ml-auto text-xs font-semibold text-primary hover:underline">Edit</Link>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2">
                <span className="text-muted-foreground">Signals collected</span>
                <span className="font-semibold">{keys.length - missing.length}/{keys.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2">
                <span className="text-muted-foreground">Resume skills</span>
                <span className="font-semibold">{(profile?.skills ?? []).length}</span>
              </div>
            </div>
          </div>

          <div className="ink-panel p-5">
            <p className="text-sm font-bold">Action Center</p>
            <p className="mt-1 text-xs text-ink-foreground/60">Jump straight into the next best step.</p>
            <div className="mt-4 space-y-2">
              <Button asChild className="w-full justify-between rounded-full"><Link to="/reports"><span>Download career report</span><Download className="size-4" /></Link></Button>
              <Button asChild variant="outline" className="w-full justify-between rounded-full border-ink-foreground/20 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"><Link to="/interview"><span>Start mock interview</span><ArrowRight className="size-4" /></Link></Button>
              <Button asChild variant="outline" className="w-full justify-between rounded-full border-ink-foreground/20 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"><Link to="/jobs"><span>Get matched jobs</span><Briefcase className="size-4" /></Link></Button>
            </div>
          </div>
        </div>

        {/* Middle column — rings + trend */}
        <div className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <RingCard label="Overall readiness" value={data.readiness.overall} to="/analytics" icon={Sparkles} />
            <RingCard label="Resume & ATS" value={data.signals.resume} to="/resume" icon={FileText} />
            <RingCard label="Interview" value={data.signals.interview} to="/interview" icon={Bot} />
            <RingCard label="Job fit" value={data.signals.jobFit} to="/job-analyzer" icon={Briefcase} />
          </div>

          <div className="surface-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">Readiness trend</p>
              <Link to="/analytics" className="text-xs font-semibold text-primary hover:underline">Full analytics →</Link>
            </div>
            {history.length < 2 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Complete a couple of activities to see your trend.</p>
            ) : (
              <div className="h-52">
                <ResponsiveContainer>
                  <AreaChart data={history}>
                    <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity={0.5} /><stop offset="1" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="i" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                    <Area dataKey="overall" stroke="var(--primary)" fill="url(#g)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-5">
              <p className="mb-3 text-sm font-bold">All signals</p>
              <div className="space-y-2.5">
                {keys.map((k) => {
                  const L = LINKS[k];
                  const v = data.signals[k];
                  return (
                    <Link key={k} to={L.to} className="flex items-center gap-2 text-sm hover:text-primary">
                      <L.icon className="size-4 shrink-0 text-primary" />
                      <span className="w-28 truncate text-xs text-muted-foreground">{SIGNAL_LABELS[k]}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${v ?? 0}%` }} />
                      </span>
                      <span className="w-8 text-right text-xs font-semibold">{v == null ? "—" : v}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="surface-card p-5">
              <p className="mb-3 text-sm font-bold">Weakest topics</p>
              {weak.length === 0 ? (
                <p className="text-sm text-muted-foreground">Take a skill test or interview to find weak spots.</p>
              ) : (
                <ul className="space-y-2">
                  {weak.map((w) => (
                    <li key={String(w["topic"])} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-sm">
                      <span>{String(w["topic"])}</span>
                      <span className="text-xs font-semibold text-primary">{String(w["weight"])}% miss</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row — tasks */}
      <div className="ink-panel p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Next tasks</p>
          <Button asChild size="sm" className="rounded-full"><Link to="/tasks">Open tasks</Link></Button>
        </div>
        {open.length === 0 ? (
          <p className="mt-3 text-sm text-ink-foreground/60">No open tasks. Generate a roadmap to get a plan.</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {open.map((t) => (
              <div key={t.id} className="flex items-center gap-2 rounded-xl bg-ink-foreground/5 px-3 py-2 text-sm">
                <Flame className="size-4 shrink-0 text-primary" />
                <span className="truncate">{t.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
