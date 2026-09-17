import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Gate, useUpgrade } from "@/components/paywall";
import { NeedFile } from "@/components/need-file";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BODY_SYSTEMS } from "@/lib/content/body-systems";
import { MEDICINES } from "@/lib/content/medicines";
import { runConsult } from "@/lib/ai";
import { saveConsult } from "@/lib/desk";
import { remainingConsults } from "@/lib/scoring";
import { useHP } from "@/lib/store";
import type { Consult, ConsultResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clinic")({
  component: () => (
    <NeedFile>
      <Clinic />
    </NeedFile>
  ),
});

const EMERGENCY =
  /suicid|kill myself|want to die|chest pain|crushing|can't breathe|cannot breathe|anaphyla|stroke|one-sided weakness|overdose/i;

function Clinic() {
  const [active, setActive] = useState(BODY_SYSTEMS[0].id);
  const system = BODY_SYSTEMS.find((s) => s.id === active) ?? BODY_SYSTEMS[0];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Clinic atlas</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
          Every region. Red flags first. Then the work.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Educational notes for body and mind. Not a diagnosis, not a prescription. If something
          feels like an emergency, it is — leave this page and get help.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {BODY_SYSTEMS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "min-h-11 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    s.id === active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="block">{s.name}</span>
                  <span className={cn("text-[11px]", s.id === active ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {s.region}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Badge variant="outline">{system.region}</Badge>
            <h2 className="mt-3 font-display text-3xl">{system.name}</h2>
            <p className="mt-3 text-muted-foreground">{system.summary}</p>

            <h3 className="mt-8 text-sm font-medium">Common presentations</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {system.common.map((c) => (
                <span key={c} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-destructive/10 p-5">
              <h3 className="text-sm font-medium">Red flags — do not wait on a website</h3>
              <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground">
                {system.redFlags.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <h3 className="mt-8 font-display text-2xl">Free first moves</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {system.free.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <ProtocolBlock system={system} />
          </div>
        </div>

        <Desk region={system.name} />

        <Medicines />
      </div>
    </Shell>
  );
}

function ProtocolBlock({
  system,
}: {
  system: (typeof BODY_SYSTEMS)[number];
}) {
  return (
    <div className="mt-10 grid gap-6">
      <section>
        <h3 className="font-display text-2xl">Protocol</h3>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
          {system.protocol.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          If a named medicine is unavailable
        </p>
        <Gate need="plus">
          <p className="mt-3 text-sm text-muted-foreground">{system.formula}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            This is not a prescription and not compounding advice.
          </p>
        </Gate>
      </section>
      <p className="text-xs text-muted-foreground">Sources: {system.citations.join(" · ")}</p>
    </div>
  );
}

function Desk({ region }: { region: string }) {
  const profile = useHP((s) => s.profile);
  const tier = useHP((s) => s.tier);
  const consults = useHP((s) => s.consults);
  const addConsult = useHP((s) => s.addConsult);
  const left = remainingConsults(tier, consults.length);
  const upgrade = useUpgrade();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<Consult | null>(consults[0] ?? null);

  const crisis = useMemo(() => EMERGENCY.test(text), [text]);

  async function submit() {
    setError(null);
    if (left <= 0) {
      upgrade.open(tier === "free" ? "pro" : "plus");
      return;
    }
    if (text.trim().length < 8) {
      setError("Write a little more — region, timing, what you feel.");
      return;
    }
    setBusy(true);
    try {
      const res = await runConsult({
        data: {
          region,
          symptoms: text.trim(),
          tier,
          profile: {
            age: profile.age,
            sex: profile.sex,
            conditions: profile.conditions,
            medications: profile.medications,
            sleepHours: profile.sleepHours,
            goals: profile.goals,
          },
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const result: ConsultResult = {
        title: res.result.title,
        urgency: res.result.urgency,
        summary: res.result.summary,
        possibleConsiderations: res.result.possibleConsiderations,
        lifestyleFirst: res.result.lifestyleFirst,
        whenToSeeClinician: res.result.whenToSeeClinician,
        educationalMedications: res.result.educationalMedications,
        formulaIfUnavailable: res.result.formulaIfUnavailable,
        citations: res.result.citations,
        disclaimer: res.result.disclaimer,
      };
      const consult: Consult = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        bodyRegion: region,
        symptoms: text.trim(),
        result,
      };
      addConsult(consult);
      saveConsult({ data: consult }).catch(() => {});
      setLatest(consult);
    } catch {
      setError("The desk could not be reached. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      {upgrade.dialog}
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Medical desk</p>
          <h2 className="mt-3 font-display text-3xl">Ask about this region</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Powered by a constrained medical writer. Remaining consults on this desk:{" "}
            <span className="tabular-nums text-foreground">{tier === "plus" ? "open" : left}</span>
            {tier === "free" ? " of 8 on the free desk" : ""}.
          </p>
          {crisis && (
            <div className="mt-4 rounded-xl bg-destructive/15 p-4 text-sm">
              If you are in danger or thinking of suicide, stop here. Call local emergency
              services. In the US, call or text 988. This desk cannot hold a crisis.
            </div>
          )}
          <Textarea
            className="mt-5 min-h-36"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What is happening in ${region.toLowerCase()}? Timing, severity, what you have already tried.`}
          />
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          <Button className="mt-4 w-full sm:w-auto" onClick={submit} disabled={busy}>
            {busy ? "Writing the note…" : "Request educational note"}
          </Button>
        </div>
        <div className="lg:col-span-7">
          {latest ? <ConsultCard consult={latest} /> : (
            <div className="rounded-xl bg-card p-6 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
              The note will appear here. It will never be a prescription.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ConsultCard({ consult }: { consult: Consult }) {
  const r = consult.result;
  const urgency =
    r.urgency === "emergency" ? "danger" : r.urgency === "urgent" ? "warn" : r.urgency === "soon" ? "sage" : "muted";
  return (
    <article className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={urgency}>{r.urgency ?? "routine"}</Badge>
        <span className="text-xs text-muted-foreground">{consult.bodyRegion}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl">{r.title || "Educational note"}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{r.summary}</p>
      <Block title="Possible considerations (not a diagnosis)" items={r.possibleConsiderations} />
      <Block title="Lifestyle first" items={r.lifestyleFirst} />
      <Block title="When to see a clinician" items={r.whenToSeeClinician} />
      {r.educationalMedications?.length ? (
        <div className="mt-5">
          <h4 className="text-sm font-medium">Educational medicine notes</h4>
          <ul className="mt-2 grid gap-3">
            {r.educationalMedications.map((m) => (
              <li key={m.name} className="rounded-lg bg-secondary p-3 text-sm">
                <p className="font-medium">{m.name}</p>
                <p className="text-muted-foreground">{m.role}</p>
                <p className="mt-1 text-muted-foreground">{m.notes}</p>
                {m.generics ? <p className="mt-1 text-xs text-muted-foreground">If unavailable: {m.generics}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {r.formulaIfUnavailable ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Formula if a brand is missing. </span>
          {r.formulaIfUnavailable}
        </p>
      ) : null}
      {r.citations?.length ? (
        <p className="mt-4 text-xs text-muted-foreground">Cited: {r.citations.join(" · ")}</p>
      ) : null}
      <p className="mt-4 text-xs text-muted-foreground">
        {r.disclaimer ||
          "Educational only. Not a diagnosis or prescription. Involve a licensed clinician."}
      </p>
    </article>
  );
}

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-5">
      <h4 className="text-sm font-medium">{title}</h4>
      <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function Medicines() {
  return (
    <section className="mt-16 border-t border-border pt-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Educational pharmacy</p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl">Classes, not prescriptions.</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Over-the-counter notes so you do not wander a pharmacy blind. Never start, stop, or combine medicines because
        a website said so. If a named brand is missing, Plus writes the substitution — still not a script.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {MEDICINES.map((m) => (
          <article key={m.id} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{m.className}</p>
            <h3 className="mt-2 font-display text-xl">{m.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{m.usedFor}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="text-foreground">How. </span>
              {m.how}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="text-foreground">Avoid. </span>
              {m.avoid}
            </p>
            <div className="mt-4">
              <Gate need="plus">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground">If unavailable. </span>
                  {m.ifUnavailable}
                </p>
              </Gate>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{m.cite}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

