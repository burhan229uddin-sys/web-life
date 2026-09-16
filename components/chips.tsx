import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full px-3.5 text-sm transition-colors",
        selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function ChipGroup({
  options,
  value,
  onChange,
  multiple,
}: {
  options: readonly string[] | string[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multiple?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = multiple ? (value as string[]).includes(opt) : value === opt;
        return (
          <Chip
            key={opt}
            selected={selected}
            onClick={() => {
              if (multiple) {
                const cur = value as string[];
                onChange(selected ? cur.filter((x) => x !== opt) : [...cur, opt]);
              } else {
                onChange(opt);
              }
            }}
          >
            {opt}
          </Chip>
        );
      })}
    </div>
  );
}
