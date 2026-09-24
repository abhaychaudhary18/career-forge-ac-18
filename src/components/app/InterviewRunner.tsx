import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mic, MicOff } from "lucide-react";
import { evaluateAnswer, nextInterviewQuestion, summariseInterview } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { notify, recordTopicOutcome, useIntelligence, useProfile } from "@/lib/data";
import { Section, Bullets, errMsg } from "@/components/app/kit";
import { ScoreRing } from "@/components/ui/score-ring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Mode = "technical" | "behavioral" | "project-defense";
type Q = Awaited<ReturnType<typeof nextInterviewQuestion>>;
type Ev = Awaited<ReturnType<typeof evaluateAnswer>>;
type Sum = Awaited<ReturnType<typeof summariseInterview>>;
type Turn = { question: string; answer: string; score: number; category: string; ev: Ev };

export function InterviewRunner({ mode, context, topic, maxQuestions = 6 }: { mode: Mode; context: string; topic: string; maxQuestions?: number }) {
  const next = useServerFn(nextInterviewQuestion);
  const evaluate = useServerFn(evaluateAnswer);
  const summarise = useServerFn(summariseInterview);
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const { data: intel } = useIntelligence();
  const [q, setQ] = useState<Q | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<Sum | null>(null);
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);

  const weakTopics = (intel?.weakness ?? []).filter((w) => Number(w["weight"]) >= 50).map((w) => String(w["topic"])).slice(0, 8);
  const history = (t: Turn[]) => t.map(({ question, answer, score, category }) => ({ question, answer, score, category }));

  async function ask(t: Turn[]) {
    const nq = await next({ data: { mode, role: profile?.target_role ?? "Software Engineer", context, weakTopics, history: history(t) } });
    setQ(nq);
  }

  async function start() {
    setBusy(true); setTurns([]); setSummary(null);
    try { await ask([]); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }

  async function submit() {
    if (!q) return;
    stopMic();
    setBusy(true);
    try {
      const ev = await evaluate({ data: { question: q.question, answer, category: q.category, context } });
      const t = [...turns, { question: q.question, answer, score: ev.score, category: q.category, ev }];
      setTurns(t); setAnswer("");
      await recordTopicOutcome(q.category, "interview", ev.score >= 60);
      if (t.length >= maxQuestions) await finish(t);
      else await ask(t);
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }

  async function finish(t = turns) {
    if (!t.length) return;
    setBusy(true);
    try {
      const s = await summarise({ data: { mode, history: history(t) } });
      const { data: row } = await supabase.from("interviews").insert({ mode, topic, context: { context: context.slice(0, 4000) } as never, status: "completed", overall_score: s.overall, scores: s.scores as never, summary: s as never }).select("id").single();
      if (row) await supabase.from("interview_answers").insert(t.map((x) => ({ interview_id: row.id, question: x.question, answer: x.answer, score: x.score, category: x.category, evaluation: x.ev as never })) as never);
      if (s.questionsToRevise.length) await supabase.from("tasks").insert(s.recommendedTopics.slice(0, 3).map((r) => ({ title: `Revise: ${r}`, category: "interview", source: "interview" })));
      await notify(`Interview scored ${s.overall}/100`, "Weak topics were added to your heatmap.");
      setSummary(s); setQ(null);
      qc.invalidateQueries();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }

  function toggleMic() {
    if (listening) return stopMic();
    const W = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const SR = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!SR) return void toast.error("Voice input isn't supported in this browser. Try Chrome.");
    const rec = new SR();
    rec.continuous = true; rec.interimResults = false;
    const base = answer;
    let acc = "";
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) acc += e.results[i][0].transcript + " ";
      setAnswer((base ? base + " " : "") + acc);
    };
    rec.onend = () => setListening(false);
    rec.start(); recRef.current = rec; setListening(true);
  }
  function stopMic() { recRef.current?.stop(); recRef.current = null; setListening(false); }

  if (summary)
    return (
      <div className="space-y-4">
        <div className="surface-card flex flex-wrap items-center gap-6 p-5">
          <ScoreRing value={summary.overall} size={120} label="Overall" />
          <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(summary.scores).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border p-2 text-center"><p className="font-display text-lg">{v}</p><p className="text-[11px] capitalize text-muted-foreground">{k.replace(/([A-Z])/g, " $1")}</p></div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Strengths"><Bullets items={summary.strengths} /></Section>
          <Section title="Weak areas"><Bullets items={summary.weakAreas} /></Section>
          <Section title="Questions to revise"><Bullets items={summary.questionsToRevise} /></Section>
          <Section title="Recommended topics"><Bullets items={summary.recommendedTopics} /></Section>
        </div>
        <Button onClick={start} disabled={busy}>Start another interview</Button>
      </div>
    );

  return (
    <div className="space-y-4">
      {!q ? (
        <Button onClick={start} disabled={busy}>{busy ? "Preparing first question…" : "Start interview"}</Button>
      ) : (
        <div className="surface-card space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline">Question {turns.length + 1} of {maxQuestions}</Badge>
            <Badge variant="outline">{q.category}</Badge>
            <Badge variant="outline">{q.difficulty}</Badge>
          </div>
          <p className="font-display text-lg">{q.question}</p>
          <Textarea rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer, or use the microphone…" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={submit} disabled={busy || !answer.trim()}>{busy ? "Evaluating…" : "Submit answer"}</Button>
            <Button variant="outline" onClick={toggleMic}>{listening ? <><MicOff className="mr-1 size-4" />Stop</> : <><Mic className="mr-1 size-4" />Speak</>}</Button>
            {turns.length > 0 && <Button variant="ghost" onClick={() => finish()} disabled={busy}>End & get report</Button>}
          </div>
        </div>
      )}
      {turns.slice().reverse().map((t, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="flex items-center justify-between"><p className="font-medium">{t.question}</p><Badge variant="outline">{t.ev.verdict} · {t.score}</Badge></div>
          <p className="mt-2 text-muted-foreground">{t.ev.feedback}</p>
          {t.ev.missedPoints.length > 0 && <div className="mt-2"><Bullets items={t.ev.missedPoints} /></div>}
        </div>
      ))}
    </div>
  );
}
