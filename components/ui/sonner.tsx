import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      toastOptions={{
        classNames: {
          toast: "bg-card text-foreground shadow-[var(--shadow-border)] border-0",
        },
      }}
    />
  );
}
