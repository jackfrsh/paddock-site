import React from 'react'
import appStoreBadge from '../assets/app-store-badge.svg'
import { APP_STORE_URL } from '../links'
import { trackCtaClicked } from '../analytics'

export default function AppStoreBadgeLink({ className = '', location = 'inline' }) {
  const classes = ['app-store-badge-link', className].filter(Boolean).join(' ')

  return (
    <a
      className={classes}
      href={APP_STORE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Download Paddock on the App Store"
      onClick={() => trackCtaClicked({ location, target: 'app_store' })}
    >
      <img
        src={appStoreBadge}
        alt="Download Paddock on the App Store"
        className="app-store-badge-image"
        loading="lazy"
      />
    </a>
  )
}
