import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { searchDesk } from "@/lib/search-index";

export function SearchDesk() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const hits = useMemo(() => searchDesk(q), [q]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Search the desk">
          <Search />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <p className="font-display text-2xl">Search the desk</p>
        <p className="mt-2 text-sm text-muted-foreground">Rooms, recipes, body regions, medicines, books, questions.</p>
        <Input
          className="mt-5"
          placeholder="Sleep, iron, Gottman, lentils…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <ul className="mt-6 grid gap-2">
          {hits.map((h) => (
            <li key={h.kind + h.title}>
              <Link
                to={h.href as never}
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-secondary px-4 py-3 hover:bg-accent"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{h.kind}</p>
                <p className="mt-1 text-sm font-medium">{h.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{h.blurb}</p>
              </Link>
            </li>
          ))}
          {q.trim().length >= 2 && hits.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nothing with that name. Try a body region or a food.</li>
          ) : null}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
