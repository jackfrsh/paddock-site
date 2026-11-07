import React from 'react'
import { COMPARISON_CHECKED_ON, VENDOR_NAMES, VENDOR_SOURCES } from '../comparisonFacts'
import { formatDate } from '../ukFigures'

/* "Checked on" line plus the pages the claims about other products rest on.
   Rendered under every comparison table so readers can verify us. */
export default function ComparisonSources({ vendors }) {
  return (
    <div className="cmp-sources">
      <p className="cmp-note">
        <strong>Checked {formatDate(COMPARISON_CHECKED_ON)}.</strong> Statements about other
        products come from the pages below. Where we could not find something, we say so rather
        than say &ldquo;no&rdquo;. Plans and prices change, so confirm on each provider&apos;s own
        site before deciding.
      </p>
      <ul className="cmp-sources-list">
        {vendors.map((key) => (
          <li key={key}>
            <strong>{VENDOR_NAMES[key]}:</strong>{' '}
            {VENDOR_SOURCES[key].map((source, i) => (
              <React.Fragment key={source.url}>
                {i > 0 ? '; ' : ''}
                <a href={source.url} target="_blank" rel="noopener noreferrer nofollow">
                  {source.label}
                </a>
              </React.Fragment>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}
