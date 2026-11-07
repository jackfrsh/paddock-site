# The acquisition report (website + app)

One command produces a Markdown report you can read in five minutes. It joins
two sources that never share an identifier on purpose:

- **Website events** (anonymous counts from the Cloudflare Analytics Engine
  dataset `paddock_events`, plus optional Cloudflare Web Analytics).
- **App funnel by source** (aggregate counts of accounts, grouped by the website
  page they arrived from, from the app's own database).

They are lined up by the page label (`tools_fire_number`, `guide_isa_allowance_uk`
and so on) and the channel, not by person. The report is therefore good at
"which pages lead to accounts", and deliberately cannot say "this visitor became
that customer".

## Run it

Prerequisites: `docs/phase-3-owner-actions.md` steps 2 and 3 (event dataset and
read-only token) and the app change deployed.

```sh
cp .env.example .env.local        # once; fill in CF_ACCOUNT_ID and CF_API_TOKEN yourself
set -a; . ./.env.local; set +a

node scripts/acquisition-report.mjs --check                 # is storage configured? needs no token
node scripts/acquisition-report.mjs --days 7 --daily > report-week.md
```

Add the app half:

1. Sign in to the app as an admin, **Admin**, **Acquisition**, choose 7d, 30d or 90d,
   **Copy JSON**. It holds counts only: no emails, ids or balances.
2. Paste it into a local file (for example `funnel.json`, which is not committed)
   and run:

```sh
node scripts/acquisition-report.mjs --days 7 --daily --app-file funnel.json > report-week.md
```

Offline variants for testing or when you do not want a token on the machine:
`--file rows.json`, `--daily-file daily.json`, `--web-file groups.json`,
`--app-file funnel.json`. Without credentials and without `--file` the script
stops and tells you what to set. Sections whose source was not supplied (the app
funnel, Web Analytics, the day-by-day table) say "Not available" and why,
instead of showing zeros.

The token needs only **Account, Account Analytics, Read**. It is read from the
environment, never printed or written. If it is not set the script says so and
stops.

## What the report contains

| Section | Answers |
| ------- | ------- |
| Funnel at a glance | Visits began, calculator started / completed, result call to action shown, sign-up link clicked, then (with `--app-file`) accounts, first account added, goal created, activated, viewed upgrade, checkout started, subscribed, paid |
| Where visits began | Which pages visits begin on, and how (search, direct, social, other) |
| Calculators | Started, completed, completion rate, call to action shown and clicked, per calculator |
| Sign-up link clicks by page | Which pages send people to sign up |
| How calculator visits began | Calculator use split by channel |
| Day by day (UTC) (`--daily`) | The same events per UTC day |
| Website traffic (Cloudflare Web Analytics) | Visits, referrers and devices, when the site tag is set |
| App funnel by sign-up source | Per website page and per channel, how far the people who registered got |
| What this report measured | Which sources were included, and whether each is measured, estimated or unavailable |

Daily and weekly: run with `--days 1` for the last day and `--days 7` for the
week; `--daily` adds the day-by-day table. Both read Analytics Engine, which
keeps data for about three months.

## Measured, estimated, unavailable

| Metric | Status | Notes |
| ------ | ------ | ----- |
| Visits began (`visitor_landing`) | Measured | Page loads that began a visit, **not people**. Needs the `PADDOCK_EVENTS` binding. |
| Visitors, sessions, referrers, devices | Measured by Cloudflare Web Analytics | Only once enabled (owner actions, step 1); reported as visits and page views, not people. |
| Traffic by channel | Measured | Channel comes from the referrer host only: search, direct, internal, social, other. |
| Calculator started / completed | Measured | Counted once per page view. The completion rate **excludes** the live calculators (net worth, phased drawdown, retirement bridge), whose result appears on the first edit, so started and completed always match. |
| Call to action shown / clicked | Measured | Shown = scrolled into view. |
| Sign-up clicks to accounts | Estimated | The ratio of two separately measured counts. A click is not a registration, one person can click twice, and iOS installs carry no source. Treat it as an order of magnitude. |
| Accounts by source page | Measured (app database) | Exact for web sign-ups with measurement allowed. Accounts that opted out, signed up in the iOS app, or predate the change are in **Unattributed**. |
| Activated, goal created, upgrade viewed, checkout started | Measured (app database) | See `docs/phase-3-event-taxonomy.md` for the exact definitions. |
| Subscribed, paid | Measured (app database) | Stripe and Apple entitlements both feed one `is_pro` calculation. **Subscribed** includes people in a free trial; **Paid** excludes them. |
| Search Console clicks and impressions | Unavailable here | Read them in Search Console. |
| Account creation per person across site and app | Not measured, by design | No identifier crosses the boundary. |

Low volume: below 30 events a rate is too noisy; the report tags those rows
"(low volume)" instead of presenting them as findings.

## Keeping it simple

Run it on Monday. Read Funnel at a glance first, then Landing pages, then the app
funnel. Change one thing at a time and write down the date in
`docs/measurement-and-search-console.md`, so the next report can show whether
it helped.
