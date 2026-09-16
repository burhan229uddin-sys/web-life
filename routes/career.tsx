import { createFileRoute } from "@tanstack/react-router";
import { DomainArticle } from "@/components/domain-article";

export const Route = createFileRoute("/career")({
  component: () => (
    <DomainArticle slug="career">
      <WorldDesk />
    </DomainArticle>
  ),
});

const HYGIENE = [
  { t: "One digest", b: "A written briefing, not a feed. Close it. Distant fires will not be improved by your cortisol." },
  { t: "Controllable vs not", b: "Skills, sleep, one civic action a month. Not the entire century." },
  { t: "Ship something", b: "A public artifact every quarter beats another course you will not finish." },
  { t: "People over commentary", b: "Three conversations with lives you respect outperform ten takes." },
];

function WorldDesk() {
  return (
    <section className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">This century</p>
      <h2 className="mt-3 font-display text-3xl">The firehose is the product.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Markets are noisy, news is engineered for arousal, and your nervous system was not built for a global feed. Clarity is designed.
      </p>
      <div className="mt-6 grid gap-4">
        {HYGIENE.map((h) => (
          <div key={h.t} className="rounded-xl bg-secondary p-4">
            <h3 className="font-display text-lg">{h.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{h.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
