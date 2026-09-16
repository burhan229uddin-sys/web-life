import type { Profile } from "@/lib/types";

export type Plate = {
  id: string;
  title: string;
  for: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  protein: string;
  cite: string;
};

export const AGE_PLATES: Plate[] = [
  {
    id: "20s",
    title: "Building the chassis",
    for: "About 16–29",
    breakfast: "Eggs or tofu, fruit, leftover grain. Coffee after water.",
    lunch: "Palm of protein, fist of plants, olive oil. Bread if you trained.",
    dinner: "Fish, legumes, or chicken; bitter greens; slow starch.",
    snack: "Yogurt or fruit and nuts — not a second dessert.",
    protein: "Distribute 20–40 g at meals. Skill and tendon resilience now; don't smash joints to look a season ahead.",
    cite: "Harvard Healthy Eating Plate; ACSM",
  },
  {
    id: "30s",
    title: "Protect the engine",
    for: "About 30–44",
    breakfast: "Protein first. Oats or eggs. Delay the pastry.",
    lunch: "Half plants. Olive oil. A walk after if the afternoon dies.",
    dinner: "Protein and plants. Alcohol is optional and easy to overdo.",
    snack: "If hungry: kefir, fruit, or leftover protein. Not a vending machine.",
    protein: "Keep VO2 max and lifting. Face and waist start reporting sleep and wine.",
    cite: "PREDIMED; Attia on centenarian decathlon",
  },
  {
    id: "40s",
    title: "Fight sarcopenia like a diagnosis",
    for: "About 45–59",
    breakfast: "Protein at every meal becomes non-negotiable. Eggs, yogurt, tofu, fish.",
    lunch: "Plants, olive oil, legumes. Watch liquid sugar and the second coffee after 2pm.",
    dinner: "Protein, greens, and a starch you earned. Earlier if sleep is fragile.",
    snack: "Cottage cheese or a pear. Skip grazing from 9pm.",
    protein: "Aim toward ~1.6 g/kg if kidneys are well (Morton). Power and balance sneak into the week.",
    cite: "Morton 2018; ACSM older adult",
  },
  {
    id: "60s",
    title: "Stay in the photograph",
    for: "About 60+",
    breakfast: "Protein and plants. Fortified soy or dairy if you want calcium without a pill first.",
    lunch: "Soft-cooked if dentition is the limiter — the nutrients still count.",
    dinner: "Protein, color, olive oil. Eat with other people when you can.",
    snack: "Fruit. A handful of nuts. Appetite can fall; skipping protein is the real risk.",
    protein: "Muscle and balance are cosmetic and clinical. Creatine and vitamin D are conversations with a clinician, not a catalogue.",
    cite: "Sarcopenia literature; WHO activity 2020",
  },
];

export function plateForAge(age: number) {
  if (age < 30) return AGE_PLATES[0];
  if (age < 45) return AGE_PLATES[1];
  if (age < 60) return AGE_PLATES[2];
  return AGE_PLATES[3];
}

export function plateForGoal(goals: string[]) {
  if (goals.includes("Fat loss / composition")) {
    return "Protein high, fiber high, liquid calories out, a 300–500 kcal gap if you actually want the waist to move. Weekend photos in the same light.";
  }
  if (goals.includes("Strength & muscle")) {
    return "Small surplus on training days. Protein ~1.6 g/kg. Carbohydrate around the session. Sleep is the other anabolic drug.";
  }
  if (goals.includes("Longevity")) {
    return "Mediterranean-style pattern, zone 2, lifting, waist as a vital sign. ApoB and blood pressure belong with a clinician.";
  }
  if (goals.includes("Steady energy")) {
    return "Protein at breakfast, walk after lunch, no skipped meals, caffeine cut after early afternoon.";
  }
  return "Half plants, a palm of protein, a thumb of olive oil or nuts, water. The influencer industry, collapsed.";
}

export function dietLine(p: Profile) {
  switch (p.diet) {
    case "vegan":
      return "Tofu, tempeh, lentils, and B12. Soy is a complete protein. Iron with vitamin C.";
    case "vegetarian":
      return "Eggs, yogurt, legumes. Don't let cheese become the entire protein strategy.";
    case "low-carb":
      return "Plants still occupy half the plate. Protein and olive oil, not bacon theatre.";
    case "mediterranean":
      return "You already named the pattern with outcome data. Execute it: oil, plants, fish, legumes.";
    default:
      return "Omnivore is a permission, not a plan. Default to plants, protein, olive oil.";
  }
}
