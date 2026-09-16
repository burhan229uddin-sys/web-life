export type OrganicBand = {
  band: string;
  note: string;
  items: { name: string; why: string }[];
};

export const ORGANIC_SPEND: OrganicBand[] = [
  {
    band: "Spend first, if residue worries you",
    note: "Thin skins, eaten whole, or leafy. Wash still matters. Organic is a residue and soil choice, not a morality test.",
    items: [
      { name: "Strawberries, blueberries, grapes", why: "Often top residue lists. Frozen organic berries are a sane budget move." },
      { name: "Spinach, kale, herbs", why: "Large surface area. Herbs are a small spend with a large residue difference." },
      { name: "Apples, pears, peaches, nectarines", why: "Eaten with the peel, which is also the fiber." },
      { name: "Sweet peppers and hot peppers", why: "Frequently cited on consumer residue rankings." },
      { name: "Green beans, cherries", why: "Worth organic if they are weekly staples." },
    ],
  },
  {
    band: "Usually lower priority",
    note: "Thick peel you discard, or historically lower detections. Conventional plus a scrub still wins over no plants.",
    items: [
      { name: "Avocado, pineapple, mango, melon", why: "Peel is discarded. Buy ripe, not a label." },
      { name: "Sweet corn, frozen peas, cabbage", why: "Often lower residue. Frozen is nutritionally respectable." },
      { name: "Onion, garlic, mushrooms", why: "Cheap conventional workhorses." },
      { name: "Kiwi, papaya, asparagus", why: "Typically lower on consumer lists." },
      { name: "Dried pulses and oats", why: "Rinse pulses. Organic oats if you eat them daily and budget allows." },
    ],
  },
  {
    band: "Animal foods, ranked by signal not fashion",
    note: "If you buy one organic animal food, make it the one you eat most. Processing and dose beat a halo.",
    items: [
      { name: "Fatty fish", why: "EPA/DHA matter more than the organic sticker. Smaller fish, lower mercury (AHA)." },
      { name: "Eggs and yogurt", why: "Pasture or organic if you can. Plain live cultures beat fruit-on-the-bottom." },
      { name: "Poultry and meat", why: "A named farm is nicer. Well-cooked conventional plus plants still outperforms a beige delivery." },
      { name: "Ultra-processed 'organic' snacks", why: "Organic sugar is still sugar. Skip the cookie." },
    ],
  },
];

export const ORGANIC_RULES = [
  {
    heading: "Wash everything",
    body: "Running water and a rub remove more than a vinegar theatre. Peeling reduces residue and fiber — choose per food.",
  },
  {
    heading: "The list is a budget tool",
    body: "USDA PDP is the underlying monitoring data. Consumer rankings (EWG and others) compress that into a shopping heuristic. They are not a toxicity diagnosis.",
  },
  {
    heading: "Plants beat purity",
    body: "A conventional apple eaten is better than an organic apple left in the crisper. The PREDIMED pattern is the outcome data; the sticker is a modifier.",
  },
  {
    heading: "Olive oil is a harvest date",
    body: "Look for a harvest or press date, a dark bottle, and extra-virgin. 'Organic' without freshness is rancid charity.",
  },
];
