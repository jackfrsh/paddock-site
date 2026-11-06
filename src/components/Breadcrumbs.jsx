import React, { useContext } from 'react'
import { RouteContext } from '../routeContext.js'
import { breadcrumbTrail } from '../breadcrumbs.js'

/* Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is generated in
   src/meta.js from the same trail data. */
export default function Breadcrumbs() {
  const { path, navigateTo } = useContext(RouteContext)
  const trail = path ? breadcrumbTrail(path) : []
  if (trail.length < 2) return null

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((step, i) => {
          const last = i === trail.length - 1
          return (
            <li key={step.path}>
              {last ? (
                <span aria-current="page">{step.name}</span>
              ) : (
                <a
                  href={step.path}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                    if (!navigateTo) return
                    e.preventDefault()
                    navigateTo(step.path)
                  }}
                >
                  {step.name}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
