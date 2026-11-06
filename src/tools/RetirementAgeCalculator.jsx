import React, { useState, useCallback, useEffect } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ResultCta from '../components/ResultCta'
import { calculateRetirementAge, MAX_AGE } from './retirementAgeCalc'
import { figureOn, formatDate, gbp, pensionAccessAge, taxYearOf, valueOn } from '../ukFigures'

const TAX_YEAR = taxYearOf().label
const STATE_PENSION = valueOn('state_pension.new_full_rate_annual')
const STATE_PENSION_SOURCE = figureOn('state_pension.new_full_rate_annual', new Date())
const NMPA = pensionAccessAge()

function track(event, data = {}) {
  try {
    window.dispatchEvent(new CustomEvent('paddock:calc', { detail: { event, ...data } }))
  } catch {
    /* Analytics is optional. */
  }
}

function fmt(n) {
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
}

const parseNum = (str) => {
  const n = parseFloat(String(str).replace(/,/g, ''))
  return Number.isNaN(n) ? NaN : n
}
const parsePct = (str) => {
  const n = parseFloat(str)
  return Number.isNaN(n) ? NaN : n / 100
}

const DEFAULTS = {
  currentAge: '40',
  currentSavings: '100000',
  annualContributions: '12000',
  incomeWanted: '30000',
  statePensionAge: '67',
  statePension: String(Math.round(STATE_PENSION)),
  annualReturn: '5',
  inflation: '2.5',
  withdrawalRate: '4',
}

function CalcField({ label, id, hint, prefix, suffix, children }) {
  return (
    <div className="calc-field">
      <label className="calc-label" htmlFor={id}>{label}</label>
      {hint ? <div className="calc-hint">{hint}</div> : null}
      <div className="calc-input-wrap">
        {prefix ? <span className="calc-input-prefix">{prefix}</span> : null}
        {children}
        {suffix ? <span className="calc-input-suffix">{suffix}</span> : null}
      </div>
    </div>
  )
}

function NumInput({ id, value, onChange, min, max, step = 'any', prefix, suffix, ...rest }) {
  return (
    <input
      type="number"
      id={id}
      className={`calc-input${prefix ? ' has-prefix' : ''}${suffix ? ' has-suffix' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      inputMode="decimal"
      {...rest}
    />
  )
}

function StatCard({ label, value, note, highlight }) {
  return (
    <div className={`calc-stat${highlight ? ' calc-stat-highlight' : ''}`}>
      <div className="calc-stat-value">{value}</div>
      <div className="calc-stat-label">{label}</div>
      {note ? <div className="calc-stat-note">{note}</div> : null}
    </div>
  )
}

export default function RetirementAgeCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState([])
  const [hasCalculated, setHasCalculated] = useState(false)

  const setField = useCallback((key) => (val) => setForm((f) => ({ ...f, [key]: val })), [])

  const runCalculation = useCallback(() => {
    const result = calculateRetirementAge({
      currentAge: parseNum(form.currentAge),
      currentSavings: parseNum(form.currentSavings),
      annualContributions: parseNum(form.annualContributions),
      annualReturn: parsePct(form.annualReturn),
      inflation: parsePct(form.inflation),
      incomeWanted: parseNum(form.incomeWanted),
      statePension: parseNum(form.statePension),
      statePensionAge: parseNum(form.statePensionAge),
      withdrawalRate: parsePct(form.withdrawalRate),
    })
    if (result.ok) {
      setResults(result)
      setErrors([])
    } else {
      setResults(null)
      setErrors(result.errors)
    }
    return result
  }, [form])

  useEffect(() => {
    if (hasCalculated) runCalculation()
  }, [form, hasCalculated, runCalculation])

  function handleSubmit(e) {
    e.preventDefault()
    const result = runCalculation()
    if (result.ok) {
      setHasCalculated(true)
      track('retirement_age_calculate')
      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById('retirement-age-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }
  }

  const spa = parseNum(form.statePensionAge)
  const shownRows = results
    ? results.rows.filter((r) => r.age % 5 === 0 || r.age === results.earliestAge || r.age === MAX_AGE)
    : []

  return (
    <div className="landing-shell">
      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Retirement planning tool</div>
          <h1 className="calc-h1">Retirement age calculator UK</h1>
          <p className="calc-subhead">
            Find the earliest age your savings could cover the income you want, allowing for the
            gap before your State Pension starts. Results are in today&apos;s money.
          </p>
          <p className="calc-trust">
            Your numbers are calculated in your browser and never sent anywhere.
          </p>
        </div>
      </section>

      <section className="calc-section">
        <div className="container">
          <div className="calc-layout">
            <form className="calc-form-card" onSubmit={handleSubmit} noValidate>
              <div className="calc-group">
                <div className="calc-group-title">About you</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Your age now" id="currentAge">
                    <NumInput id="currentAge" value={form.currentAge} onChange={setField('currentAge')} min="18" max="74" step="1" />
                  </CalcField>
                  <CalcField label="State Pension age" id="statePensionAge" hint="Check yours on GOV.UK">
                    <NumInput id="statePensionAge" value={form.statePensionAge} onChange={setField('statePensionAge')} min="55" max="75" step="1" />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Savings and income</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Savings and investments now" id="currentSavings" hint="ISAs, pensions, investments" prefix="£">
                    <NumInput id="currentSavings" value={form.currentSavings} onChange={setField('currentSavings')} min="0" step="5000" prefix="£" />
                  </CalcField>
                  <CalcField label="Saved each year" id="annualContributions" hint="Kept the same in today's money" prefix="£">
                    <NumInput id="annualContributions" value={form.annualContributions} onChange={setField('annualContributions')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField label="Income you want each year" id="incomeWanted" hint="In today's money, before tax" prefix="£">
                    <NumInput id="incomeWanted" value={form.incomeWanted} onChange={setField('incomeWanted')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField label="Your State Pension each year" id="statePension" hint={`Full new State Pension is ${gbp(STATE_PENSION)} in ${TAX_YEAR}`} prefix="£">
                    <NumInput id="statePension" value={form.statePension} onChange={setField('statePension')} min="0" step="500" prefix="£" />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Assumptions</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Investment return" id="annualReturn" hint="Yearly, before inflation" suffix="%">
                    <NumInput id="annualReturn" value={form.annualReturn} onChange={setField('annualReturn')} min="0" max="20" step="0.5" suffix="%" />
                  </CalcField>
                  <CalcField label="Inflation" id="inflation" hint="Yearly" suffix="%">
                    <NumInput id="inflation" value={form.inflation} onChange={setField('inflation')} min="0" max="15" step="0.5" suffix="%" />
                  </CalcField>
                  <CalcField label="Withdrawal rate" id="withdrawalRate" hint="Share of the pot taken each year" suffix="%">
                    <NumInput id="withdrawalRate" value={form.withdrawalRate} onChange={setField('withdrawalRate')} min="0.5" max="20" step="0.5" suffix="%" />
                  </CalcField>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="calc-errors" role="alert">
                  {errors.map((err) => (
                    <div key={err} className="calc-error">{err}</div>
                  ))}
                </div>
              )}

              <div className="calc-submit">
                <button type="submit" className="btn btn-primary calc-submit-btn">
                  Find my retirement age
                </button>
              </div>
            </form>

            <div className="calc-results-panel" id="retirement-age-results">
              {!results && !hasCalculated ? (
                <div className="calc-results-empty">
                  <p className="calc-results-empty-text">
                    Enter your details and click <strong>Find my retirement age</strong> to see your estimate.
                  </p>
                </div>
              ) : results ? (
                <div className="calc-results">
                  <div className="calc-results-header">
                    <div className="calc-results-title">Your retirement age estimate</div>
                    <div className="calc-results-note">In today&apos;s money</div>
                  </div>

                  <div className="calc-stats">
                    {results.earliestAge !== null ? (
                      <>
                        <StatCard
                          label="Earliest age your savings cover it"
                          value={`Age ${results.earliestAge}`}
                          note={results.yearsToGo === 0 ? 'Your savings already cover it' : `About ${results.yearsToGo} years from now`}
                          highlight
                        />
                        <StatCard
                          label="Pot needed at that age"
                          value={fmt(results.rows.find((r) => r.age === results.earliestAge).needed)}
                          note={results.earliestAge < spa ? `Includes the gap until State Pension age ${spa}` : 'Supports income for life at your withdrawal rate'}
                        />
                      </>
                    ) : (
                      <>
                        <StatCard
                          label="Earliest age"
                          value={`Not by ${MAX_AGE}`}
                          note="On these assumptions"
                          highlight
                        />
                        <StatCard
                          label={`Shortfall at age ${MAX_AGE}`}
                          value={fmt(results.shortfallAtMaxAge)}
                          note="Save more, want less, or retire later"
                        />
                      </>
                    )}
                  </div>

                  {results.earliestAge !== null && NMPA.now !== null && results.earliestAge < NMPA.now && (
                    <p className="calc-disclaimer">
                      This age is below the normal minimum pension age of {NMPA.now}. Money in pensions
                      cannot normally be taken before then, so it would need to come from ISAs or other savings.
                    </p>
                  )}

                  <div className="calc-comparison">
                    <div className="calc-cmp-title">Pot against pot needed, by age</div>
                    <div className="calc-fire-cmp-head has-years">
                      <span>Age</span>
                      <span>Needed</span>
                      <span>Projected pot</span>
                      <span>Covered</span>
                    </div>
                    {shownRows.map((row) => (
                      <div
                        key={row.age}
                        className={`calc-fire-cmp-row has-years${row.age === results.earliestAge ? ' active' : ''}`}
                      >
                        <div className="calc-fire-cmp-rate"><span className="calc-fire-cmp-rate-value">{row.age}</span></div>
                        <div className="calc-fire-cmp-target">{fmt(row.needed)}</div>
                        <div className="calc-fire-cmp-gap">{fmt(row.pot)}</div>
                        <div className="calc-fire-cmp-years">{Math.min(Math.round(row.fundedPct), 999)}%</div>
                      </div>
                    ))}
                  </div>

                  <p className="calc-disclaimer">
                    Illustrative only. Investment returns are not guaranteed, and tax is not modelled.
                    Not financial advice.
                  </p>
                  <ResultCta source="retirement_age" />
                </div>
              ) : (
                <div className="calc-results-empty">
                  <p className="calc-results-empty-text">Check the inputs and try again.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section calc-guide-section">
          <div className="calc-guide">
            <h2 className="calc-guide-h2">How this calculator works</h2>
            <p className="calc-guide-p">
              It tests each age from today up to {MAX_AGE}. For each age it works out two things: how big your
              pot would be if you kept saving until then, and how big it would need to be to stop work at that age.
              The earliest age where the pot is big enough is your result.
            </p>
            <ul className="calc-guide-list">
              <li>
                <strong>Today&apos;s money.</strong> Returns are reduced by inflation, so every figure is in
                today&apos;s prices. The real return is (1 + return) ÷ (1 + inflation) − 1. Your yearly saving
                is assumed to rise with inflation, which keeps it the same in today&apos;s money.
              </li>
              <li>
                <strong>The pot you need.</strong> It is the income you want multiplied by the years until your
                State Pension starts, plus the income you still need after that (the income you want minus your
                State Pension) divided by your withdrawal rate. The years before State Pension age are drawn
                from the pot with no growth assumed, which is a cautious simplification.
              </li>
              <li>
                <strong>Withdrawal rate.</strong> A rate of 4% means the pot needs to be 25 times the yearly
                income it must provide. The 4% rule comes from US research on historical returns. It is a rule of
                thumb and not a guarantee, and a lower rate is more cautious.
              </li>
              <li>
                <strong>Not included.</strong> Income tax, pension tax-free cash limits, charges, changing
                spending in retirement, and the rule that pensions cannot normally be accessed before the normal
                minimum pension age.
              </li>
            </ul>

            <h2 className="calc-guide-h2">UK figures used</h2>
            <p className="calc-guide-p">
              The full new State Pension is {gbp(STATE_PENSION, { pence: true })} a year ({gbp(valueOn('state_pension.new_full_rate_weekly'), { pence: true })} a week) in {TAX_YEAR}.
              You may get less if you have fewer qualifying National Insurance years, and your own State
              Pension age depends on your date of birth. The normal minimum pension age is {NMPA.now}
              {NMPA.next ? `, rising to ${NMPA.next} on ${NMPA.nextFrom}` : ''}. Source:{' '}
              <a href={STATE_PENSION_SOURCE.sourceUrl} rel="noopener noreferrer">{STATE_PENSION_SOURCE.sourceName}</a>
              , checked {formatDate(STATE_PENSION_SOURCE.lastChecked)}. Check your own State Pension age and
              forecast on{' '}
              <a href="https://www.gov.uk/check-state-pension" rel="noopener noreferrer">GOV.UK</a>.
            </p>

            <h2 className="calc-guide-h2">Common questions</h2>
            <div className="faq-grid">
              <div className="faq-card">
                <h3>Why does retiring before State Pension age cost so much more?</h3>
                <p>
                  Until the State Pension starts, your pot has to pay the whole income. Each year of that gap
                  adds one year of income to the pot you need, before the long-term amount is counted.
                </p>
              </div>
              <div className="faq-card">
                <h3>Can I take money from my pension at the age shown?</h3>
                <p>
                  Not necessarily. The normal minimum pension age is {NMPA.now}
                  {NMPA.next ? ` and rises to ${NMPA.next} on ${NMPA.nextFrom}` : ''}. If the result is earlier, the
                  money to bridge the gap would need to be in ISAs or other accessible savings.
                </p>
              </div>
              <div className="faq-card">
                <h3>Is the result a prediction?</h3>
                <p>
                  No. It shows what your own assumptions imply. Returns, inflation and spending will differ, so
                  try a lower return and a lower withdrawal rate to see how sensitive the answer is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
