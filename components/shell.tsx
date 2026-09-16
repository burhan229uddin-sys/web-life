import { Link, useRouterState } from "@tanstack/react-router";
import { HeartPulse, Home, Salad, ScrollText, Stethoscope } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { SearchDesk } from "@/components/search-desk";
import { DeskBoot } from "@/components/desk-boot";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useHP } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { to: "/", label: "Home" },
  { to: "/clinic", label: "Clinic" },
  { to: "/kitchen", label: "Kitchen" },
  { to: "/dashboard", label: "Status" },
];

const MORE = [
  { to: "/sleep", label: "Sleep & energy" },
  { to: "/nutrition", label: "Diet" },
  { to: "/aesthetics", label: "Aesthetics" },
  { to: "/mind", label: "Mind & discipline" },
  { to: "/relations", label: "Therapist & bond" },
  { to: "/strength", label: "Body & strength" },
  { to: "/career", label: "Career & world" },
  { to: "/progress", label: "Progress & logs" },
  { to: "/library", label: "Evidence" },
  { to: "/pricing", label: "Membership" },
  { to: "/payouts", label: "Receive money" },
  { to: "/faq", label: "Questions" },
  { to: "/notes", label: "Quiet notes" },
];

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/clinic", label: "Clinic", icon: Stethoscope },
  { to: "/kitchen", label: "Kitchen", icon: Salad },
  { to: "/dashboard", label: "Status", icon: HeartPulse },
  { to: "/library", label: "Proof", icon: ScrollText },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-baseline gap-1.5", className)}>
      <span className="font-display text-xl font-medium tracking-tight text-foreground">Human Potential</span>
    </Link>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="size-9 animate-pulse rounded-full bg-secondary" />;
  if (user) return <UserButton />;
  return (
    <Button asChild size="sm">
      <Link to="/login">Sign in</Link>
    </Button>
  );
}

function TierChip() {
  const tier = useHP((s) => s.tier);
  return (
    <Link
      to="/pricing"
      className="hidden h-9 items-center rounded-full px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-[var(--shadow-border)] hover:text-foreground sm:inline-flex"
    >
      {tier === "free" ? "Free" : tier}
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const profile = useHP((s) => s.profile);
  const assessed = Boolean(profile.completedAt);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <DeskBoot />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Wordmark />
          <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
            {PRIMARY.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-sm text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.to && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <SearchDesk />
            <SignedIn>
              <TierChip />
            </SignedIn>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Rooms
                </Button>
              </SheetTrigger>
              <SheetContent>
                <p className="font-display text-2xl">Every room</p>
                <div className="mt-6 flex flex-col gap-1">
                  {MORE.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <AuthSlot />
          </div>
        </div>
      </header>
      <main id="main" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
        aria-label="Mobile"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = pathname === t.to;
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
                    on ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <footer className="hidden border-t border-border md:block">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Educational operating system for body, mind, and life. Not a licensed clinic.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <Link to="/clinic" className="hover:text-foreground">
              Clinic
            </Link>
            <Link to="/aesthetics" className="hover:text-foreground">
              Aesthetics
            </Link>
            <Link to="/pricing" className="hover:text-foreground">
              Membership
            </Link>
            <Link to="/library" className="hover:text-foreground">
              Evidence
            </Link>
            <Link to="/notes" className="hover:text-foreground">
              Quiet notes
            </Link>
            <Link to="/faq" className="hover:text-foreground">
              Questions
            </Link>
            <Link to="/payouts" className="hover:text-foreground">
              Receive money
            </Link>
            <SignedOut>
              <Link to="/login" className="hover:text-foreground">
                Sign in
              </Link>
            </SignedOut>
            <Link to="/intake" className="hover:text-foreground">
              {assessed ? "Revise file" : "Assessment"}
            </Link>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Human Potential does not diagnose, treat, or prescribe. Emergencies: local emergency number. US crisis
            line: 988. Photographs: Unsplash — real cameras, real people.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
