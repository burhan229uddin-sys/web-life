import { useEffect } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadDesk, saveTier, touchPresence } from "@/lib/desk";
import { isOwnerEmail } from "@/lib/owner";
import { useHP } from "@/lib/store";

const EMPTY_DESK = {
  profile: null,
  tier: "free" as const,
  consults: [],
  reviews: [],
  activities: [],
  checkins: [],
  visitCount: 0,
  lastSeen: null,
};

export function DeskBoot() {
  const { user, isPending } = useCurrentUserState();
  const hydrate = useHP((s) => s.hydrate);
  const setTier = useHP((s) => s.setTier);

  useEffect(() => {
    if (isPending || !user) return;
    let alive = true;
    loadDesk()
      .then((desk) => {
        if (!alive) return;
        const owner = isOwnerEmail(user.primaryEmail);
        hydrate(owner && desk.tier === "free" ? { ...desk, tier: "plus" } : desk);
        if (owner) {
          setTier("plus");
          saveTier({ data: { tier: "plus" } }).catch(() => {});
        }
      })
      .catch(() => {
        if (!alive) return;
        const owner = isOwnerEmail(user.primaryEmail);
        hydrate(owner ? { ...EMPTY_DESK, tier: "plus" } : EMPTY_DESK);
        if (owner) setTier("plus");
      });
    touchPresence().catch(() => {});
    return () => {
      alive = false;
    };
  }, [user?.id, user?.primaryEmail, isPending, hydrate, setTier]);

  return null;
}
