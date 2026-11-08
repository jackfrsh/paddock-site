/* Weekly acquisition report from the site's anonymous aggregate events.

   Reads the Workers Analytics Engine dataset that functions/api/e.js writes to
   and prints a Markdown report of counts and rates. It reads aggregates only
   (GROUP BY, never individual rows) and the dataset holds no personal data.

   Usage
     node scripts/acquisition-report.mjs --check                 (is event storage configured? no credentials needed)
     node scripts/acquisition-report.mjs [--days 7|1]            (needs CF_ACCOUNT_ID and CF_API_TOKEN)
     node scripts/acquisition-report.mjs --file rows.json        (offline: rows saved from the SQL API)
     ... --daily                                                  (adds a day-by-day table; one extra read-only query)
     ... --app-file funnel.json                                  (adds the app's aggregate sign-up funnel, see docs/acquisition-dashboard.md)

   Optional: set CF_WEB_ANALYTICS_SITE_TAG to add visits, landing pages, referrers
   and devices from Cloudflare Web Analytics; or pass --web-file groups.json offline.
   Copy .env.example to .env.local and `set -a; . ./.env.local; set +a` to load it.

   The API token needs only the "Account Analytics: Read" permission. It is read
   from the environment and never printed or written anywhere. */

import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { BLOB_COLUMNS, CALCULATOR_PAGES } from '../src/analyticsSchema.js'

const DEFAULT_DATASET = 'paddock_events'

/* Calculators whose result is live from the first edit, so started and
   completed move together and the completion rate carries no information. */
const LIVE_CALCULATORS = new Set(['tools_phased_drawdown', 'tools_retirement_bridge', 'tools_net_worth'])

/* Below this many events a rate is too noisy to act on. */
const LOW_VOLUME = 30

export function buildQuery(dataset, days) {
  const cols = BLOB_COLUMNS.slice(0, 6).map((name, i) => `blob${i + 1} AS ${name}`).join(', ')
  const group = BLOB_COLUMNS.slice(0, 6).join(', ')
  const n = Number.isInteger(days) && days > 0 && days <= 90 ? days : 7
  if (!/^[a-z0-9_]{1,64}$/i.test(dataset)) throw new Error('Invalid dataset name')
  return `SELECT ${cols}, SUM(_sample_interval) AS n FROM ${dataset} WHERE timestamp > NOW() - INTERVAL '${n}' DAY GROUP BY ${group} FORMAT JSON`
}

const num = (v) => Math.round(Number(v) || 0)

export function summarise(rows) {
  const by = {}
  const channels = {}
  const signupByPage = {}
  const landings = {}
  const landingChannels = {}
  for (const row of rows) {
    const n = num(row.n)
    const page = row.page
    by[page] ??= { started: 0, completed: 0, displayed: 0, clicked: 0, signupClicks: 0 }
    const p = by[page]
    if (row.event === 'visitor_landing') {
      landings[page] = (landings[page] || 0) + n
      landingChannels[row.channel] = (landingChannels[row.channel] || 0) + n
    }
    if (row.event === 'calculator_started') {
      p.started += n
      channels[row.channel] = (channels[row.channel] || 0) + n
    }
    if (row.event === 'calculator_completed') p.completed += n
    if (row.event === 'cta_displayed' && row.location === 'result') p.displayed += n
    if (row.event === 'cta_clicked') {
      if (row.location === 'result') p.clicked += n
      if (row.target === 'signup') {
        p.signupClicks += n
        signupByPage[page] = (signupByPage[page] || 0) + n
      }
    }
  }
  return { by, channels, signupByPage, landings, landingChannels }
}

const pct = (a, b) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : 'n/a')
const flag = (n) => (n < LOW_VOLUME ? ' (low volume)' : '')

export function buildReport(rows, { days = 7, generatedAt = new Date(), web = undefined, app = undefined, events = true, daily = undefined } = {}) {
  const summary = summarise(rows)
  const { by, channels, signupByPage } = summary
  const lines = []
  lines.push(`# Acquisition report`)
  lines.push('')
  lines.push(`Generated ${generatedAt.toISOString().slice(0, 10)} · last ${days} days · counts of anonymous events, no visitor identifiers.`)
  lines.push('')
  lines.push(...buildFunnelSection(summary, app))
  lines.push(...buildLandingSection(summary))
  if (daily) lines.push(...buildDailySection(daily))
  lines.push('## Calculators')
  lines.push('')
  lines.push('| Calculator | Started | Completed | Completion | Result CTA shown | CTA clicks | CTA click rate |')
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: |')
  for (const page of CALCULATOR_PAGES) {
    const p = by[page] || { started: 0, completed: 0, displayed: 0, clicked: 0 }
    const completion = LIVE_CALCULATORS.has(page) ? 'live' : pct(p.completed, p.started)
    lines.push(`| ${page} | ${p.started} | ${p.completed} | ${completion}${LIVE_CALCULATORS.has(page) ? '' : flag(p.started)} | ${p.displayed} | ${p.clicked} | ${pct(p.clicked, p.displayed)}${flag(p.displayed)} |`)
  }
  lines.push('')
  lines.push('"live" calculators show a result from the first edit, so started and completed move together and the completion rate is not meaningful.')
  lines.push('')
  lines.push('## Sign-up link clicks by page')
  lines.push('')
  const pages = Object.entries(signupByPage).sort((a, b) => b[1] - a[1])
  if (pages.length === 0) lines.push('No sign-up clicks recorded in this period.')
  else {
    lines.push('| Page | Sign-up clicks |')
    lines.push('| --- | ---: |')
    for (const [page, n] of pages) lines.push(`| ${page} | ${n} |`)
  }
  lines.push('')
  lines.push('## How calculator visits began')
  lines.push('')
  const chan = Object.entries(channels).sort((a, b) => b[1] - a[1])
  if (chan.length === 0) lines.push('No calculator starts recorded in this period.')
  else {
    lines.push('| Channel | Calculator starts |')
    lines.push('| --- | ---: |')
    for (const [c, n] of chan) lines.push(`| ${c} | ${n} |`)
  }
  lines.push('')
  lines.push(...buildWebAnalyticsSection(web))
  lines.push(...buildAppFunnelSection(app))
  lines.push(...buildStatusSection({ events, web: Boolean(web), app: Boolean(app && Array.isArray(app.by_source)), daily: Boolean(daily) }))
  return lines.join('\n')
}

/* ── One-table funnel ────────────────────────────────────────────────────────
   Website stages count page views and clicks; app stages count people. They are
   different units and are never divided by each other, except in one clearly
   labelled approximate line (sign-up clicks to accounts). */

const sumValues = (obj) => Object.values(obj).reduce((n, v) => n + v, 0)

export function buildFunnelSection(summary, app) {
  const { by, landings } = summary
  const pages = Object.values(by)
  const sum = (key) => pages.reduce((n, p) => n + p[key], 0)
  const started = sum('started')
  const completed = sum('completed')
  const displayed = sum('displayed')
  const signupClicks = sum('signupClicks')
  const landed = sumValues(landings)
  /* Live calculators fire started and completed together on the first edit, so
     they would flatter the completion rate. The rate uses submit-style ones only. */
  const submitStyle = Object.entries(by).filter(([page]) => !LIVE_CALCULATORS.has(page)).map(([, p]) => p)
  const startedSubmit = submitStyle.reduce((n, p) => n + p.started, 0)
  const completedSubmit = submitStyle.reduce((n, p) => n + p.completed, 0)

  const lines = ['## Funnel at a glance', '']
  lines.push('| Stage | Count | Unit | Rate | Source |')
  lines.push('| --- | ---: | --- | ---: | --- |')
  const site = [
    ['Visits began (landings)', landed, 'page loads', null, 'website events'],
    ['Calculator started', started, 'page views', null, 'website events'],
    ['Calculator completed', completed, 'page views', startedSubmit > 0 ? `${pct(completedSubmit, startedSubmit)} of started (excluding live calculators)` : null, 'website events'],
    ['Result call to action shown', displayed, 'page views', null, 'website events'],
    ['Sign-up link clicked (all pages)', signupClicks, 'clicks', null, 'website events'],
  ]
  for (const [label, n, unit, rate, src] of site) lines.push(`| ${label} | ${n} | ${unit} | ${rate ?? 'n/a'} | ${src} |`)

  const totals = app && Array.isArray(app.by_source) ? app.totals : null
  if (totals) {
    const stages = [
      ['Accounts created', 'registrations'],
      ['First account added', 'first_account'],
      ['Goal created', 'goal_created'],
      ['Activated', 'activated'],
      ['Viewed upgrade', 'upgrade_viewed'],
      ['Checkout started', 'checkout_started'],
      ['Subscribed (incl. trial)', 'subscribed'],
      ['Paid', 'paid'],
    ]
    const base = num(totals.registrations)
    for (const [label, key] of stages) {
      const n = num(totals[key])
      const rate = key === 'registrations' || base === 0 ? 'n/a' : `${pct(n, base)} of accounts`
      lines.push(`| ${label} | ${n} | people | ${rate} | app database |`)
    }
  } else {
    lines.push('| Accounts, activation, upgrade, subscription | n/a | people | n/a | not supplied (pass --app-file, see docs/acquisition-dashboard.md) |')
  }
  lines.push('')
  lines.push('Website stages are page views and clicks, not people, and are never divided by app stages. App stages are people, shown as a share of accounts created in the period (cohort to date: recent sign-ups have had less time to reach later stages).')
  if (totals && signupClicks > 0) {
    lines.push('', `Rough ratio, not a conversion rate: ${num(totals.registrations)} accounts created from ${signupClicks} sign-up clicks in the same period. Clicks are not people, accounts can come from clicks before the period, and some accounts arrive without a website source (opted-out browsers, the iOS app, direct visits).`)
  }
  lines.push('')
  return lines
}

export function buildLandingSection(summary) {
  const { landings, landingChannels, signupByPage } = summary
  const lines = ['## Where visits began', '']
  const entries = Object.entries(landings).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) {
    lines.push('No landings recorded in this period.', '')
    return lines
  }
  lines.push('| Landing page | Landings | Sign-up clicks on that page |')
  lines.push('| --- | ---: | ---: |')
  for (const [page, n] of entries.slice(0, 15)) lines.push(`| ${page} | ${n} | ${signupByPage[page] || 0} |`)
  lines.push('')
  lines.push('Sign-up clicks on a page include visits that began elsewhere, so the two columns are side by side, not a rate.')
  lines.push('')
  lines.push('| How the visit began | Landings |')
  lines.push('| --- | ---: |')
  for (const [c, n] of Object.entries(landingChannels).sort((a, b) => b[1] - a[1])) lines.push(`| ${c} | ${n} |`)
  lines.push('')
  return lines
}

/* ── Day by day ──────────────────────────────────────────────────────────────
   Uses the bucketing form from Cloudflare's own Analytics Engine examples
   (seconds since the epoch, rounded down to the day, UTC). */

export function buildDailyQuery(dataset, days) {
  if (!/^[a-z0-9_]{1,64}$/i.test(dataset)) throw new Error('Invalid dataset name')
  const n = Number.isInteger(days) && days > 0 && days <= 90 ? days : 7
  return `SELECT intDiv(toUInt32(timestamp), 86400) * 86400 AS t, blob1 AS event, blob5 AS target, SUM(_sample_interval) AS n FROM ${dataset} WHERE timestamp > NOW() - INTERVAL '${n}' DAY GROUP BY t, event, target ORDER BY t FORMAT JSON`
}

export function summariseDaily(rows) {
  const byDay = new Map()
  for (const row of rows) {
    const seconds = Number(row.t)
    if (!Number.isFinite(seconds)) continue
    const day = new Date(seconds * 1000).toISOString().slice(0, 10)
    const d = byDay.get(day) ?? { landings: 0, started: 0, completed: 0, displayed: 0, signupClicks: 0 }
    const n = num(row.n)
    if (row.event === 'visitor_landing') d.landings += n
    if (row.event === 'calculator_started') d.started += n
    if (row.event === 'calculator_completed') d.completed += n
    if (row.event === 'cta_displayed') d.displayed += n
    if (row.event === 'cta_clicked' && row.target === 'signup') d.signupClicks += n
    byDay.set(day, d)
  }
  return [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

export function buildDailySection(rows) {
  const lines = ['## Day by day (UTC)', '']
  const days = summariseDaily(rows)
  if (days.length === 0) {
    lines.push('No events recorded in this period.', '')
    return lines
  }
  lines.push('| Day | Landings | Calculators started | Completed | CTA shown | Sign-up clicks |')
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: |')
  for (const [day, d] of days) lines.push(`| ${day} | ${d.landings} | ${d.started} | ${d.completed} | ${d.displayed} | ${d.signupClicks} |`)
  lines.push('')
  return lines
}


/* ── Cloudflare Web Analytics (RUM) ──────────────────────────────────────────
   Read through the GraphQL Analytics API with the same read-only token. The
   dataset and field names follow Cloudflare's published schema for
   rumPageloadEventsAdaptiveGroups; this part has not yet been run against a live
   site because Web Analytics is not enabled (docs/phase-3-owner-actions.md, step 1). */

export function buildWebAnalyticsQuery() {
  return `query Rum($accountTag: String!, $siteTag: String!, $since: Time!, $until: Time!) {
  viewer { accounts(filter: { accountTag: $accountTag }) {
    pages: rumPageloadEventsAdaptiveGroups(limit: 25, filter: { siteTag: $siteTag, datetime_geq: $since, datetime_lt: $until }, orderBy: [count_DESC]) { count sum { visits } dimensions { requestPath } }
    referrers: rumPageloadEventsAdaptiveGroups(limit: 25, filter: { siteTag: $siteTag, datetime_geq: $since, datetime_lt: $until }, orderBy: [count_DESC]) { count sum { visits } dimensions { refererHost } }
    devices: rumPageloadEventsAdaptiveGroups(limit: 10, filter: { siteTag: $siteTag, datetime_geq: $since, datetime_lt: $until }, orderBy: [count_DESC]) { count sum { visits } dimensions { deviceType } }
  } }
}`
}

const sumVisits = (groups) => groups.reduce((n, g) => n + num(g?.sum?.visits), 0)
const sumLoads = (groups) => groups.reduce((n, g) => n + num(g?.count), 0)

export function buildWebAnalyticsSection(account) {
  const lines = ['## Website traffic (Cloudflare Web Analytics)', '']
  if (!account) {
    lines.push('Not available: Cloudflare Web Analytics has not been enabled or queried (see docs/phase-3-owner-actions.md, step 1).', '')
    return lines
  }
  const { pages = [], referrers = [], devices = [] } = account
  lines.push(`Visits: **${sumVisits(pages)}** · page views: **${sumLoads(pages)}** (Cloudflare counts a visit when a page load has an external or empty referrer; these are not unique people).`, '')
  const table = (title, groups, dim, label) => {
    lines.push(`### ${title}`, '', `| ${label} | Visits | Page views |`, '| --- | ---: | ---: |')
    if (groups.length === 0) lines.push('| none | 0 | 0 |')
    for (const g of groups) lines.push(`| ${g.dimensions?.[dim] || '(direct / none)'} | ${num(g?.sum?.visits)} | ${num(g?.count)} |`)
    lines.push('')
  }
  table('Landing and most viewed pages', pages, 'requestPath', 'Path')
  table('Where visits came from (referrer host only)', referrers, 'refererHost', 'Referrer')
  table('Devices', devices, 'deviceType', 'Device')
  return lines
}

/* ── The app's aggregate funnel (wealthapp /api/admin/acquisition) ──────────
   Counts only, by sign-up source. The file comes from the owner's admin view;
   it contains no emails or financial data. */

const FUNNEL_COLUMNS = [
  ['registrations', 'Accounts'],
  ['first_account', 'First account added'],
  ['goal_created', 'Goal created'],
  ['activated', 'Activated'],
  ['upgrade_viewed', 'Viewed upgrade'],
  ['checkout_started', 'Checkout started'],
  ['subscribed', 'Subscribed (incl. trial)'],
  ['paid', 'Paid'],
]

export function buildAppFunnelSection(funnel) {
  const lines = ['## App funnel by sign-up source', '']
  if (!funnel || !Array.isArray(funnel.by_source)) {
    lines.push('Not available: pass --app-file with the aggregate funnel from the app (see docs/acquisition-dashboard.md).', '')
    return lines
  }
  const row = (label, r) => `| ${label} | ${FUNNEL_COLUMNS.map(([k]) => num(r?.[k])).join(' | ')} |`
  const header = `| Source | ${FUNNEL_COLUMNS.map(([, h]) => h).join(' | ')} |`
  const rule = `| --- | ${FUNNEL_COLUMNS.map(() => '---:').join(' | ')} |`
  lines.push(`Last ${funnel.range_days ?? '?'} days · activation = ${funnel.activation_definition || 'see docs/phase-3-event-taxonomy.md'}`, '')
  lines.push(header, rule)
  const sources = [...funnel.by_source].sort((a, b) => num(b.registrations) - num(a.registrations))
  for (const s of sources) lines.push(row(s.source, s))
  if (funnel.unattributed) lines.push(row('(no website source recorded)', funnel.unattributed))
  if (funnel.totals) lines.push(row('**All accounts**', funnel.totals))
  lines.push('')
  if (Array.isArray(funnel.by_channel) && funnel.by_channel.length) {
    lines.push('By how the visit began:', '', header.replace('Source', 'Channel'), rule)
    for (const c of funnel.by_channel) lines.push(row(c.channel, c))
    lines.push('')
  }
  return lines
}

export function buildStatusSection({ events, web, app, daily = false }) {
  const yes = (v) => (v ? 'yes' : 'no')
  return [
    '## What this report measured',
    '',
    '| Source | Included | Kind |',
    '| --- | --- | --- |',
    `| Website events (landing, calculator, CTA) | ${yes(events)} | Directly measured, anonymous counts of page loads and clicks (not people) |`,
    `| Day-by-day table | ${yes(daily)} | Same events, grouped by UTC day (add --daily) |`,
    `| Website traffic (Cloudflare Web Analytics) | ${yes(web)} | Directly measured, page loads and visits (not people) |`,
    `| App funnel by source | ${yes(app)} | Directly measured, per-source counts from the app database |`,
    '| Search Console clicks and impressions | no | Not available from this script: read in Search Console |',
    '| Unique visitors | no | Not measured, by design |',
    '',
  ]
}

async function fetchRows({ accountId, token, dataset, days, query = buildQuery }) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: query(dataset, days),
  })
  if (!res.ok) throw new Error(`Analytics Engine SQL API returned ${res.status}`)
  const json = await res.json()
  return json.data ?? []
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}

async function graphql({ accountId, token, siteTag, days }) {
  const until = new Date()
  const since = new Date(until.getTime() - days * 86_400_000)
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: buildWebAnalyticsQuery(),
      variables: { accountTag: accountId, siteTag, since: since.toISOString(), until: until.toISOString() },
    }),
  })
  if (!res.ok) throw new Error(`Cloudflare GraphQL API returned ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(`Cloudflare GraphQL error: ${json.errors[0].message}`)
  return json.data?.viewer?.accounts?.[0] ?? null
}

async function checkStorage(site) {
  const res = await fetch(`${site}/api/e`, { headers: { 'Cache-Control': 'no-cache' } })
  let body = null
  try { body = await res.json() } catch { /* not JSON */ }
  const ok = res.status === 200 && body?.storage === 'configured'
  console.log(ok
    ? `OK: ${site}/api/e reports event storage configured (schema ${body.schema}).`
    : `NOT CONFIGURED: ${site}/api/e answered ${res.status}${body ? ` ${JSON.stringify(body)}` : ''}. Events are being refused until the PADDOCK_EVENTS binding exists (docs/phase-3-owner-actions.md, step 2).`)
  return ok
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const site = (process.env.PADDOCK_SITE_URL || 'https://getpaddock.com').replace(/\/$/, '')
  if (process.argv.includes('--check')) {
    process.exit((await checkStorage(site)) ? 0 : 1)
  }
  const days = Number(arg('days', 7))
  const wantDaily = process.argv.includes('--daily')
  const file = arg('file')
  const appFile = arg('app-file')
  const webFile = arg('web-file')
  const { CF_ACCOUNT_ID: accountId, CF_API_TOKEN: token, CF_WEB_ANALYTICS_SITE_TAG: siteTag } = process.env

  let rows
  if (file) {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    rows = Array.isArray(parsed) ? parsed : parsed.data ?? []
  } else {
    if (!accountId || !token) {
      console.error('Set CF_ACCOUNT_ID and CF_API_TOKEN (read-only: Account Analytics Read), or pass --file rows.json. See .env.example.')
      process.exit(2)
    }
    rows = await fetchRows({ accountId, token, dataset: arg('dataset', DEFAULT_DATASET), days })
  }

  let web
  if (webFile) web = JSON.parse(fs.readFileSync(webFile, 'utf8'))
  else if (accountId && token && siteTag) web = await graphql({ accountId, token, siteTag, days })

  let daily
  if (wantDaily && !file && accountId && token) {
    daily = await fetchRows({ accountId, token, dataset: arg('dataset', DEFAULT_DATASET), days, query: buildDailyQuery })
  } else if (wantDaily) {
    const dailyFile = arg('daily-file')
    if (dailyFile) {
      const parsed = JSON.parse(fs.readFileSync(dailyFile, 'utf8'))
      daily = Array.isArray(parsed) ? parsed : parsed.data ?? []
    } else {
      console.error('--daily needs live credentials, or --daily-file rows.json when running offline.')
      process.exit(2)
    }
  }

  const app = appFile ? JSON.parse(fs.readFileSync(appFile, 'utf8')) : undefined
  console.log(buildReport(rows, { days, web, app, daily }))
}
