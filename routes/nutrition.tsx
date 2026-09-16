import { createFileRoute } from "@tanstack/react-router";
import { DomainArticle } from "@/components/domain-article";
import { ORGANIC_SPEND } from "@/lib/content/organic";
import { AGE_PLATES, plateForAge, plateForGoal } from "@/lib/content/plates";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/nutrition")({
  component: () => (
    <DomainArticle slug="nutrition">
      <NutritionTools />
    </DomainArticle>
  ),
});

function NutritionTools() {
  const profile = useHP((s) => s.profile);
  const mine = plateForAge(profile.age);

  return (
    <div className="grid gap-10">
      <section>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Plates by decade</p>
        <h2 className="mt-3 font-display text-3xl">{mine.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {mine.for}. {plateForGoal(profile.goals)}
        </p>
        <dl className="mt-6 grid gap-4">
          {[
            ["Breakfast", mine.breakfast],
            ["Lunch", mine.lunch],
            ["Dinner", mine.dinner],
            ["Snack", mine.snack],
            ["Protein", mine.protein],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]">
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{k}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">{mine.cite}</p>
      </section>
      <section>
        <h2 className="font-display text-2xl">Other decades</h2>
        <div className="mt-4 grid gap-4">
          {AGE_PLATES.filter((p) => p.id !== mine.id).map((p) => (
            <article key={p.id} className="rounded-2xl bg-secondary p-4">
              <h3 className="font-display text-lg">{p.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.for}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.protein}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl">Organic spend order</h2>
        <p className="mt-2 text-sm text-muted-foreground">The kitchen has the full ranking. Here is the short version.</p>
        <ul className="mt-4 grid gap-3">
          {ORGANIC_SPEND[0].items.map((i) => (
            <li key={i.name} className="text-sm text-muted-foreground">
              <span className="text-foreground">{i.name}. </span>
              {i.why}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
