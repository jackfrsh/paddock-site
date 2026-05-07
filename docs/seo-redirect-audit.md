# SEO Redirect Audit

Date: 2026-05-04

## Canonical Domain Policy

The canonical marketing-site origin is:

`https://getpaddock.com`

Public page URLs use no trailing slash, except the homepage:

`https://getpaddock.com/`

Domain and protocol variants should resolve in one hop:

- `http://getpaddock.com/*` -> `https://getpaddock.com/:splat`
- `http://www.getpaddock.com/*` -> `https://getpaddock.com/:splat`
- `https://www.getpaddock.com/*` -> `https://getpaddock.com/:splat`

Cloudflare Pages `_redirects` does not support domain-level redirects, so the host/protocol policy must be configured in Cloudflare DNS/Bulk Redirects rather than this repo. See Cloudflare's Pages redirects documentation: `https://developers.cloudflare.com/pages/configuration/redirects/`. The repo-level checker still verifies the live behavior when run against `https://getpaddock.com`.

## Redirect Rules

Redirect rules live in `public/_redirects`.

The repo rules now do three things only:

- Redirect retired trailing-slash page variants to their slashless canonical URL.
- Let Cloudflare Pages serve generated `.html` pages at their extensionless paths.
- Return `404` for unknown routes.

The previous catch-all rewrite to `/index.html` was removed because it made unknown routes return homepage-like `200` responses. Unknown routes now fall through to `404.html` with a `404` status.

## Public Indexable URLs

- `https://getpaddock.com/`
- `https://getpaddock.com/tools`
- `https://getpaddock.com/tools/net-worth-calculator`
- `https://getpaddock.com/tools/pension-drawdown-calculator`
- `https://getpaddock.com/tools/retirement-bridge-calculator`
- `https://getpaddock.com/tools/fire-number-calculator`
- `https://getpaddock.com/tools/isa-growth-calculator`
- `https://getpaddock.com/guides`
- `https://getpaddock.com/guides/multi-currency-net-worth-tracker`
- `https://getpaddock.com/guides/long-term-wealth-projection`
- `https://getpaddock.com/guides/inflation-adjusted-net-worth`
- `https://getpaddock.com/net-worth-tracker`
- `https://getpaddock.com/track-isas-pensions-savings`
- `https://getpaddock.com/spreadsheet-alternative-net-worth-tracking`
- `https://getpaddock.com/how-to-track-your-net-worth`
- `https://getpaddock.com/best-net-worth-tracking-apps-uk`
- `https://getpaddock.com/why-i-track-wealth-manually-instead-of-using-open-banking-apps`
- `https://getpaddock.com/privacy`
- `https://getpaddock.com/security`
- `https://getpaddock.com/support`
- `https://getpaddock.com/terms`

## Excluded From Indexing

The sitemap excludes app/backend and private routes:

- `/api/`
- `/admin`
- `/dashboard`
- `/settings`
- `/accounts`
- `/auth`

`robots.txt` disallows those private route prefixes and references:

`Sitemap: https://getpaddock.com/sitemap.xml`

## Before And After Notes

Before this cleanup:

- Live slashless URLs such as `/privacy`, `/terms`, `/tools`, `/guides`, and `/tools/pension-drawdown-calculator` redirected to trailing-slash variants.
- The sitemap and canonical metadata used trailing-slash page URLs.
- `/support` was a public route but was not in the sitemap or prerender route list.
- The SPA catch-all returned `/index.html` with `200` for unknown routes.
- `https://www.getpaddock.com` did not resolve during the pre-change `curl -I` check, so the one-hop `www` policy also needs DNS/Cloudflare validation after deployment.

After this cleanup:

- Sitemap URLs are slashless final canonical URLs.
- Canonical tags and Open Graph URLs point to the same final URLs.
- Public pages are prerendered as `.html` files and served at extensionless paths by Cloudflare Pages.
- Retired trailing-slash URLs redirect once to the canonical slashless page.
- Unknown routes return a real `404`.

## Search Console Validation Steps

After deployment:

1. Submit `https://getpaddock.com/sitemap.xml`.
2. Inspect `https://getpaddock.com/`.
3. Inspect and request indexing for key pages:
   - `https://getpaddock.com/tools`
   - `https://getpaddock.com/tools/pension-drawdown-calculator`
   - `https://getpaddock.com/tools/fire-number-calculator`
   - `https://getpaddock.com/tools/net-worth-calculator`
   - `https://getpaddock.com/guides`
   - `https://getpaddock.com/privacy`
   - `https://getpaddock.com/terms`
   - `https://getpaddock.com/support`
4. Click `Validate Fix` on Redirect Error once the new deployment is live.
5. Treat `Page with redirect` entries for HTTP -> HTTPS, `www` -> apex, and trailing-slash -> slashless variants as expected and harmless, provided each redirect is one hop.
