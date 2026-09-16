import { FAQ } from "@/lib/content/faq";
import { LIBRARY } from "@/lib/content/library";
import { MEDICINES } from "@/lib/content/medicines";
import { RECIPES } from "@/lib/content/recipes";
import { ROOMS } from "@/lib/rooms";
import { BODY_SYSTEMS } from "@/lib/content/body-systems";

export type Hit = { title: string; blurb: string; href: string; kind: string };

export function searchDesk(q: string): Hit[] {
  const n = q.trim().toLowerCase();
  if (n.length < 2) return [];
  const hits: Hit[] = [];

  for (const r of ROOMS) {
    const hay = `${r.title} ${r.blurb} ${r.kicker}`.toLowerCase();
    if (hay.includes(n)) hits.push({ title: r.title, blurb: r.blurb, href: r.to, kind: "Room" });
  }
  for (const r of RECIPES) {
    const hay = `${r.name} ${r.why} ${r.tags.join(" ")} ${r.ingredients.join(" ")}`.toLowerCase();
    if (hay.includes(n)) hits.push({ title: r.name, blurb: r.why, href: "/kitchen", kind: "Recipe" });
  }
  for (const s of BODY_SYSTEMS) {
    const hay = `${s.name} ${s.summary} ${s.common.join(" ")} ${s.redFlags.join(" ")}`.toLowerCase();
    if (hay.includes(n)) hits.push({ title: s.name, blurb: s.summary, href: "/clinic", kind: "Clinic" });
  }
  for (const m of MEDICINES) {
    const hay = `${m.name} ${m.usedFor} ${m.className}`.toLowerCase();
    if (hay.includes(n)) hits.push({ title: m.name, blurb: m.usedFor, href: "/clinic", kind: "Medicine" });
  }
  for (const s of LIBRARY) {
    const hay = `${s.title} ${s.author} ${s.takeaway}`.toLowerCase();
    if (hay.includes(n)) hits.push({ title: s.title, blurb: s.takeaway, href: "/library", kind: "Evidence" });
  }
  for (const f of FAQ) {
    const hay = `${f.q} ${f.a}`.toLowerCase();
    if (hay.includes(n)) hits.push({ title: f.q, blurb: f.a, href: "/faq", kind: "FAQ" });
  }

  return hits.slice(0, 18);
}
