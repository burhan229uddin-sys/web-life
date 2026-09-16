import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useHP } from "@/lib/store";
import { Shell } from "@/components/shell";

export function NeedFile({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const loaded = useHP((s) => s.loaded);
  const profile = useHP((s) => s.profile);

  if (isPending || (user && !loaded)) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg px-4 py-24">
          <div className="h-8 w-48 animate-pulse rounded-md bg-secondary" />
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-secondary" />
        </div>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (!profile.completedAt) return <Navigate to="/intake" />;
  return <>{children}</>;
}
