import React from 'react'

/**
 * Accessibility skip link — lets keyboard users jump past the navigation
 * straight to the page's main content. Rendered as the first focusable element
 * inside the page header. It is visually hidden until focused (see .skip-link
 * in App.css).
 *
 * Rather than relying on a per-page `#main-content` anchor (easy to forget on a
 * new page), it focuses the element immediately after the header, which is the
 * first block of page content on every layout.
 */
export default function SkipLink() {
  const onSkip = (e) => {
    e.preventDefault()
    const header = e.currentTarget.closest('header')
    const target = document.getElementById('main-content') || header?.nextElementSibling
    if (!target) return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus()
    target.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  return (
    <a className="skip-link" href="#main-content" onClick={onSkip}>
      Skip to main content
    </a>
  )
}
