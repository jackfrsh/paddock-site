/* Weekly acquisition report from the site's anonymous aggregate events.

   Reads the Workers Analytics Engine dataset that functions/api/e.js writes to
   and prints a Markdown report of counts and rates. It reads aggregates only
   (GROUP BY, never individual rows) and the dataset holds no personal data.

   Usage
     CF_ACCOUNT_ID=... CF_API_TOKEN=... node scripts/acquisition-report.mjs [--days 7] [--dataset paddock_events]
     node scripts/acquisition-report.mjs --file rows.json      (offline: rows saved from the SQL API)

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
  for (const row of rows) {
    const n = num(row.n)
    const page = row.page
    by[page] ??= { started: 0, completed: 0, displayed: 0, clicked: 0, signupClicks: 0 }
    const p = by[page]
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
  return { by, channels, signupByPage }
}

const pct = (a, b) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : 'n/a')
const flag = (n) => (n < LOW_VOLUME ? ' (low volume)' : '')

export function buildReport(rows, { days = 7, generatedAt = new Date() } = {}) {
  const { by, channels, signupByPage } = summarise(rows)
  const lines = []
  lines.push(`# Acquisition report`)
  lines.push('')
  lines.push(`Generated ${generatedAt.toISOString().slice(0, 10)} · last ${days} days · counts of anonymous events, no visitor identifiers.`)
  lines.push('')
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
  lines.push('Page views, referrers and performance are in Cloudflare Web Analytics; search visibility is in Search Console; sign-ups and upgrades are in the app. This report covers only what those three cannot.')
  lines.push('')
  return lines.join('\n')
}

async function fetchRows({ accountId, token, dataset, days }) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: buildQuery(dataset, days),
  })
  if (!res.ok) throw new Error(`Analytics Engine SQL API returned ${res.status}`)
  const json = await res.json()
  return json.data ?? []
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const days = Number(arg('days', 7))
  const file = arg('file')
  let rows
  if (file) {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    rows = Array.isArray(parsed) ? parsed : parsed.data ?? []
  } else {
    const { CF_ACCOUNT_ID: accountId, CF_API_TOKEN: token } = process.env
    if (!accountId || !token) {
      console.error('Set CF_ACCOUNT_ID and CF_API_TOKEN (Account Analytics: Read), or pass --file rows.json')
      process.exit(2)
    }
    rows = await fetchRows({ accountId, token, dataset: arg('dataset', DEFAULT_DATASET), days })
  }
  console.log(buildReport(rows, { days }))
}
