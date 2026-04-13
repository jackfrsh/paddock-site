import React, { useState, useEffect, useRef } from 'react'

/**
 * Self-contained desktop dropdown for the Tools nav item.
 * Handles open/close, click-outside, and ESC key internally.
 * Passes navigateTo for routing.
 */
export default function ToolsDropdown({ navigateTo }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)

  // Click outside → close
  useEffect(() => {
    if (!open) return
    function onMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  // ESC → close and return focus
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function go(path) {
    setOpen(false)
    navigateTo(path)
  }

  return (
    <div className="nav-tools-wrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`nav-link subtle nav-tools-btn${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Tools
        <svg
          className={`tools-chevron${open ? ' is-open' : ''}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="tools-dropdown" role="dialog" aria-label="Tools menu">
          <div className="tools-dropdown-label">Free planning tools</div>

          <a
            href="/tools/pension-drawdown-calculator"
            className="tools-dropdown-item"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault()
                go('/tools/pension-drawdown-calculator')
              }
            }}
          >
            <div className="tools-dropdown-item-title">Pension drawdown calculator</div>
            <div className="tools-dropdown-item-desc">
              Estimate retirement income and how long your pension may last.
            </div>
          </a>

          <div className="tools-dropdown-sep" />

          <a
            href="/tools"
            className="tools-dropdown-all"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault()
                go('/tools')
              }
            }}
          >
            View all tools →
          </a>
        </div>
      )}
    </div>
  )
}
