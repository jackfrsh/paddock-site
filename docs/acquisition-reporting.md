# Acquisition measurement and weekly reporting

Status: implemented in the site code on 7 November 2026. **Not collecting yet**:
it needs the owner steps in section 6. Until then the endpoint accepts events
and discards them, and the site behaves exactly as before.

## 1. What this answers

Which pages bring relevant people, whether they use the calculators, whether the
call to action under each result earns clicks, and which pages lead to sign-ups.
It does **not** measure anything about a person: no balances, no ages, no
inputs, no identifiers.

## 2. How it is built, and why

Three layers, each doing what it is good at:

| Layer | Tool | Answers | Stores on the visitor's device |
| --- | --- | --- | --- |
| Traffic | Cloudflare Web Analytics | Page views, referrers, countries, Core Web Vitals | Nothing (cookieless) |
| Search | Google Search Console | Impressions, clicks, position, indexing | n/a (Google's own data) |
| Product events | First-party counter (`functions/api/e.js` → Workers Analytics Engine) | Calculator started and completed, CTA displayed and clicked, per page | Nothing |

Cloudflare Web Analytics alone cannot do this: it has no custom events, so it
cannot count calculator completions or call-to-action clicks. The first-party
counter fills that gap without adding a third-party script. Google Analytics,
advertising pixels and session-replay tools are deliberately not used.

## 3. Event catalogue (schema version 1)

Defined once in `src/analyticsSchema.js` and enforced in the browser and in the
Pages Function. An event is a name plus fields that each come from a closed list.
Unknown fields reject the whole event; there is no free-text field.

| Event | Fires when | Fields |
| --- | --- | --- |
| `calculator_started` | A visitor changes a field in a calculator (once per page view) | `page`, `channel` |
| `calculator_completed` | The calculator shows a result for the visitor's own inputs (once per page view). Submit-style calculators fire on a successful submit; live calculators (phased drawdown, retirement bridge, net worth) fire on the first edit | `page`, `channel` |
| `cta_displayed` | A call to action is at least 60% in view (once per placement per page view) | `page`, `channel`, `location`, `target`, `variant` |
| `cta_clicked` | A call to action is clicked | `page`, `channel`, `location`, `target`, `variant` |

- `page`: the route key of the page, for example `tools_retirement_age`.
- `channel`: how the visit began, from the referrer's host only: `search`,
  `direct`, `internal`, `social`, `other`. The referrer's path and query are
  never read.
- `location`: `header`, `hero`, `result`, `mid`, `bottom`, `pricing`, `footer`,
  `inline`, `other`.
- `target`: `signup`, `signin`, `pro_page`, `app_store`.
- `variant`: `none` until a wording test is run (see section 5).

Analytics Engine column order (the report script reads these by position):
`blob1 event, blob2 page, blob3 channel, blob4 location, blob5 target,
blob6 variant, blob7 schema_version`; `double1 = 1`; `index1 = event`.

### What is never collected

Calculator inputs or outputs; balances, income, pension values, ages, rates;
anything typed by the visitor; full URLs or query strings; IP address, user
agent, cookies; any identifier; anything in browser storage. The old
`paddock:calc` DOM events, which carried assumptions such as withdrawal rate and
return, have been removed. Tests (`src/analytics.test.js`) check that smuggled
fields are rejected and that the function writes nothing from the request beyond
the validated fields.

### Signals honoured

The browser sends nothing, and the function discards anything it receives, when
Global Privacy Control or Do Not Track is set. Nothing is recorded outside
`getpaddock.com` (previews and local runs are ignored).

## 4. Funnel across site and app

| Stage | Where | Event or source | Status |
| --- | --- | --- | --- |
| Acquisition | Site | Cloudflare Web Analytics, Search Console | Owner enables (section 6) |
| Calculator started / completed / type / source page | Site | `calculator_started`, `calculator_completed` (`page` = calculator, `channel` = how the visit began) | Built |
| CTA displayed / clicked | Site | `cta_displayed`, `cta_clicked` | Built |
| Registration CTA clicked | Site | `cta_clicked` with `target=signup` | Built |
| Registration started / completed | App | App `signup` event; needs the `src` label (see `docs/app-instrumentation-plan.md`) | **App change, separate repo** |
| Activation: first login, first account, dashboard viewed, goal created | App | `dashboard_loaded`, `account_created`, `goal_created` (web); iOS `activation_achieved` | Exists in the app |
| Pro upgrade viewed / initiated / checkout / subscription active | App | `upgrade_viewed`, `upgrade_clicked`, `checkout_started`, `checkout_completed`, `upgrade_success` | Exists in the app |

The site and app cannot be joined per person, by design. Attribution is by the
coarse `src=<page key>` label on the sign-up link: the app can count sign-ups
per source page without learning anything else about the visit.

## 5. Wording tests

Visitors are not split into random groups, because nothing is stored on the
device to keep them in a group. To test wording: change the string in
`src/ctaCopy.js`, record the date below, and compare the click rate for the
same calculator in the weeks before and after. Only change one calculator's
wording at a time and wait for at least 30 displays a week before judging
(the report marks low volume).

| Date | Calculator | Change | Result |
| --- | --- | --- | --- |
| 2026-11-07 | all seven | First calculator-specific wording shipped (baseline) | Awaiting data |

## 6. Owner steps (cannot be done from the repository)

1. **Enable Cloudflare Web Analytics** for the Pages project: Workers & Pages →
   `paddock-site` → Metrics → enable Web Analytics. Do not choose any option that
   excludes UK or EU visitors. This injects Cloudflare's script at the edge.
2. **Create the dataset binding.** Pages project → Settings → Bindings → add an
   Analytics Engine binding with variable name `PADDOCK_EVENTS` and dataset name
   `paddock_events`, for Production (and Preview if wanted), then redeploy. If
   the dashboard has no Analytics Engine option, add the binding with Wrangler;
   do not add a `wrangler.toml` to this repo without checking it will not
   override the project's existing dashboard settings.
3. **Create a read-only API token** with the single permission *Account →
   Account Analytics → Read*, for the weekly report. Keep it in your password
   manager or a local environment variable. Do not paste it into chat or commit it.
4. **Check the free-plan limits** in Cloudflare's current Analytics Engine
   pricing before relying on it. At the time of writing, writes and reads are not
   billed, with daily limits well above this site's traffic; data is kept for
   three months.
5. After step 2, visit the live calculator, complete one, and run the report
   (below). It should show one start and one completion. If it shows nothing,
   see "Troubleshooting".

## 7. Weekly workflow (about ten minutes)

1. Search Console: clicks, impressions, average position, top pages and queries;
   indexing exclusions.
2. Cloudflare Web Analytics: visits per page, top referrers, Core Web Vitals.
3. Product events:

   ```
   CF_ACCOUNT_ID=<id> CF_API_TOKEN=<token> node scripts/acquisition-report.mjs --days 7
   ```

   (add `--file rows.json` to run offline on saved rows). It prints, per
   calculator: started, completed, completion rate, result-CTA displays, clicks
   and click rate; sign-up clicks per page; and how calculator visits began.
4. App: sign-ups, activations and Pro upgrades from the app's own funnel
   (`/admin` funnel and billing), once the `src` label is recorded.
5. Fill in the template in `docs/measurement-and-search-console.md`, note any
   wording changes in the table in section 5, and pick one thing to change next week.

## 8. Reading the numbers

- Completion rate is only meaningful for submit-style calculators. The report
  marks live calculators.
- Rates under 30 events are noise: the report flags them. Look at four-week
  trends, not single weeks.
- Analytics Engine can sample under very high load; the report weights counts by
  `_sample_interval`, so totals stay correct.
- The counts are of page views, not people. One person can start in several
  visits. Nothing here estimates unique visitors, deliberately.

## 9. Privacy and regulatory notes

- The first-party counter stores nothing on the visitor's device and sends no
  identifier. This is designed to fit the "statistical purposes" exception in the
  ICO's storage-and-access guidance (the Data (Use and Access) Act 2025 changes
  to PECR, in force from 5 February 2026): clear information, a simple way to
  object, and aggregate-only use. Honouring Global Privacy Control and Do Not
  Track is the objection mechanism. **Confirm with a UK privacy adviser** before
  relying on the exception, and in particular whether a visible opt-out on the
  privacy page is needed beyond browser signals.
- The privacy page (`/privacy`) describes this measurement. It must stay in step
  with the code: if events, fields or retention change, change the page in the
  same commit.
- Cloudflare Web Analytics is described by Cloudflare as cookieless and not
  tracking visitors across sites. Re-read Cloudflare's current documentation
  when enabling it, because the privacy page relies on it.
- Raw events are kept for three months by Analytics Engine and then expire.
  Weekly reports hold aggregates only.

## 10. Troubleshooting

- *Report is empty*: the binding is missing or named differently (must be
  `PADDOCK_EVENTS`), the project was not redeployed after adding it, or you are
  testing with Global Privacy Control / Do Not Track on.
- *Function not invoked*: the request must be `POST /api/e` on `getpaddock.com`
  (not the `pages.dev` address). `_redirects` rules do not apply to Functions.
- *Events rejected*: the function answers 400 with a `reason`; the same reasons
  are asserted in `src/analytics.test.js`.
