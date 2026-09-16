import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  size = 132,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 132 132" className="size-full -rotate-90" aria-hidden>
        <circle cx="66" cy="66" r={r} fill="none" stroke="currentColor" className="text-secondary" strokeWidth="6" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl tabular-nums leading-none">{value}</span>
        {label ? <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  );
}

export function DomainBars({
  items,
}: {
  items: { key: string; label: string; score: number; note?: string }[];
}) {
  return (
    <ul className="grid gap-4">
      {items.map((d) => (
        <li key={d.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm">{d.label}</span>
            <span className="text-sm tabular-nums text-muted-foreground">{d.score}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full bg-primary transition-[width] duration-500")}
              style={{ width: `${d.score}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
