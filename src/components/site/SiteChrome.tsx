import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteChrome({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3 py-1.5 transition-colors hover:text-foreground"
                activeProps={{ className: "bg-foreground text-background hover:text-background" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm"><Link to="/dashboard">Open dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
                <Button asChild size="sm"><Link to="/auth" search={{ mode: "signup" }}>Get started</Link></Button>
              </>
            )}
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 text-sm text-muted-foreground md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="whitespace-nowrap rounded-full px-3 py-1"
              activeProps={{ className: "bg-foreground text-background" }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p>© {new Date().getFullYear()} CareerForge AI. Turn Your Resume Into Career Readiness.</p>
        </div>
        <p className="mx-auto mt-6 max-w-6xl px-4 text-center text-xs text-muted-foreground sm:text-left">
          Made by <span className="font-semibold text-foreground">Abhay Chaudhary</span>
        </p>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="grid-backdrop border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</span>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{body}</p>
      </div>
    </section>
  );
}

export function PageCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="surface-card grid-backdrop flex flex-col items-center gap-4 p-12 text-center">
        <h2 className="font-display text-3xl font-semibold">Turn your resume into career readiness.</h2>
        <p className="max-w-xl text-sm text-muted-foreground">Start with one resume and one GitHub repository. The score builds from there.</p>
        <Button asChild size="lg">
          <Link to="/auth" search={{ mode: "signup" }}>Start career analysis <ArrowRight className="ml-1 size-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
