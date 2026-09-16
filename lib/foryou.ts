import { plateForAge, plateForGoal, dietLine } from "@/lib/content/plates";
import { aestheticsByAge } from "@/lib/content/aesthetics";
import type { Profile } from "@/lib/types";

export type FileNote = { heading: string; body: string };

export function fileNotes(p: Profile, room?: string): FileNote[] {
  const notes: FileNote[] = [];
  const agePlate = plateForAge(p.age);

  if (!room || room === "nutrition" || room === "kitchen") {
    notes.push({
      heading: `Plate for ${agePlate.for.toLowerCase()}`,
      body: `${dietLine(p)} ${plateForGoal(p.goals)}`,
    });
  }
  if (!room || room === "aesthetics") {
    notes.push({ heading: "This decade, visually", body: aestheticsByAge(p.age) });
  }
  if ((!room || room === "sleep") && p.sleepHours < 7) {
    notes.push({
      heading: "Sleep is the bottleneck",
      body: `You logged ${p.sleepHours} hours. Protect an 8-hour opportunity and a fixed wake time before adding supplements.`,
    });
  }
  if ((!room || room === "strength") && (p.training === "none" || p.activity === "sedentary")) {
    notes.push({
      heading: "The minimum that still works",
      body: "Two full-body sessions and walking most days. Sit-to-stand, a hinge, a push, a row, a carry.",
    });
  }
  if ((!room || room === "mind") && (p.stress >= 4 || p.mood <= 2)) {
    notes.push({
      heading: "Mood is medical",
      body: "High stress or low mood lasting more than two weeks, or harming work or love, is a reason to involve a clinician or therapist. 988 in the US if you might hurt yourself.",
    });
  }
  if ((!room || room === "relations") && (p.socialSupport <= 2 || p.relationship === "complicated")) {
    notes.push({
      heading: "Bond is a vital sign",
      body: "Loneliness and contempt are physiologic stressors. One undistracted conversation this week is a protocol, not a luxury.",
    });
  }
  if ((!room || room === "career") && (p.careerSatisfaction <= 2 || p.purpose <= 2)) {
    notes.push({
      heading: "Prototype, don't declare",
      body: "Write a one-sentence purpose for 90 days. Run one two-week experiment instead of a five-year proclamation.",
    });
  }
  if (p.smoking === "current") {
    notes.push({
      heading: "The highest-yield change",
      body: "Stopping smoking outperforms almost every other lever on this desk. Licensed cessation help exists. This site is not that clinic.",
    });
  }
  return notes.slice(0, 3);
}
