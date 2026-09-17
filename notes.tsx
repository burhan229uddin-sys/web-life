import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { SEED_REVIEWS } from "@/lib/content/reviews";
import { saveReview } from "@/lib/desk";
import { useHP } from "@/lib/store";

export const Route = createFileRoute("/notes")({ component: Notes });

function Notes() {
  const user = useCurrentUser();
  const extras = useHP((s) => s.reviews);
  const addReview = useHP((s) => s.addReview);
  const all = [...extras, ...SEED_REVIEWS];
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Quiet notes</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Not a testimonial wall.</h1>
        <p className="mt-4 text-muted-foreground">
          A small room at the edge of the site. Field notes from people who used the desk.
        </p>

        <ol className="mt-12 grid gap-10">
          {all.map((r) => (
            <li key={r.id}>
              <blockquote className="font-display text-2xl italic leading-snug">“{r.text}”</blockquote>
              <p className="mt-3 text-sm text-muted-foreground">
                {r.name}
                {r.role ? ` · ${r.role}` : ""} · {r.rating}/5
              </p>
            </li>
          ))}
        </ol>

        <form
          className="mt-16 grid gap-4 border-t border-border pt-10"
          onSubmit={async (e) => {
            e.preventDefault();
            if (text.trim().length < 8) return;
            const row = {
              id: crypto.randomUUID(),
              name: name.trim() || "Anonymous",
              role: role.trim(),
              text: text.trim(),
              rating: 5,
              createdAt: new Date().toISOString(),
            };
            addReview(row);
            setName("");
            setRole("");
            setText("");
            if (user) {
              setBusy(true);
              try {
                await saveReview({ data: row });
              } catch {
                /* local already stored */
              } finally {
                setBusy(false);
              }
            }
          }}
        >
          <p className="font-display text-2xl">Leave a note</p>
          <div className="grid gap-2">
            <Label htmlFor="n">Name</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="r">Role</Label>
            <Input id="r" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. teacher, 38" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="t">Note</Label>
            <Textarea id="t" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Filing…" : "File it"}
          </Button>
        </form>
      </div>
    </Shell>
  );
}
