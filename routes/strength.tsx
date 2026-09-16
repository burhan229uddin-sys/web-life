import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DomainArticle } from "@/components/domain-article";
import { Button } from "@/components/ui/button";
import { logVisit } from "@/lib/desk";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/strength")({
  component: () => (
    <DomainArticle slug="strength">
      <SessionLog />
    </DomainArticle>
  ),
});

const MOVES = [
  "Goblet squat or sit-to-stand",
  "Hinge / Romanian deadlift",
  "Push-up or press",
  "Row",
  "Carry",
];

function SessionLog() {
  const addActivity = useHP((s) => s.addActivity);
  const training = useHP((s) => s.profile.training);
  const [done, setDone] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function toggle(m: string) {
    setDone((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
  }

  function save() {
    const row = {
      id: crypto.randomUUID(),
      kind: "strength",
      label: "Logged a strength session",
      detail: done.join(", ") || training,
      createdAt: new Date().toISOString(),
    };
    addActivity(row);
    logVisit({ data: { label: "Logged a strength session" } }).catch(() => {});
    setSaved(true);
  }

  return (
    <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Tonight's session</p>
      <h2 className="mt-3 font-display text-3xl">Five moves. Two times this week.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Training grade on your file: {training}. 3×8, rest 90 seconds. Leave two reps in reserve.
      </p>
      <ul className="mt-6 grid gap-2">
        {MOVES.map((m) => (
          <li key={m}>
            <button
              type="button"
              onClick={() => toggle(m)}
              className={`flex min-h-11 w-full items-center rounded-xl px-4 text-left text-sm ${done.includes(m) ? "bg-sage/15 text-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {m}
            </button>
          </li>
        ))}
      </ul>
      <Button className="mt-5" onClick={save} disabled={saved}>
        {saved ? "Logged" : "Log this session"}
      </Button>
    </section>
  );
}
