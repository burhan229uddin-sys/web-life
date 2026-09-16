export type Payouts = {
  businessName: string;
  email: string;
  provider: "stripe" | "paypal" | "lemon" | "paddle" | "payoneer";
  country: string;
  proLink: string;
  plusLink: string;
  savedAt: string | null;
};

const KEY = "hp-payouts";

export const EMPTY_PAYOUTS: Payouts = {
  businessName: "",
  email: "",
  provider: "stripe",
  country: "",
  proLink: "",
  plusLink: "",
  savedAt: null,
};

export function loadPayouts(): Payouts {
  if (typeof window === "undefined") return EMPTY_PAYOUTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_PAYOUTS;
    return { ...EMPTY_PAYOUTS, ...(JSON.parse(raw) as Payouts) };
  } catch {
    return EMPTY_PAYOUTS;
  }
}

export function savePayouts(p: Payouts) {
  const next = { ...p, savedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
