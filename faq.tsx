import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/lib/content/faq";

export const Route = createFileRoute("/faq")({ component: FaqPage });

function FaqPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Asked, not marketed</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">What people actually want to know.</h1>
        <p className="mt-4 text-muted-foreground">
          Pulled from 2026 health-app reviews: hidden billing, fake precision, no export, no humans in the photos.
        </p>
        <ol className="mt-12 grid gap-10">
          {FAQ.map((f) => (
            <li key={f.q}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{f.tag}</p>
              <h2 className="mt-2 font-display text-2xl">{f.q}</h2>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/payouts">Receive membership money</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/pricing">See the three desks</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
}
