import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DomainBars, ScoreRing } from "@/components/score";
import { Gate } from "@/components/paywall";
import { NeedFile } from "@/components/need-file";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { checkinStreak, weekPlan } from "@/lib/plan";
import { assess, calcTdee } from "@/lib/scoring";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <NeedFile>
      <Dashboard />
    </NeedFile>
  ),
});

function Dashboard() {
  const profile = useHP((s) => s.profile);
  const tier = useHP((s) => s.tier);
  const activities = useHP((s) => s.activities);
  const checkins = useHP((s) => s.checkins);
  const consults = useHP((s) => s.consults);
  const visitCount = useHP((s) => s.visitCount);
  const lastSeen = useHP((s) => s.lastSeen);

  const a = assess(profile);
  const name = profile.name ? profile.name : "Your";
  const streak = checkinStreak(checkins);
  const week = weekPlan(profile);
  const tdee = calcTdee(profile);

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {tier} desk · educational report
        </p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl">
              {name === "Your" ? "Your potential index" : `${name}'s potential index`}
            </h1>
            <p className="mt-4 text-muted-foreground">{a.headline}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {visitCount} visits
              {lastSeen ? ` · last ${new Date(lastSeen).toLocaleString()}` : ""}
              {streak ? ` · ${streak}-day streak` : ""}
              {` · ${consults.length} clinic notes`}
            </p>
          </div>
          <ScoreRing value={a.potentialIndex} label="Index" />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/progress">
              Progress & logs <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/packet">
              Clinician packet <ArrowRight />
            </Link>
          </Button>
        </div>

        {a.flags.length > 0 && (
          <div className="mt-10 rounded-2xl bg-destructive/10 p-5 text-sm">
            <p className="font-medium">Flags — read before the numbers</p>
            <ul className="mt-2 grid gap-2 text-muted-foreground">
              {a.flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] lg:col-span-5">
            <h2 className="font-display text-2xl">Domains</h2>
            <p className="mt-1 text-sm text-muted-foreground">Lowest three are where the free moves point.</p>
            <div className="mt-6">
              <DomainBars items={a.domains} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3">
            <Stat label="BMI" value={String(a.bmi)} note={a.bmiLabel} />
            <Stat label="BMR" value={`${a.bmr}`} note="kcal / day, Mifflin-St Jeor" />
            <Stat label="TDEE" value={`${tdee - 150}–${tdee + 150}`} note="estimate ± margin, not a lab" />
            <Stat
              label="Waist"
              value={profile.waistCm ? `${profile.waistCm} cm` : "—"}
              note={a.waistRisk === "unknown" ? "add a waist" : `${a.waistRisk} metabolic risk band`}
            />
            <Stat label="Sleep" value={`${profile.sleepHours} h`} note="opportunity, not wearables" />
            <Stat label="Training" value={profile.training} note={profile.activity} />
          </div>
        </div>

        {checkins.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl">Check-ins</h2>
            <div className="mt-5 overflow-x-auto">
              <div className="flex gap-3">
                {checkins.slice(0, 14).map((c) => (
                  <div key={c.id} className="min-w-36 rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]">
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm">E {c.energy} · M {c.mood}</p>
                    <p className="text-sm text-muted-foreground">S {c.sleep} · R {c.stress}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display text-3xl">Three free moves</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {a.freeMoves.map((m, i) => (
              <li key={m} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
                <p className="text-[11px] tabular-nums text-muted-foreground">0{i + 1}</p>
                <p className="mt-3 text-sm text-muted-foreground">{m}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl">This week, from your file</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {week.map((d) => (
              <article key={d.day} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{d.day}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="text-foreground">Sleep. </span>
                  {d.sleep}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="text-foreground">Move. </span>
                  {d.move}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="text-foreground">Fuel. </span>
                  {d.fuel}
                </p>
              </article>
            ))}
          </div>
        </section>

        {activities.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl">Involvement</h2>
            <ol className="mt-5 grid gap-2">
              {activities.slice(0, 12).map((act) => (
                <li
                  key={act.id}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]"
                >
                  <span>
                    {act.label}
                    {act.detail ? <span className="text-muted-foreground"> · {act.detail}</span> : null}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
            <Badge variant="outline">Clinic</Badge>
            <h3 className="mt-3 font-display text-2xl">Take a symptom to the desk</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Eight free educational consults. Not a prescription. Red flags are named.
            </p>
            <Button asChild className="mt-5">
              <Link to="/clinic">
                Open clinic <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
            <Badge variant="outline">Kitchen</Badge>
            <h3 className="mt-3 font-display text-2xl">Eat for this file</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pattern {profile.diet}. Maintenance around {a.tdee} kcal if weight-stable is the aim.
            </p>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/kitchen">
                Open kitchen <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl">Locked continuation</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            You already have the map. Pro writes the week. Plus writes the substitutions.
          </p>
          <div className="mt-6">
            <Gate
              need="pro"
              teaser={
                <ul className="grid gap-3 md:grid-cols-2">
                  {[
                    "A 14-day sleep reset matched to your hours and caffeine window.",
                    "Strength week shaped by your training grade, not a generic PDF.",
                    "Plate math for your TDEE and diet pattern.",
                    "Therapist / GP triage from your mood and stress scores.",
                  ].map((t) => (
                    <li key={t} className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
              }
            >
              <ProPlan />
            </Gate>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/intake">Revise assessment</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/pricing">Membership</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl capitalize tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function ProPlan() {
  const profile = useHP((s) => s.profile);
  const a = assess(profile);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h3 className="font-display text-xl">This week's physiology</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Sleep opportunity {profile.sleepHours < 7 ? "is short — fix the window before adding supplements." : "is in range — protect it with a fixed wake time."}{" "}
          Training grade {profile.training}: two full-body sessions plus walking. Fuel around {a.tdee} kcal if you are not cutting.
        </p>
      </article>
      <article className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h3 className="font-display text-xl">Who to involve</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          {profile.mood <= 2 || profile.stress >= 4
            ? "A therapist is indicated if this mood/stress pattern has lasted more than two weeks or is harming work or love. That is treatment, not failure."
            : "No urgent mental-health flag from the scores. Keep the door open — function dropping is the reason to go, not a worse story."}{" "}
          {a.waistRisk !== "low" && a.waistRisk !== "unknown"
            ? "Ask a clinician for BP, ApoB or lipids, and A1c."
            : "Still know your BP and lipids this year."}
        </p>
      </article>
    </div>
  );
}
