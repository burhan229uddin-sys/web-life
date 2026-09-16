import { create } from "zustand";
import {
  EMPTY_PROFILE,
  type Activity,
  type CheckIn,
  type Consult,
  type DeskPayload,
  type Profile,
  type Review,
  type Tier,
} from "./types";

type State = {
  profile: Profile;
  tier: Tier;
  consults: Consult[];
  reviews: Review[];
  activities: Activity[];
  checkins: CheckIn[];
  visitCount: number;
  lastSeen: string | null;
  loaded: boolean;
  hydrate: (d: DeskPayload) => void;
  setProfile: (p: Partial<Profile>) => void;
  completeIntake: (p: Profile) => void;
  setTier: (t: Tier) => void;
  addConsult: (c: Consult) => void;
  addReview: (r: Review) => void;
  addActivity: (a: Activity) => void;
  addCheckin: (c: CheckIn) => void;
  reset: () => void;
};

export const useHP = create<State>()((set) => ({
  profile: EMPTY_PROFILE,
  tier: "free",
  consults: [],
  reviews: [],
  activities: [],
  checkins: [],
  visitCount: 0,
  lastSeen: null,
  loaded: false,
  hydrate: (d) =>
    set({
      profile: d.profile ?? EMPTY_PROFILE,
      tier: d.tier,
      consults: d.consults,
      reviews: d.reviews,
      activities: d.activities,
      checkins: d.checkins ?? [],
      visitCount: d.visitCount,
      lastSeen: d.lastSeen,
      loaded: true,
    }),
  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  completeIntake: (p) =>
    set((s) => ({
      profile: { ...p, completedAt: p.completedAt ?? new Date().toISOString() },
      activities: [
        {
          id: crypto.randomUUID(),
          kind: "intake",
          label: "Completed assessment",
          detail: p.name,
          createdAt: new Date().toISOString(),
        },
        ...s.activities,
      ],
    })),
  setTier: (tier) => set({ tier }),
  addConsult: (c) => set((s) => ({ consults: [c, ...s.consults].slice(0, 40) })),
  addReview: (r) => set((s) => ({ reviews: [r, ...s.reviews].slice(0, 40) })),
  addActivity: (a) => set((s) => ({ activities: [a, ...s.activities].slice(0, 40) })),
  addCheckin: (c) => set((s) => ({ checkins: [c, ...s.checkins].slice(0, 90) })),
  reset: () =>
    set({
      profile: EMPTY_PROFILE,
      tier: "free",
      consults: [],
      activities: [],
      checkins: [],
      loaded: false,
    }),
}));
