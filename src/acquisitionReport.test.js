import assert from 'node:assert/strict'
import {
  buildAppFunnelSection, buildDailyQuery, buildDailySection, buildFunnelSection, buildLandingSection, buildQuery, buildReport,
  buildStatusSection, buildWebAnalyticsQuery, buildWebAnalyticsSection, summariseDaily, summarise,
} from '../scripts/acquisition-report.mjs'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const row = (event, page, n, extra = {}) => ({ event, page, channel: 'search', location: '', target: '', variant: 'none', n, ...extra })
const rows = [
  row('calculator_started', 'tools_retirement_age', 200),
  row('calculator_completed', 'tools_retirement_age', 150),
  row('cta_displayed', 'tools_retirement_age', 100, { location: 'result', target: 'signup' }),
  row('cta_clicked', 'tools_retirement_age', 12, { location: 'result', target: 'signup' }),
  row('cta_clicked', 'landing', 40, { location: 'hero', target: 'signup' }),
  row('cta_clicked', 'landing', 9, { location: 'hero', target: 'app_store' }),
  row('calculator_started', 'tools_phased_drawdown', 10, { channel: 'direct' }),
  row('visitor_landing', 'tools_retirement_age', 300),
  row('visitor_landing', 'landing', 120, { channel: 'direct' }),
  row('visitor_landing', 'guide_isa_allowance_uk', 80, { channel: 'social' }),
]

test('query is a fixed aggregate over the documented columns', () => {
  const q = buildQuery('paddock_events', 7)
  assert.match(q, /^SELECT blob1 AS event, blob2 AS page, blob3 AS channel, blob4 AS location, blob5 AS target, blob6 AS variant, SUM\(_sample_interval\) AS n FROM paddock_events WHERE timestamp > NOW\(\) - INTERVAL '7' DAY GROUP BY /)
  assert.ok(!/\bSELECT \*/.test(q))
})

test('query rejects an unsafe dataset name and clamps the period', () => {
  assert.throws(() => buildQuery('x; DROP TABLE y', 7))
  assert.match(buildQuery('paddock_events', 9999), /INTERVAL '7' DAY/)
  assert.match(buildQuery('paddock_events', 30), /INTERVAL '30' DAY/)
})

test('summary counts started, completed, CTA and sign-up clicks per page', () => {
  const s = summarise(rows)
  const p = s.by.tools_retirement_age
  assert.equal(p.started, 200)
  assert.equal(p.completed, 150)
  assert.equal(p.displayed, 100)
  assert.equal(p.clicked, 12)
  assert.equal(s.signupByPage.landing, 40)
  assert.equal(s.signupByPage.tools_retirement_age, 12)
  assert.equal(s.channels.search, 200)
  assert.equal(s.channels.direct, 10)
})

test('report shows rates, marks live calculators and flags low volume', () => {
  const md = buildReport(rows, { days: 7, generatedAt: new Date('2026-11-07T00:00:00Z') })
  assert.match(md, /\| tools_retirement_age \| 200 \| 150 \| 75\.0% \| 100 \| 12 \| 12\.0% \|/)
  assert.match(md, /tools_phased_drawdown \| 10 \| 0 \| live/)
  assert.match(md, /\| landing \| 40 \|/)
  assert.match(buildReport([], {}), /No sign-up clicks recorded/)
  assert.match(md, /low volume/)
})

test('app store clicks are not counted as sign-up clicks', () => {
  assert.equal(summarise(rows).signupByPage.landing, 40)
})

const webAccount = {
  pages: [{ count: 120, sum: { visits: 90 }, dimensions: { requestPath: '/tools/fire-number-calculator' } }, { count: 30, sum: { visits: 20 }, dimensions: { requestPath: '/' } }],
  referrers: [{ count: 100, sum: { visits: 80 }, dimensions: { refererHost: 'www.google.com' } }, { count: 50, sum: { visits: 30 }, dimensions: { refererHost: '' } }],
  devices: [{ count: 110, sum: { visits: 85 }, dimensions: { deviceType: 'mobile' } }, { count: 40, sum: { visits: 25 }, dimensions: { deviceType: 'desktop' } }],
}

test('web analytics query is read-only, scoped to one site tag and asks for no personal fields', () => {
  const q = buildWebAnalyticsQuery()
  assert.match(q, /^query Rum\(/)
  assert.ok(!/mutation/i.test(q))
  assert.match(q, /siteTag: \$siteTag/)
  for (const personal of ['ip', 'userAgent', 'clientIP', 'sessionId']) assert.ok(!new RegExp(personal, 'i').test(q.replace(/requestPath|refererHost/g, '')), personal)
})

test('web analytics section totals visits and page views and labels empty referrers', () => {
  const text = buildWebAnalyticsSection(webAccount).join('\n')
  assert.match(text, /Visits: \*\*110\*\*/)
  assert.match(text, /page views: \*\*150\*\*/)
  assert.match(text, /\(direct \/ none\)/)
  assert.match(text, /not unique people/)
})

test('web analytics section says plainly when it is not available', () => {
  assert.match(buildWebAnalyticsSection(undefined).join('\n'), /Not available/)
})

const funnel = {
  range_days: 30,
  activation_definition: 'test definition',
  totals: { registrations: 10, first_account: 6, goal_created: 5, activated: 4, upgrade_viewed: 3, checkout_started: 2, subscribed: 1, paid: 0 },
  by_source: [
    { source: 'tools_fire_number', registrations: 6, first_account: 4, goal_created: 3, activated: 3, upgrade_viewed: 2, checkout_started: 1, subscribed: 1, paid: 0 },
    { source: 'guide_isa_allowance_uk', registrations: 2, first_account: 1, goal_created: 1, activated: 0, upgrade_viewed: 0, checkout_started: 0, subscribed: 0, paid: 0 },
  ],
  unattributed: { registrations: 2, first_account: 1, goal_created: 1, activated: 1, upgrade_viewed: 1, checkout_started: 1, subscribed: 0, paid: 0 },
  by_channel: [{ channel: 'search', registrations: 7, first_account: 4, goal_created: 3, activated: 3, upgrade_viewed: 2, checkout_started: 1, subscribed: 1, paid: 0 }],
}

test('app funnel section lists sources by registrations, unattributed accounts and totals', () => {
  const text = buildAppFunnelSection(funnel).join('\n')
  assert.ok(text.indexOf('tools_fire_number') < text.indexOf('guide_isa_allowance_uk'))
  assert.match(text, /\(no website source recorded\)/)
  assert.match(text, /\*\*All accounts\*\*/)
  assert.match(text, /By how the visit began/)
  assert.match(text, /test definition/)
})

test('app funnel section never prints emails or ids even if the file contained them', () => {
  const dirty = { ...funnel, users: [{ email: 'a@b.com', user_id: 7 }] }
  const text = buildAppFunnelSection(dirty).join('\n')
  assert.ok(!text.includes('a@b.com') && !text.includes('user_id'))
})

test('landings are counted per page and per channel', () => {
  const s = summarise(rows)
  assert.equal(s.landings.tools_retirement_age, 300)
  assert.equal(s.landings.landing, 120)
  assert.equal(s.landingChannels.search, 300)
  assert.equal(s.landingChannels.direct, 120)
  assert.equal(s.landingChannels.social, 80)
  const text = buildLandingSection(s).join('\n')
  assert.ok(text.indexOf('tools_retirement_age') < text.indexOf('guide_isa_allowance_uk'))
  assert.match(text, /\| tools_retirement_age \| 300 \| 12 \|/)
  assert.match(text, /not a rate/)
  assert.match(buildLandingSection(summarise([])).join('\n'), /No landings recorded/)
})

test('funnel table keeps website page views and app people apart', () => {
  const text = buildFunnelSection(summarise(rows), funnel).join('\n')
  assert.match(text, /\| Visits began \(landings\) \| 500 \| page loads \|/)
  assert.match(text, /\| Calculator completed \| 150 \| page views \| 75\.0% of started \(excluding live calculators\) \|/)
  assert.match(text, /\| Sign-up link clicked \(all pages\) \| 52 \| clicks \|/) // 12 + 40, app store excluded
  assert.match(text, /\| Accounts created \| 10 \| people \| n\/a \|/)
  assert.match(text, /\| Activated \| 4 \| people \| 40\.0% of accounts \|/)
  assert.match(text, /\| Paid \| 0 \| people \| 0\.0% of accounts \|/)
  assert.match(text, /never divided by app stages/)
  assert.match(text, /Rough ratio, not a conversion rate: 10 accounts created from 52 sign-up clicks/)
})

test('funnel table says the app stages are missing when no app file is supplied', () => {
  const text = buildFunnelSection(summarise(rows), undefined).join('\n')
  assert.match(text, /not supplied \(pass --app-file/)
  assert.ok(!/Rough ratio/.test(text))
})

test('app funnel includes first account and goal columns', () => {
  const text = buildAppFunnelSection(funnel).join('\n')
  assert.match(text, /\| Source \| Accounts \| First account added \| Goal created \| Activated \|/)
  assert.match(text, /\| tools_fire_number \| 6 \| 4 \| 3 \| 3 \| 2 \| 1 \| 1 \| 0 \|/)
})

test('daily query is a fixed aggregate, UTC day buckets, with the same safeguards', () => {
  const q = buildDailyQuery('paddock_events', 14)
  assert.match(q, /^SELECT intDiv\(toUInt32\(timestamp\), 86400\) \* 86400 AS t, blob1 AS event, blob5 AS target, SUM\(_sample_interval\) AS n FROM paddock_events WHERE timestamp > NOW\(\) - INTERVAL '14' DAY GROUP BY t, event, target ORDER BY t FORMAT JSON$/)
  assert.throws(() => buildDailyQuery('x; DROP TABLE y', 7))
  assert.match(buildDailyQuery('paddock_events', 9999), /INTERVAL '7' DAY/)
})

test('daily section groups events by UTC day, in order, and ignores bad rows', () => {
  const day1 = Date.UTC(2026, 10, 1) / 1000
  const day2 = Date.UTC(2026, 10, 2) / 1000
  const daily = [
    { t: day2, event: 'visitor_landing', target: '', n: 5 },
    { t: day1, event: 'visitor_landing', target: '', n: 3 },
    { t: day1, event: 'calculator_started', target: '', n: 2 },
    { t: day1, event: 'cta_clicked', target: 'signup', n: 1 },
    { t: day1, event: 'cta_clicked', target: 'app_store', n: 9 },
    { t: 'nonsense', event: 'visitor_landing', target: '', n: 99 },
  ]
  const days = summariseDaily(daily)
  assert.deepEqual(days.map(([d]) => d), ['2026-11-01', '2026-11-02'])
  assert.equal(days[0][1].signupClicks, 1) // app store clicks are not sign-up clicks
  assert.equal(days[0][1].landings, 3)
  assert.match(buildDailySection(daily).join('\n'), /\| 2026-11-01 \| 3 \| 2 \| 0 \| 0 \| 1 \|/)
  assert.match(buildDailySection([]).join('\n'), /No events recorded/)
  assert.match(buildReport(rows, { days: 7, daily }), /## Day by day \(UTC\)/)
  assert.ok(!/Day by day/.test(buildReport(rows, { days: 7 })))
})

test('the full report says which parts were and were not measured', () => {
  const full = buildReport(rows, { days: 7, web: webAccount, app: funnel })
  assert.match(full, /Website traffic \(Cloudflare Web Analytics\) \| yes/)
  assert.match(full, /App funnel by source \| yes/)
  const bare = buildReport(rows, { days: 7 })
  assert.match(bare, /Website traffic \(Cloudflare Web Analytics\) \| no/)
  assert.match(bare, /App funnel by source \| no/)
  assert.match(bare, /Unique visitors \| no \| Not measured, by design/)
  assert.match(buildStatusSection({ events: true, web: false, app: false }).join('\n'), /Search Console/)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
