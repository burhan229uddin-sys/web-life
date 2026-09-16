import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gate, hasTier } from "@/components/paywall";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LIBRARY } from "@/lib/content/library";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/library")({ component: LibraryPage });

const KINDS = ["all", "book", "guideline", "trial", "lecture"] as const;

function LibraryPage() {
  const tier = useHP((s) => s.tier);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("all");
  const list = LIBRARY.filter((s) => kind === "all" || s.kind === kind);
  const freeCount = LIBRARY.filter((s) => s.tier === "free").length;

  return (
    <Shell>
      <div className="relative min-h-[36vh] overflow-hidden">
        <img src="/images/library.jpg" alt="Private medical library" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/25" />
        <div className="relative mx-auto flex min-h-[36vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Evidence</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Books, trials, guidelines.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every protocol on this desk should be able to point at a page. {freeCount} sources are open on the free
            desk — enough to read for a month.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} onClick={() => setKind(k)}>
              {k === "all" ? "All" : k}
            </Button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {list.map((s) => {
            const locked = !hasTier(tier, s.tier);
            const card = <SourceCard key={s.id} s={s} />;
            if (!locked) return card;
            return (
              <Gate key={s.id} need={s.tier} teaser={<SourceCard s={s} dimmed />}>
                {card}
              </Gate>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

function SourceCard({
  s,
  dimmed,
}: {
  s: (typeof LIBRARY)[number];
  dimmed?: boolean;
}) {
  return (
    <article className={`rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] ${dimmed ? "max-h-40 overflow-hidden opacity-50" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{s.kind}</Badge>
        <span className="text-xs tabular-nums text-muted-foreground">{s.year}</span>
        {s.tier !== "free" ? <Badge variant="muted">{s.tier}</Badge> : null}
      </div>
      <h2 className="mt-3 font-display text-2xl">{s.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{s.author}</p>
      {!dimmed && (
        <>
          <p className="mt-4 text-sm text-muted-foreground">{s.takeaway}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Used in {s.usedIn.join(" · ")}</p>
        </>
      )}
    </article>
  );
}
