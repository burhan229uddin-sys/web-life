import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { NeedAuth } from "@/components/need-auth";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { saveTier } from "@/lib/desk";
import { grantOwnerEmail, isOwnerEmail, loadOwnerEmails } from "@/lib/owner";
import { EMPTY_PAYOUTS, loadPayouts, savePayouts, type Payouts } from "@/lib/payouts";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/payouts")({
  component: () => (
    <NeedAuth>
      <PayoutsPage />
    </NeedAuth>
  ),
});

function PayoutsPage() {
  const { user } = useCurrentUserState();
  const setTier = useHP((s) => s.setTier);
  const [form, setForm] = useState<Payouts>(EMPTY_PAYOUTS);
  const [saved, setSaved] = useState(false);
  const [members, setMembers] = useState(20);
  const [granted, setGranted] = useState(false);
  const email = user?.primaryEmail ?? "";

  useEffect(() => {
    const p = loadPayouts();
    setForm(p);
    setGranted(isOwnerEmail(email));
  }, [email]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    savePayouts(form);
    if (form.email) grantOwnerEmail(form.email);
    setSaved(true);
  }

  function giveThisAccountPlus() {
    if (email) grantOwnerEmail(email);
    setTier("plus");
    saveTier({ data: { tier: "plus" } }).catch(() => {});
    setGranted(true);
  }

  const gross = members * 18;
  const fee = Math.round(gross * 0.03 + members * 0.3);
  const net = Math.max(0, gross - fee);

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Owner · profit</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">You own the desk. Unlock Plus on your login.</h1>
        <p className="mt-4 text-muted-foreground">
          Signed in as {email || "an account without email"}. Members pay your checkout. You should not pay yourself.
        </p>

        <section className="mt-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl">Your access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            One tap puts this email on the owner list. Every login after that opens the Plus desk — Pro and Plus rooms,
            formulas, unlimited notes. Owner emails on this device:{" "}
            {loadOwnerEmails().join(", ") || "none yet"}.
          </p>
          <Button className="mt-5" type="button" onClick={giveThisAccountPlus} disabled={!email || granted}>
            {granted ? "This email already has Plus" : "Give my email Plus forever"}
          </Button>
        </section>

        <section className="mt-10 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl">A rough month</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If {members} people take Pro at $18, before your own costs:
          </p>
          <Label htmlFor="n" className="mt-4 block">
            Paying Pro members
          </Label>
          <Input
            id="n"
            className="mt-2 max-w-40"
            type="number"
            min={0}
            value={members}
            onChange={(e) => setMembers(Number(e.target.value))}
          />
          <dl className="mt-6 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Gross</dt>
              <dd className="tabular-nums">${gross}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Processor (~3% + 30¢)</dt>
              <dd className="tabular-nums">−${fee}</dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt>About what hits the bank</dt>
              <dd className="tabular-nums">${net}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Plus is $36. Fees vary. This is not tax advice — keep a cut for tax in your country.
          </p>
        </section>

        <ol className="mt-10 grid gap-4">
          {[
            [
              "1",
              "Pick a rail that can pay YOUR bank",
              "Stripe or PayPal if they support your country. Pakistan cannot open Stripe on a local CNIC/bank — use Lemon Squeezy, Paddle, Payoneer, or a legal company in a Stripe country with a bank there.",
            ],
            [
              "2",
              "Create two subscriptions",
              "Pro $18/month. Plus $36/month. Cancel anytime on. Name them Human Potential Pro / Plus.",
            ],
            [
              "3",
              "Paste the checkout links below",
              "When a member taps Activate, your checkout opens. After they pay, the processor pays you on its schedule.",
            ],
          ].map(([n, t, b]) => (
            <li key={n} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] tabular-nums text-muted-foreground">{n}</p>
              <h2 className="mt-2 font-display text-xl">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </li>
          ))}
        </ol>

        <form className="mt-12 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="biz">Your name or studio</Label>
            <Input
              id="biz"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              placeholder="Your studio"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="em">Owner email (also gets Plus)</Label>
            <Input
              id="em"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={email || "you@studio.com"}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="prov">Who pays you</Label>
              <select
                id="prov"
                className="h-11 rounded-md bg-secondary px-3 text-sm"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value as Payouts["provider"] })}
              >
                <option value="stripe">Stripe (if your country is supported)</option>
                <option value="lemon">Lemon Squeezy</option>
                <option value="paddle">Paddle</option>
                <option value="payoneer">Payoneer</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co">Country you will be paid in</Label>
              <Input
                id="co"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="US, UK, PK…"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pro">Your Pro $18 checkout link</Label>
            <Input
              id="pro"
              type="url"
              value={form.proLink}
              onChange={(e) => setForm({ ...form, proLink: e.target.value })}
              placeholder="https://buy.stripe.com/…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plus">Your Plus $36 checkout link</Label>
            <Input
              id="plus"
              type="url"
              value={form.plusLink}
              onChange={(e) => setForm({ ...form, plusLink: e.target.value })}
              placeholder="https://buy.stripe.com/…"
            />
          </div>
          {saved ? <p className="text-sm text-sage">Saved. That owner email will open Plus on login.</p> : null}
          <Button type="submit">Save as the owner</Button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Members still use{" "}
          <Link to="/pricing" className="underline-offset-4 hover:underline">
            Membership
          </Link>
          . You never type a card number here.
        </p>
      </div>
    </Shell>
  );
}
