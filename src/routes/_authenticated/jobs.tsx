import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, MapPin, Bookmark } from "lucide-react";
import { fetchJobs } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { useIntelligence, useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { Chips, errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/jobs")({
  head: () => ({ meta: [{ title: "Job Matcher — CareerForge AI" }, { name: "description", content: "Live jobs ranked by how well they match your skills." }] }),
  component: JobsPage,
});

function JobsPage() {
  const run = useServerFn(fetchJobs);
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({ queryKey: ["jobs", query, page], queryFn: () => run({ data: { query, page } }) });

  const verified = (intel?.skills ?? []).filter((s) => Number(s["score"]) >= 55).map((s) => String(s["skill"]));
  const mine = [...new Set([...(profile?.skills ?? []), ...verified])].map((s) => s.toLowerCase());
  const ranked = (data ?? []).map((j) => {
    const tags = j.tags.length ? j.tags : [];
    const hay = `${j.title} ${j.description}`.toLowerCase();
    const matched = mine.filter((s) => tags.some((t) => t.toLowerCase().includes(s)) || hay.includes(s));
    const missing = tags.filter((t) => !mine.some((s) => t.toLowerCase().includes(s))).slice(0, 5);
    const pct = mine.length ? Math.min(100, Math.round((matched.length / Math.max(3, Math.min(mine.length, tags.length || 5))) * 100)) : 0;
    return { ...j, matched, missing, pct };
  }).sort((a, b) => b.pct - a.pct);

  async function save(j: (typeof ranked)[number]) {
    const { error: e } = await supabase.from("saved_jobs").insert({ job: j as never, match: { pct: j.pct, matched: j.matched, missing: j.missing } as never });
    if (e) toast.error(errMsg(e)); else toast.success("Job saved");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Live Job Matcher" description={mine.length ? "Live openings ranked by overlap with your skills." : "Add skills in your profile to get match percentages."} />
      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter: react, backend, remote…" onKeyDown={(e) => e.key === "Enter" && (setQuery(q), setPage(1))} />
        <Button onClick={() => { setQuery(q); setPage(1); }}>Search</Button>
      </div>
      {error && <p className="text-sm text-destructive">{errMsg(error)}</p>}
      {isLoading ? <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div> : (
        <div className="space-y-3">
          {!ranked.length && <p className="text-sm text-muted-foreground">No jobs found on this page. Try another filter or page.</p>}
          {ranked.map((j) => (
            <div key={j.slug} className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
              <div className="grid size-14 shrink-0 place-items-center rounded-xl border border-border font-display text-lg text-accent">{j.pct}%</div>
              <div className="flex-1 space-y-2">
                <div><p className="font-medium">{j.title}</p><p className="flex items-center gap-1 text-xs text-muted-foreground">{j.company} · <MapPin className="size-3" />{j.location}{j.remote && " · Remote"}</p></div>
                {j.matched.length > 0 && <Chips items={j.matched} tone="good" />}
                {j.missing.length > 0 && <Chips items={j.missing} tone="bad" />}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => save(j)}><Bookmark className="size-4" /></Button>
                <Button size="sm" asChild><a href={j.url} target="_blank" rel="noreferrer">Apply <ExternalLink className="ml-1 size-3" /></a></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
        <span className="self-center text-sm text-muted-foreground">Page {page}</span>
        <Button variant="outline" disabled={page >= 10} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
