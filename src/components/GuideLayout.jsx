import React from 'react'
import SiteFooter from './SiteFooter'
import Breadcrumbs from './Breadcrumbs'

function isModifiedEvent(e) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
}

export function H2({ children }) {
  return <h2 className="guide-h2">{children}</h2>
}

export function P({ children }) {
  return <p className="guide-p">{children}</p>
}

export function UL({ children }) {
  return <ul className="guide-ul">{children}</ul>
}

export function Callout({ children }) {
  return (
    <div className="guide-callout">
      <div className="guide-callout-text">{children}</div>
    </div>
  )
}

export function ProTip({ children }) {
  return (
    <div className="guide-protip">
      <div className="guide-protip-label">Pro tip</div>
      <div className="guide-protip-text">{children}</div>
    </div>
  )
}

export function Example({ children }) {
  return (
    <div className="guide-example">
      <div className="guide-example-label">Worked example</div>
      <div className="guide-example-text">{children}</div>
    </div>
  )
}

export function Divider() {
  return <div className="guide-divider" />
}

export function GuideCTA({ children, onClick, buttonText }) {
  return (
    <div className="guide-cta-box">
      <p className="guide-cta-text">{children}</p>
      <button type="button" className="btn btn-primary guide-cta-btn" onClick={onClick}>
        {buttonText || "Get started — it's free"}
      </button>
    </div>
  )
}

export function GuideLink({ to, navigateTo, children, className = '' }) {
  const handleClick = (e) => {
    if (isModifiedEvent(e)) return
    e.preventDefault()
    navigateTo(to)
  }

  return (
    <a href={to} onClick={handleClick} className={`guide-link-card ${className}`.trim()}>
      {children}
    </a>
  )
}

export function GuideShell({
  canonicalPath,
  heroLabel,
  onBack,
  navigateTo,
  backLabel,
  children,
}) {
  const resolvedHeroLabel = heroLabel || 'Guide'
  const resolvedBackLabel =
    backLabel || (canonicalPath === '/guides' ? 'Back to Paddock' : 'Back to Guides')

  return (
    <div className="landing-shell">
      <section className="hero-section hero-section-guide">
        <div className="container">
          <div className="guide-page-header">
            <a
              href="/"
              onClick={(e) => { if (isModifiedEvent(e)) return; e.preventDefault(); navigateTo('/') }}
              className="brand guide-brand"
            >
              Paddock<span>.</span>
            </a>

            <a
              href={canonicalPath?.startsWith('/guides/') ? '/guides' : '/'}
              onClick={(e) => { if (isModifiedEvent(e)) return; e.preventDefault(); onBack() }}
              className="guide-back-link"
            >
              ← {resolvedBackLabel}
            </a>
          </div>

          <Breadcrumbs />

          <div className="hero-copy guide-hero-copy">
            <div className="hero-kicker">{resolvedHeroLabel}</div>
          </div>
        </div>
      </section>

      <section className="container section guide-page-section">
        <article className="guide-article">{children}</article>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}

/* ── Article furniture shared by the evidence-based guides ─────────────── */

/** "Published … · Last reviewed …" line. Dates are ISO strings. */
export function ArticleDates({ published, reviewed, formatDate }) {
  return (
    <p className="guide-article-dates">
      Published {formatDate(published)} · Last reviewed {formatDate(reviewed)} · By the Paddock
      team. General information, not financial advice.
    </p>
  )
}

/** The short answer, shown before anything else. */
export function QuickAnswerBox({ children }) {
  return (
    <div className="guide-quick-answer">
      <div className="guide-quick-answer-label">Quick answer</div>
      <div className="guide-quick-answer-text">{children}</div>
    </div>
  )
}

/** Primary sources, each with the organisation and where it was read. */
export function SourceList({ sources, checked, formatDate }) {
  return (
    <section className="guide-sources" aria-labelledby="guide-sources-h">
      <h2 className="guide-h2" id="guide-sources-h">Sources</h2>
      <ul className="guide-ul">
        {sources.map((src) => (
          <li key={src.url}>
            <a href={src.url} rel="noopener noreferrer" className="guide-inline-link">
              {src.title}
            </a>
            {src.org ? `, ${src.org}` : ''}
          </li>
        ))}
      </ul>
      <p className="guide-p guide-sources-note">
        Figures and rules checked against these pages on {formatDate(checked)}. Tax rules and
        allowances change, so check the source before you rely on a number.
      </p>
    </section>
  )
}
