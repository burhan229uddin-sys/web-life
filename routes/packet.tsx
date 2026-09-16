import { createFileRoute } from "@tanstack/react-router";
import { NeedFile } from "@/components/need-file";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { getDayLog } from "@/lib/logs";
import { assess, bmiLabel, calcBmi, calcTdee } from "@/lib/scoring";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/packet")({
  component: () => (
    <NeedFile>
      <Packet />
    </NeedFile>
  ),
});

function Packet() {
  const profile = useHP((s) => s.profile);
  const checkins = useHP((s) => s.checkins);
  const consults = useHP((s) => s.consults);
  const a = assess(profile);
  const bmi = calcBmi(profile.weightKg, profile.heightCm);
  const tdee = calcTdee(profile);
  const log = getDayLog();

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:px-0 print:py-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Clinician packet</p>
        <h1 className="mt-3 font-display text-4xl">A memory aid. Not a chart.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Printed from Human Potential. Educational self-report. Not a diagnosis.
        </p>
        <Button className="mt-6 print:hidden" onClick={() => window.print()}>
          Print or save PDF
        </Button>

        <section className="mt-10 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] print:shadow-none">
          <h2 className="font-display text-2xl">{profile.name || "Member"}</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>
              {profile.age} years · {profile.sex} · {profile.heightCm} cm · {profile.weightKg} kg
            </li>
            <li>
              BMI {bmi.toFixed(1)} ({bmiLabel(bmi)}) — a screening number, not a diagnosis
            </li>
            <li>
              Estimated maintenance {tdee - 150}–{tdee + 150} kcal (Mifflin-St Jeor ± margin)
            </li>
            <li>Sleep {profile.sleepHours} h · activity {profile.activity} · diet {profile.diet}</li>
            <li>Conditions: {profile.conditions.join(", ") || "none listed"}</li>
            <li>Medications: {profile.medications || "none listed"}</li>
            <li>Goals: {profile.goals.join(", ") || "unspecified"}</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-2xl">Potential Index (self-scored)</h2>
          <ul className="mt-3 grid gap-1 text-sm text-muted-foreground">
            {a.domains.map((d) => (
              <li key={d.key}>
                {d.label}: {d.score}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-2xl">Recent check-ins</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {checkins.slice(0, 10).map((c) => (
              <li key={c.id}>
                {new Date(c.createdAt).toLocaleDateString()} — E {c.energy} · M {c.mood} · S {c.sleep} · R {c.stress}
                {c.note ? ` · ${c.note}` : ""}
              </li>
            ))}
            {checkins.length === 0 ? <li>None yet.</li> : null}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-2xl">Today’s grams and symptoms</h2>
          <ul className="mt-3 grid gap-1 text-sm text-muted-foreground">
            {log.meals.map((m) => (
              <li key={m.id}>
                {m.name} — {m.grams} g
              </li>
            ))}
            {log.symptoms.map((s) => (
              <li key={s.id}>
                {s.name} — {s.intensity}/5
              </li>
            ))}
            {log.meals.length + log.symptoms.length === 0 ? <li>Nothing logged today.</li> : null}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-2xl">Educational clinic notes</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {consults.slice(0, 8).map((c) => (
              <li key={c.id}>
                {new Date(c.createdAt).toLocaleDateString()} · {c.bodyRegion} — {c.result.title} ({c.result.urgency})
              </li>
            ))}
            {consults.length === 0 ? <li>None yet.</li> : null}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
