# Phase 3: owner actions, in order

Everything below needs access that the repository and the build agents do not
have (the Cloudflare dashboard, Google Search Console, the live app database).
Each step says what to do, how to prove it worked, and what to change in the
code afterwards. **Do not skip the proof**: the Privacy page only describes
measurement that a person has verified, and it reads the flags in
`src/measurementStatus.js`.

State when this was written (7 November 2026): `webAnalytics`, `eventStorage`
and `appRecordsSource` are all `false`. Nothing here has been switched on.
The live site could not be inspected from the build environment, so treat
every "currently" statement in older documents as unverified until you have
done step 1 and step 2.

| # | Step | Where | Time |
| - | ---- | ----- | ---- |
| 1 | Enable Cloudflare Web Analytics | Cloudflare dashboard | 5 min |
| 2 | Bind the event dataset (`PADDOCK_EVENTS`) | Cloudflare dashboard | 10 min |
| 3 | Create a read-only reporting token | Cloudflare dashboard | 5 min |
| 4 | Deploy the app change, then the site change | GitHub / Railway | 15 min |
| 5 | Prove attribution end to end | Browser | 10 min |
| 6 | Flip the verified flags | Repository | 5 min |
| 7 | Search Console | Google | 15 min |
| 8 | Decisions that are yours | n/a | n/a |

## 1. Enable Cloudflare Web Analytics

Cloudflare Web Analytics is cookieless and needs no code change for a Pages
project: Cloudflare injects the beacon at deploy time.

1. Cloudflare dashboard, **Workers & Pages**, the `paddock-site` project,
   **Metrics** tab, **Web Analytics**, **Enable**.
2. If asked whether to exclude visitors in the EU or UK, **do not exclude
   them**. The site's audience is UK-based and excluding them would hide most
   of the traffic.
3. Trigger a new deployment (push any commit to `main`, or **Deployments**,
   **Retry deployment**). The beacon is added on the next deploy.

Prove it:

```sh
curl -s https://getpaddock.com/ | grep -o 'static.cloudflareinsights.com/beacon[^"]*' | head -1
```

A line of output means the beacon is in the live HTML. No output means it is
not enabled yet. Then open the project's **Metrics** tab after a few visits
and confirm page views appear.

Afterwards: copy the **site tag** (Web Analytics, your site, **Manage site**)
into `.env.local` as `CF_WEB_ANALYTICS_SITE_TAG` (optional, lets the report
include visits and referrers), and set `webAnalytics: true` in
`src/measurementStatus.js` (step 6).

## 2. Bind the event dataset

Until this exists, `POST /api/e` answers 503 and **every event is discarded**.
That is deliberate (it cannot pretend to store), and it is also why the site
currently has no calculator or call-to-action data.

1. Cloudflare dashboard, **Workers & Pages**, `paddock-site`, **Settings**,
   **Bindings**, **Add**, **Analytics engine**.
2. **Variable name:** `PADDOCK_EVENTS`. **Dataset:** `paddock_events`.
   These exact names are what `functions/api/e.js` and
   `scripts/acquisition-report.mjs` use.
3. Add it for **Production**. (Preview deployments do not record events: the
   function ignores any origin other than `https://getpaddock.com`.)
4. Redeploy. Bindings apply to new deployments only.

If the dashboard asks you to enable Workers Analytics Engine for the account
first, follow the prompt; the dataset is created on the first write.

Do **not** add a `wrangler.toml` to this repository to do this. Once a Pages
project has a `wrangler.toml` with `pages_build_output_dir`, the file becomes
the single source of truth and silently overrides dashboard settings
(environment variables, other bindings) the repository cannot see. If you
prefer configuration in code, run `npx wrangler pages download config
paddock-site` first so nothing is lost, review the output, and commit that.

Prove it:

```sh
node scripts/acquisition-report.mjs --check
```

Expected: `OK: ... reports event storage configured`. `NOT CONFIGURED: ... answered 503` means the binding is
missing or the deployment predates it. Then:

1. Open `https://getpaddock.com/tools/fire-number-calculator` in a normal window with
   Global Privacy Control and Do Not Track off, change one field.
2. Wait a few minutes, then run the report (step 3) and look for a
   `calculator_started` row for `tools_fire_number` and a `visitor_landing` row.

Afterwards: set `eventStorage: true` (step 6).

Operational warning if it breaks later: `GET /api/e` returns 503
`{"storage":"missing"}` and the Pages Function log shows
`[paddock-events] PADDOCK_EVENTS binding is missing`. The GitHub workflow
`analytics-health.yml` checks this daily and fails (so GitHub emails you).

## 3. Create a read-only reporting token

Needed only to run the report from your own computer.

1. Cloudflare dashboard, **My Profile**, **API Tokens**, **Create Token**,
   **Create Custom Token**.
2. Permissions: **Account**, **Account Analytics**, **Read**. Nothing else.
3. Account resources: include only the Paddock account. Add an expiry if you
   like. This token cannot change anything.
4. `cp .env.example .env.local`, fill in `CF_ACCOUNT_ID` and `CF_API_TOKEN`
   with your own editor, and load it with
   `set -a; . ./.env.local; set +a`. `.env.local` is git-ignored.

**Never paste the token into a chat, an issue, a pull request or a commit.**
If it is ever exposed, delete it in the dashboard and make another.

Run it:

```sh
node scripts/acquisition-report.mjs --days 7 --daily > report-week.md
```

See `docs/acquisition-dashboard.md` for the app half of the report.

## 4. Deploy order

The two repositories are independent, but the attribution change only becomes
visible end to end when both are live.

1. **App (`wealthapp`):** merge the Phase 3 pull request. The Docker start
   command runs `alembic upgrade head` from `backend/`, which creates the new
   `user_attribution` table (migration `b7d4e1f2a3c5`). It is additive and
   idempotent: no existing table is altered. Watch the Railway deploy log for
   the migration line before moving on. Rollback is `alembic downgrade -1`
   (drops only the new table).
2. **Site (`paddock-site`):** merge its Phase 3 pull request. Pushing to `main`
   deploys to https://getpaddock.com.

## 5. Prove attribution end to end

Use a fresh browser profile with GPC and DNT off.

1. Open `https://getpaddock.com/tools/fire-number-calculator`, use the calculator, click
   the sign-up call to action. The link goes to the app with `?src=` and
   `?ch=` labels; the app removes them from the address bar on load.
2. Register a test account with a throw-away email. Confirm the email.
3. Sign in. Add one account with a balance, and create a goal.
4. Open the app's **Admin** page (your email must be in `ADMIN_EMAILS`),
   **Acquisition**. The test account should appear under `tools_fire_number`,
   counted as activated.
5. Repeat once with **Continue with Google** to prove the claim route.
6. Open the same sign-up page with GPC on (for example in a browser with GPC
   enabled): the account must appear under **Unattributed**.

Afterwards set `appRecordsSource: true` (step 6).

Known gap: the iOS app cannot receive the labels (an App Store install
carries no query string). Accounts created in the iOS app will always be
**Unattributed**. See `docs/app-instrumentation-plan.md`, change 2 (App Store
custom product pages), if iOS volume matters.

## 6. Flip the flags you have verified

Edit `src/measurementStatus.js`: set each flag you proved to `true`, and set
`lastVerified` to today's date (`'2026-11-07'` style). Commit and push. The
Privacy page then describes exactly what is running. Flip nothing you did not
prove.

## 7. Search Console

Unchanged from `docs/measurement-and-search-console.md`: add the
`getpaddock.com` **domain** property (DNS TXT record), submit
`https://getpaddock.com/sitemap.xml`, and request indexing for the home page,
`/tools/` and the calculators. Record the "Pages" report numbers in the
weekly report. This cannot be automated from the repository.

## 8. Decisions that are yours

- **Trial.** The code grants a 30-day trial on the **annual plan only**
  (`trial_period_days = 30` in the app's Stripe checkout; monthly has none; a
  comment in `billing.py` still says seven days and is stale). Confirm that is
  the offer you want, then check every page on the site says the same
  (`docs/pro-proposition-audit.md`).
- **Legal review of consent wording.** Measurement here is designed to be
  cookieless and aggregate, honours GPC and DNT, and holds no identifiers.
  Whether any given use falls inside the PECR "strictly necessary" or
  statistical-purposes allowances, and whether the app's per-tab storage of a
  source label needs consent or notice beyond the Privacy page, is a legal
  question this repository cannot answer. Get it checked by someone qualified
  before relying on it (`docs/fca-boundary-and-legal-review.md`).
- **Figures.** The figures reviewer still reports 46 warnings
  (`npm run check:figures`). They are unchanged by this phase.
