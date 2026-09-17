import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DomainArticle } from "@/components/domain-article";
import { Button } from "@/components/ui/button";
import { logVisit } from "@/lib/desk";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/mind")({
  component: () => (
    <DomainArticle slug="mind">
      <FocusTimer />
    </DomainArticle>
  ),
});

function FocusTimer() {
  const addActivity = useHP((s) => s.addActivity);
  const [seconds, setSeconds] = useState(50 * 60);
  const [run, setRun] = useState(false);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  useEffect(() => {
    if (!run) return;
    const t = window.setInterval(() => {
      setSeconds((n) => {
        if (n <= 1) {
          setRun(false);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [run]);

  function finish() {
    setRun(false);
    const row = {
      id: crypto.randomUUID(),
      kind: "focus",
      label: "Finished a deep block",
      detail: "50 minutes",
      createdAt: new Date().toISOString(),
    };
    addActivity(row);
    logVisit({ data: { label: "Finished a deep block" } }).catch(() => {});
  }

  return (
    <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Deep block</p>
      <h2 className="mt-3 font-display text-3xl">Fifty minutes. Phone in another room.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Newport: one hard thing. The timer is a border, not a personality.
      </p>
      <p className="mt-6 font-display text-5xl tabular-nums">
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => setRun((v) => !v)}>{run ? "Pause" : "Start"}</Button>
        <Button
          variant="outline"
          onClick={() => {
            setRun(false);
            setSeconds(50 * 60);
          }}
        >
          Reset
        </Button>
        <Button variant="secondary" onClick={finish}>
          Mark done
        </Button>
      </div>
    </section>
  );
}
