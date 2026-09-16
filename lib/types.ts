export type Tier = "free" | "pro" | "plus";

export type Sex = "female" | "male" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "high" | "athlete";
export type DietPattern =
  | "omnivore"
  | "mediterranean"
  | "vegetarian"
  | "vegan"
  | "low-carb"
  | "undecided";
export type Alcohol = "none" | "light" | "moderate" | "heavy";
export type Smoking = "never" | "former" | "current";
export type Training = "none" | "beginner" | "intermediate" | "advanced";
export type Occupation = "desk" | "standing" | "physical" | "mixed" | "shift";
export type Relationship =
  | "single"
  | "partnered"
  | "married"
  | "complicated"
  | "prefer-not";

export type Scale = 1 | 2 | 3 | 4 | 5;

export type Profile = {
  name: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  activity: ActivityLevel;
  occupation: Occupation;
  sleepHours: number;
  sleepQuality: Scale;
  energy: Scale;
  stress: Scale;
  mood: Scale;
  diet: DietPattern;
  alcohol: Alcohol;
  smoking: Smoking;
  goals: string[];
  conditions: string[];
  medications: string;
  symptoms: string[];
  symptomNotes: string;
  relationship: Relationship;
  socialSupport: Scale;
  careerSatisfaction: Scale;
  purpose: Scale;
  training: Training;
  completedAt?: string;
};

export type DomainKey = "body" | "sleep" | "fuel" | "mind" | "social" | "drive";

export type DomainScore = {
  key: DomainKey;
  label: string;
  score: number;
  note: string;
};

export type Assessment = {
  bmi: number;
  bmiLabel: string;
  bmr: number;
  tdee: number;
  waistRisk: "low" | "elevated" | "high" | "unknown";
  potentialIndex: number;
  domains: DomainScore[];
  headline: string;
  freeMoves: string[];
  flags: string[];
};

export type ConsultUrgency = "routine" | "soon" | "urgent" | "emergency";

export type ConsultMedication = {
  name: string;
  role: string;
  notes: string;
  generics?: string;
};

export type ConsultResult = {
  title: string;
  urgency: ConsultUrgency;
  summary: string;
  possibleConsiderations: string[];
  lifestyleFirst: string[];
  whenToSeeClinician: string[];
  educationalMedications: ConsultMedication[];
  formulaIfUnavailable: string;
  citations: string[];
  disclaimer: string;
};

export type Consult = {
  id: string;
  createdAt: string;
  bodyRegion: string;
  symptoms: string;
  result: ConsultResult;
};

export type Review = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  createdAt: string;
  hidden?: boolean;
};

export type Activity = {
  id: string;
  kind: string;
  label: string;
  detail: string;
  createdAt: string;
};

export type CheckIn = {
  id: string;
  energy: number;
  mood: number;
  sleep: number;
  stress: number;
  note: string;
  createdAt: string;
};

export type DeskPayload = {
  profile: Profile | null;
  tier: Tier;
  consults: Consult[];
  reviews: Review[];
  activities: Activity[];
  checkins: CheckIn[];
  visitCount: number;
  lastSeen: string | null;
};

export const GOAL_OPTIONS = [
  "Sleep restoration",
  "Steady energy",
  "Fat loss / composition",
  "Strength & muscle",
  "Longevity",
  "Anxiety relief",
  "Focus & cognition",
  "Pain reduction",
  "Relationship repair",
  "Purpose & meaning",
  "Discipline & time",
  "Career clarity",
] as const;

export const CONDITION_OPTIONS = [
  "None that I know",
  "High blood pressure",
  "Type 2 diabetes / prediabetes",
  "High cholesterol",
  "Asthma",
  "Thyroid disorder",
  "PCOS",
  "IBS / reflux",
  "Migraine",
  "Depression / anxiety (treated)",
  "Autoimmune condition",
  "Chronic pain",
  "Insomnia",
  "Anemia",
] as const;

export const SYMPTOM_OPTIONS = [
  "Low energy",
  "Poor sleep",
  "Brain fog",
  "Low mood",
  "Anxiety",
  "Headaches",
  "Digestive discomfort",
  "Joint or back pain",
  "Shortness of breath",
  "Chest tightness",
  "Skin issues",
  "Hormonal irregularity",
  "Low libido",
  "Frequent illness",
  "Weight change",
  "Restless mind",
] as const;

export const EMPTY_PROFILE: Profile = {
  name: "",
  age: 32,
  sex: "female",
  heightCm: 168,
  weightKg: 68,
  waistCm: 78,
  activity: "light",
  occupation: "desk",
  sleepHours: 6.5,
  sleepQuality: 3,
  energy: 3,
  stress: 3,
  mood: 3,
  diet: "omnivore",
  alcohol: "light",
  smoking: "never",
  goals: ["Steady energy", "Sleep restoration"],
  conditions: [],
  medications: "",
  symptoms: [],
  symptomNotes: "",
  relationship: "prefer-not",
  socialSupport: 3,
  careerSatisfaction: 3,
  purpose: 3,
  training: "beginner",
};

export const TIER_LIMITS: Record<Tier, { consults: number; recipes: number; library: number }> = {
  free: { consults: 8, recipes: 20, library: 26 },
  pro: { consults: 24, recipes: 99, library: 99 },
  plus: { consults: 999, recipes: 99, library: 99 },
};
