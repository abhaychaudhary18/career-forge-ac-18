import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Printer, FileDown } from "lucide-react";
import { improveResumeSection } from "@/lib/ai.functions";
import { useProfile } from "@/lib/data";
import { PageHeader } from "@/components/app/PageHeader";
import { errMsg } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — CareerForge AI" },
      { name: "description", content: "Build an ATS-friendly resume with templates, AI rewrites and PDF, Word and LaTeX export." },
    ],
  }),
  component: BuilderPage,
});

const TEMPLATES = ["Classic", "Modern", "Compact", "Technical", "Minimal"] as const;
type T = (typeof TEMPLATES)[number];
const SECTIONS = ["summary", "experience", "projects", "education", "skills"] as const;
type Sec = (typeof SECTIONS)[number];
type Doc = { name: string; headline: string; contact: string } & Record<Sec, string>;

const STYLE: Record<T, { font: string; head: string; rule: string }> = {
  Classic: { font: "Georgia, serif", head: "text-center", rule: "border-b border-neutral-400" },
  Modern: { font: "Helvetica, Arial, sans-serif", head: "text-left", rule: "border-l-4 border-neutral-800 pl-2" },
  Compact: { font: "Arial, sans-serif", head: "text-left", rule: "border-b border-neutral-300" },
  Technical: { font: "'JetBrains Mono', monospace", head: "text-left", rule: "border-b border-dashed border-neutral-500" },
  Minimal: { font: "'DM Sans', sans-serif", head: "text-center", rule: "" },
};

const esc = (s: string) => s.replace(/[\\&%$#_{}~^]/g, (c) => `\\${c}`);

function BuilderPage() {
  const run = useServerFn(improveResumeSection);
  const { data: profile } = useProfile();
  const [tpl, setTpl] = useState<T>("Modern");
  const [busy, setBusy] = useState<Sec | null>(null);
  const [doc, setDoc] = useState<Doc>({ name: "", headline: "", contact: "", summary: "", experience: "", projects: "", education: "", skills: "" });

  useEffect(() => {
    if (profile && !doc.name)
      setDoc((d) => ({
        ...d,
        name: profile.name ?? "",
        headline: profile.target_role ?? "",
        contact: [profile.email, profile.phone, profile.location, profile.linkedin_url].filter(Boolean).join(" · "),
        skills: (profile.skills ?? []).join(", "),
      }));
  }, [profile, doc.name]);

  async function improve(s: Sec) {
    if (doc[s].trim().length < 3) { toast.error("Write something in this section first."); return; }
    setBusy(s);
    try {
      const r = await run({ data: { section: s, content: doc[s], targetRole: profile?.target_role ?? "Software Engineer" } });
      setDoc({ ...doc, [s]: r.bullets.length ? r.bullets.map((b) => `• ${b}`).join("\n") : r.rewritten });
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  function download(content: string, name: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportWord() {
    const html = document.getElementById("resume-preview")?.outerHTML ?? "";
    download(`<html><head><meta charset="utf-8"></head><body>${html}</body></html>`, "resume.doc", "application/msword");
  }

  function exportLatex() {
    const body = SECTIONS.filter((s) => doc[s].trim())
      .map((s) => `\\section*{${s[0]!.toUpperCase() + s.slice(1)}}\n${esc(doc[s]).replace(/\n/g, "\\\\\n")}`)
      .join("\n\n");
    download(`\\documentclass[11pt]{article}\n\\usepackage[margin=0.8in]{geometry}\n\\begin{document}\n\\begin{center}{\\LARGE ${esc(doc.name)}}\\\\ ${esc(doc.headline)}\\\\ ${esc(doc.contact)}\\end{center}\n${body}\n\\end{document}\n`, "resume.tex", "text/x-tex");
  }

  const st = STYLE[tpl];

  return (
    <div className="space-y-6">
      <PageHeader title="Resume Builder" description="Write, let AI sharpen each section, pick a template and export." />
      <div className="flex flex-wrap gap-2 print:hidden">
        {TEMPLATES.map((t) => (
          <Button key={t} size="sm" variant={t === tpl ? "default" : "outline"} onClick={() => setTpl(t)}>{t}</Button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="size-4" /> PDF</Button>
          <Button size="sm" variant="outline" onClick={exportWord}><FileDown className="size-4" /> Word</Button>
          <Button size="sm" variant="outline" onClick={exportLatex}><FileDown className="size-4" /> LaTeX</Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card space-y-4 p-5 print:hidden">
          {(["name", "headline", "contact"] as const).map((k) => (
            <div key={k} className="space-y-1.5"><Label className="capitalize">{k}</Label><Input value={doc[k]} onChange={(e) => setDoc({ ...doc, [k]: e.target.value })} /></div>
          ))}
          {SECTIONS.map((s) => (
            <div key={s} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="capitalize">{s}</Label>
                <Button size="sm" variant="ghost" onClick={() => improve(s)} disabled={busy !== null}><Sparkles className="size-3.5" /> {busy === s ? "Rewriting…" : "Improve with AI"}</Button>
              </div>
              <Textarea rows={s === "skills" ? 2 : 4} value={doc[s]} onChange={(e) => setDoc({ ...doc, [s]: e.target.value })} />
            </div>
          ))}
        </div>
        <div id="resume-preview" className="rounded-lg bg-white p-8 text-[13px] leading-relaxed text-neutral-900 shadow-lg print:shadow-none" style={{ fontFamily: st.font }}>
          <div className={cn("mb-4", st.head)}>
            <h1 style={{ fontFamily: st.font, fontSize: 24, fontWeight: 700 }}>{doc.name || "Your Name"}</h1>
            <p>{doc.headline}</p>
            <p className="text-neutral-600">{doc.contact}</p>
          </div>
          {SECTIONS.filter((s) => doc[s].trim()).map((s) => (
            <div key={s} className={cn(tpl === "Compact" ? "mb-2" : "mb-4")}>
              <h2 className={cn("mb-1 text-sm font-bold uppercase tracking-wide", st.rule)} style={{ fontFamily: st.font }}>{s}</h2>
              <p className="whitespace-pre-line">{doc[s]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
