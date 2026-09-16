import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  EMPTY_PROFILE,
  type Activity,
  type CheckIn,
  type Consult,
  type ConsultResult,
  type DeskPayload,
  type Profile,
  type Review,
  type Tier,
} from "@/lib/types";

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function iso(v: unknown) {
  if (!v) return new Date().toISOString();
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

async function insertActivity(userId: string, kind: string, label: string, detail = "") {
  const sql = await getSql();
  const id = crypto.randomUUID();
  await sql.query(`insert into hp_activities (id, user_id, kind, label, detail) values ($1, $2, $3, $4, $5)`, [
    id,
    userId,
    kind,
    label,
    detail,
  ]);
}

export const loadDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DeskPayload> => {
    const sql = await getSql();
    const uid = context.userId;

    const profiles = await sql.query<{ data: unknown; completed_at: string | null }>(
      `select data, completed_at from hp_profiles where user_id = $1`,
      [uid],
    );
    const membership = await sql.query<{ tier: string }>(`select tier from hp_membership where user_id = $1`, [uid]);
    const consultRows = await sql.query<{
      id: string;
      body_region: string;
      symptoms: string;
      result: unknown;
      created_at: string;
    }>(
      `select id, body_region, symptoms, result, created_at from hp_consults where user_id = $1 order by created_at desc limit 40`,
      [uid],
    );
    const reviewRows = await sql.query<{
      id: string;
      name: string;
      role: string;
      body: string;
      rating: number;
      created_at: string;
    }>(`select id, name, role, body, rating, created_at from hp_reviews where user_id = $1 order by created_at desc limit 40`, [
      uid,
    ]);
    const activityRows = await sql.query<{
      id: string;
      kind: string;
      label: string;
      detail: string;
      created_at: string;
    }>(
      `select id, kind, label, detail, created_at from hp_activities where user_id = $1 order by created_at desc limit 30`,
      [uid],
    );
    const presence = await sql.query<{ last_seen: string | null; visit_count: number }>(
      `select last_seen, visit_count from hp_presence where user_id = $1`,
      [uid],
    );
    const checkinRows = await sql.query<{
      id: string;
      energy: number;
      mood: number;
      sleep_score: number;
      stress: number;
      note: string;
      created_at: string;
    }>(
      `select id, energy, mood, sleep_score, stress, note, created_at from hp_checkins where user_id = $1 order by created_at desc limit 90`,
      [uid],
    );

    let profile: Profile | null = null;
    if (profiles[0]) {
      const data = parseJson<Profile>(profiles[0].data, EMPTY_PROFILE);
      profile = {
        ...EMPTY_PROFILE,
        ...data,
        completedAt: profiles[0].completed_at ? iso(profiles[0].completed_at) : data.completedAt,
      };
    }

    const consults: Consult[] = consultRows.map((r) => ({
      id: r.id,
      bodyRegion: r.body_region,
      symptoms: r.symptoms,
      createdAt: iso(r.created_at),
      result: parseJson<ConsultResult>(r.result, {
        title: "Educational note",
        urgency: "routine",
        summary: "",
        possibleConsiderations: [],
        lifestyleFirst: [],
        whenToSeeClinician: [],
        educationalMedications: [],
        formulaIfUnavailable: "",
        citations: [],
        disclaimer: "",
      }),
    }));

    const reviews: Review[] = reviewRows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      text: r.body,
      rating: Number(r.rating) || 5,
      createdAt: iso(r.created_at),
    }));

    const activities: Activity[] = activityRows.map((r) => ({
      id: r.id,
      kind: r.kind,
      label: r.label,
      detail: r.detail,
      createdAt: iso(r.created_at),
    }));

    const checkins: CheckIn[] = checkinRows.map((r) => ({
      id: r.id,
      energy: Number(r.energy),
      mood: Number(r.mood),
      sleep: Number(r.sleep_score),
      stress: Number(r.stress),
      note: r.note,
      createdAt: iso(r.created_at),
    }));

    const lastSeen = presence[0]?.last_seen ? iso(presence[0].last_seen) : null;
    const visitCount = Number(presence[0]?.visit_count ?? 0);

    return {
      profile,
      tier: (membership[0]?.tier as Tier) || "free",
      consults,
      reviews,
      activities,
      checkins,
      visitCount,
      lastSeen,
    };
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Profile) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const completed = data.completedAt ?? new Date().toISOString();
    await sql.query(
      `insert into hp_profiles (user_id, data, completed_at, updated_at)
       values ($1, $2::jsonb, $3, now())
       on conflict (user_id) do update set data = excluded.data, completed_at = excluded.completed_at, updated_at = now()`,
      [context.userId, JSON.stringify({ ...data, completedAt: completed }), completed],
    );
    await insertActivity(context.userId, "intake", "Completed assessment", data.name || "Profile saved");
    return { ok: true as const, completedAt: completed };
  });

export const saveTier = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { tier: Tier }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query(
      `insert into hp_membership (user_id, tier, updated_at)
       values ($1, $2, now())
       on conflict (user_id) do update set tier = excluded.tier, updated_at = now()`,
      [context.userId, data.tier],
    );
    if (data.tier !== "free") {
      await insertActivity(context.userId, "upgrade", `Opened ${data.tier}`, "");
    }
    return { ok: true as const };
  });

export const saveConsult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Consult) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query(
      `insert into hp_consults (id, user_id, body_region, symptoms, result, created_at)
       values ($1, $2, $3, $4, $5::jsonb, $6)`,
      [data.id, context.userId, data.bodyRegion, data.symptoms, JSON.stringify(data.result), data.createdAt],
    );
    await insertActivity(context.userId, "consult", `Clinic note · ${data.bodyRegion}`, data.result.title);
    return { ok: true as const };
  });

export const saveReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Review) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query(
      `insert into hp_reviews (id, user_id, name, role, body, rating, created_at)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [data.id, context.userId, data.name, data.role, data.text, data.rating, data.createdAt],
    );
    await insertActivity(context.userId, "review", "Left a quiet note", "");
    return { ok: true as const };
  });

export const saveCheckin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CheckIn) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query(
      `insert into hp_checkins (id, user_id, energy, mood, sleep_score, stress, note, created_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [data.id, context.userId, data.energy, data.mood, data.sleep, data.stress, data.note, data.createdAt],
    );
    await insertActivity(context.userId, "checkin", "Logged today's state", data.note);
    return { ok: true as const };
  });

export const logVisit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { label: string }) => input)
  .handler(async ({ context, data }) => {
    await insertActivity(context.userId, "visit", data.label, "");
    return { ok: true as const };
  });

export const touchPresence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const prev = await sql.query<{ last_seen: string | null; visit_count: number }>(
      `select last_seen, visit_count from hp_presence where user_id = $1`,
      [context.userId],
    );
    const last = prev[0]?.last_seen ? new Date(prev[0].last_seen).getTime() : 0;
    const stale = Date.now() - last > 6 * 60 * 60 * 1000;
    await sql.query(
      `insert into hp_presence (user_id, last_seen, visit_count)
       values ($1, now(), 1)
       on conflict (user_id) do update set last_seen = now(), visit_count = hp_presence.visit_count + 1`,
      [context.userId],
    );
    if (stale) {
      await insertActivity(context.userId, "login", "Returned to Human Potential", "");
    }
    return { ok: true as const, returning: stale && last > 0 };
  });
