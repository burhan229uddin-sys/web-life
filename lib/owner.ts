import { loadPayouts } from "@/lib/payouts";

/** Emails the owner asked to bake in. Add more here if they tell us in chat. */
export const BAKED_OWNER_EMAILS: string[] = ["burhan229uudin@gmail.com"];

const KEY = "hp-owner-emails";

function norm(email: string) {
  return email.trim().toLowerCase();
}

export function loadOwnerEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string").map(norm) : [];
  } catch {
    return [];
  }
}

export function saveOwnerEmails(emails: string[]) {
  const next = [...new Set(emails.map(norm).filter(Boolean))];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function grantOwnerEmail(email: string) {
  const n = norm(email);
  if (!n) return loadOwnerEmails();
  return saveOwnerEmails([...loadOwnerEmails(), n]);
}

export function isOwnerEmail(email: string | null | undefined) {
  if (!email) return false;
  const n = norm(email);
  const payout = loadPayouts().email;
  const all = [
    ...BAKED_OWNER_EMAILS.map(norm),
    ...loadOwnerEmails(),
    ...(payout ? [norm(payout)] : []),
  ];
  return all.includes(n);
}
