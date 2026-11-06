import React from 'react'
import { ISA_RULES, gbp } from '../isaRules'

/* "This tax year" ISA allowance card, drawn in HTML/CSS like the hero
   dashboard so it stays crisp and costs no image request. The balances are
   illustrative; the allowance and dates come from isaRules.js. */
const USED = [
  { name: 'Stocks & Shares ISA', amount: 6000 },
  { name: 'Cash ISA', amount: 2400 },
]

export default function IsaAllowanceCard() {
  const total = ISA_RULES.overallAllowance
  const used = USED.reduce((sum, row) => sum + row.amount, 0)
  const left = total - used
  const percentUsed = Math.round((used / total) * 100)

  return (
    <div
      className="isa-card"
      role="img"
      aria-label={`Illustrative Paddock card for the ${ISA_RULES.taxYear} tax year showing ${gbp(used)} of the ${gbp(total)} ISA allowance used and ${gbp(left)} left`}
    >
      <div className="isa-card-top">
        <span className="isa-card-label">This tax year</span>
        <span className="isa-card-year">{ISA_RULES.taxYear}</span>
      </div>

      <div className="isa-card-title">ISA allowance</div>
      <div className="isa-card-left">
        {gbp(left)} <span>left</span>
      </div>

      <div className="isa-card-bar" aria-hidden="true">
        <span style={{ width: `${percentUsed}%` }} />
      </div>
      <div className="isa-card-scale" aria-hidden="true">
        <span>{gbp(used)} used</span>
        <span>{gbp(total)} allowance</span>
      </div>

      <ul className="isa-card-rows" aria-hidden="true">
        {USED.map((row) => (
          <li key={row.name} className="isa-card-row">
            <span>{row.name}</span>
            <span>{gbp(row.amount)}</span>
          </li>
        ))}
      </ul>

      <div className="isa-card-foot">
        Illustrative figures · Tax year ends {ISA_RULES.taxYearEnd}
      </div>
    </div>
  )
}
