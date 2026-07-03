import React from 'react'
import AppStoreBadgeLink from './AppStoreBadgeLink'

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/tools', label: 'Free tools' },
      { href: '/guides', label: 'Guides' },
      { href: '/net-worth-tracker', label: 'Net worth tracker' },
      { href: '/track-isas-pensions-savings', label: 'Track ISAs & pensions' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { href: '/moneyhub-alternative', label: 'Moneyhub alternative' },
      { href: '/spreadsheet-alternative-net-worth-tracking', label: 'Spreadsheet alternative' },
      { href: '/best-net-worth-tracking-apps-uk', label: 'Best net worth apps UK' },
      { href: '/why-i-track-wealth-manually-instead-of-using-open-banking-apps', label: 'Why manual entry?' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/security', label: 'Security' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/support', label: 'Support' },
    ],
  },
]

export default function SiteFooter({ navigateTo }) {
  function handleInternalClick(event, path) {
    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault()
      navigateTo(path)
    }
  }

  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <a
              href="/"
              onClick={(event) => handleInternalClick(event, '/')}
              className="footer-brand"
            >
              Paddock<span>.</span>
            </a>
            <p className="footer-tagline">
              Private UK wealth tracking. No bank linking. No ads. No data selling.
            </p>
            <AppStoreBadgeLink className="app-store-badge-footer" />
          </div>

          <nav className="footer-cols" aria-label="Footer">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="footer-col">
                <div className="footer-col-title">{col.title}</div>
                {col.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(event) => handleInternalClick(event, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Paddock</span>
          <span>
            Paddock is a tracking and planning tool, not financial advice. Projections are
            illustrative.
          </span>
        </div>
      </div>
    </footer>
  )
}
