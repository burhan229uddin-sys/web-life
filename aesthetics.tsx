import { createFileRoute } from "@tanstack/react-router";
import { Gate } from "@/components/paywall";
import { NeedFile } from "@/components/need-file";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { AESTHETICS, aestheticsByAge } from "@/lib/content/aesthetics";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/aesthetics")({
  component: () => (
    <NeedFile>
      <Aesthetics />
    </NeedFile>
  ),
});

function Aesthetics() {
  const profile = useHP((s) => s.profile);
  const free = AESTHETICS.filter((b) => b.tier === "free");
  const pro = AESTHETICS.filter((b) => b.tier === "pro");
  const plus = AESTHETICS.filter((b) => b.tier === "plus");

  return (
    <Shell>
      <article>
        <div className="relative min-h-[42vh] overflow-hidden">
          <img src="/images/aesthetics.jpg" alt="Natural light on skin and posture" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
          <div className="relative mx-auto flex min-h-[42vh] max-w-3xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
            <Badge variant="outline">Form</Badge>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl">Aesthetics, separately</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Skin, posture, composition. Vanity is allowed. It is more honest than a wellness alibi — and it still
              runs on sleep, protein, and light.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">For your decade</p>
            <p className="mt-3 text-muted-foreground">{aestheticsByAge(profile.age)}</p>
          </div>
          <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Free desk</p>
          <div className="mt-6 grid gap-8">
            {free.map((b) => (
              <section key={b.heading}>
                <h2 className="font-display text-2xl">{b.heading}</h2>
                <p className="mt-3 text-muted-foreground">{b.body}</p>
                {b.cite ? <p className="mt-2 text-xs text-muted-foreground/80">{b.cite}</p> : null}
              </section>
            ))}
          </div>
          <div className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Pro protocol</p>
            <Gate need="pro">
              <div className="mt-6 grid gap-8">
                {pro.map((b) => (
                  <section key={b.heading}>
                    <h2 className="font-display text-2xl">{b.heading}</h2>
                    <p className="mt-3 text-muted-foreground">{b.body}</p>
                    {b.cite ? <p className="mt-2 text-xs text-muted-foreground/80">{b.cite}</p> : null}
                  </section>
                ))}
              </div>
            </Gate>
          </div>
          <div className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Plus</p>
            <Gate need="plus">
              <div className="mt-6 grid gap-8">
                {plus.map((b) => (
                  <section key={b.heading}>
                    <h2 className="font-display text-2xl">{b.heading}</h2>
                    <p className="mt-3 text-muted-foreground">{b.body}</p>
                    {b.cite ? <p className="mt-2 text-xs text-muted-foreground/80">{b.cite}</p> : null}
                  </section>
                ))}
              </div>
            </Gate>
          </div>
        </div>
      </article>
    </Shell>
  );
}
