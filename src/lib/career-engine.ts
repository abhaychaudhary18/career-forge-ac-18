/**
 * CareerReadinessEngine — the central intelligence layer.
 * Every module (resume, GitHub, skills, coding, interview, job fit) feeds
 * signals in here; the weighted result is the Career Readiness Score.
 */

export type ReadinessSignals = {
  resume: number | null;
  project: number | null;
  technical: number | null;
  coding: number | null;
  interview: number | null;
  communication: number | null;
  jobFit: number | null;
};

export const READINESS_WEIGHTS: Record<keyof ReadinessSignals, number> = {
  resume: 0.15,
  project: 0.18,
  technical: 0.18,
  coding: 0.16,
  interview: 0.16,
  communication: 0.07,
  jobFit: 0.1,
};

export const SIGNAL_LABELS: Record<keyof ReadinessSignals, string> = {
  resume: "Resume / ATS",
  project: "GitHub Projects",
  technical: "Technical Readiness",
  coding: "Coding Performance",
  interview: "Interview Readiness",
  communication: "Communication",
  jobFit: "Job Fit",
};

export function clampScore(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Weighted, not averaged: missing signals are excluded and the remaining
 * weights renormalised, so an empty profile never fakes a high score.
 */
export function computeReadiness(signals: ReadinessSignals) {
  let weighted = 0;
  let totalWeight = 0;
  const present: (keyof ReadinessSignals)[] = [];

  (Object.keys(READINESS_WEIGHTS) as (keyof ReadinessSignals)[]).forEach((key) => {
    const value = signals[key];
    if (value === null || value === undefined) return;
    weighted += clampScore(value) * READINESS_WEIGHTS[key];
    totalWeight += READINESS_WEIGHTS[key];
    present.push(key);
  });

  const overall = totalWeight > 0 ? clampScore(weighted / totalWeight) : 0;
  const coverage = Math.round((totalWeight / 1) * 100);

  return { overall, coverage, present, missing: (Object.keys(READINESS_WEIGHTS) as (keyof ReadinessSignals)[]).filter((k) => !present.includes(k)) };
}

export function scoreTone(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}
