/* Every outbound link into the Paddock app lives here, so a URL change is one
   edit and every sign-up link carries attribution the same way. */

export const APP_ORIGIN = 'https://app.getpaddock.com'
export const SIGNIN_URL = `${APP_ORIGIN}/auth?mode=signin`
export const SIGNUP_BASE_URL = `${APP_ORIGIN}/auth?mode=signup`
export const APP_STORE_URL = 'https://apps.apple.com/gb/app/paddock-wealth/id6761938898'

/* The sign-up link tells the app which public page the visitor came from, using
   the page's route key (for example "tools_fire_number"). It is a coarse label
   for the page, never anything the visitor typed, and the app ignores query
   parameters it does not know, so the link works whether or not the app reads
   it yet (see docs/app-instrumentation-plan.md). */
const SOURCE_PATTERN = /^[a-z0-9_]{1,40}$/

export function signupUrl(source) {
  if (typeof source !== 'string' || !SOURCE_PATTERN.test(source)) return SIGNUP_BASE_URL
  return `${SIGNUP_BASE_URL}&src=${source}`
}

export function authUrl(kind, source) {
  return kind === 'signup' ? signupUrl(source) : SIGNIN_URL
}
