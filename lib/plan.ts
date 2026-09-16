import { assess } from "./scoring";
import type { Profile } from "./types";

export type DayPlan = {
  day: string;
  sleep: string;
  move: string;
  fuel: string;
  mind: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function weekPlan(p: Profile): DayPlan[] {
  const a = assess(p);
  const shortSleep = p.sleepHours < 7;
  const lift =
    p.training === "none"
      ? "Walk 30 min. Two sets of sit-to-stand from a chair."
      : p.training === "beginner"
        ? "Full-body: squat, hinge, push, row — 3×8."
        : "Strength: squat/hinge/push/pull/carry. Leave 2 reps in reserve.";
  const zone2 =
    p.activity === "sedentary" || p.activity === "light"
      ? "Brisk walk you can talk through, 25–40 min."
      : "Zone 2 (conversational effort) 40–50 min.";
  const protein =
    p.diet === "vegan"
      ? "Tofu, lentils, or tempeh at each meal."
      : p.diet === "vegetarian"
        ? "Eggs, yogurt, or legumes at each meal."
        : "A palm of protein at each meal.";

  return DAYS.map((day, i) => {
    const liftDay = i === 0 || i === 3;
    const zoneDay = i === 1 || i === 4 || i === 6;
    const restish = i === 5;
    return {
      day,
      sleep: shortSleep
        ? "Fixed wake. Lights down 60 min before bed. No caffeine after 14:00."
        : "Protect the same wake time. Phone charges outside the room.",
      move: liftDay ? lift : zoneDay ? zone2 : restish ? "Walk, mobility, no heroics." : "8k steps. Ten-minute walk after lunch.",
      fuel:
        i === 6
          ? `Social meal is allowed. Keep ${protein.toLowerCase()} and skip the second drink.`
          : `${protein} Plants on half the plate. Water before coffee.`,
      mind:
        a.domains.find((d) => d.key === "mind")!.score < 55
          ? "Ten-minute outdoor light. One worry dump on paper. No news in bed."
          : "One 50-minute deep block. Phone in another room.",
    };
  });
}

export function localDayKey(iso = new Date().toISOString()) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function checkinStreak(checkins: { createdAt: string }[]) {
  if (!checkins.length) return 0;
  const days = new Set(checkins.map((c) => localDayKey(c.createdAt)));
  const cursor = new Date();
  if (!days.has(localDayKey(cursor.toISOString()))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let n = 0;
  while (days.has(localDayKey(cursor.toISOString()))) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

export function checkedInToday(checkins: { createdAt: string }[]) {
  const today = localDayKey();
  return checkins.some((c) => localDayKey(c.createdAt) === today);
}
