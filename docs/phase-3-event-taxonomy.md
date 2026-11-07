# Funnel event taxonomy (website and app)

The funnel is:

```
Website visitor → landing page → calculator / guide → CTA → app sign-up
  → account created → activation → Pro subscription
```

The website and the app are separate systems with separate stores and no shared
identifier. This table fixes one vocabulary for the whole funnel and says where
each step is recorded, so nothing is counted twice and every gap is stated.
Where an event already existed under another name, it is **mapped**, not
duplicated.

| Funnel step | Recorded as | Where | Status |
| ----------- | ----------- | ----- | ------ |
| `visitor_landing` | `visitor_landing` (page, channel) | Website → Analytics Engine | **New in Phase 3.** Once per full page load that begins a visit. Not sent when the visit started from another page of the site. |
| `calculator_started` | `calculator_started` (page, channel) | Website | Existing. Once per page view. |
| `calculator_completed` | `calculator_completed` (page, channel) | Website | Existing. Once per page view. Live calculators complete on the first edit (see the dashboard doc). |
| `cta_clicked` | `cta_clicked` (page, channel, location, target, variant) | Website | Existing. `cta_displayed` is the matching impression. |
| `signup_started` | Not a separate event | | A visitor opening the sign-up form is anonymous and pre-account. Recording it needs an identifier or a page-view counter on the auth page; neither is justified. Use `cta_clicked` with `target = signup` as the closest honest measure. |
| `account_created` | `signup` | App database (`analytics_event`) | Existing name, kept. Written the first time a new person makes an authenticated request, so with email confirmation it counts people who confirmed **and** signed in. |
| source of the account | `user_attribution` row (first and registration `src`, `ch`) | App database | **New in Phase 3.** Write-once, see `wealthapp/docs/phase-3-attribution.md`. |
| `first_account_created` | `first_account_created` | App database | **New in Phase 3.** Server-side, when a user's **first** account row is created. The UI's `account_added` / `account_created` events fire for every account and stay as they were. |
| `goal_created` | `goal_created` | App database | Existing. Reported separately; **not** part of the activation definition. |
| `first_snapshot_created` | Not used | | Net-worth snapshots are written automatically in the background, so a first snapshot says nothing about what the user did. Not recorded as a signal on purpose. |
| `user_activated` | Derived (no event) | App database | Computed from current data. Definition below. |
| `upgrade_viewed` | `upgrade_viewed` | App database | Existing. |
| `checkout_started` | `checkout_started` (meta: plan) | App database | **Now emitted** (it was on the allow-list but nothing sent it): written server-side when Stripe confirms it created the checkout session. Failed attempts are not recorded. |
| `subscription_completed` | Derived: subscribed (Pro or grace, trial included) and paid (subscribed, not trialling) | App database | Computed from the entitlement state that Stripe webhooks and Apple receipts already maintain. Trial and paid are reported separately. |

Not used: `checkout_completed` and `upgrade_success` are on the app's event
allow-list but nothing emits them. The report derives subscription from
entitlement state instead, which also covers Apple purchases and webhook
delays. Do not build on those two names.

## What "activated" means

> An account holder with at least one account that has a **non-zero balance**
> and **counts towards net worth**.

This is the first moment Paddock can show a person their own net worth, which
is the product's first promise. A goal is a second step and is reported on its
own column, so you can see both without choosing one. Signing in, viewing
pages, or creating an empty account does not count. Two people with the same
sign-up date can therefore differ on activation depending only on whether they
entered a real figure.

The definition is one string in the app (`ACTIVATION_DEFINITION` in
`backend/app/routers/admin.py`) and is printed at the top of every report, so a
future change shows up in the report instead of silently shifting the numbers.

## Privacy rules every event follows

- Website events are fixed labels from closed lists (`src/analyticsSchema.js`).
  There is no free-text field, identifier, value or URL in any of them.
- App events carry no balances, figures, names or emails. `checkout_started`
  carries the plan name only. `first_account_created` carries nothing.
- The source label is a page name and a broad channel, validated against a
  fixed list on both sides. It is written once and never updated by later
  navigation.
- Global Privacy Control and Do Not Track switch off the website counter and
  the app's capture of the label.

## Known gaps (stated, not hidden)

- iOS installs cannot carry the label, so they are always unattributed.
- A person who clicks a sign-up link, leaves, and registers on another device
  or after 24 hours is unattributed. This is by design: the label is held for
  one tab and 24 hours, with no cookie.
- Website sign-up clicks and app accounts are compared as counts, not matched
  to people. The ratio is an estimate.
