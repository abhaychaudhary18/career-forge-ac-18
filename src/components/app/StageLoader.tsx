import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shows AI work as sequential named stages while a request is in flight. */
export function StageLoader({ stages, active }: { stages: string[]; active: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, stages.length - 1)), 2200);
    return () => clearInterval(id);
  }, [active, stages.length]);

  if (!active) return null;

  return (
    <div className="surface-card space-y-3 p-5">
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-center gap-3 text-sm">
          {i < step ? (
            <Check className="size-4 text-success" />
          ) : i === step ? (
            <Loader2 className="size-4 animate-spin text-accent" />
          ) : (
            <span className="size-4 rounded-full border border-border" />
          )}
          <span className={cn(i <= step ? "text-foreground" : "text-muted-foreground")}>{stage}</span>
        </div>
      ))}
    </div>
  );
}
