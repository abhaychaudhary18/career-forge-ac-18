import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, ChevronDown, LogOut, Menu, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNotifications, useProfile } from "@/lib/data";
import { Logo } from "@/components/brand/Logo";
import { NAV_GROUPS, NAV_ITEMS } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AppLayout,
});

const MENU_GROUPS = NAV_GROUPS.filter((g) => g !== "Account" && g !== "Overview");
const groupLabel = (g: string) => (g === "Profile intelligence" ? "Resume" : g);

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar open={open} onMenu={() => setOpen(!open)} pathname={pathname} />
      {open && (
        <div className="border-b border-border bg-card lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:grid-cols-2">
            {NAV_GROUPS.map((g) => (
              <div key={g}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{groupLabel(g)}</p>
                {NAV_ITEMS.filter((i) => i.group === g).map((i) => (
                  <Link key={i.to} to={i.to} className="flex items-center gap-2 py-1.5 text-sm hover:text-primary">
                    <i.icon className="size-4 text-primary" /> {i.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6 lg:grid-cols-7">
          {NAV_GROUPS.map((g) => (
            <div key={g}>
              <p className="mb-2 font-semibold">{groupLabel(g)}</p>
              {NAV_ITEMS.filter((i) => i.group === g).map((i) => (
                <Link key={i.to} to={i.to} className="block py-1 text-muted-foreground hover:text-primary">{i.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <p className="pb-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} CareerForge AI</p>
      </footer>
    </div>
  );
}

function TopBar({ onMenu, open, pathname }: { onMenu: () => void; open: boolean; pathname: string }) {
  const { data: profile } = useProfile();
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const unread = (notifications ?? []).filter((n) => !n.read).length;
  const matches = query ? NAV_ITEMS.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [];

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="mr-2 shrink-0"><Logo /></Link>
        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link to="/dashboard" className={cn("rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary", pathname === "/dashboard" && "text-primary")}>Home</Link>
          {MENU_GROUPS.map((g) => {
            const items = NAV_ITEMS.filter((i) => i.group === g);
            const active = items.some((i) => i.to === pathname);
            return (
              <DropdownMenu key={g}>
                <DropdownMenuTrigger className={cn("flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium outline-none hover:bg-secondary", active && "text-primary")}>
                  {groupLabel(g)} <ChevronDown className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {items.map((i) => (
                    <DropdownMenuItem key={i.to} asChild>
                      <Link to={i.to} className="flex items-center gap-2"><i.icon className="size-4 text-primary" /> {i.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </nav>
        <div className="relative ml-auto hidden w-52 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages…" className="pl-9" />
          {matches.length > 0 && (
            <div className="absolute mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
              {matches.map((m) => (
                <Link key={m.to} to={m.to} onClick={() => setQuery("")} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary">
                  <m.icon className="size-4 text-primary" /> {m.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-4" />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(notifications ?? []).length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">Nothing yet. Run an analysis to get updates.</p>}
              {(notifications ?? []).slice(0, 6).map((n) => (
                <div key={n.id} className="px-2 py-2">
                  <p className="text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {(profile?.name ?? "U").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{profile?.name ?? "Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/admin">Admin</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 size-4" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="ml-1 lg:hidden" onClick={onMenu} aria-label="Open menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
