# App-side instrumentation plan (separate repositories)

Written 7 November 2026. **Nothing in the app repositories has been changed.**
This is a plan for the owner to approve and for a later change in `wealthapp`
(web app and API) and `paddock-ios`. It exists so the site's acquisition numbers
can be followed through registration, activation and upgrade.

## Why

The marketing site can count sign-up link clicks per page. It cannot see what
happens after the click. The sign-up link now carries a coarse label naming the
page it came from, for example `…/auth?mode=signup&src=tools_retirement_age`.
Today the app ignores the label (it reads only `mode`, and preserves other
parameters), so nothing breaks. The plan below makes the app use it.

## What exists already (verified in code, 7 November 2026)

- Web events, allowlisted in `backend/app/routers/events.py`: `signup`,
  `page_view`, `goal_created`, `goal_updated`, `account_added`, `account_created`,
  `account_updated`, `account_deleted`, `projection_opened`, `upgrade_viewed`,
  `upgrade_clicked`, `checkout_started`, `checkout_completed`, `upgrade_success`,
  `billing_portal_opened`, `dashboard_loaded`, `insights_viewed`, `settings_updated`.
- `signup` is logged server-side in `backend/app/auth.py` when the user row is
  first created, with empty metadata.
- The admin funnel (`backend/app/routers/admin.py`) already counts distinct users
  at signup, goal created, account added, projection opened, upgrade clicked,
  checkout started and upgrade success.
- iOS has a documented, privacy-bounded onboarding funnel
  (`Docs/OnboardingAnalytics.md`) with `activation_achieved`; it takes only
  typed enums and never account values.

So registration-to-upgrade is already measured per user inside the app. The one
missing piece is **where the person came from**.

## Proposed change 1: record the source label on signup (web)

1. In `frontend/src/pages/Auth.jsx`, on the sign-up screen, read `src` from the URL.
   Accept only `^[a-z0-9_]{1,40}$`; ignore anything else.
2. Pass it into registration as Supabase user metadata:
   `supabase.auth.signUp({ email, password, options: { data: { signup_source: src } } })`.
   This survives the email-confirmation round trip without any extra browser storage.
3. In `backend/app/auth.py`, where the `signup` event is logged, read
   `user_metadata.signup_source` from the verified JWT, re-validate it against the
   same pattern, and log `_log_event(session, user.id, "signup", {"src": value})`.
4. In the admin funnel, add a breakdown of `signup` by `meta.src`.

Privacy notes: the label names a public page, never anything the visitor typed;
it is stored with the user's own signup event inside the authenticated product,
which the privacy page should mention in one line; it should not be sent to any
third party.

Open point for the owner: whether the privacy page's description of account data
needs updating to mention "which public page you signed up from". Probably yes,
one sentence.

## Proposed change 2: iOS attribution

Marketing-site visitors who go to the App Store link cannot carry a label
through the store. Options, in order of simplicity:

- Accept that iOS installs from the site are unattributed and measure them as
  App Store link clicks on the site (already counted as `target=app_store`)
  against App Store Connect downloads, week by week.
- Use an App Store custom product page link per source page and read the
  per-page counts in App Store Connect. This uses Apple's own, aggregate
  attribution and adds nothing to the app. Suggested first pages: the retirement
  age calculator, the FIRE number calculator, the Pro page.

Do not add a third-party attribution SDK.

## Proposed change 3: activation and upgrade reporting

No new events are needed for the site's funnel. Add to the weekly report, from
the app's own admin funnel:

| Stage | Source |
| --- | --- |
| Registered | `signup` (by `src` after change 1) |
| Activated | `account_created` or `account_added` within 7 days; iOS `activation_achieved` |
| Pro viewed | `upgrade_viewed` |
| Pro initiated | `upgrade_clicked`, `checkout_started` |
| Subscribed | `checkout_completed` / `upgrade_success`; iOS purchase event if present |

Use counts of distinct users per week. Report conversion rates only once a
stage has at least 30 people in it.

## Things found while auditing the app (not part of this change)

- `backend/app/routers/billing.py` has a comment saying "7-day trial" but sets
  `trial_period_days = 30` for annual subscriptions only. The code is what
  customers get; the comment is stale. The marketing site now says 30 days.
- The web app makes all four decision tools free (`proOnly={false}`); the iOS
  decisions screen appears to gate most of them behind Pro
  (`isPro || activeTab == .accelerate`). The two should agree, and the site's
  copy stays silent about it until the owner decides which is intended.
- iOS `Paddock.storekit` lists £5.99 and £59.99; the web app charges £6 and £60.
  The `.storekit` file is a local test configuration; check the live prices in
  App Store Connect and decide whether they should match.
- In-app decision screens use the labels "Primary recommendation" and
  "Wrapper strategy". These may read as personal recommendations. See the
  compliance flags in the Phase 2 report.
