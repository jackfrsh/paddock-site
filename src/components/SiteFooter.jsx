import React from 'react'

export default function SiteFooter({ navigateTo }) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <button
          type="button"
          onClick={() => navigateTo('/')}
          className="footer-brand"
        >
          Paddock<span>.</span>
        </button>

        <div className="footer-links">
          <button type="button" onClick={() => navigateTo('/guides')}>
            Guides
          </button>
          <button type="button" onClick={() => navigateTo('/terms')}>
            Terms
          </button>
          <button type="button" onClick={() => navigateTo('/privacy')}>
            Privacy
          </button>
          <button type="button" onClick={() => navigateTo('/security')}>
            Security
          </button>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  )
}