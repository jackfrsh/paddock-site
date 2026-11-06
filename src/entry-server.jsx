import React from 'react'
import { prerender } from 'react-dom/static'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'

/* Build-time renderer, used only by scripts/prerender.js (never shipped to the
   browser). Renders the real page for a path so the HTML on disk already holds
   the headings, copy, tables and FAQs. `prerender` waits for the lazy route
   chunks, so the output is the finished page and not a loading placeholder. */
export async function render(pathname) {
  const helmetContext = {}

  const { prelude } = await prerender(
    <HelmetProvider context={helmetContext}>
      <App initialPath={pathname} />
    </HelmetProvider>,
  )

  return {
    html: await new Response(prelude).text(),
    helmet: helmetContext.helmet,
  }
}
