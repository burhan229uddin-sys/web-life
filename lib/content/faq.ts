export type Faq = { q: string; a: string; tag: string };

export const FAQ: Faq[] = [
  {
    tag: "Trust",
    q: "Is this a doctor? Will I get a real prescription?",
    a: "No. Human Potential is an educational desk. It names red flags, classes of medicine, and when to see a licensed clinician. It does not diagnose, treat, or prescribe. A real person with a license starts, stops, or substitutes a drug.",
  },
  {
    tag: "Trust",
    q: "Why should I trust the numbers?",
    a: "Calories and TDEE here are Mifflin-St Jeor estimates with a range, not a lab. Wearables often miscount steps and sleep — we say so. Grams on recipes come from typical cooked yields. If a number cannot be honest, we will not print it as fact.",
  },
  {
    tag: "Billing",
    q: "Will you charge my card in secret?",
    a: "No. Free is actually free. Pro is $18/month, Plus $36/month. Cancel any time. This preview cannot take a live card until you paste Stripe (or PayPal) payment links on the Receive money page. Then members pay you, not a mystery middleman.",
  },
  {
    tag: "Billing",
    q: "How do I receive the $18 and $36?",
    a: "Create a Stripe account, make two recurring Payment Links, paste them under Receive money. Members tap Pay. Stripe deposits to the bank you verified. PayPal works the same way if you prefer it.",
  },
  {
    tag: "Product",
    q: "What do people actually want that you built?",
    a: "From 2026 health-app reviews: honest tracking, a generous free tier, cancel-anytime billing, grams not mystery cups, a packet you can take to a clinician, real photographs of humans, a search box, and a daily log that takes seconds — not a game about your health.",
  },
  {
    tag: "Product",
    q: "Can I export my file for a doctor's visit?",
    a: "Yes. Status includes a clinician packet: your file, check-ins, symptoms, and consult titles. Print or save as PDF from the browser. It is a memory aid, not a medical record.",
  },
  {
    tag: "Privacy",
    q: "Do you sell my health file?",
    a: "No. Your assessment, check-ins, and clinic notes sit on your signed-in desk. Quiet notes are optional. There is no ad network here.",
  },
  {
    tag: "Health",
    q: "What if I am in crisis?",
    a: "Leave this site. Local emergency services. In the US, call or text 988. This desk cannot hold a crisis and will not give methods.",
  },
  {
    tag: "Health",
    q: "I just want to know what to eat today.",
    a: "Open Diet or Kitchen after the file. You get a plate for your decade, a protein line for your pattern, and recipes in grams. Organic is a spend order, not a halo.",
  },
  {
    tag: "Health",
    q: "I need a therapist, not a quote.",
    a: "The bond room says when to go, what a licensed method looks like, and the first six-session review. We do not assign you a person. The door is the point.",
  },
];
