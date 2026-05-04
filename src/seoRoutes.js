export const CANONICAL_ORIGIN = 'https://getpaddock.com'

export const PUBLIC_ROUTES = [
  { key: 'landing', path: '/', lastmod: '2026-04-19' },
  { key: 'tools_hub', path: '/tools', lastmod: '2026-04-19' },
  { key: 'tools_net_worth', path: '/tools/net-worth-calculator', lastmod: '2026-04-19' },
  { key: 'tools_pension_drawdown', path: '/tools/pension-drawdown-calculator', lastmod: '2026-04-19' },
  { key: 'tools_retirement_bridge', path: '/tools/retirement-bridge-calculator', lastmod: '2026-04-19' },
  { key: 'tools_fire_number', path: '/tools/fire-number-calculator', lastmod: '2026-04-19' },
  { key: 'tools_isa_growth', path: '/tools/isa-growth-calculator', lastmod: '2026-04-19' },
  { key: 'guides_index', path: '/guides', lastmod: '2026-03-25' },
  { key: 'guide_multi_currency', path: '/guides/multi-currency-net-worth-tracker', lastmod: '2026-04-19' },
  { key: 'guide_long_term_projection', path: '/guides/long-term-wealth-projection', lastmod: '2026-03-25' },
  { key: 'guide_inflation_adjusted', path: '/guides/inflation-adjusted-net-worth', lastmod: '2026-03-25' },
  { key: 'net_worth_tracker', path: '/net-worth-tracker', lastmod: '2026-03-25' },
  { key: 'track_isas_pensions_savings', path: '/track-isas-pensions-savings', lastmod: '2026-03-25' },
  { key: 'spreadsheet_alternative', path: '/spreadsheet-alternative-net-worth-tracking', lastmod: '2026-03-25' },
  { key: 'how_to_track_net_worth', path: '/how-to-track-your-net-worth', lastmod: '2026-03-25' },
  { key: 'best_net_worth_apps_uk', path: '/best-net-worth-tracking-apps-uk', lastmod: '2026-04-19' },
  {
    key: 'founder_manual_tracking',
    path: '/why-i-track-wealth-manually-instead-of-using-open-banking-apps',
    lastmod: '2026-04-19',
  },
  { key: 'privacy', path: '/privacy', lastmod: '2026-03-08' },
  { key: 'security', path: '/security', lastmod: '2026-03-25' },
  { key: 'support', path: '/support', lastmod: '2026-04-19' },
  { key: 'terms', path: '/terms', lastmod: '2026-03-25' },
]

export const PUBLIC_ROUTE_MAP = Object.fromEntries(PUBLIC_ROUTES.map((route) => [route.key, route.path]))
