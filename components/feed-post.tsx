import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FeedPost({
  img,
  imgAlt,
  kicker,
  title,
  body,
  href,
  cite,
  children,
  className,
}: {
  img?: string;
  imgAlt?: string;
  kicker?: string;
  title: string;
  body?: string;
  href?: string;
  cite?: string;
  children?: ReactNode;
  className?: string;
}) {
  const inner = (
    <>
      {img ? (
        <img src={img} alt={imgAlt ?? ""} className="aspect-[4/3] w-full object-cover" />
      ) : null}
      <div className="p-5">
        {kicker ? (
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{kicker}</p>
        ) : null}
        <h3 className="mt-2 font-display text-2xl leading-snug">{title}</h3>
        {body ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
        {cite ? <p className="mt-3 text-xs text-muted-foreground/80">{cite}</p> : null}
        {children}
      </div>
    </>
  );

  const cls = cn(
    "block overflow-hidden rounded-2xl bg-card text-left shadow-[var(--shadow-border)] transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]",
    className,
  );

  if (href) {
    return (
      <Link to={href as never} className={cls}>
        {inner}
      </Link>
    );
  }
  return <article className={cls}>{inner}</article>;
}
