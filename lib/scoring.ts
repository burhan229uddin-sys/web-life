import { TIER_LIMITS, type Assessment, type DomainScore, type Profile, type Tier } from "./types";

const ACTIVITY_FACTOR: Record<Profile["activity"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

export function calcBmi(weightKg: number, heightCm: number) {
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return weightKg / (m * m);
}

export function bmiLabel(bmi: number) {
  if (bmi < 18.5) return "Below typical range";
  if (bmi < 25) return "Typical range";
  if (bmi < 30) return "Above typical range";
  return "Significantly above typical range";
}

export function calcBmr(p: Profile) {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  if (p.sex === "male") return Math.round(base + 5);
  if (p.sex === "female") return Math.round(base - 161);
  return Math.round(base - 78);
}

export function calcTdee(p: Profile) {
  return Math.round(calcBmr(p) * ACTIVITY_FACTOR[p.activity]);
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function waistRisk(p: Profile): Assessment["waistRisk"] {
  if (!p.waistCm) return "unknown";
  if (p.sex === "male") {
    if (p.waistCm >= 102) return "high";
    if (p.waistCm >= 94) return "elevated";
    return "low";
  }
  if (p.sex === "female") {
    if (p.waistCm >= 88) return "high";
    if (p.waistCm >= 80) return "elevated";
    return "low";
  }
  if (p.waistCm >= 95) return "high";
  if (p.waistCm >= 85) return "elevated";
  return "low";
}

export function assess(p: Profile): Assessment {
  const bmi = calcBmi(p.weightKg, p.heightCm);
  const bmr = calcBmr(p);
  const tdee = calcTdee(p);
  const waist = waistRisk(p);

  const body = clamp(
    72 -
      Math.abs(bmi - 22.5) * 4 +
      (p.training === "none" ? -12 : p.training === "beginner" ? 0 : 8) +
      (p.activity === "sedentary" ? -10 : p.activity === "light" ? 0 : 8) +
      (waist === "high" ? -12 : waist === "elevated" ? -6 : 4),
  );

  const sleep =
    clamp(p.sleepHours >= 7 && p.sleepHours <= 9 ? 78 : 78 - Math.abs(p.sleepHours - 7.5) * 12, 18, 100) +
    (p.sleepQuality - 3) * 6;
  const sleepScore = clamp(sleep);

  const fuel = clamp(
    70 +
      (p.diet === "mediterranean" ? 12 : p.diet === "undecided" ? -8 : 0) +
      (p.alcohol === "none" ? 8 : p.alcohol === "light" ? 2 : p.alcohol === "moderate" ? -8 : -18) +
      (p.smoking === "never" ? 10 : p.smoking === "former" ? 0 : -22) +
      (p.energy - 3) * 3,
  );

  const mind = clamp(55 + (p.mood - 3) * 8 + (3 - p.stress) * 8 + (p.purpose - 3) * 4);

  const social = clamp(
    50 + (p.socialSupport - 3) * 10 + (p.relationship === "complicated" ? -12 : p.relationship === "prefer-not" ? 0 : 6),
  );

  const drive = clamp(48 + (p.careerSatisfaction - 3) * 8 + (p.purpose - 3) * 8 + Math.min(12, p.goals.length * 3));

  const domains: DomainScore[] = [
    { key: "body", label: "Body", score: Math.round(body), note: "Composition, training, and movement load." },
    { key: "sleep", label: "Sleep", score: Math.round(sleepScore), note: "Duration and reported quality — the recovery bottleneck." },
    { key: "fuel", label: "Fuel", score: Math.round(fuel), note: "Pattern of eating, alcohol, and smoke exposure." },
    { key: "mind", label: "Mind", score: Math.round(mind), note: "Mood, stress load, and cognitive rest." },
    { key: "social", label: "Bond", score: Math.round(social), note: "Support and the quality of close ties." },
    { key: "drive", label: "Drive", score: Math.round(drive), note: "Purpose, work fit, and chosen aims." },
  ];

  const potentialIndex = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length);

  const flags: string[] = [];
  if (p.symptoms.includes("Chest tightness") || p.symptoms.includes("Shortness of breath")) {
    flags.push(
      "Chest tightness or breathlessness can be urgent. If sudden, severe, or with arm, jaw, or fainting symptoms, seek emergency care now.",
    );
  }
  if (p.sleepHours < 6) flags.push("Chronic short sleep is a major lever — start here before adding complexity.");
  if (p.smoking === "current") flags.push("Stopping smoking is the single highest-yield health change available.");
  if (p.stress >= 4 && p.mood <= 2) {
    flags.push("High stress with low mood is a reason to involve a clinician or therapist, not only self-protocols.");
  }
  if (waist === "high") {
    flags.push("Waist circumference is in a range linked with metabolic risk — worth a clinical check of glucose, lipids, and blood pressure.");
  }
  if (p.alcohol === "heavy") {
    flags.push("Heavy alcohol use undermines sleep, mood, liver, and blood pressure. Discuss reduction with a clinician.");
  }

  const lowest = [...domains].sort((a, b) => a.score - b.score).slice(0, 3);
  const freeMoves: string[] = [];
  for (const d of lowest) {
    if (d.key === "sleep") {
      freeMoves.push(
        "Protect an 8-hour sleep opportunity: fixed wake time, dim lights 60 minutes before bed, no caffeine after early afternoon.",
      );
    }
    if (d.key === "body") {
      freeMoves.push(
        "Walk 7–8k steps and lift 2–3 days this week. Strength is the longevity drug you can start without a prescription.",
      );
    }
    if (d.key === "fuel") {
      freeMoves.push("Build plates around plants, protein, and olive oil. Cut liquid sugar. Keep alcohol to 0–3 drinks a week.");
    }
    if (d.key === "mind") {
      freeMoves.push("Ten minutes of outdoor morning light and a 10-minute worry dump on paper beats another supplement stack.");
    }
    if (d.key === "social") {
      freeMoves.push("Schedule one undistracted conversation this week. Loneliness is a physiologic stressor, not a personality flaw.");
    }
    if (d.key === "drive") {
      freeMoves.push("Write a one-sentence purpose for the next 90 days. Ambiguity is more exhausting than hard work.");
    }
  }

  const headline =
    potentialIndex >= 78
      ? "A high-capacity system with a few precise upgrades."
      : potentialIndex >= 62
        ? "A workable foundation. Three levers will move this faster than twenty tweaks."
        : potentialIndex >= 48
          ? "The organism is compensating. Recovery and fuel first — then ambition."
          : "The load is high. Simplify: sleep, protein, walking, and a clinical check-in.";

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiLabel: bmiLabel(bmi),
    bmr,
    tdee,
    waistRisk: waist,
    potentialIndex,
    domains,
    headline,
    freeMoves: freeMoves.slice(0, 3),
    flags,
  };
}

export function remainingConsults(tier: Tier, used: number) {
  return Math.max(0, TIER_LIMITS[tier].consults - used);
}
