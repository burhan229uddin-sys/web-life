import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { ChipGroup } from "@/components/chips";
import { NeedAuth } from "@/components/need-auth";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { saveProfile } from "@/lib/desk";
import {
  CONDITION_OPTIONS,
  EMPTY_PROFILE,
  GOAL_OPTIONS,
  SYMPTOM_OPTIONS,
  type Profile,
  type Scale,
} from "@/lib/types";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/intake")({ component: IntakePage });

function IntakePage() {
  return (
    <NeedAuth>
      <Intake />
    </NeedAuth>
  );
}

const STEPS = ["Frame", "Load", "Recovery", "Fuel", "Signals", "Life"];

function Intake() {
  const saved = useHP((s) => s.profile);
  const completeIntake = useHP((s) => s.completeIntake);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState<Profile>({ ...EMPTY_PROFILE, ...saved, completedAt: saved.completedAt });

  function patch(partial: Partial<Profile>) {
    setP((prev) => ({ ...prev, ...partial }));
  }

  async function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    const finished = { ...p, completedAt: new Date().toISOString() };
    setBusy(true);
    try {
      await saveProfile({ data: finished });
      completeIntake(finished);
      navigate({ to: "/" });
    } catch {
      completeIntake(finished);
      navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          First, your file · {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </p>
        <h1 className="mt-3 font-display text-4xl">{STEPS[step]}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Four minutes. Then every room opens. Educational only — not a diagnosis.
        </p>
        <div className="mt-6 flex gap-1">
          {STEPS.map((_, i) => (
            <button
              key={STEPS[i]}
              type="button"
              aria-label={STEPS[i]}
              onClick={() => setStep(i)}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>
        <IntakeSteps step={step} p={p} patch={patch} />
        <div className="mt-10 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button className="flex-1" onClick={next} disabled={busy}>
            {step === STEPS.length - 1 ? (busy ? "Saving…" : "Open the rooms") : "Continue"}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function IntakeSteps({
  step,
  p,
  patch,
}: {
  step: number;
  p: Profile;
  patch: (partial: Partial<Profile>) => void;
}) {
  return (
    <div className="mt-10 grid gap-6">
      {step === 0 && (
        <>
          <Field label="What should we call you?" hint="Optional">
            <Input value={p.name} onChange={(e) => patch({ name: e.target.value })} placeholder="First name" />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Age">
              <Input type="number" min={16} max={100} value={p.age} onChange={(e) => patch({ age: Number(e.target.value) })} />
            </Field>
            <Field label="Sex">
              <ChipGroup options={["female", "male", "other"]} value={p.sex} onChange={(v) => patch({ sex: v as Profile["sex"] })} />
            </Field>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field label="Height (cm)">
              <Input type="number" min={120} max={220} value={p.heightCm} onChange={(e) => patch({ heightCm: Number(e.target.value) })} />
            </Field>
            <Field label="Weight (kg)">
              <Input type="number" min={35} max={250} value={p.weightKg} onChange={(e) => patch({ weightKg: Number(e.target.value) })} />
            </Field>
            <Field label="Waist (cm)">
              <Input type="number" min={40} max={200} value={p.waistCm} onChange={(e) => patch({ waistCm: Number(e.target.value) })} />
            </Field>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <Field label="Daily movement">
            <ChipGroup options={["sedentary", "light", "moderate", "high", "athlete"]} value={p.activity} onChange={(v) => patch({ activity: v as Profile["activity"] })} />
          </Field>
          <Field label="Work">
            <ChipGroup options={["desk", "standing", "physical", "mixed", "shift"]} value={p.occupation} onChange={(v) => patch({ occupation: v as Profile["occupation"] })} />
          </Field>
          <Field label="Strength training">
            <ChipGroup options={["none", "beginner", "intermediate", "advanced"]} value={p.training} onChange={(v) => patch({ training: v as Profile["training"] })} />
          </Field>
        </>
      )}
      {step === 2 && (
        <>
          <ScaleField label="Hours of sleep" value={p.sleepHours} min={3} max={10} step={0.5} display={`${p.sleepHours} h`} onChange={(n) => patch({ sleepHours: n })} />
          <ScaleField label="Sleep quality" value={p.sleepQuality} onChange={(n) => patch({ sleepQuality: n as Scale })} />
          <ScaleField label="Daytime energy" value={p.energy} onChange={(n) => patch({ energy: n as Scale })} />
          <ScaleField label="Stress load" value={p.stress} onChange={(n) => patch({ stress: n as Scale })} />
          <ScaleField label="Mood" value={p.mood} onChange={(n) => patch({ mood: n as Scale })} />
        </>
      )}
      {step === 3 && (
        <>
          <Field label="Eating pattern">
            <ChipGroup options={["omnivore", "mediterranean", "vegetarian", "vegan", "low-carb", "undecided"]} value={p.diet} onChange={(v) => patch({ diet: v as Profile["diet"] })} />
          </Field>
          <Field label="Alcohol">
            <ChipGroup options={["none", "light", "moderate", "heavy"]} value={p.alcohol} onChange={(v) => patch({ alcohol: v as Profile["alcohol"] })} />
          </Field>
          <Field label="Smoking">
            <ChipGroup options={["never", "former", "current"]} value={p.smoking} onChange={(v) => patch({ smoking: v as Profile["smoking"] })} />
          </Field>
        </>
      )}
      {step === 4 && (
        <>
          <Field label="Symptoms you notice" hint="Select any">
            <ChipGroup multiple options={SYMPTOM_OPTIONS} value={p.symptoms} onChange={(v) => patch({ symptoms: v as string[] })} />
          </Field>
          <Field label="Known conditions">
            <ChipGroup multiple options={CONDITION_OPTIONS} value={p.conditions} onChange={(v) => patch({ conditions: v as string[] })} />
          </Field>
          <Field label="Medicines or supplements" hint="Names only — we do not alter doses">
            <Textarea value={p.medications} onChange={(e) => patch({ medications: e.target.value })} placeholder="e.g. levothyroxine, vitamin D" />
          </Field>
          <Field label="Anything else the desk should know">
            <Textarea value={p.symptomNotes} onChange={(e) => patch({ symptomNotes: e.target.value })} placeholder="Onset, what helps, what worries you" />
          </Field>
        </>
      )}
      {step === 5 && (
        <>
          <Field label="What you want from this season">
            <ChipGroup multiple options={GOAL_OPTIONS} value={p.goals} onChange={(v) => patch({ goals: v as string[] })} />
          </Field>
          <Field label="Close relationships">
            <ChipGroup options={["single", "partnered", "married", "complicated", "prefer-not"]} value={p.relationship} onChange={(v) => patch({ relationship: v as Profile["relationship"] })} />
          </Field>
          <ScaleField label="Social support" value={p.socialSupport} onChange={(n) => patch({ socialSupport: n as Scale })} />
          <ScaleField label="Career fit" value={p.careerSatisfaction} onChange={(n) => patch({ careerSatisfaction: n as Scale })} />
          <ScaleField label="Sense of purpose" value={p.purpose} onChange={(n) => patch({ purpose: n as Scale })} />
        </>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function ScaleField({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  display,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  display?: string;
}) {
  return (
    <Field label={label} hint={display ?? String(value)}>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
    </Field>
  );
}
