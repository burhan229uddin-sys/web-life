import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Gate, hasTier } from "@/components/paywall";
import { SaveButton } from "@/components/save-button";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORGANIC_RULES, ORGANIC_SPEND } from "@/lib/content/organic";
import { CONVERTER, MEASURES, RECIPES } from "@/lib/content/recipes";
import { useHasHydrated } from "@/lib/hydrated";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/kitchen")({ component: Kitchen });

function Kitchen() {
  const hydrated = useHasHydrated();
  const diet = useHP((s) => s.profile.diet);
  const tier = useHP((s) => s.tier);
  const [filter, setFilter] = useState<"all" | "free" | "fit">("all");
  const sorted = useMemo(() => {
    let list = [...RECIPES];
    if (filter === "free") list = list.filter((r) => r.tier === "free");
    if (filter === "fit") list = list.filter((r) => r.diet.includes(diet as never));
    return list.sort((a, b) => {
      const aFit = a.diet.includes(diet as never) ? 0 : 1;
      const bFit = b.diet.includes(diet as never) ? 0 : 1;
      const aFree = a.tier === "free" ? 0 : 1;
      const bFree = b.tier === "free" ? 0 : 1;
      return aFree - bFree || aFit - bFit;
    });
  }, [diet, filter]);
  const freeCount = RECIPES.filter((r) => r.tier === "free").length;

  return (
    <Shell>
      <div className="relative min-h-[40vh] overflow-hidden">
        <img src="/images/food-table.jpg" alt="Mediterranean foods on linen" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Kitchen</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Grams, plants, and olive oil.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {freeCount} recipes on the free desk — enough to cook for weeks. Pattern currently: {hydrated ? diet : "omnivore"}.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl">Cooking measures</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Cooks who weigh eat more consistently. Palms and fists are for restaurants and travel.
        </p>
        <Converter />
        <div className="mt-6 overflow-hidden rounded-2xl shadow-[var(--shadow-border)]">
          <table className="w-full text-sm">
            <tbody>
              {MEASURES.map((m) => (
                <tr key={m.from} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{m.from}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Organic, ranked</p>
          <h2 className="mt-3 font-display text-3xl">A spend order, not a halo.</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Residue lists are a budget tool. Plants beat purity. Wash everything.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {ORGANIC_SPEND.map((band) => (
              <article key={band.band} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
                <h3 className="font-display text-xl">{band.band}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{band.note}</p>
                <ul className="mt-4 grid gap-3">
                  {band.items.map((item) => (
                    <li key={item.name} className="text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">{item.why}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {ORGANIC_RULES.map((r) => (
              <div key={r.heading} className="rounded-2xl bg-secondary p-5">
                <h3 className="font-display text-lg">{r.heading}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 flex flex-wrap gap-2">
          {(["all", "free", "fit"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
              {f === "all" ? "All recipes" : f === "free" ? "Free desk" : "Fits your pattern"}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sorted.map((r) => {
            const locked = !hydrated || !hasTier(tier, r.tier);
            const card = <RecipeCard r={r} />;
            if (!locked) return <div key={r.id}>{card}</div>;
            return (
              <Gate key={r.id} need={r.tier} teaser={<RecipeCard r={r} dimmed />}>
                {card}
              </Gate>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

function Converter() {
  const [id, setId] = useState(CONVERTER[0].id);
  const [qty, setQty] = useState(1);
  const item = CONVERTER.find((c) => c.id === id) ?? CONVERTER[0];
  const grams = Math.round(item.grams * qty * 10) / 10;
  return (
    <div className="mt-6 rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
      <p className="text-sm font-medium">Quick converter</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs text-muted-foreground">
          Ingredient
          <select
            className="h-11 rounded-md bg-secondary px-3 text-sm text-foreground"
            value={id}
            onChange={(e) => setId(e.target.value)}
          >
            {CONVERTER.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          {item.unit}s
          <input
            type="number"
            min={0.25}
            step={0.25}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="h-11 w-24 rounded-md bg-secondary px-3 text-sm text-foreground tabular-nums"
          />
        </label>
        <p className="pb-2 font-display text-2xl tabular-nums">{grams} g</p>
      </div>
    </div>
  );
}

function RecipeCard({
  r,
  dimmed,
}: {
  r: (typeof RECIPES)[number];
  dimmed?: boolean;
}) {
  return (
    <article className={`rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] ${dimmed ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{r.minutes} min</Badge>
        <Badge variant="muted">
          {r.serves} {r.serves === 1 ? "plate" : "plates"}
        </Badge>
        {r.kcal ? <Badge variant="sage">{r.kcal}</Badge> : null}
        {r.tier !== "free" ? <Badge>{r.tier}</Badge> : null}
        {!dimmed ? <SaveButton id={`recipe:${r.id}`} /> : null}
      </div>
      <h3 className="mt-3 font-display text-2xl">{r.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{r.why}</p>
      {!dimmed && (
        <>
          <h4 className="mt-5 text-sm font-medium">Ingredients</h4>
          <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
            {r.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <h4 className="mt-5 text-sm font-medium">Method</h4>
          <ol className="mt-2 grid list-decimal gap-1 pl-4 text-sm text-muted-foreground">
            {r.method.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-muted-foreground">{r.organic}</p>
        </>
      )}
    </article>
  );
}
