import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { CheckInCard } from "@/components/checkin";
import { FeedPost } from "@/components/feed-post";
import { ScoreRing } from "@/components/score";
import { Shell } from "@/components/shell";
import { Stories } from "@/components/stories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SEED_REVIEWS } from "@/lib/content/reviews";
import { LIBRARY } from "@/lib/content/library";
import { PRACTICES, practiceOfDay } from "@/lib/content/practices";
import { RECIPES } from "@/lib/content/recipes";
import { checkedInToday, checkinStreak, weekPlan } from "@/lib/plan";
import { ROOMS } from "@/lib/rooms";
import { assess } from "@/lib/scoring";
import { useHP } from "@/lib/store";
import { isPracticeDoneToday, markPracticeDone } from "@/lib/saves";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const loaded = useHP((s) => s.loaded);
  const profile = useHP((s) => s.profile);

  if (isPending || (user && !loaded)) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg px-4 py-24">
          <div className="h-10 w-64 animate-pulse rounded-md bg-secondary" />
          <div className="mt-4 h-40 animate-pulse rounded-xl bg-secondary" />
        </div>
      </Shell>
    );
  }

  if (user && !profile.completedAt) return <Navigate to="/intake" />;
  if (user && profile.completedAt) return <Hub />;
  return <Landing />;
}

function Landing() {
  const sample = PRACTICES.slice(0, 6);
  const recipe = RECIPES.find((r) => r.tier === "free")!;
  const books = LIBRARY.filter((s) => s.tier === "free").slice(0, 4);

  return (
    <Shell>
      <section className="relative min-h-[82vh] overflow-hidden">
        <img
          src="/images/hero-light.jpg"
          alt="A person in late light among plants"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/15" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6">
          <p className="hp-enter text-[11px] uppercase tracking-[0.28em] text-primary">Body · mind · life</p>
          <h1 className="hp-enter hp-enter-d1 mt-3 max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">
            A taste first. Then your file. Then every room.
          </h1>
          <p className="hp-enter hp-enter-d2 mt-5 max-w-xl text-base text-foreground/85 sm:text-lg">
            Human Potential is an educational desk for the whole organism — clinic, sleep, diet,
            kitchen, therapist, mind, strength, career. Cited. Never a prescription.
          </p>
          <div className="hp-enter hp-enter-d3 mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/login">
                Sign in and begin
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/kitchen">Taste the kitchen</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/60 py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Rooms</p>
          <Stories />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">A little of the feed</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Scroll it like a life, not a portal.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {sample.map((p) => (
            <FeedPost key={p.id} img={p.image} kicker={`${p.minutes} min`} title={p.title} body={p.body} cite={p.cite} />
          ))}
        </div>
        <div className="mt-5">
          <FeedPost
            img="/images/food-table.jpg"
            kicker="Kitchen · free"
            title={recipe.name}
            body={recipe.why}
            href="/kitchen"
          />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {books.map((b) => (
            <FeedPost
              key={b.id}
              kicker={`${b.kind} · ${b.year}`}
              title={b.title}
              body={b.takeaway}
              href="/library"
              cite={b.author}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          ["01", "Taste", "Stories, kitchen, evidence — no account required."],
          ["02", "File", "Four minutes: frame, sleep, fuel, signals, life."],
          ["03", "Rooms", "Clinic, diet, kitchen, therapist, mind, career…"],
          ["04", "Return", "Status, streak, and what you actually did."],
        ].map(([n, t, b]) => (
          <div key={n} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] tabular-nums text-muted-foreground">{n}</p>
            <h2 className="mt-3 font-display text-xl">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Why this desk</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">Built so a careful clinician would not flinch.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Red flags first", "Every region names emergencies before lifestyle. Chest pain, stroke signs, suicidal intent — leave the page."],
            ["Named sources", "Walker, Attia, Gottman, NICE, AHA, PREDIMED, AASM, ACSM. The evidence room is open on the free desk."],
            ["Medicines, educationally", "Classes, generics, and 'if the brand is missing.' Never a prescription. A licensed person starts, stops, or substitutes."],
            ["Crisis is not content", "988 in the US. Local emergency services everywhere else. This desk cannot hold a crisis and will not pretend to."],
          ].map(([t, b]) => (
            <article key={t} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <img src="/images/community.jpg" alt="People together outdoors" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">From the reviews</p>
            <h2 className="mt-3 font-display text-3xl">What people were tired of.</h2>
            <ul className="mt-6 grid gap-4 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">Fake precision. </span>
                Calories and steps here are entered or ranged. We will not invent a banana’s calories while you sit.
              </li>
              <li>
                <span className="text-foreground">Hidden billing. </span>
                Free is free. $18 and $36 are named. Cancel any time. You paste Stripe links to actually get paid.
              </li>
              <li>
                <span className="text-foreground">No export. </span>
                Print a clinician packet: file, check-ins, grams, symptoms.
              </li>
              <li>
                <span className="text-foreground">Stock that isn’t people. </span>
                Photographs on this desk are real cameras, real humans (Unsplash).
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl">Nine rooms, after the file</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((r) => (
            <div key={r.to} className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
              <img src={r.img} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{r.kicker}</p>
                <h3 className="mt-1 font-display text-lg">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Quiet notes</p>
        <blockquote className="mt-5 font-display text-2xl italic">“{SEED_REVIEWS[0].text}”</blockquote>
        <p className="mt-3 text-sm text-muted-foreground">
          {SEED_REVIEWS[0].name} · {SEED_REVIEWS[0].role}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/login">Create a file</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/pricing">Free · Pro $18 · Plus $36</Link>
          </Button>
        </div>
      </section>
    </Shell>
  );
}

function Hub() {
  const profile = useHP((s) => s.profile);
  const activities = useHP((s) => s.activities);
  const visitCount = useHP((s) => s.visitCount);
  const lastSeen = useHP((s) => s.lastSeen);
  const checkins = useHP((s) => s.checkins);
  const consults = useHP((s) => s.consults);
  const a = assess(profile);
  const name = profile.name || "there";
  const streak = checkinStreak(checkins);
  const done = checkedInToday(checkins);
  const practice = practiceOfDay();
  const recipe =
    RECIPES.find((r) => r.tier === "free" && r.diet.includes(profile.diet as never)) ??
    RECIPES.find((r) => r.tier === "free")!;
  const week = weekPlan(profile);
  const today = week[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const lowest = [...a.domains].sort((x, y) => x.score - y.score)[0];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Stories />

        <div className="mt-8 flex flex-col gap-6 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Welcome back</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">Hello, {name}.</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{a.headline}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {visitCount > 1 ? `${visitCount} visits` : "First saved visit"}
              {lastSeen ? ` · last here ${new Date(lastSeen).toLocaleDateString()}` : ""}
              {streak > 0 ? ` · ${streak}-day check-in streak` : ""}
              {consults.length ? ` · ${consults.length} clinic notes` : ""}
            </p>
          </div>
          <ScoreRing value={a.potentialIndex} label="Index" />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <div className="grid gap-5 lg:col-span-7">
            {!done ? <CheckInCard /> : (
              <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
                <Badge variant="sage">Today logged</Badge>
                <p className="mt-3 font-display text-2xl">Streak {streak}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Energy {checkins[0]?.energy}/5 · mood {checkins[0]?.mood}/5 · sleep {checkins[0]?.sleep}/5
                </p>
              </div>
            )}

            <FeedPost
              img={practice.image}
              kicker="Practice of the day"
              title={practice.title}
              body={practice.body}
              cite={practice.cite}
            >
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to={practice.room}>Open the room</Link>
                </Button>
                <DonePractice id={practice.id} />
              </div>
            </FeedPost>

            <FeedPost
              img="/images/food-table.jpg"
              kicker="Kitchen · matched to your file"
              title={recipe.name}
              body={recipe.why}
              href="/kitchen"
            />
          </div>

          <div className="grid gap-5 lg:col-span-5">
            <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Three free moves</p>
              <ol className="mt-4 grid gap-3">
                {a.freeMoves.map((m, i) => (
                  <li key={m} className="text-sm text-muted-foreground">
                    <span className="tabular-nums text-foreground">0{i + 1} </span>
                    {m}
                  </li>
                ))}
              </ol>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to="/dashboard">Full status</Link>
              </Button>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Today · {today.day}</p>
              <h2 className="mt-2 font-display text-2xl">A day written from your file</h2>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <li>
                  <span className="text-foreground">Sleep. </span>
                  {today.sleep}
                </li>
                <li>
                  <span className="text-foreground">Move. </span>
                  {today.move}
                </li>
                <li>
                  <span className="text-foreground">Fuel. </span>
                  {today.fuel}
                </li>
                <li>
                  <span className="text-foreground">Mind. </span>
                  {today.mind}
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Lowest domain right now: {lowest.label} ({lowest.score}). Educational, not a prescription.
              </p>
            </div>
          </div>
        </div>

        {activities.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Your involvement</h2>
            <ol className="mt-4 grid gap-2">
              {activities.slice(0, 8).map((act) => (
                <li
                  key={act.id}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]"
                >
                  <span>{act.label}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl">Choose a room</h2>
            <Badge variant="sage">File complete</Badge>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)] transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]"
              >
                <img src={r.img} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{r.kicker}</p>
                  <h3 className="mt-1 font-display text-lg group-hover:text-primary">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function DonePractice({ id }: { id: string }) {
  const addActivity = useHP((s) => s.addActivity);
  const [done, setDone] = useState(isPracticeDoneToday(id));

  if (done) {
    return <p className="self-center text-xs uppercase tracking-wider text-muted-foreground">Done today</p>;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        markPracticeDone(id);
        setDone(true);
        addActivity({
          id: crypto.randomUUID(),
          kind: "practice",
          label: "Finished today's practice",
          detail: "",
          createdAt: new Date().toISOString(),
        });
      }}
    >
      Mark done
    </Button>
  );
}
