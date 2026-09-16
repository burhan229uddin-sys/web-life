import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { isSaved, toggleSave } from "@/lib/saves";
import { cn } from "@/lib/utils";

export function SaveButton({ id, label }: { id: string; label?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(isSaved(id));
  }, [id]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOn(toggleSave(id).includes(id));
      }}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-medium uppercase tracking-wider",
        on ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      aria-pressed={on}
      aria-label={label ?? "Save"}
    >
      <Bookmark className={cn("size-4", on && "fill-current")} />
      {on ? "Saved" : "Save"}
    </button>
  );
}
