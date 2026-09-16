import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Shell } from "@/components/shell";

export function NeedAuth({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg px-4 py-24">
          <div className="h-8 w-48 animate-pulse rounded-md bg-secondary" />
        </div>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
