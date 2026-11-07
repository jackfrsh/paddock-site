# Claims register

Phase 3. Checked on **7 November 2026** against the website code (`jackfrsh/paddock-site`),
the production line of the app code (`jackfrsh/wealthapp`, branch `infrastructure/cloud-run`),
and the live sites (`getpaddock.com`, `app.getpaddock.com`).

This register lists what Paddock tells the public about privacy, security, data, payments and
the product, and the evidence behind each statement. It does not say that Paddock complies with
any law or regulation, and it is not legal advice. Anything marked **Legal review** needs a
qualified person.

**Owner.** Every claim is owned by the site owner. No named reviewer has been assigned to any
claim, and this register does not assign one. Put a person's name in the Owner column only
after that person has agreed to keep the claim true.

**Status key**

| Status | Meaning |
| --- | --- |
| Verified | Read in code or observed live on the date shown. |
| Provider-stated | True as far as the provider's own published statement goes; not independently checked. |
| Corrected | Wording was wrong or unsupported and was changed in Phase 3. |
| Unverified | No evidence found. Owner must confirm, soften or remove. |
| Legal review | A legal or regulatory judgement sits behind the wording. |

## 1. Register

### Privacy page (`/privacy`)

| Claim | Evidence | Owner | Last reviewed | Status |
| --- | --- | --- | --- | --- |
| Paddock does not sell your data or use it for advertising | No ad, analytics or tracking SDK in the app (`frontend/package.json`, `index.html`); no data-sale code or export job in the backend. The statement is also a commitment that code cannot prove. | Site owner | 2026-11-07 | Verified (code); commitment is policy |
| No ad networks and no tracking pixels (website) | `getpaddock.com` home page loads only first-party resources, sets no cookies and writes nothing to local or session storage (live check). Cloudflare Web Analytics is not enabled yet (`src/measurementStatus.js`). | Site owner | 2026-11-07 | Verified (live) |
| No ad networks and no tracking pixels (app) | `app.getpaddock.com` loads only its own files plus Google Fonts (see F4). No analytics or advertising script. | Site owner | 2026-11-07 | Verified (live) |
| No bank linking; manual entry only | No open-banking or aggregator dependency in `backend/requirements.txt`, `frontend/package.json` or `backend/app`. | Site owner | 2026-11-07 | Verified (code) |
| Who processes your data: Supabase, Google Cloud and Firebase Hosting, Stripe, Apple, Google sign-in | Hosting and database set-up in the app repo's `docs/firebase-cloud-run-migration.md` and `docs/phase-4e-production-configuration-matrix.md`; `x-served-by` header and CSP on the live app; Stripe in `billing.py`; Apple in `billing_apple.py`. Google Fonts added to the Google entry in Phase 3. | Site owner | 2026-11-07 | Corrected |
| Cloudflare hosts the website and sees visits | `src/privacyCopy.js` (`hosted on Cloudflare`), guarded by `privacyCopy.test.js`. | Site owner | 2026-11-07 | Verified |
| The email provider that sends sign-in and password emails is covered | Not found. Supabase sends these by default; if a separate email service is configured in Supabase, it is another processor and is not listed. | Site owner | 2026-11-07 | Unverified (see F7) |
| You can ask for a copy of your data | There is no export feature in the web app or API. A request is answered by hand through `hello@getpaddock.com`. No written process exists in either repo. | Site owner | 2026-11-07 | Unverified (see F2) |
| You can ask for your data to be deleted, and deleting your account removes it from the app | `DELETE /api/auth/account` (`backend/app/routers/auth.py`) removes the Supabase Auth user and the user's rows in all app tables. The web app has no button for it. See F1 and F3 for what it does not remove. | Site owner | 2026-11-07 | Verified (code), with caveats |
| Providers "process data only to provide their service to us" and are not used to build an advertising profile | Provider terms not reviewed. Stripe, Supabase, Google Cloud and Apple each publish their own processing terms. | Site owner | 2026-11-07 | Provider-stated; Legal review |
| This website: what is counted and what is not (`websiteMeasurementCopy`) | Copy is generated from `measurementStatus.js` flags and fails its test if it describes a measurement that is not switched on. | Site owner | 2026-11-07 | Verified |

### Security page (`/security`)

| Claim | Evidence | Owner | Last reviewed | Status |
| --- | --- | --- | --- | --- |
| Sign-in, password reset and sessions use industry-standard authentication; credentials are never stored in plain text | Supabase Auth (backend validates Supabase JWTs against its JWKS). Password hashing is Supabase's own behaviour and is not visible in Paddock's code. | Site owner | 2026-11-07 | Provider-stated |
| Billing is handled by Stripe on the web and Apple on iOS; card details never touch Paddock's servers | Stripe-hosted Checkout and billing portal (`billing.py` uses `stripe.checkout.Session.create` and `stripe.billing_portal.Session.create`); Apple purchases arrive as StoreKit transactions (`billing_apple.py`). The page said "Stripe" only until Phase 3. | Site owner | 2026-11-07 | Corrected |
| Stripe's environment is PCI compliant | Stripe states it is certified annually by an independent assessor as a PCI DSS Level 1 Service Provider (docs.stripe.com/security). The page now says "PCI DSS Level 1 service provider" instead of the looser "PCI-compliant environment". | Site owner | 2026-11-07 | Provider-stated |
| All connections are encrypted with HTTPS | Both sites serve over HTTPS. `app.getpaddock.com` also sends `Strict-Transport-Security` (max-age 63072000), a Content-Security-Policy, `X-Frame-Options: DENY` and `nosniff`. `getpaddock.com` sends none of HSTS, CSP or `X-Frame-Options` (see F6). | Site owner | 2026-11-07 | Verified (HTTPS); hardening gap on the website |
| Manual input means fewer integrations and a smaller surface | Descriptive. Consistent with the dependency check above. | Site owner | 2026-11-07 | Verified |

### Terms page (`/terms`)

| Claim | Evidence | Owner | Last reviewed | Status |
| --- | --- | --- | --- | --- |
| Not personal financial advice, regulated investment advice or a guarantee | Wording is a position, not a fact. See `docs/fca-boundary-and-legal-review.md` for in-app wording that may cut across it. | Site owner | 2026-11-07 | Legal review |
| Paid plans are processed by Stripe on the web and by Apple for App Store purchases | `billing.py`, `billing_apple.py`. Said "Stripe" only until Phase 3. | Site owner | 2026-11-07 | Corrected |
| Trial terms, pricing and cancellation "are presented clearly within the product" | The app's Upgrade page shows prices, "Annual includes a 30-day trial" and "Monthly has no trial". It does not say the trial asks for a card (see F5). Cancellation is through the Stripe portal or Apple. | Site owner | 2026-11-07 | Verified in part; see F5 |
| Continued use after changes means acceptance; service is as-is; features may be discontinued | Standard contract wording. Not assessed. | Site owner | 2026-11-07 | Legal review |

### Home page, tools hub and calculators

| Claim | Evidence | Owner | Last reviewed | Status |
| --- | --- | --- | --- | --- |
| "No bank linking. No ads. No data selling. Manual entry, always." | Same evidence as the Privacy rows above. | Site owner | 2026-11-07 | Verified |
| "We never hold your bank credentials" | No bank connection exists in the code. | Site owner | 2026-11-07 | Verified (code) |
| "Free to start · No credit card required" | Creating an account does not call Stripe. A card is requested only at Stripe Checkout when upgrading. | Site owner | 2026-11-07 | Verified |
| "Setup in under 2 minutes" | No timing evidence. Sign-up needs an email confirmation, which the site cannot time. | Site owner | 2026-11-07 | Corrected (removed from five pages; reinstate only with timed evidence). Guarded by `privacyCopy.test.js`. |
| Calculator results are estimates and not regulated advice | Every calculator carries a disclaimer; the arithmetic is covered by the `*Calc.test.js` suites. | Site owner | 2026-11-07 | Verified; wording is Legal review |

### Pro page, plan facts and FAQs

| Claim | Evidence | Owner | Last reviewed | Status |
| --- | --- | --- | --- | --- |
| Free plan: 5 accounts; Pro: unlimited | `FREE_ACCOUNT_LIMIT = 5` in `backend/app/routers/accounts.py` | Site owner | 2026-11-07 (first checked in Phase 2) | Verified |
| Pro costs £6 a month or £60 a year on the web | `Upgrade.jsx`; matches the owner's confirmed website prices | Site owner | 2026-11-07 | Verified |
| iOS price £5.99 a month or £59.99 a year | Owner-confirmed. The iOS repository was not available, so the App Store listing was not read. | Site owner | 2026-11-07 | Provider-stated (owner) |
| Annual plan has a 30-day trial, once per subscriber; monthly has none | `billing.py`: `trial_period_days = 30` only for annual and only when no subscription id is stored. Apple's trial setting is in App Store Connect and was not checked. | Site owner | 2026-11-07 | Verified (web); Unverified (iOS) |
| Cancelling drops you to Free at the end of the billing period; you keep your data | Entitlement sync in `billing.py` and `billing_apple.py`. | Site owner | 2026-11-07 | Verified (code) |
| Comparisons with Moneyhub, Emma and others | Each statement is sourced in `src/comparisonFacts.js`; see `docs/comparison-verification.md`. Not re-checked in Phase 3. | Site owner | 2026-11-06 (Phase 2) | Verified in Phase 2; owner to reopen sources quarterly |

### Guides and central figures

| Claim | Evidence | Owner | Last reviewed | Status |
| --- | --- | --- | --- | --- |
| Savings income tax rates of 24% (basic) and 44% (higher) from April 2027, described as planned | GOV.UK "Income Tax: changes to tax rates for property and savings income" (Budget 2026). Not yet law; Finance Bill 2026-27. Phase 2 had 22% and 42% from the Budget 2025 note. | Site owner | 2026-11-07 | Corrected |
| Cash ISA allowance stays £20,000 from April 2027; the £12,000 under-65 cap is dropped | HMRC tax-free savings newsletter 24, read 2026-11-07 | Site owner | 2026-11-07 | Verified (primary source) |
| Lifetime ISA charge 25%, or 20% for first-home purchases above £450,000 on or after 29 October 2026 | GOV.UK / HMRC, read 2026-11-07 | Site owner | 2026-11-07 | Verified (primary source) |
| FSCS deposit protection £120,000 from 1 December 2025 | Bank of England. Not re-read in Phase 3. | Site owner | 2026-11-07 (Phase 2) | Verified in Phase 2 |
| All other tax, pension, ISA and State Pension figures | `src/ukFigures.js`, 36 rows. Annex A of the Budget 2026 rates and allowances page was read on 2026-11-07 and agrees with the rows for 2027-28 listed in `docs/figures-review-2026-11.md`. | Site owner | 2026-11-07 | Verified; 35 rows have no named reviewer |

## 2. Findings that need an owner decision or an engineering change

| # | Finding | Why it matters | Suggested handling | Blocks production? |
| --- | --- | --- | --- | --- |
| F1 | **Deleting an account does not cancel a Stripe subscription or delete the Stripe customer.** `delete_account` removes the Supabase user and app rows and never calls Stripe. | A person on Pro who deletes their account may keep being billed with no login to cancel it. Stripe also keeps the customer record. | Decide the rule (cancel immediately, cancel at period end, or refuse deletion until cancelled), then change `delete_account` and test it with Stripe test mode. Apple subscriptions cannot be cancelled by the server, so the deletion flow should say so. Not changed in Phase 3: it alters billing behaviour and needs approval. | No, but it is the most serious finding in this register |
| F2 | **No self-serve data export, and no written process for access or deletion requests on the web.** | The Privacy page invites these requests. UK GDPR sets a time limit for answering them (normally one month; confirm with ICO guidance). | Write a short internal procedure: who answers `hello@getpaddock.com`, how identity is checked, how to export a user's rows, how to run the deletion endpoint and what to do about Stripe (F1). | No |
| F3 | **Copies of deleted data outlive the deletion.** GitHub-hosted encrypted backup artifacts are kept for 14 days (`.github/workflows/postgres-encrypted-backup.yml`). The Railway Postgres database and encrypted archives are retained for rollback (app repo `docs/phase-4e-cost-cleanup.md`). Cloud Run log retention is recommended at 30 days but was not confirmed. | The Privacy page says deletion "removes it from the app". That is accurate but could be read as "everywhere". | Decide how long the Railway rollback copy stays. State backup retention in plain words on the Privacy page once the owner confirms the periods. | No |
| F4 | **The app loads fonts from Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`), so each visitor's browser contacts Google. | A third-party request not previously disclosed. | Disclosed on the Privacy page in Phase 3. The cleaner fix is to host the two typefaces with the app and drop the Google request; that is an app change and was not made. | No |
| F5 | **The annual trial probably asks for a card at checkout, and no page says so.** `billing.py` sets no `payment_method_collection`, and Stripe Checkout's default for subscriptions is to collect a card. | A visitor who reads "free to start, no credit card required" and then "try Pro" may be surprised. | Confirm by opening the Stripe Checkout screen for the annual plan with a test account, then add one plain sentence to the Pro page and the app's Upgrade page. Not changed because the checkout screen could not be viewed. | No |
| F6 | **`getpaddock.com` sends no HSTS, CSP, `X-Frame-Options` or `Permissions-Policy`.** The app sends all four. | The Security page talks about HTTPS; the marketing site is HTTPS but lacks the hardening headers. | Add safe headers in `public/_headers` or in Cloudflare. A CSP must allow Cloudflare Web Analytics (`static.cloudflareinsights.com`) or it will block the beacon when the owner enables it, so set the CSP after that is on. Not changed in Phase 3. | No |
| F7 | **Data location and the email sender are unconfirmed.** The app repo documents Cloud Run in `europe-west1`; it does not state the Supabase database region or whether Supabase sends sign-in emails through its own service or a separate one. | If the database is outside the UK or EU, or a separate email service is used, the Privacy page needs to say so. | Owner reads the Supabase project settings (Region, Auth > SMTP) and reports back. The site makes no claim about where data is held, and none should be added until this is known. | No |
| F8 | **iOS was not reviewed.** The iOS repository was not available. | Apple trial setting, restore purchases, in-app wording, account deletion and any analytics SDK are unchecked. | Owner or the iOS maintainer reviews the same items against this register. | No |

## 3. Claims Paddock deliberately does not make

Do not add any of these without evidence in this register first: encryption at rest; SOC 2, ISO 27001
or similar certification; penetration testing; two-factor authentication; "bank-level" or "military-grade"
security; UK-only or EU-only data storage; GDPR, ICO or FCA compliance or registration; "regulated" or
"authorised"; that Paddock is covered by FSCS; testimonials, user counts or savings statistics.

## 4. Keeping the register true

1. When a page changes a claim, change the row in the same commit.
2. When a provider is added or removed (analytics, email, hosting, payments), update the Privacy page,
   the Security page and this register together.
3. Re-read every row marked Unverified or Provider-stated at least once a quarter.
4. `src/privacyCopy.test.js` fails if the Privacy and Security pages stop matching the facts above that
   it pins (providers, Stripe and Apple, Google Fonts, the removed timing claim).
