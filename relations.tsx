import { createFileRoute } from "@tanstack/react-router";
import { DomainArticle } from "@/components/domain-article";

export const Route = createFileRoute("/relations")({
  component: () => (
    <DomainArticle slug="relations">
      <TherapistDesk />
    </DomainArticle>
  ),
});

const FLAGS = [
  "Function at work or home has dropped for more than two weeks.",
  "The same fight or loop keeps costing you years.",
  "You feel frightened in a relationship — skip experiments, get help.",
  "Trauma keeps arriving as body sensation, not a story you can finish.",
  "Parenting rage, numbness, or panic you do not recognize.",
  "You might hurt yourself — 988 (US) or local emergency services now.",
];

function TherapistDesk() {
  return (
    <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">When to go</p>
      <h2 className="mt-3 font-display text-3xl">A therapist is treatment, not failure.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Licensed. A method you can name. Six sessions then review. This desk does not assign you a person — it tells you the door is the point.
      </p>
      <ul className="mt-6 grid gap-3">
        {FLAGS.map((f) => (
          <li key={f} className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted-foreground">
        Gottman, Burns, van der Kolk, Holt-Lunstad — cited in the evidence room. Emergency: local number. US: 988.
      </p>
    </section>
  );
}
