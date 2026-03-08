import React from 'react'

export function TopBar({ title, onClose }) {
  return (
    <div className="guide-topbar">
      <div className="guide-topbar-inner">
        <div className="guide-topbar-spacer" />
        <div className="guide-topbar-title">{title}</div>
        <button
          type="button"
          onClick={onClose}
          className="guide-close"
          aria-label="Back to home"
          title="Back to home"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>
    </div>
  )
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

export function GuideShell({ title, onClose, children }) {
  return (
    <div className="guide-shell">
      <TopBar title={title} onClose={onClose} />
      <div className="guide-container">
        <article className="guide-card">
          {children}
        </article>
        <div className="guide-footer-action">
          <button type="button" onClick={onClose} className="guide-done">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export function GuideLink({ to, navigateTo, children }) {
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigateTo(to)
  }
  return (
    <a href={to} onClick={handleClick} className="guide-link-card">
      {children}
    </a>
  )
}
