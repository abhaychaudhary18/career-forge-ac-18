import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { computeReadiness, type ReadinessSignals } from "@/lib/career-engine";

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

async function latest(table: string, columns = "*") {
  const { data, error } = await supabase
    .from(table as never)
    .select(columns)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as Record<string, unknown>[];
}

export function useIntelligence() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["intelligence", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [resumes, jobs, github, skills, interviews, coding, weakness, history] = await Promise.all([
        latest("resume_analyses"),
        latest("job_analyses"),
        latest("github_analyses"),
        latest("skill_results"),
        latest("interviews"),
        latest("coding_submissions"),
        latest("weakness_topics"),
        latest("career_scores"),
      ]);

      const avg = (values: number[]) =>
        values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;

      const finishedInterviews = interviews.filter((i) => i["overall_score"] != null);

      const signals: ReadinessSignals = {
        resume: resumes.length ? Number(resumes[0]["ats_score"]) : null,
        project: github.length ? avg(github.map((g) => Number(g["score"]))) : null,
        technical: skills.length ? avg(skills.map((s) => Number(s["score"]))) : null,
        coding: coding.length ? avg(coding.map((c) => Number(c["score"]))) : null,
        interview: finishedInterviews.length ? avg(finishedInterviews.map((i) => Number(i["overall_score"]))) : null,
        communication: finishedInterviews.length
          ? avg(
              finishedInterviews.map((i) => {
                const scores = (i["scores"] ?? {}) as Record<string, number>;
                return Number(scores["communication"] ?? i["overall_score"] ?? 0);
              }),
            )
          : null,
        jobFit: jobs.length ? Number(jobs[0]["match_score"]) : null,
      };

      return {
        signals,
        readiness: computeReadiness(signals),
        resumes,
        jobs,
        github,
        skills,
        interviews,
        coding,
        weakness,
        history: history.slice().reverse(),
      };
    },
  });
}

export function useTasks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("done", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export async function notify(title: string, body: string) {
  await supabase.from("notifications").insert({ title, body });
}

/** Records a readiness snapshot so progress over time is chartable. */
export async function recordReadinessSnapshot(signals: ReadinessSignals) {
  const { overall } = computeReadiness(signals);
  await supabase.from("career_scores").insert({
    overall,
    resume: signals.resume ?? 0,
    technical: signals.technical ?? 0,
    coding: signals.coding ?? 0,
    project: signals.project ?? 0,
    communication: signals.communication ?? 0,
    interview: signals.interview ?? 0,
    job_fit: signals.jobFit ?? 0,
    breakdown: signals as unknown as Record<string, number>,
  });
}

/** Feeds a wrong/right answer on a topic back into the weakness heatmap. */
export async function recordTopicOutcome(topic: string, area: string, correct: boolean) {
  const { data } = await supabase.from("weakness_topics").select("*").eq("topic", topic).maybeSingle();
  const hits = (data?.hits ?? 0) + (correct ? 1 : 0);
  const misses = (data?.misses ?? 0) + (correct ? 0 : 1);
  const weight = Math.round((misses / Math.max(1, hits + misses)) * 100);
  if (data) {
    await supabase.from("weakness_topics").update({ hits, misses, weight, area }).eq("id", data.id);
  } else {
    await supabase.from("weakness_topics").insert({ topic, area, hits, misses, weight });
  }
}
