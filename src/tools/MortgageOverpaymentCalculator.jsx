import React, { useState, useCallback, useEffect } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { calculateOverpayment } from './mortgageCalc'
import ResultCta from '../components/ResultCta'
import { trackCalculatorCompleted, trackCalculatorStarted } from '../analytics'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
}

function fmtTerm(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = []
  if (y) parts.push(`${y} ${y === 1 ? 'year' : 'years'}`)
  if (m || !y) parts.push(`${m} ${m === 1 ? 'month' : 'months'}`)
  return parts.join(' ')
}

const DEFAULTS = {
  balance: '200000',
  rate: '5',
  years: '25',
  monthlyOverpayment: '200',
  lumpSum: '',
  allowancePct: '10',
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function MortgageOverpaymentCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState([])
  const [hasCalculated, setHasCalculated] = useState(false)

  const setField = useCallback((key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const runCalculation = useCallback(() => {
    const result = calculateOverpayment(form)
    if (result.ok) {
      setResults(result)
      setErrors([])
    } else {
      setErrors(result.errors)
      setResults(null)
    }
    return result
  }, [form])

  // Auto-recalculate after the first submission
  useEffect(() => {
    if (!hasCalculated) return
    runCalculation()
  }, [form, hasCalculated, runCalculation])

  function handleSubmit(e) {
    e.preventDefault()
    const result = runCalculation()
    if (result.ok) {
      setHasCalculated(true)
      trackCalculatorCompleted()
      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById('mortgage-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }
  }

  return (
    <div className="landing-shell">
      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      <main id="main-content" tabIndex={-1}>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="calc-hero">
          <div className="container">
            <div className="hero-kicker">Mortgage planning tool</div>
            <h1 className="calc-h1">Mortgage overpayment calculator UK</h1>
            <p className="calc-subhead">
              See how much interest and time overpaying a repayment mortgage could save, from a monthly
              overpayment, a one-off lump sum, or both. It also checks your overpayments against a
              yearly limit.
            </p>
            <p className="calc-trust">Your numbers are calculated in your browser and never sent anywhere.</p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────── */}
        <section className="calc-section">
          <div className="container">
            <div className="calc-layout">
              {/* ── Form ── */}
              <form className="calc-form-card" onSubmit={handleSubmit} onChange={() => trackCalculatorStarted()} noValidate>
                <div className="calc-group">
                  <div className="calc-group-title">Your mortgage</div>
                  <div className="calc-fields calc-fields-2">
                    <CalcField label="Outstanding balance" id="balance" prefix="£">
                      <NumInput id="balance" value={form.balance} onChange={setField('balance')} min="1" step="1000" prefix="£" placeholder="200,000" />
                    </CalcField>
                    <CalcField label="Interest rate" id="rate" hint="Your current rate, not the headline rate" suffix="%">
                      <NumInput id="rate" value={form.rate} onChange={setField('rate')} min="0" max="15" step="0.05" suffix="%" placeholder="5" />
                    </CalcField>
                  </div>
                  <div className="calc-fields calc-fields-1">
                    <CalcField label="Years left on the mortgage" id="years" hint="Between 1 and 40" suffix="years">
                      <NumInput id="years" value={form.years} onChange={setField('years')} min="1" max="40" step="1" suffix="years" placeholder="25" />
                    </CalcField>
                  </div>
                </div>

                <div className="calc-group">
                  <div className="calc-group-title">Your overpayments</div>
                  <div className="calc-fields calc-fields-2">
                    <CalcField label="Extra each month" id="monthlyOverpayment" hint="Optional — on top of your normal payment" prefix="£">
                      <NumInput id="monthlyOverpayment" value={form.monthlyOverpayment} onChange={setField('monthlyOverpayment')} min="0" step="50" prefix="£" placeholder="200" />
                    </CalcField>
                    <CalcField label="One-off lump sum now" id="lumpSum" hint="Optional — paid today" prefix="£">
                      <NumInput id="lumpSum" value={form.lumpSum} onChange={setField('lumpSum')} min="0" step="1000" prefix="£" placeholder="5,000" />
                    </CalcField>
                  </div>
                </div>

                <div className="calc-group">
                  <div className="calc-group-title">Your lender&apos;s limit</div>
                  <div className="calc-fields calc-fields-1">
                    <CalcField
                      label="Yearly overpayment allowance"
                      id="allowancePct"
                      hint="Share of the balance you can overpay each year without a charge. Many lenders allow up to 10%; check your own terms."
                      suffix="%"
                    >
                      <NumInput id="allowancePct" value={form.allowancePct} onChange={setField('allowancePct')} min="0" max="100" step="1" suffix="%" placeholder="10" />
                    </CalcField>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="calc-errors" role="alert">
                    {errors.map((err) => (
                      <div key={err} className="calc-error-item">{err}</div>
                    ))}
                  </div>
                )}

                <div className="calc-submit">
                  <button type="submit" className="btn btn-primary calc-submit-btn">Calculate savings</button>
                </div>
              </form>

              {/* ── Results ── */}
              <div className="calc-results-panel" id="mortgage-results">
                {!results && !hasCalculated ? (
                  <div className="calc-results-empty">
                    <p className="calc-results-empty-text">
                      Enter your mortgage details and click <strong>Calculate savings</strong> to see what overpaying could do.
                    </p>
                  </div>
                ) : results ? (
                  <div className="calc-results">
                    <div className="calc-results-header">
                      <div className="calc-results-title">What overpaying could do</div>
                      <div className="calc-results-note">
                        Normal payment {fmt(results.monthlyPayment)} a month over {fmtTerm(results.baseline.months)}
                      </div>
                    </div>

                    {results.hasOverpayment ? (
                      <div className="calc-stats">
                        <StatCard
                          label="Interest saved"
                          value={fmt(results.interestSaved)}
                          note={`Total interest ${fmt(results.baseline.interest)} → ${fmt(results.withOverpayment.interest)}`}
                          highlight
                        />
                        <StatCard
                          label="Mortgage-free sooner by"
                          value={results.monthsSaved ? fmtTerm(results.monthsSaved) : 'No change'}
                          note={`Clear in ${fmtTerm(results.withOverpayment.months)} instead of ${fmtTerm(results.baseline.months)}`}
                        />
                        <StatCard
                          label="Overpaid in the first year"
                          value={fmt(results.firstYearOverpayment)}
                          note={`Allowance at ${results.allowancePct}%: ${fmt(results.allowanceAmount)}`}
                        />
                      </div>
                    ) : (
                      <p className="calc-guide-p">
                        Add a monthly amount or a lump sum to see the effect. The table below shows three example monthly amounts.
                      </p>
                    )}

                    {results.hasOverpayment && results.overAllowance && (
                      <p className="calc-disclaimer" role="note">
                        Your first-year overpayments are above the allowance you entered. Going over it can
                        trigger an early repayment charge on many deals, which could cancel out the saving.
                        Check your mortgage terms or ask your lender before paying more than the limit.
                      </p>
                    )}

                    <div className="calc-comparison">
                      <div className="calc-cmp-title">If you paid this much extra each month</div>
                      <div className="calc-fire-cmp-head isa-cmp-head">
                        <span>Extra a month</span>
                        <span>Interest saved</span>
                        <span>Sooner by</span>
                      </div>
                      {results.comparison.map((row) => (
                        <div key={row.monthly} className="calc-fire-cmp-row isa-cmp-row">
                          <div className="calc-fire-cmp-rate"><span className="calc-fire-cmp-rate-value">{fmt(row.monthly)}</span></div>
                          <div className="calc-fire-cmp-target">{fmt(row.interestSaved)}</div>
                          <div className="calc-fire-cmp-gap">{row.monthsSaved ? fmtTerm(row.monthsSaved) : '—'}</div>
                        </div>
                      ))}
                    </div>

                    <p className="calc-disclaimer">
                      Illustrative only. Assumes a repayment mortgage at one rate for the whole term, with interest
                      worked out monthly. Real lenders may charge interest daily or yearly, and your rate will
                      change when a fixed deal ends. Not financial advice.
                    </p>
                    <ResultCta source="mortgage_overpayment" />
                  </div>
                ) : (
                  <div className="calc-results-empty">
                    <p className="calc-results-empty-text">Check the inputs above and try again.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Guide content ──────────────────────────────────────────────── */}
        <section className="section-border">
          <div className="container section calc-guide-section">
            <div className="calc-guide">
              <h2 className="calc-guide-h2">How the saving is worked out</h2>
              <p className="calc-guide-p">
                The calculator takes your balance, rate and remaining term and works out the normal monthly payment
                that would clear the mortgage exactly at the end. It then runs the mortgage month by month: add a
                month&apos;s interest (the annual rate divided by 12, applied to what you owe), take off your payment
                plus any overpayment, and repeat until the balance reaches zero. The interest saved is the total
                interest on the normal run minus the total on the overpaying run.
              </p>
              <p className="calc-guide-p">
                A lump sum is paid today, before the first month&apos;s interest. A monthly overpayment is paid at the
                end of every month, so the shorter term comes from owing less each month and paying interest on
                less. The first-year figure is your lump sum plus twelve monthly overpayments, compared with the
                allowance you entered.
              </p>

              <h2 className="calc-guide-h2">The yearly limit and early repayment charges</h2>
              <p className="calc-guide-p">
                Many lenders let you overpay up to 10% of the balance a year without a charge, according to
                MoneyHelper, but the limit is set by your own deal. Fixed and discounted deals often have
                one; a standard variable rate mortgage usually does not. If you want to pay more than your
                lender allows, MoneyHelper notes you could save the money and pay it off in one go at the end of
                your fixed deal, which helps avoid extra fees. Check your mortgage offer for the exact rule.
              </p>

              <h2 className="calc-guide-h2">Questions this calculator does not answer</h2>
              <p className="calc-guide-p">
                It does not say whether overpaying is better than saving, investing or paying into a pension.
                That depends on your mortgage rate, the return and tax on the alternatives, how much you would
                be comfortable locking away, and charges on your deal. Our guide,{' '}
                <a
                  href="/guides/overpay-mortgage-or-invest-uk"
                  className="guide-inline-link"
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/overpay-mortgage-or-invest-uk') } }}
                >
                  should you overpay your mortgage or invest?
                </a>
                , sets out the trade-offs without telling you which to choose.
              </p>

              <h2 className="calc-guide-h2">Frequently asked questions</h2>
              <div className="faq-card">
                <h3>Does overpaying shorten the term or lower the payment?</h3>
                <p>
                  This calculator keeps your payment the same and shortens the term, which is the usual result of
                  overpaying. Some lenders let you choose to lower the monthly payment instead; ask yours.
                </p>
              </div>
              <div className="faq-card">
                <h3>Why does my lender&apos;s figure differ from this one?</h3>
                <p>
                  Lenders may charge interest daily or yearly, round payments, apply fees, or reset the rate when
                  a fixed deal ends. This tool uses one rate and monthly interest so you can compare scenarios,
                  not predict the exact figure on your statement.
                </p>
              </div>
              <div className="faq-card">
                <h3>Is my information stored?</h3>
                <p>
                  No. The numbers stay in your browser and are not sent anywhere. Paddock only counts that a
                  calculator was used, never what was entered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="section-border">
          <div className="container section">
            <div className="calc-cta-block">
              <div className="calc-cta-copy">
                <h2 className="calc-cta-h2">See your mortgage next to everything else you own.</h2>
                <p className="calc-cta-sub">
                  Record your mortgage balance in Paddock alongside your ISAs, pensions, savings and property, and
                  watch your net worth change as you pay it down. You enter the numbers yourself; no bank
                  connection is needed.
                </p>
                <div className="hero-actions">
                  <button type="button" className="btn btn-primary" onClick={() => { goTo('signup', 'bottom') }}>
                    Start tracking — it&apos;s free
                  </button>
                  <a
                    href="/tools/net-worth-calculator"
                    className="btn btn-secondary"
                    onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/tools/net-worth-calculator') } }}
                  >
                    Work out your net worth
                  </a>
                </div>
                <p className="hero-foot">Free to start · No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
