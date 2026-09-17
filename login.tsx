import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/shell";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    return <Navigate to="/" />;
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({ email, password, name: name || "Member" });
        if (err) throw new Error(err.message || "Could not create the account");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || "Could not sign in");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="/images/hero-light.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="font-display text-4xl text-foreground">Your file, your desk.</p>
          <p className="mt-3 max-w-sm text-sm text-foreground/80">
            Sign in to save the assessment, clinic notes, check-ins, and activity across visits.
          </p>
        </div>
      </div>
      <div className="grid place-items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Wordmark />
          <h1 className="mt-8 font-display text-3xl">{mode === "up" ? "Create your desk." : "Welcome back."}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Google, X, or email. The file follows the account.</p>
          {isPending ? (
            <div className="mt-8 h-11 animate-pulse rounded-md bg-secondary" />
          ) : authEnabled ? (
            <div className="mt-8 grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}

          <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form className="grid gap-3" onSubmit={onEmail}>
            {mode === "up" && (
              <div className="grid gap-1.5">
                <Label htmlFor="n">Name</Label>
                <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="grid gap-1.5">
              <Label htmlFor="e">Email</Label>
              <Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p">Password</Label>
              <Input
                id="p"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMode(mode === "up" ? "in" : "up")}
          >
            {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
          <p className="mt-8 text-xs text-muted-foreground">
            Educational wellness only — not a licensed clinic.{" "}
            <Link to="/" className="underline-offset-4 hover:underline">
              Back
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
