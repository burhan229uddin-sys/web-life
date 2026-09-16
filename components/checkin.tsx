import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { saveCheckin } from "@/lib/desk";
import { useHP } from "@/lib/store";
import type { CheckIn } from "@/lib/types";

export function CheckInCard() {
  const addCheckin = useHP((s) => s.addCheckin);
  const addActivity = useHP((s) => s.addActivity);
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [stress, setStress] = useState(3);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const row: CheckIn = {
      id: crypto.randomUUID(),
      energy,
      mood,
      sleep,
      stress,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    setBusy(true);
    addCheckin(row);
    addActivity({
      id: crypto.randomUUID(),
      kind: "checkin",
      label: "Logged today's state",
      detail: note.trim(),
      createdAt: row.createdAt,
    });
    try {
      await saveCheckin({ data: row });
    } catch {
      /* local already stored */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Today</p>
      <h2 className="mt-2 font-display text-2xl">How is the organism?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Thirty seconds. It compounds into your streak and your next plan.</p>
      <div className="mt-6 grid gap-5">
        <Row label="Energy" value={energy} onChange={setEnergy} />
        <Row label="Mood" value={mood} onChange={setMood} />
        <Row label="Last night's sleep" value={sleep} onChange={setSleep} />
        <Row label="Stress" value={stress} onChange={setStress} />
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional: what pulled on you today"
          className="min-h-20"
        />
        <Button onClick={submit} disabled={busy}>
          {busy ? "Saving…" : "Log today"}
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-sm">{label}</p>
        <p className="text-sm tabular-nums text-muted-foreground">{value}/5</p>
      </div>
      <Slider min={1} max={5} step={1} value={[value]} onValueChange={(v) => onChange(v[0] ?? value)} />
    </div>
  );
}
