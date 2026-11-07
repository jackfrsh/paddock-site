import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { PUBLIC_ROUTES } from './seoRoutes.js'
import { PAGE_META } from './meta.js'
import { breadcrumbTrail } from './breadcrumbs.js'
import { FIGURES, figureOn, valueOn } from './ukFigures.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try {
    fn()
    passed += 1
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failed += 1
    console.error(`  ✗ ${name}\n    ${err.message}`)
  }
}

const here = fileURLToPath(new URL('.', import.meta.url))
const read = (file) => readFileSync(join(here, file), 'utf8')

const NEW_GUIDES = [
  { key: 'guide_isa_allowance_uk', path: '/guides/isa-allowance-uk', file: 'guides/IsaAllowanceUK.jsx' },
  { key: 'guide_cash_vs_stocks_shares_isa', path: '/guides/cash-isa-vs-stocks-and-shares-isa', file: 'guides/CashVsStocksSharesIsa.jsx' },
  { key: 'guide_lifetime_isa_rules_uk', path: '/guides/lifetime-isa-rules-uk', file: 'guides/LifetimeIsaRulesUK.jsx' },
  { key: 'guide_end_of_tax_year_checklist_uk', path: '/guides/end-of-tax-year-checklist-uk', file: 'guides/EndOfTaxYearChecklistUK.jsx' },
  { key: 'guide_net_worth_vs_investable_wealth', path: '/guides/net-worth-vs-investable-wealth', file: 'guides/NetWorthVsInvestableWealth.jsx' },
  { key: 'guide_monthly_investment_retire_early_uk', path: '/guides/monthly-investment-to-retire-early-uk', file: 'guides/MonthlyInvestmentToRetireEarlyUK.jsx' },
]

console.log('▶ src/evidenceGuides.test.js')

test('every new guide is a public, prioritised route with metadata and a breadcrumb trail', () => {
  for (const g of NEW_GUIDES) {
    const route = PUBLIC_ROUTES.find((r) => r.key === g.key)
    assert.ok(route, `${g.key} missing from PUBLIC_ROUTES`)
    assert.equal(route.path, g.path)
    assert.ok(route.priority, `${g.path} should be a priority page`)
    assert.ok(route.targetKeyword && route.intent && route.intro, `${g.path} needs keyword, intent and intro`)
    const meta = PAGE_META[g.key]
    assert.ok(meta, `${g.key} missing from PAGE_META`)
    assert.equal(meta.canonical, `https://getpaddock.com${g.path}`)
    assert.ok(meta.title.length <= 70, `${g.path} title is ${meta.title.length} characters`)
    assert.ok(meta.description.length >= 80 && meta.description.length <= 200, `${g.path} description is ${meta.description.length} characters`)
    const nodes = meta.jsonLd['@graph'] ?? [meta.jsonLd]
    const article = nodes.find((n) => n['@type'] === 'Article')
    assert.ok(article, `${g.path} needs Article structured data`)
    assert.ok(article.dateModified && article.datePublished, `${g.path} needs dateModified and datePublished`)
    assert.ok(nodes.some((n) => n['@type'] === 'BreadcrumbList'), `${g.path} needs BreadcrumbList structured data`)
    assert.ok(breadcrumbTrail(g.path).length === 3, `${g.path} needs Home > Guides > page`)
  }
})

test('no two pages share a target keyword (no cannibalisation)', () => {
  const seen = new Map()
  for (const r of PUBLIC_ROUTES.filter((x) => x.targetKeyword)) {
    const k = r.targetKeyword.toLowerCase()
    assert.ok(!seen.has(k), `${r.path} and ${seen.get(k)} both target "${r.targetKeyword}"`)
    seen.set(k, r.path)
  }
})

test('each new guide shows the standard editorial parts', () => {
  for (const g of NEW_GUIDES) {
    const src = read(g.file)
    for (const part of ['<ArticleDates', '<QuickAnswerBox', '<SourceList', '<GuideCTA', 'What this guide leaves out', 'What this checklist leaves out']) {
      if (part.startsWith('What this') && !src.includes('What this guide leaves out') && !src.includes('What this checklist leaves out')) {
        assert.fail(`${g.file} has no "leaves out" section`)
      }
      if (!part.startsWith('What this')) assert.ok(src.includes(part), `${g.file} is missing ${part}`)
    }
    assert.ok(/not\s+financial(?:\s+or\s+tax)?\s+advice/i.test(src), `${g.file} needs the not-advice line`)
  }
})

test('new guides take rules and figures from the central file, not typed in', () => {
  const watched = [/£20,000/, /£4,000/, /£9,000/, /£450,000/, /£60,000/, /£120,000/, /\b25% bonus\b/]
  for (const g of NEW_GUIDES) {
    const src = read(g.file)
    for (const re of watched) assert.ok(!re.test(src), `${g.file} types in ${re}; import it from ukFigures instead`)
  }
})

test('new guides never recommend a product or a provider', () => {
  const banned = [/\bwe recommend\b/i, /\byou should (?:buy|sell|invest in|open a|choose)\b/i, /\bbest (?:cash|stocks)/i, /\bAJ Bell\b|\bHargreaves\b|\bVanguard\b|\bFidelity\b|\bMoneybox\b|\bTrading ?212\b/i]
  for (const g of NEW_GUIDES) {
    const src = read(g.file)
    for (const re of banned) assert.ok(!re.test(src), `${g.file} matches ${re}`)
  }
})

test('the dropped Cash ISA cut is described as dropped, not as law', () => {
  const src = read('guides/IsaAllowanceUK.jsx')
  assert.ok(/dropped in the Autumn Budget/.test(src))
  assert.ok(/HMRC says/.test(src))
  const row = FIGURES.find((f) => f.key === 'isa.cash_isa_limit_under_65')
  assert.equal(row.status, 'abandoned')
})

test('figures added for the new guides carry a source and the right values', () => {
  assert.equal(valueOn('income_tax.personal_savings_allowance_basic'), 1000)
  assert.equal(valueOn('income_tax.personal_savings_allowance_higher'), 500)
  assert.equal(valueOn('fscs.deposit_protection_limit'), 120000)
  assert.equal(figureOn('income_tax.savings_rate_basic', '2027-05-01').status, 'announced')
  assert.equal(valueOn('income_tax.savings_rate_basic', '2027-05-01'), 24, 'Budget 2026 raised 22% to 24%')
  assert.equal(valueOn('income_tax.savings_rate_higher', '2027-05-01'), 44, 'Budget 2026 raised 42% to 44%')
  for (const key of ['income_tax.personal_savings_allowance_basic', 'income_tax.savings_rate_basic', 'fscs.deposit_protection_limit']) {
    const row = FIGURES.find((f) => f.key === key)
    assert.ok(row.sourceUrl.startsWith('https://www.gov.uk/') || row.sourceUrl.startsWith('https://www.bankofengland.co.uk/'))
    assert.equal(row.verification, 'source_page_read')
  }
})

test('the investment protection limit is not typed anywhere because it was only read on secondary sources', () => {
  for (const g of NEW_GUIDES) assert.ok(!/£85,000/.test(read(g.file)), `${g.file} quotes £85,000`)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
