export type RoomTo =
  | "/clinic"
  | "/sleep"
  | "/nutrition"
  | "/aesthetics"
  | "/kitchen"
  | "/relations"
  | "/mind"
  | "/strength"
  | "/career";

export type Room = {
  to: RoomTo;
  img: string;
  title: string;
  blurb: string;
  kicker: string;
};

export const ROOMS: Room[] = [
  {
    to: "/clinic",
    img: "/images/clinic.jpg",
    title: "Clinic & body",
    blurb: "Every region, red flags, and an educational medical desk.",
    kicker: "Atlas",
  },
  {
    to: "/sleep",
    img: "/images/sleep-still.jpg",
    title: "Sleep & energy",
    blurb: "Regularity, light, caffeine math, CBT-I.",
    kicker: "Recovery",
  },
  {
    to: "/nutrition",
    img: "/images/food-table.jpg",
    title: "Diet",
    blurb: "Plates by age and goal. Organic ranking.",
    kicker: "Fuel",
  },
  {
    to: "/aesthetics",
    img: "/images/aesthetics.jpg",
    title: "Aesthetics",
    blurb: "Skin, posture, composition — health that shows.",
    kicker: "Form",
  },
  {
    to: "/kitchen",
    img: "/images/kitchen.jpg",
    title: "Kitchen",
    blurb: "Grams, recipes, olive oil. A full free menu.",
    kicker: "Cook",
  },
  {
    to: "/relations",
    img: "/images/relations.jpg",
    title: "Therapist & bond",
    blurb: "When to go. Gottman. Social potential.",
    kicker: "Bond",
  },
  {
    to: "/mind",
    img: "/images/mind.jpg",
    title: "Mind & discipline",
    blurb: "Deep work, purpose, stop delaying.",
    kicker: "Focus",
  },
  {
    to: "/strength",
    img: "/images/strength.jpg",
    title: "Body & strength",
    blurb: "Zone 2, load, longevity.",
    kicker: "Frame",
  },
  {
    to: "/career",
    img: "/images/career.jpg",
    title: "Career & world",
    blurb: "Prototype a life. Diet the news.",
    kicker: "World",
  },
];
