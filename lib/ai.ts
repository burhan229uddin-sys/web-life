import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

const inputSchema = z.object({
  region: z.string().min(1).max(80),
  symptoms: z.string().min(8).max(4000),
  profile: z
    .object({
      age: z.number().optional(),
      sex: z.string().optional(),
      conditions: z.array(z.string()).optional(),
      medications: z.string().optional(),
      sleepHours: z.number().optional(),
      goals: z.array(z.string()).optional(),
    })
    .optional(),
  tier: z.enum(["free", "pro", "plus"]),
});

const medSchema = z.object({
  name: z.string(),
  role: z.string(),
  notes: z.string(),
  generics: z.string().optional(),
});

const resultSchema = z.object({
  title: z.string(),
  urgency: z.enum(["routine", "soon", "urgent", "emergency"]),
  summary: z.string(),
  possibleConsiderations: z.array(z.string()),
  lifestyleFirst: z.array(z.string()),
  whenToSeeClinician: z.array(z.string()),
  educationalMedications: z.array(medSchema),
  formulaIfUnavailable: z.string(),
  citations: z.array(z.string()),
  disclaimer: z.string(),
});

export type ConsultPayload = z.infer<typeof resultSchema>;

const SYSTEM = `You are Human Potential's educational medical writer. You are NOT a doctor, NOT a prescriber, NOT a diagnostic service.

Hard rules:
- Begin from lifestyle, red flags, and when to see a licensed clinician.
- Never claim to diagnose or to issue a prescription.
- If the user describes emergency features (crushing chest pain, stroke signs, suicidal intent, anaphylaxis, severe breathlessness, uncontrolled bleeding), set urgency to "emergency" and tell them to use local emergency services immediately. For suicidal intent, include the 988 Suicide & Crisis Lifeline (US) and local emergency numbers. Do not provide methods.
- Medication discussion is educational: class, typical role, common generics if a brand might be unavailable, monitoring. Always "only a licensed prescriber can start, stop, or substitute."
- "formulaIfUnavailable": describe generic equivalents, same-class options clinicians often consider, or a lifestyle formula — never a homemade drug recipe, never dosing for a specific person, never compounding instructions for controlled substances or sterile injectables.
- Prefer citations to named books, major guidelines (AHA, NICE, AASM, ACSM, ADA, ACG), and landmark trials.
- Tone: calm, precise, adult. No emoji. No wellness-influencer cadence.
- Output STRICT JSON only, matching this shape:
{
  "title": string,
  "urgency": "routine" | "soon" | "urgent" | "emergency",
  "summary": string,
  "possibleConsiderations": string[],
  "lifestyleFirst": string[],
  "whenToSeeClinician": string[],
  "educationalMedications": [{"name": string, "role": string, "notes": string, "generics": string}],
  "formulaIfUnavailable": string,
  "citations": string[],
  "disclaimer": string
}`;

function strings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function parseResult(raw: unknown): ConsultPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const urgency: ConsultPayload["urgency"] =
    o.urgency === "emergency" || o.urgency === "urgent" || o.urgency === "soon" || o.urgency === "routine"
      ? o.urgency
      : "routine";
  const meds = Array.isArray(o.educationalMedications)
    ? o.educationalMedications.flatMap((m) => {
        if (!m || typeof m !== "object") return [];
        const x = m as Record<string, unknown>;
        return [
          {
            name: String(x.name ?? ""),
            role: String(x.role ?? ""),
            notes: String(x.notes ?? ""),
            generics: typeof x.generics === "string" ? x.generics : "",
          },
        ];
      })
    : [];
  return {
    title: String(o.title ?? "Educational note"),
    urgency,
    summary: String(o.summary ?? ""),
    possibleConsiderations: strings(o.possibleConsiderations),
    lifestyleFirst: strings(o.lifestyleFirst),
    whenToSeeClinician: strings(o.whenToSeeClinician),
    educationalMedications: meds,
    formulaIfUnavailable: String(o.formulaIfUnavailable ?? ""),
    citations: strings(o.citations),
    disclaimer: String(o.disclaimer ?? "Educational only. Not a diagnosis or prescription."),
  };
}

export const runConsult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; result: ConsultPayload } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "The medical desk is offline in this environment." };
    }

    const user = [
      `Membership: ${data.tier}`,
      `Body region: ${data.region}`,
      `Symptoms / question: ${data.symptoms}`,
      data.profile
        ? `Context: age ${data.profile.age ?? "?"}, sex ${data.profile.sex ?? "?"}, sleep ${data.profile.sleepHours ?? "?"}h, conditions: ${(data.profile.conditions ?? []).join(", ") || "none listed"}, medications: ${data.profile.medications || "none listed"}, goals: ${(data.profile.goals ?? []).join(", ") || "unspecified"}`
        : "",
      data.tier === "free"
        ? "Keep lifestyleFirst to 3 items. Keep educationalMedications to at most 1 general class. Emphasize seeing a clinician."
        : data.tier === "pro"
          ? "Be thorough. Include generic equivalents."
          : "Be thorough. Include a careful 'formula if unavailable' as licensed generics / same-class options / lifestyle formula. Still not a prescription.",
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 1400,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `The desk could not complete this consult (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const jsonText = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    try {
      const parsed = parseResult(JSON.parse(jsonText));
      if (!parsed) return { ok: false, error: "The desk returned an unreadable note. Try a shorter description." };
      return { ok: true, result: parsed };
    } catch {
      return { ok: false, error: "The desk returned an unreadable note. Try a shorter description." };
    }
  });
