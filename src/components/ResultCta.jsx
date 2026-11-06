import React from 'react'

const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'

/* Call to action shown under calculator results. It is a plain link to the
   Paddock sign-up page: no calculator inputs or results are attached to the
   link, stored, or sent anywhere. The only thing recorded (as a browser event
   that nothing listens to yet) is which calculator the click came from. */
export default function ResultCta({ source }) {
  return (
    <div className="calc-result-cta">
      <p className="calc-result-cta-text">
        <strong>Track your real progress against this estimate.</strong> Enter your actual
        balances in Paddock and see how you are doing over time. No bank access required.
      </p>
      <a
        className="btn btn-primary calc-result-cta-btn"
        href={SIGNUP_URL}
        onClick={() => {
          try {
            window.dispatchEvent(
              new CustomEvent('paddock:calc', { detail: { event: 'result_cta_click', source } }),
            )
          } catch {
            /* Analytics is optional. */
          }
        }}
      >
        Create a free account
      </a>
    </div>
  )
}
