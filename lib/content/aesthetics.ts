export type AestheticBlock = {
  heading: string;
  body: string;
  cite?: string;
  tier: "free" | "pro" | "plus";
};

export const AESTHETICS: AestheticBlock[] = [
  {
    heading: "Aesthetics are downstream of sleep and inflammation",
    body: "Face, waist, skin, and posture change with sleep, alcohol, smoking, and training more than with a cream. Photograph in the same light monthly. Vanity is allowed; it is more honest than a 'wellness' alibi.",
    cite: "Dermatology photodamage literature; Attia on waist as a vital sign",
    tier: "free",
  },
  {
    heading: "Skin: barrier first",
    body: "Gentle cleanse, moisturizer, SPF on the face in daylight. Retinoids (adapalene OTC in many countries) are the evidence active for photoaging and acne — start slow, moisturize, expect six weeks. Vitamin C serums are optional; sunscreen is not.",
    cite: "AAD acne and photoprotection",
    tier: "free",
  },
  {
    heading: "Posture is training, not a brace",
    body: "The 'desk neck' look is load plus time. Chin tucks, thoracic extension over a towel, screens at eye height, and walking. A $200 chair does not replace a strong back.",
    cite: "Physical therapy consensus on mechanical neck pain",
    tier: "free",
  },
  {
    heading: "Composition by decade",
    body: "20s: skill and tendon resilience — don't smash joints to look a season ahead. 30s: keep VO2 max and protein. 40s: fight sarcopenia like a diagnosis. 50s+: power and balance, the un-glamorous fall-prevention work. Muscle is the aesthetic organ that also saves you.",
    cite: "ACSM; sarcopenia literature",
    tier: "free",
  },
  {
    heading: "Hair and nails as systems, not products",
    body: "Telogen shedding after fever, crash diets, or childbirth is often temporary. Iron, thyroid, and protein matter more than a shampoo. Rapidly changing moles are a dermatologist, not a serum.",
    cite: "AAD hair loss; ABCDE melanoma",
    tier: "free",
  },
  {
    heading: "Teeth are the visible organ people forget",
    body: "Twice-daily fluoride, daily interdental cleaning, spit-don't-rinse at night. Bleeding gums are inflammation, not a brushing personality.",
    cite: "WHO oral health; AHA oral-systemic notes",
    tier: "free",
  },
  {
    heading: "Clothes, light, and the monthly photo",
    body: "Same shirt, same window, once a month. Waist and posture change slower than mood. That is the point.",
    tier: "free",
  },
  {
    heading: "The 12-week composition protocol",
    body: "Strength 3×, steps 8k, protein target (~1.6 g/kg if kidneys are well), a 300–500 kcal gap if fat loss is the aim, weekend photos in the same shirt and light. Face and waist change with sleep and alcohol more than with a cream.",
    cite: "Morton protein meta; energy-balance consensus",
    tier: "pro",
  },
  {
    heading: "Skin stack that is actually a stack",
    body: "AM: cleanse if needed, moisturizer, SPF 30+. PM: cleanse, retinoid 3–5 nights/week, moisturizer. Add a benzoyl peroxide spot for acne. Stop five new actives at once — irritation is not a glow.",
    cite: "AAD; evidence on retinoids",
    tier: "pro",
  },
  {
    heading: "When labs change how you look",
    body: "Ferritin if shedding plus fatigue. TSH if hair, temperature, and energy cluster. A1c and lipids if waist is climbing. Hormones are not a social-media protocol.",
    cite: "Endocrine Society; NICE fatigue",
    tier: "plus",
  },
];

export function aestheticsByAge(age: number) {
  if (age < 30) {
    return "Build the habits that still look optional: SPF, sleep, two lifts a week, no crash diets. Collagen marketing is louder than collagen need.";
  }
  if (age < 45) {
    return "This is the decade the face starts reporting your sleep. Strength and protein now are cheaper than catching up later. Alcohol shows up around the eyes first.";
  }
  if (age < 60) {
    return "Muscle and balance are cosmetic and clinical. Hormone conversations (NAMS, Endocrine Society) belong with a clinician, not a pellet clinic on a high street.";
  }
  return "Power, balance, skin barrier, and social life. Aesthetics here is remaining in the photograph — standing, walking, eating with other people.";
}
