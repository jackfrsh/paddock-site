/* Breadcrumb trails for the public pages. Plain JS (no JSX) so src/meta.js can
   import it during prerender and build BreadcrumbList structured data from the
   same source as the visible breadcrumbs. */

export const CANONICAL_ORIGIN = 'https://getpaddock.com'

const SECTION_LABELS = {
  '/tools': 'Tools',
  '/guides': 'Guides',
}

const PAGE_LABELS = {
  '/tools': 'Tools',
  '/tools/net-worth-calculator': 'Net worth calculator',
  '/tools/pension-drawdown-calculator': 'Pension drawdown calculator',
  '/tools/phased-drawdown-calculator': 'Phased drawdown calculator',
  '/tools/retirement-bridge-calculator': 'Retirement bridge calculator',
  '/tools/fire-number-calculator': 'FIRE number calculator',
  '/tools/isa-growth-calculator': 'ISA growth calculator',
  '/tools/retirement-age-calculator': 'Retirement age calculator',
  '/guides': 'Guides',
  '/guides/multi-currency-net-worth-tracker': 'Multi-currency net worth',
  '/guides/long-term-wealth-projection': 'Long-term wealth projection',
  '/guides/inflation-adjusted-net-worth': 'Inflation-adjusted net worth',
  '/net-worth-tracker': 'Net worth tracker',
  '/track-isas-pensions-savings': 'Track ISAs, pensions and savings',
  '/spreadsheet-alternative-net-worth-tracking': 'Spreadsheet alternative',
  '/how-to-track-your-net-worth': 'How to track your net worth',
  '/best-net-worth-tracking-apps-uk': 'Best net worth tracking apps (UK)',
  '/moneyhub-alternative': 'Moneyhub alternatives',
  '/why-i-track-wealth-manually-instead-of-using-open-banking-apps': 'Why track wealth manually',
  '/privacy': 'Privacy',
  '/security': 'Security',
  '/support': 'Support',
  '/terms': 'Terms',
}

/** [{ name, path }] from Home to the page. Empty for the home page and for
    paths this file does not know about (so unknown pages get no trail). */
export function breadcrumbTrail(path) {
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  if (clean === '/') return []
  const label = PAGE_LABELS[clean]
  if (!label) return []

  const trail = [{ name: 'Home', path: '/' }]
  const section = '/' + clean.split('/')[1]
  if (clean !== section && SECTION_LABELS[section]) {
    trail.push({ name: SECTION_LABELS[section], path: section })
  }
  trail.push({ name: label, path: clean })
  return trail
}

/** schema.org BreadcrumbList for a path, or null when there is no trail. */
export function breadcrumbList(path) {
  const trail = breadcrumbTrail(path)
  if (trail.length < 2) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${CANONICAL_ORIGIN}${step.path === '/' ? '/' : step.path}`,
    })),
  }
}
