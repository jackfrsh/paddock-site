/* Checks the central UK figures file and the copy that depends on it.

   Run with `npm run check:figures`. It fails (exit 1) when:
   - an entry in src/ukFigures.js is malformed, unsourced, overdue for review,
     unverified, or when a new tax year has started without a new entry;
   - site copy still mentions a tax year that has already ended (for example
     "2025/26" once 2026/27 has started), unless the line is listed in
     scripts/figures-allowlist.json as an intentional historical reference;
   - site copy types in a figure that the central file owns (for example the
     ISA allowance or the State Pension) instead of importing it.

   Warnings (reviews due soon, no named reviewer) are printed but do not fail.

   It is deliberately NOT part of `npm run build`: a lapsed figure should block
   a deliberate release, not take the live site down on 6 April. */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FIGURES, validateFigures, taxYearOf, toIsoDate } from '../src/ukFigures.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const srcDir = join(root, 'src')
const allowlist = JSON.parse(readFileSync(join(root, 'scripts/figures-allowlist.json'), 'utf8'))
const today = toIsoDate(new Date())

const errors = []
const warnings = []

// 1. The figures themselves.
const result = validateFigures(FIGURES, new Date())
errors.push(...result.errors)
warnings.push(...result.warnings)

// 2. Copy that mentions a finished tax year, or types in a managed figure.
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return name === 'assets' ? [] : walk(p)
    return ['.js', '.jsx'].includes(extname(p)) ? [p] : []
  })
}

const files = walk(srcDir).filter((f) => !f.endsWith('.test.js') && !f.endsWith('ukFigures.js'))
const currentStart = Number(taxYearOf(today).start.slice(0, 4))

// "2025/26", "2025-26", "2025 to 2026", "2025/2026"
const TAX_YEAR_LABEL = /\b(20\d\d)\s?(?:\/|-|to)\s?(?:20)?(\d\d)\b/g

// Figures the central file owns, written as typed pound amounts or ages.
const WATCHED = [
  { re: /£12,570\b/, why: 'Personal Allowance (income_tax.personal_allowance)' },
  { re: /£37,700\b/, why: 'basic rate limit (income_tax.basic_rate_limit)' },
  { re: /£125,140\b/, why: 'additional rate threshold' },
  { re: /£60,000 (?:a year|annual allowance)|annual allowance of £60,000/i, why: 'pension annual allowance (pension.annual_allowance)' },
  { re: /£268,275\b/, why: 'lump sum allowance (pension.lump_sum_allowance)' },
  { re: /£1,073,100\b/, why: 'lump sum and death benefit allowance' },
  { re: /£241\.30\b|£12,547\b|£12,548\b/, why: 'full new State Pension (state_pension.*)' },
  { re: /£450,000\b/, why: 'Lifetime ISA property price cap (isa.lifetime_isa.property_price_cap)' },
  { re: /ISA allowance[^.\n]{0,40}£20,000|£20,000[^.\n]{0,40}ISA allowance/i, why: 'ISA allowance (isa.overall_allowance)' },
  { re: /Premium Bonds?[^.\n]{0,60}£50,000|£50,000[^.\n]{0,60}Premium Bonds?/i, why: 'Premium Bonds maximum (nsi.premium_bonds.max_holding)' },
  { re: /minimum pension age[^.\n]{0,40}\b(?:55|57)\b|\b(?:55|57)\b[^.\n]{0,40}minimum pension age/i, why: 'normal minimum pension age (pension.normal_minimum_pension_age)' },
]

function allowed(file, line) {
  return allowlist.some((a) => file === a.file && line.includes(a.contains))
}

for (const file of files) {
  const rel = relative(root, file)
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    const where = `${rel}:${i + 1}`
    for (const m of line.matchAll(TAX_YEAR_LABEL)) {
      const start = Number(m[1])
      const end2 = Number(m[2])
      // Only treat it as a tax-year label when the second part is the next year.
      if ((start + 1) % 100 !== end2) continue
      if (start < currentStart && !allowed(rel, line)) {
        errors.push(`${where}: mentions the ${m[0]} tax year, which has ended. Use ukFigures.js, or add the line to scripts/figures-allowlist.json if it is a deliberate historical reference.`)
      }
    }
    for (const w of WATCHED) {
      if (w.re.test(line) && !allowed(rel, line)) {
        errors.push(`${where}: typed figure that ukFigures.js owns: ${w.why}. Import it instead.`)
      }
    }
  })
}

for (const w of warnings) console.warn(`  warn  ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`  FAIL  ${e}`)
  console.error(`\ncheck:figures failed: ${errors.length} error(s), ${warnings.length} warning(s)`)
  process.exit(1)
}
console.log(`check:figures passed: ${FIGURES.length} entries, ${files.length} files scanned, ${warnings.length} warning(s)`)
