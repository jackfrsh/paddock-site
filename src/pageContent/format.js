// Small helpers shared by the page-content modules and the section components.
// Plain JS with explicit .js import paths because meta.js (which imports the
// FAQ modules) is also loaded directly by Node in scripts/prerender.js.
import { gbp } from '../isaRules.js'

export const sum = (items) => items.reduce((total, n) => total + n, 0)

// Numbers become £ amounts (negatives get a true minus sign); strings pass
// through unchanged so a table cell can hold a dash or a label.
export function money(value) {
  if (typeof value === 'string') return value
  return value < 0 ? `−${gbp(-value)}` : gbp(value)
}

export function signed(value) {
  return value < 0 ? `−${gbp(-value)}` : `+${gbp(value)}`
}

// Reuse a homepage FAQ verbatim so the wording lives in one place. Throws at
// build time if the question text is ever edited, rather than silently
// dropping the answer.
export function pickFaq(list, q) {
  const found = list.find((item) => item.q === q)
  if (!found) throw new Error(`FAQ not found: ${q}`)
  return found
}
