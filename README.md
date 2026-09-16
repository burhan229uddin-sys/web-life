# Human Potential

A health, fitness, and personal-development web app (React 19 + TanStack Start,
deployed as a Vercel serverless function via Nitro).

## Status

- `npm run typecheck` — clean
- `npm run lint` — clean (0 errors, a few pre-existing stylistic warnings)
- `npm run build` — clean, produces a working `.vercel/output`
- `npm test` — 182/195 pass. The 13 failures are all in `scripts/*.test.mjs`
  and check internal tooling from the Grok app-builder platform this project
  was scaffolded in (dev-time env-flag format, social-preview injection for
  `grok.me` links, template-default checks). They don't touch app code and
  don't run in production — see "Known limitations" below.

## Local development

```bash
npm install
cp .env.example .env   # fill in what you need, see below
npm run dev             # http://localhost:8080
```

With no `.env` at all, the app still runs: it falls back to an embedded
PGLite database and a demo/dev user, and the AI consult feature shows an
"offline in this environment" message instead of erroring.

## Deploying to GitHub + Vercel

1. **Push to GitHub.** `.gitignore` already excludes `node_modules`,
   build output, and the platform-only `.grok/`, `attachments/`,
   `artifacts/`, `screenshots/` folders (leftover workspace metadata from
   the Grok app builder this project came from — not needed to run the
   app; the two zip files under `attachments/` alone are ~170 MB and
   should never go into git).

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import the repo in Vercel.** Framework preset: Vite (the project's
   own `vite.config.ts` already registers the `nitro({ preset: "vercel" })`
   plugin, so no extra Vercel config file is needed). Build command
   `npm run build`, output is handled automatically via `.vercel/output`.

3. **Set environment variables** in Vercel → Project → Settings →
   Environment Variables (see `.env.example` for the full list):

   | Variable | Required? | Notes |
   |---|---|---|
   | `DATABASE_URL` | Yes, for real data | Neon Postgres connection string. Without it the app runs on an in-memory embedded DB that resets on every cold start. |
   | `BETTER_AUTH_SECRET` | **Yes** | Fixed session-signing secret. Without it, each serverless cold start mints its own random secret and users get logged out unpredictably. `openssl rand -hex 32`. |
   | `BETTER_AUTH_URL` | Yes | Your production URL, e.g. `https://your-app.vercel.app`. |
   | `VITE_AUTH_ENABLED` | Yes | Set to `true` to turn on real sign-in. |
   | `XAI_API_KEY` | Optional | Powers the AI "medical desk" consult feature (Clinic page). Without it, that one feature degrades gracefully; the rest of the site is unaffected. |
   | `GROK_AUTH_ISSUER` / `GROK_AUTH_CLIENT_ID` / `GROK_AUTH_CLIENT_SECRET` | Optional | See "Known limitations" — these can't be obtained outside the Grok platform, so leave them unset. |

4. Run the database migrations once `DATABASE_URL` is set — `npm run build`
   already does this automatically on every deploy (`migrations/0001_auth.sql`,
   `0002_hp.sql`, `0003_checkins.sql`).

## Known limitations

- **Google / X sign-in buttons on the login page won't work outside the Grok
  app builder.** They're wired to federate through xAI's internal "Grok auth
  broker," which issues per-app credentials that aren't available to a
  standalone deployment. **Email/password sign-in is already enabled** and
  works with no extra setup — that's the one to point users at. If you don't
  want the non-functional Google/X buttons showing at all, remove the
  `GROK_PROVIDERS.map(...)` block in `src/routes/login.tsx`.
- **The AI consult feature (`/clinic`) needs your own `XAI_API_KEY`.** It
  already ships with firm safety rails in `src/lib/ai.ts` — it's instructed
  never to claim a diagnosis or issue a prescription, always leads with
  lifestyle/red-flags/when-to-see-a-clinician, and routes emergency or
  self-harm language straight to emergency services and the 988 crisis line.
  Worth a read before launch, and worth keeping a visible disclaimer on that
  page in the UI, not just in the AI's own output — this is the single
  highest-stakes part of the site content-wise.
- **`npm test` has 13 failing tests**, all in `scripts/*.test.mjs`, all
  about the originating platform's own dev tooling (not your app code) —
  safe to ignore or delete for this deployment; see "Status" above.
