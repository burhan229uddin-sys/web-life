import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { UpgradeDialog } from "@/components/paywall";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useHP } from "@/lib/store";
import type { Tier } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({ component: Pricing });

const ROWS: { name: string; free: string; pro: string; plus: string }[] = [
  { name: "Body assessment & Potential Index", free: "Yes", pro: "Yes", plus: "Yes" },
  { name: "Daily check-in, streak, weekly plan", free: "Yes", pro: "Yes", plus: "Yes" },
  { name: "Clinic atlas (red flags + first moves)", free: "All regions", pro: "All regions", plus: "All + formulas" },
  { name: "Educational medicine notes", free: "OTC classes", pro: "OTC + classes", plus: "If-unavailable formulas" },
  { name: "Medical desk consults", free: "8", pro: "24 / month", plus: "Open" },
  { name: "If a brand is unavailable", free: "Hint", pro: "Generics", plus: "Full formula note" },
  { name: "Sleep, strength, fuel, mind, bond, career", free: "Opening chapters", pro: "Full protocols", plus: "Labs & 90-day labs" },
  { name: "Aesthetics (skin, posture, composition)", free: "Decade notes", pro: "12-week protocol", plus: "Labs that show" },
  { name: "Kitchen recipes", free: "20", pro: "All", plus: "All" },
  { name: "Evidence library", free: "26 sources", pro: "Full", plus: "Full + guidelines" },
  { name: "Therapist / relationship desk", free: "When to go + Gottman", pro: "Scripts + trauma context", plus: "Repair experiment" },
  { name: "Career & world situation", free: "News diet + prototypes", pro: "Range + energy audit", plus: "90-day lab" },
];

function Pricing() {
  const current = useHP((s) => s.tier);
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Tier>("pro");

  function pick(t: Tier) {
    setIntent(t);
    setOpen(true);
  }

  return (
    <Shell>
      <UpgradeDialog open={open} onOpenChange={setOpen} intent={intent} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Membership</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-6xl">
          Pay when the free desk has already been useful.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Free is actually free. Pro $18 / month. Plus $36 / month. Cancel any time — no trial that quietly bills.
          Current desk: {current}.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <Plan
            name="Free"
            price="$0"
            blurb="Built to keep you busy and convert by being genuinely good."
            points={["Potential Index + check-ins", "Full atlas + 8 consults", "20 recipes, 26 sources"]}
            cta="Stay on the free desk"
            onCta={() => {}}
            quiet
            active={current === "free"}
          />
          <Plan
            name="Pro"
            price="$18"
            blurb="The week, written."
            points={["All protocols", "Kitchen + library", "24 medical-desk notes"]}
            cta={current === "pro" ? "Active" : "Activate Pro"}
            onCta={() => pick("pro")}
            featured
            active={current === "pro"}
          />
          <Plan
            name="Plus"
            price="$36"
            blurb="Formulas, career, purpose."
            points={["Unavailable-brand formulas", "Unlimited desk", "90-day career lab"]}
            cta={current === "plus" ? "Active" : "Activate Plus"}
            onCta={() => pick("plus")}
            active={current === "plus"}
          />
        </div>

        <div className="mt-16 overflow-x-auto rounded-2xl shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-card text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Included</th>
                <th className="px-4 py-3 font-medium">Free</th>
                <th className="px-4 py-3 font-medium">Pro</th>
                <th className="px-4 py-3 font-medium">Plus</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name} className="border-t border-border">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.free}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.pro}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          To collect the money in your bank, paste Stripe or PayPal Payment Links on{" "}
          <Link to="/payouts" className="text-foreground underline-offset-4 hover:underline">
            Receive money
          </Link>
          . Until then, activate is a preview unlock on this device.{" "}
          <Link to="/faq" className="text-foreground underline-offset-4 hover:underline">
            Questions people actually ask
          </Link>
          .
        </p>
      </div>
    </Shell>
  );
}

function Plan({
  name,
  price,
  blurb,
  points,
  cta,
  onCta,
  featured,
  quiet,
  active,
}: {
  name: string;
  price: string;
  blurb: string;
  points: string[];
  cta: string;
  onCta: () => void;
  featured?: boolean;
  quiet?: boolean;
  active?: boolean;
}) {
  return (
    <div className={cn("flex flex-col rounded-2xl p-6 shadow-[var(--shadow-border)]", featured && "bg-secondary")}>
      <p className="font-display text-2xl">{name}</p>
      <p className="mt-2 font-display text-4xl tabular-nums">
        {price}
        {price !== "$0" ? <span className="text-base text-muted-foreground"> / month</span> : null}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{blurb}</p>
      <ul className="mt-6 grid flex-1 gap-2 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {quiet ? (
        <Button asChild variant="outline" className="mt-8">
          <Link to="/intake">{cta}</Link>
        </Button>
      ) : (
        <Button className="mt-8" variant={featured ? "default" : "outline"} onClick={onCta} disabled={active}>
          {cta}
        </Button>
      )}
    </div>
  );
}
