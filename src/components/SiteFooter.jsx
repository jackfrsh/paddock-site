import React from 'react'
import AppStoreBadgeLink from './AppStoreBadgeLink'

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
        <a
          href="/"
          onClick={(event) => handleInternalClick(event, '/')}
          className="footer-brand"
        >
          Paddock<span>.</span>
        </a>

        <div className="footer-links">
          <a href="/guides" onClick={(event) => handleInternalClick(event, '/guides')}>
            Guides
          </a>
          <a href="/terms" onClick={(event) => handleInternalClick(event, '/terms')}>
            Terms
          </a>
          <a href="/privacy" onClick={(event) => handleInternalClick(event, '/privacy')}>
            Privacy
          </a>
          <a href="/security" onClick={(event) => handleInternalClick(event, '/security')}>
            Security
          </a>
          <span>© 2026</span>
        </div>

        <AppStoreBadgeLink className="app-store-badge-footer" />
      </div>
    </footer>
  )
}
