import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSeenStories, markStorySeen } from "@/lib/saves";
import { ROOMS, type Room, type RoomTo } from "@/lib/rooms";
import { useHP } from "@/lib/store";
import { cn } from "@/lib/utils";

const OPEN = new Set<RoomTo>(["/kitchen"]);

export function roomHref(to: RoomTo, signedIn: boolean, hasFile: boolean) {
  if (OPEN.has(to) || to === "/kitchen") return to;
  if (!signedIn) return "/login" as const;
  if (!hasFile) return "/intake" as const;
  return to;
}

export function Stories({ className }: { className?: string }) {
  const { user } = useCurrentUserState();
  const hasFile = Boolean(useHP((s) => s.profile.completedAt));
  const [seen, setSeen] = useState<string[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    setSeen(getSeenStories());
  }, []);

  function open(i: number) {
    const room = ROOMS[i];
    setActive(i);
    setSeen(markStorySeen(room.to));
  }

  function close() {
    setActive(null);
  }

  function next() {
    if (active == null) return;
    const n = (active + 1) % ROOMS.length;
    open(n);
  }

  const story = active != null ? ROOMS[active] : null;
  const href = story ? roomHref(story.to, Boolean(user), hasFile) : "/";

  return (
    <>
      <div className={cn("overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
        <ul className="flex min-w-max gap-4 px-1 py-1">
          {ROOMS.map((r, i) => {
            const viewed = seen.includes(r.to);
            return (
              <li key={r.to} className="w-20 shrink-0">
                <button type="button" onClick={() => open(i)} className="flex w-full flex-col items-center gap-2 text-center">
                  <span className={cn("grid size-[72px] place-items-center rounded-full", viewed ? "bg-border" : "story-ring")}>
                    <span className="grid size-[66px] place-items-center overflow-hidden rounded-full bg-background">
                      <img src={r.img} alt="" className="size-full object-cover" />
                    </span>
                  </span>
                  <span className="line-clamp-2 text-[11px] leading-tight text-muted-foreground">{r.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {story ? <StoryView room={story} href={href} index={active ?? 0} onClose={close} onNext={next} /> : null}
    </>
  );
}

function StoryView({
  room,
  href,
  index,
  onClose,
  onNext,
}: {
  room: Room;
  href: string;
  index: number;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground text-background" role="dialog" aria-modal="true" aria-label={room.title}>
      <div className="flex gap-1 px-3 pt-3">
        {ROOMS.map((r, i) => (
          <span key={r.to} className={cn("h-0.5 flex-1 rounded-full", i <= index ? "bg-background" : "bg-background/30")} />
        ))}
      </div>
      <div className="relative min-h-0 flex-1">
        <img src={room.img} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <button type="button" className="absolute inset-y-0 left-0 z-10 w-1/3 pb-40" aria-label="Close story" onClick={onClose} />
        <button type="button" className="absolute inset-y-0 right-0 z-10 w-2/3 pb-40" aria-label="Next story" onClick={onNext} />
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 pb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-background/70">{room.kicker}</p>
          <h2 className="mt-2 font-display text-3xl text-background">{room.title}</h2>
          <p className="mt-2 max-w-md text-sm text-background/80">{room.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to={href} onClick={onClose}>
                Enter this room
              </Link>
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
