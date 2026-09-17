import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { NeedFile } from "@/components/need-file";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDayLog, patchDay, type DayLog, type MealLog, type SymptomLog, todayKey } from "@/lib/logs";
import { checkinStreak, localDayKey } from "@/lib/plan";
import { calcTdee } from "@/lib/scoring";
import { useHP } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/progress")({
  component: () => (
    <NeedFile>
      <ProgressPage />
    </NeedFile>
  ),
});

function ProgressPage() {
  const profile = useHP((s) => s.profile);
  const checkins = useHP((s) => s.checkins);
  const addActivity = useHP((s) => s.addActivity);
  const streak = checkinStreak(checkins);
  const tdee = calcTdee(profile);
  const [log, setLog] = useState<DayLog>(() => getDayLog());
  const [mealName, setMealName] = useState("");
  const [grams, setGrams] = useState(150);
  const [symptom, setSymptom] = useState("");
  const [intensity, setIntensity] = useState(3);

  useEffect(() => {
    setLog(getDayLog());
  }, []);

  const days = useMemo(() => {
    const out: { key: string; on: boolean }[] = [];
    const set = new Set(checkins.map((c) => localDayKey(c.createdAt)));
    const cursor = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() - i);
      const key = localDayKey(d.toISOString());
      out.push({ key, on: set.has(key) });
    }
    return out;
  }, [checkins]);

  function bumpWater() {
    const next = patchDay({ water: Math.min(16, log.water + 1) });
    setLog(next);
  }

  function setSteps(n: number) {
    const next = patchDay({ steps: Math.max(0, n) });
    setLog(next);
  }

  function addMeal() {
    if (!mealName.trim()) return;
    const row: MealLog = {
      id: crypto.randomUUID(),
      name: mealName.trim(),
      grams: grams,
      note: "",
    };
    const next = patchDay({ meals: [row, ...log.meals] });
    setLog(next);
    setMealName("");
    addActivity({
      id: crypto.randomUUID(),
      kind: "food",
      label: `Logged ${row.grams} g ${row.name}`,
      detail: `${row.grams} g`,
      createdAt: new Date().toISOString(),
    });
  }

  function addSymptom() {
    if (!symptom.trim()) return;
    const row: SymptomLog = {
      id: crypto.randomUUID(),
      name: symptom.trim(),
      intensity,
      note: "",
    };
    const next = patchDay({ symptoms: [row, ...log.symptoms] });
    setLog(next);
    setSymptom("");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Progress · {todayKey()}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Logged by you. Not guessed by a sensor.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Reviews of health apps complain about fake step counts and bananas that weigh 200 kcal. You enter the grams.
          Estimates stay estimates. Check-in streak: {streak}.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl">28-day check-in map</h2>
          <div className="mt-4 grid grid-cols-7 gap-2 sm:max-w-md">
            {days.map((d) => (
              <div
                key={d.key}
                title={d.key}
                className={cn("aspect-square rounded-md", d.on ? "bg-sage" : "bg-secondary")}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Sage = a day you actually checked in. Empty is honest.</p>
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl">Water</h2>
            <p className="mt-2 text-sm text-muted-foreground">One tap is a glass. Not a smart bottle.</p>
            <p className="mt-4 font-display text-5xl tabular-nums">{log.water}</p>
            <Button className="mt-4" onClick={bumpWater}>
              + one glass
            </Button>
          </article>

          <article className="rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl">Steps you counted</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Type what the watch said, or a walking estimate. We will not invent a number while you sit.
            </p>
            <Label htmlFor="st" className="mt-4 block">
              Steps today
            </Label>
            <Input
              id="st"
              className="mt-2"
              type="number"
              min={0}
              value={log.steps}
              onChange={(e) => setSteps(Number(e.target.value))}
            />
          </article>
        </div>

        <article className="mt-6 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl">Food in grams</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Maintenance, if you are weight-stable, is around {tdee - 150}–{tdee + 150} kcal (Mifflin-St Jeor ± a
            margin). Weigh the thing. Cups lie.
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="grid min-w-48 flex-1 gap-2">
              <Label htmlFor="food">What</Label>
              <Input id="food" value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="Cooked lentils" />
            </div>
            <div className="grid w-28 gap-2">
              <Label htmlFor="g">Grams</Label>
              <Input id="g" type="number" min={5} value={grams} onChange={(e) => setGrams(Number(e.target.value))} />
            </div>
            <Button onClick={addMeal}>Log</Button>
          </div>
          <ul className="mt-5 grid gap-2">
            {log.meals.map((m) => (
              <li key={m.id} className="flex min-h-11 items-center justify-between rounded-xl bg-secondary px-4 text-sm">
                <span>{m.name}</span>
                <span className="tabular-nums text-muted-foreground">{m.grams} g</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="mt-6 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl">Symptoms, timed</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Intensity 1–5. Take this list to a clinician. Do not wait on a website for red flags.
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="grid min-w-48 flex-1 gap-2">
              <Label htmlFor="sy">What you feel</Label>
              <Input id="sy" value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="Tension headache" />
            </div>
            <div className="grid w-28 gap-2">
              <Label htmlFor="int">1–5</Label>
              <Input
                id="int"
                type="number"
                min={1}
                max={5}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
            </div>
            <Button variant="outline" onClick={addSymptom}>
              Log
            </Button>
          </div>
          <ul className="mt-5 grid gap-2">
            {log.symptoms.map((s) => (
              <li key={s.id} className="flex min-h-11 items-center justify-between rounded-xl bg-secondary px-4 text-sm">
                <span>{s.name}</span>
                <span className="tabular-nums text-muted-foreground">{s.intensity}/5</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Shell>
  );
}
