import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary">
        <Hexagon className="size-4.5 text-primary-foreground" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          CareerForge<span className="text-accent">.</span>
        </span>
      )}
    </span>
  );
}
