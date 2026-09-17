import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DomainArticle } from "@/components/domain-article";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/sleep")({
  component: () => (
    <DomainArticle slug="sleep">
      <CaffeineCut />
    </DomainArticle>
  ),
});

function CaffeineCut() {
  const sleepHours = useHP((s) => s.profile.sleepHours);
  const [wake, setWake] = useState("07:00");
  const [bed, setBed] = useState("23:00");

  const cut = addHours(bed, -8);
  const delay = addHours(wake, 1.5);

  return (
    <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Caffeine math</p>
      <h2 className="mt-3 font-display text-3xl">Half-life is not a vibe.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You logged {sleepHours} hours. Caffeine's half-life is often 5–6 hours. A cup eight hours before bed is still on board at lights-out.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="wake">Wake</Label>
          <Input id="wake" type="time" value={wake} onChange={(e) => setWake(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bed">Target lights-out</Label>
          <Input id="bed" type="time" value={bed} onChange={(e) => setBed(e.target.value)} />
        </div>
      </div>
      <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
        <li>
          <span className="text-foreground">First cup after </span>
          {delay} — cortisol is already high on waking.
        </li>
        <li>
          <span className="text-foreground">Last cup before </span>
          {cut}.
        </li>
        <li>This is a lever, not a religion. If you sleep well with different timing, keep it.</li>
      </ul>
    </section>
  );
}

function addHours(hhmm: string, hours: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + Math.round(hours * 60));
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
