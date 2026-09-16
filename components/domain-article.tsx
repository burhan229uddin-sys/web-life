import { type ReactNode, useEffect } from "react";
import { Gate } from "@/components/paywall";
import { NeedFile } from "@/components/need-file";
import { Badge } from "@/components/ui/badge";
import { DOMAINS } from "@/lib/content/domains";
import { logVisit } from "@/lib/desk";
import { fileNotes } from "@/lib/foryou";
import { Shell } from "@/components/shell";
import { useHP } from "@/lib/store";

export function DomainArticle({ slug, children }: { slug: string; children?: ReactNode }) {
  const d = DOMAINS.find((x) => x.slug === slug);
  if (!d) return null;
  return (
    <NeedFile>
      <Article d={d} slug={slug}>
        {children}
      </Article>
    </NeedFile>
  );
}

function Article({
  d,
  slug,
  children,
}: {
  d: (typeof DOMAINS)[number];
  slug: string;
  children?: ReactNode;
}) {
  const profile = useHP((s) => s.profile);
  const notes = fileNotes(profile, slug);

  useEffect(() => {
    logVisit({ data: { label: `Opened ${d.title}` } }).catch(() => {});
  }, [d.title]);

  return (
    <Shell>
      <article>
        <div className="relative min-h-[42vh] overflow-hidden">
          <img src={d.image} alt={d.imageAlt} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
          <div className="relative mx-auto flex min-h-[42vh] max-w-3xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
            <Badge variant="outline">{d.kicker}</Badge>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl">{d.title}</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{d.lede}</p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {notes.length > 0 && (
            <div className="mb-12 rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Matched to your file</p>
              <div className="mt-4 grid gap-4">
                {notes.map((n) => (
                  <div key={n.heading}>
                    <h2 className="font-display text-xl">{n.heading}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Free desk</p>
          <div className="mt-6 grid gap-8">
            {d.free.map((b) => (
              <section key={b.heading}>
                <h2 className="font-display text-2xl">{b.heading}</h2>
                <p className="mt-3 text-muted-foreground">{b.body}</p>
                {b.cite ? <p className="mt-2 text-xs text-muted-foreground/80">{b.cite}</p> : null}
              </section>
            ))}
          </div>
          {children ? <div className="mt-12">{children}</div> : null}
          <div className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Pro protocol</p>
            <Gate need="pro">
              <div className="mt-6 grid gap-8">
                {d.pro.map((b) => (
                  <section key={b.heading}>
                    <h2 className="font-display text-2xl">{b.heading}</h2>
                    <p className="mt-3 text-muted-foreground">{b.body}</p>
                    {b.cite ? <p className="mt-2 text-xs text-muted-foreground/80">{b.cite}</p> : null}
                  </section>
                ))}
              </div>
            </Gate>
          </div>
          <div className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Plus</p>
            <Gate need="plus">
              <div className="mt-6 grid gap-8">
                {d.plus.map((b) => (
                  <section key={b.heading}>
                    <h2 className="font-display text-2xl">{b.heading}</h2>
                    <p className="mt-3 text-muted-foreground">{b.body}</p>
                    {b.cite ? <p className="mt-2 text-xs text-muted-foreground/80">{b.cite}</p> : null}
                  </section>
                ))}
              </div>
            </Gate>
          </div>
        </div>
      </article>
    </Shell>
  );
}
