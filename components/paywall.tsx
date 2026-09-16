import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadPayouts } from "@/lib/payouts";
import { useHP } from "@/lib/store";
import type { Tier } from "@/lib/types";
import { cn } from "@/lib/utils";

const RANK: Record<Tier, number> = { free: 0, pro: 1, plus: 2 };

export function hasTier(current: Tier, need: Tier) {
  return RANK[current] >= RANK[need];
}

export function UpgradeDialog({
  open,
  onOpenChange,
  intent,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  intent?: Tier;
}) {
  const setTier = useHP((s) => s.setTier);
  const current = useHP((s) => s.tier);
  const [links, setLinks] = useState({ pro: "", plus: "" });

  useEffect(() => {
    const p = loadPayouts();
    setLinks({ pro: p.proLink, plus: p.plusLink });
  }, [open]);

  function activate(t: Tier) {
    const url = t === "pro" ? links.pro : t === "plus" ? links.plus : "";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setTier(t);
    import("@/lib/desk").then(({ saveTier }) => saveTier({ data: { tier: t } })).catch(() => {});
    onOpenChange(false);
    toast.success(
      url
        ? t === "pro"
          ? "Stripe opened for Pro. Desk unlocked here once you return."
          : "Stripe opened for Plus. Desk unlocked here once you return."
        : t === "pro"
          ? "Pro desk is open on this device (preview)."
          : t === "plus"
            ? "Plus desk is open on this device (preview)."
            : "Back on the free desk.",
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Membership</DialogTitle>
          <DialogDescription>
            {links.pro || links.plus
              ? "Pay opens your Stripe (or PayPal) link. The desk unlocks on this device after you tap."
              : "Preview billing — no live card yet. Paste Stripe Payment Links under Receive money to collect $18 / $36."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid gap-3">
          <PlanRow
            name="Pro"
            price="$18 / month"
            blurb="Full atlas, diet and training protocols, 24 medical-desk consults, kitchen, evidence library."
            recommended={intent === "pro" || !intent}
            current={current === "pro"}
            onPick={() => activate("pro")}
          />
          <PlanRow
            name="Plus"
            price="$36 / month"
            blurb="Everything in Pro, plus formulas if a brand is unavailable, career & world desk, purpose lab, unlimited consults."
            recommended={intent === "plus"}
            current={current === "plus"}
            onPick={() => activate("plus")}
          />
        </div>
        {current !== "free" && (
          <button
            type="button"
            className="mt-4 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => activate("free")}
          >
            Return to the free desk
          </button>
        )}
        <Link to="/payouts" className="mt-3 block text-xs text-muted-foreground hover:text-foreground">
          Receive the money — add your Stripe or PayPal
        </Link>
      </DialogContent>
    </Dialog>
  );
}

function PlanRow({
  name,
  price,
  blurb,
  recommended,
  current,
  onPick,
}: {
  name: string;
  price: string;
  blurb: string;
  recommended?: boolean;
  current?: boolean;
  onPick: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 shadow-[var(--shadow-border)]",
        recommended && "bg-secondary",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-lg">{name}</p>
        <p className="text-sm tabular-nums text-muted-foreground">{price}</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>
      <Button className="mt-4 w-full" variant={recommended ? "default" : "outline"} onClick={onPick}>
        {current ? "Active" : `Activate ${name}`}
      </Button>
    </div>
  );
}

export function Gate({
  need,
  children,
  teaser,
  className,
}: {
  need: Tier;
  children: ReactNode;
  teaser?: ReactNode;
  className?: string;
}) {
  const loaded = useHP((s) => s.loaded);
  const tier = useHP((s) => s.tier);
  const [open, setOpen] = useState(false);
  if (loaded && hasTier(tier, need)) return <>{children}</>;
  return (
    <div className={cn("relative", className)}>
      {teaser ?? <div className="max-h-40 overflow-hidden opacity-40 blur-[2px]">{children}</div>}
      <div className="mt-4 rounded-xl bg-secondary p-5">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {need === "plus" ? "Plus" : "Pro"} protocol
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The free desk is meant to impress. This layer is where the work gets personal.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setOpen(true)}>
                Open {need === "plus" ? "Plus · $36" : "Pro · $18"}
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/pricing">Compare</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <UpgradeDialog open={open} onOpenChange={setOpen} intent={need} />
    </div>
  );
}

export function useUpgrade() {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Tier>("pro");
  return {
    open: (t: Tier = "pro") => {
      setIntent(t);
      setOpen(true);
    },
    dialog: <UpgradeDialog open={open} onOpenChange={setOpen} intent={intent} />,
  };
}
