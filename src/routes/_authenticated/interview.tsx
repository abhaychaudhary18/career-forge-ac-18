import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { InterviewRunner } from "@/components/app/InterviewRunner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — CareerForge AI" }, { name: "description", content: "Adaptive AI mock interviews with voice input." }] }),
  component: InterviewPage,
});

function InterviewPage() {
  const [mode, setMode] = useState<"technical" | "behavioral">("technical");
  const [topic, setTopic] = useState("");
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-6">
      <PageHeader title="Adaptive Mock Interview" description="Each question adapts to your last answer: strong → harder, weak → fundamentals. Answer by typing or speaking." />
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setKey((k) => k + 1); }}>
          <TabsList><TabsTrigger value="technical">Technical</TabsTrigger><TabsTrigger value="behavioral">Behavioral</TabsTrigger></TabsList>
        </Tabs>
        <div className="min-w-60 flex-1 space-y-1.5">
          <Label>Focus topic (optional)</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. React, system design, DBMS" />
        </div>
      </div>
      <InterviewRunner key={key} mode={mode} topic={topic || mode} context={topic ? `Focus the interview on: ${topic}` : ""} />
    </div>
  );
}
