import { createFileRoute } from "@tanstack/react-router";
import { Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Section } from "@/components/app/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntelligence } from "@/lib/data";
import { SIGNAL_LABELS, type ReadinessSignals } from "@/lib/career-engine";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — CareerForge AI" }, { name: "description", content: "Readiness trends, skill radar and weakness heatmap." }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data, isLoading } = useIntelligence();
  if (isLoading || !data) return <Skeleton className="h-96" />;
  const radar = (Object.keys(SIGNAL_LABELS) as (keyof ReadinessSignals)[]).map((k) => ({ k: SIGNAL_LABELS[k], v: data.signals[k] ?? 0 }));
  const trend = data.history.map((h, i) => ({ i: i + 1, overall: Number(h["overall"]), technical: Number(h["technical"]), coding: Number(h["coding"]), interview: Number(h["interview"]) }));
  const heat = [...data.weakness].sort((a, b) => Number(b["weight"]) - Number(a["weight"]));
  const color = (w: number) => `color-mix(in oklab, var(--destructive) ${w}%, var(--success))`;
  const tip = { contentStyle: { background: "var(--card)", border: "1px solid var(--border)" } };

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="How your readiness is changing and where you lose points." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Readiness radar">
          <div className="h-72"><ResponsiveContainer><RadarChart data={radar}><PolarGrid stroke="var(--border)" /><PolarAngleAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><Radar dataKey="v" stroke="var(--accent)" fill="var(--primary)" fillOpacity={0.35} /></RadarChart></ResponsiveContainer></div>
        </Section>
        <Section title="Progress over time">
          {trend.length < 2 ? <p className="text-sm text-muted-foreground">Not enough history yet.</p> : (
            <div className="h-72"><ResponsiveContainer><LineChart data={trend}><XAxis dataKey="i" stroke="var(--muted-foreground)" fontSize={11} /><YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} /><Tooltip {...tip} />
              <Line dataKey="overall" stroke="var(--primary)" strokeWidth={2} dot={false} /><Line dataKey="technical" stroke="var(--accent)" dot={false} /><Line dataKey="coding" stroke="var(--success)" dot={false} /><Line dataKey="interview" stroke="var(--warning)" dot={false} />
            </LineChart></ResponsiveContainer></div>
          )}
        </Section>
      </div>
      <Section title="Interview weakness heatmap">
        {!heat.length ? <p className="text-sm text-muted-foreground">Answer interview questions or take tests to build your heatmap.</p> : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {heat.map((w) => (
              <div key={String(w["id"])} className="rounded-lg p-3 text-background" style={{ background: color(Number(w["weight"])) }}>
                <p className="text-sm font-semibold">{String(w["topic"])}</p>
                <p className="text-xs">{String(w["weight"])}% miss · {Number(w["hits"]) + Number(w["misses"])} tries</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
