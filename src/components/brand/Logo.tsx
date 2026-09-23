import { Hexagon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-brand">
        <Hexagon className="size-5 text-primary-foreground" strokeWidth={2.2} />
        <Sparkles className="absolute -right-1 -top-1 size-3.5 text-accent" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          CareerForge <span className="text-gradient">AI</span>
        </span>
      )}
    </span>
  );
}
