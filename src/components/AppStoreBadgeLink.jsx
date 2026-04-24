import React from 'react'
import appStoreBadge from '../assets/app-store-badge.svg'
import { APP_STORE_URL } from '../constants'

export default function AppStoreBadgeLink({ className = '' }) {
  const classes = ['app-store-badge-link', className].filter(Boolean).join(' ')

  return (
    <a
      className={classes}
      href="https://apps.apple.com/gb/app/paddock-wealth/id6761938898"
      target="_blank"
      rel="noreferrer"
      aria-label="Download Paddock on the App Store"
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
