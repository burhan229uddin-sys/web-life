const KEY = "hp-day-logs";

export type MealLog = { id: string; name: string; grams: number; note: string };
export type SymptomLog = { id: string; name: string; intensity: number; note: string };
export type DayLog = {
  date: string;
  water: number;
  steps: number;
  meals: MealLog[];
  symptoms: SymptomLog[];
};

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function read(): Record<string, DayLog> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, DayLog>) : {};
  } catch {
    return {};
  }
}

function write(all: Record<string, DayLog>) {
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function getDayLog(date = today()): DayLog {
  const all = read();
  return all[date] ?? { date, water: 0, steps: 0, meals: [], symptoms: [] };
}

export function patchDay(partial: Partial<DayLog>, date = today()): DayLog {
  const all = read();
  const cur = all[date] ?? { date, water: 0, steps: 0, meals: [], symptoms: [] };
  const next = { ...cur, ...partial, date };
  all[date] = next;
  write(all);
  return next;
}

export function listDays() {
  return Object.values(read()).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export { today as todayKey };
