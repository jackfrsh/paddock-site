import React, { useContext } from 'react'
import { RouteContext } from '../routeContext'
import { pageKeyForPath } from '../analyticsSchema'
import { trackCtaClicked } from '../analytics'
import { signupUrl } from '../links'

/* A plain link to the app's sign-up page. It carries the current page's route
   key as `src` and records an anonymous "sign-up clicked" count for the page.
   `location` says where on the page the link sits (see LOCATIONS in
   src/analyticsSchema.js). */
export default function SignupLink({ location = 'inline', className = 'btn btn-primary', children }) {
  const { path } = useContext(RouteContext)
  const page = pageKeyForPath(path)
  return (
    <a
      href={signupUrl(page)}
      className={className}
      onClick={() => trackCtaClicked({ page, location, target: 'signup' })}
    >
      {children}
    </a>
  )
}
