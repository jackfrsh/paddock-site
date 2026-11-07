import React, { useContext, useEffect, useRef } from 'react'
import { RouteContext } from '../routeContext'
import { pageKeyForPath } from '../analyticsSchema'
import { trackCtaClicked, trackCtaDisplayed, withVisitChannel } from '../analytics'
import { DEFAULT_RESULT_CTA, FREE_NOTE, RESULT_CTA } from '../ctaCopy'
import { signupUrl } from '../links'

/* The next step shown under a calculator result. `source` picks the wording
   for that calculator (see src/ctaCopy.js). The sign-up link carries the page's
   route key so the app can attribute the account to this calculator. */
export default function ResultCta({ source }) {
  const { path } = useContext(RouteContext)
  const page = pageKeyForPath(path)
  const copy = RESULT_CTA[source] ?? DEFAULT_RESULT_CTA
  const ref = useRef(null)

  // "Displayed" means it actually scrolled into view, not merely rendered.
  useEffect(() => {
    const node = ref.current
    if (!node || !page) return undefined
    const show = () => trackCtaDisplayed({ page, location: 'result', target: 'signup' })
    if (typeof IntersectionObserver === 'undefined') {
      show()
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        show()
        observer.disconnect()
      }
    }, { threshold: 0.6 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [page])

  return (
    <div className="calc-result-cta" ref={ref}>
      <p className="calc-result-cta-text">
        <strong>{copy.headline}</strong> {copy.body}
      </p>
      <a
        className="btn btn-primary calc-result-cta-btn"
        href={signupUrl(page)}
        onClick={(event) => {
          trackCtaClicked({ page, location: 'result', target: 'signup' })
          event.currentTarget.href = withVisitChannel(event.currentTarget.href)
        }}
        onAuxClick={(event) => { event.currentTarget.href = withVisitChannel(event.currentTarget.href) }}
      >
        {copy.button}
      </a>
      <p className="calc-result-cta-note">{FREE_NOTE}</p>
    </div>
  )
}
