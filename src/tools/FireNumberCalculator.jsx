import React, { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { calculateFire } from './fireCalc'

// ─── Analytics ───────────────────────────────────────────────────────────────
function track(event, data = {}) {
  try {
    window.dispatchEvent(
      new CustomEvent('paddock:calc', { detail: { event, ...data } })
    )
  } catch (_) {}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtPct(n) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return `${n.toFixed(1)}%`
}

function parsePct(str) {
  const n = parseFloat(str)
  return isNaN(n) ? NaN : n / 100
}

function parseNum(str) {
  const n = parseFloat(String(str).replace(/,/g, ''))
  return isNaN(n) ? NaN : n
}

// ─── Defaults ────────────────────────────────────────────────────────────────
const DEFAULTS = {
  annualSpending: '30000',
  passiveIncome: '0',
  withdrawalRate: '4',
  currentAssets: '100000',
  annualContributions: '12000',
  annualReturn: '5',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CalcField({ label, id, hint, prefix, suffix, children }) {
  return (
    <div className="calc-field">
      <label className="calc-label" htmlFor={id}>
        {label}
      </label>
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

function ProgressBar({ pct }) {
  const clamped = Math.min(Math.max(pct, 0), 100)
  return (
    <div className="calc-progress">
      <div className="calc-progress-header">
        <span className="calc-progress-title">Progress to FIRE target</span>
        <span className="calc-progress-pct">{fmtPct(pct)}</span>
      </div>
      <div className="calc-progress-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="calc-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

function FireCompRow({ rateLabel, fireNumber, gap, yearsToFI, isActive, showYearsCol }) {
  const yearsLabel =
    yearsToFI === null ? '—'
    : yearsToFI === 0 ? 'Reached'
    : `~${yearsToFI} yr${yearsToFI === 1 ? '' : 's'}`

  return (
    <div className={`calc-fire-cmp-row${isActive ? ' active' : ''}${showYearsCol ? ' has-years' : ''}`}>
      <div className="calc-fire-cmp-rate">
        <span className="calc-fire-cmp-rate-value">{rateLabel}</span>
      </div>
      <div className="calc-fire-cmp-target">{fmt(fireNumber)}</div>
      <div className={`calc-fire-cmp-gap${gap === 0 ? ' reached' : ''}`}>
        {gap === 0 ? 'Reached' : fmt(gap)}
      </div>
      {showYearsCol && (
        <div className="calc-fire-cmp-years">{yearsLabel}</div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FireNumberCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState([])
  const [hasCalculated, setHasCalculated] = useState(false)

  const setField = useCallback((key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const buildInputs = useCallback(() => ({
    annualSpending: parseNum(form.annualSpending),
    passiveIncome: parseNum(form.passiveIncome),
    withdrawalRate: parsePct(form.withdrawalRate),
    currentAssets: parseNum(form.currentAssets),
    annualContributions: parseNum(form.annualContributions),
    annualReturn: parsePct(form.annualReturn),
  }), [form])

  const runCalculation = useCallback(() => {
    const inputs = buildInputs()
    const result = calculateFire(inputs)
    if (result.ok) {
      setResults(result)
      setErrors([])
    } else {
      setErrors(result.errors)
      setResults(null)
    }
    return result
  }, [buildInputs])

  // Auto-recalculate after first submission
  useEffect(() => {
    if (!hasCalculated) return
    runCalculation()
  }, [form, hasCalculated, runCalculation])

  function handleSubmit(e) {
    e.preventDefault()
    const result = runCalculation()
    if (result.ok) {
      setHasCalculated(true)
      track('fire_calculate', { withdrawalRate: form.withdrawalRate })
      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById('fire-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }
  }

  // Show years column if any comparison row has a meaningful years estimate
  const showYearsCol = Boolean(
    results && results.comparison.some((r) => r.yearsToFI !== null)
  )

  const activeRate = parsePct(form.withdrawalRate)

  return (
    <div className="landing-shell">
      <Helmet>
        <title>FIRE Number Calculator UK — How Much Do You Need to Retire? | Paddock</title>
        <meta
          name="description"
          content="Free FIRE number calculator. Enter your annual spending and assumptions to find your financial independence target, track your progress, and estimate how long it could take."
        />
        <link rel="canonical" href="https://getpaddock.com/tools/fire-number-calculator" />
        <meta property="og:title" content="FIRE Number Calculator UK | Paddock" />
        <meta
          property="og:description"
          content="Free FIRE number calculator. Find your financial independence target and see how the 3.5%, 4%, and 4.5% withdrawal rates compare."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools/fire-number-calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FIRE Number Calculator UK | Paddock" />
        <meta
          name="twitter:description"
          content="Free FIRE number calculator. Find your financial independence target and see how long it could take."
        />
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Financial independence tool</div>
          <h1 className="calc-h1">FIRE number calculator UK</h1>
          <p className="calc-subhead">
            Enter your annual spending and assumptions to see your financial independence target,
            how far you are from it, and a 3.5% / 4% / 4.5% withdrawal rate comparison.
          </p>
          <p className="calc-trust">
            Your numbers are calculated in your browser and never sent anywhere.
          </p>
        </div>
      </section>

      {/* ── Calculator ──────────────────────────────────────────────────── */}
      <section className="calc-section">
        <div className="container">
          <div className="calc-layout">

            {/* ── Form ── */}
            <form className="calc-form-card" onSubmit={handleSubmit} noValidate>

              {/* Group 1: Spending */}
              <div className="calc-group">
                <div className="calc-group-title">Your spending</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Annual spending" id="annualSpending" prefix="£">
                    <NumInput
                      id="annualSpending"
                      value={form.annualSpending}
                      onChange={setField('annualSpending')}
                      min="0"
                      step="1000"
                      prefix="£"
                      placeholder="30,000"
                    />
                  </CalcField>
                  <CalcField
                    label="Other annual passive income"
                    id="passiveIncome"
                    hint="Optional — rental, dividends, etc."
                    prefix="£"
                  >
                    <NumInput
                      id="passiveIncome"
                      value={form.passiveIncome}
                      onChange={setField('passiveIncome')}
                      min="0"
                      step="1000"
                      prefix="£"
                      placeholder="0"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 2: Portfolio */}
              <div className="calc-group">
                <div className="calc-group-title">Your portfolio</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField
                    label="Current invested assets"
                    id="currentAssets"
                    hint="Stocks, funds, SIPPs — exclude property"
                    prefix="£"
                  >
                    <NumInput
                      id="currentAssets"
                      value={form.currentAssets}
                      onChange={setField('currentAssets')}
                      min="0"
                      step="5000"
                      prefix="£"
                      placeholder="100,000"
                    />
                  </CalcField>
                  <CalcField
                    label="Annual contributions"
                    id="annualContributions"
                    hint="Optional — total invested per year"
                    prefix="£"
                  >
                    <NumInput
                      id="annualContributions"
                      value={form.annualContributions}
                      onChange={setField('annualContributions')}
                      min="0"
                      step="1000"
                      prefix="£"
                      placeholder="12,000"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 3: Assumptions */}
              <div className="calc-group">
                <div className="calc-group-title">Assumptions</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField
                    label="Withdrawal rate"
                    id="withdrawalRate"
                    hint="% of portfolio taken per year"
                    suffix="%"
                  >
                    <NumInput
                      id="withdrawalRate"
                      value={form.withdrawalRate}
                      onChange={setField('withdrawalRate')}
                      min="0.5"
                      max="20"
                      step="0.5"
                      suffix="%"
                      placeholder="4"
                    />
                  </CalcField>
                  <CalcField
                    label="Expected annual return"
                    id="annualReturn"
                    hint="Nominal, before contributions"
                    suffix="%"
                  >
                    <NumInput
                      id="annualReturn"
                      value={form.annualReturn}
                      onChange={setField('annualReturn')}
                      min="0"
                      max="20"
                      step="0.5"
                      suffix="%"
                      placeholder="5"
                    />
                  </CalcField>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="calc-errors" role="alert">
                  {errors.map((err) => (
                    <div key={err} className="calc-error-item">
                      {err}
                    </div>
                  ))}
                </div>
              )}

              <div className="calc-submit">
                <button type="submit" className="btn btn-primary calc-submit-btn">
                  Calculate my FIRE number
                </button>
              </div>
            </form>

            {/* ── Results ── */}
            <div className="calc-results-panel" id="fire-results">
              {!results && !hasCalculated ? (
                <div className="calc-results-empty">
                  <div className="calc-results-empty-icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="calc-results-empty-text">
                    Enter your assumptions and click <strong>Calculate my FIRE number</strong> to see your results.
                  </p>
                </div>
              ) : results ? (
                <div className="calc-results">
                  <div className="calc-results-header">
                    <div className="calc-results-title">Your FIRE estimate</div>
                    <div className="calc-results-note">Based on your assumptions</div>
                  </div>

                  <div className="calc-stats">
                    <StatCard
                      label="FIRE number"
                      value={fmt(results.fireNumber)}
                      note={`At ${form.withdrawalRate}% withdrawal rate`}
                      highlight
                    />
                    <StatCard
                      label="Current portfolio"
                      value={fmt(results.currentAssets)}
                      note={results.gap > 0 ? `${fmt(results.gap)} gap remaining` : 'Target met'}
                    />
                    {results.yearsToFI === 0 && (
                      <StatCard
                        label="Financial independence"
                        value="Reached"
                        note="Your portfolio already meets this target"
                      />
                    )}
                    {results.yearsToFI !== null && results.yearsToFI > 0 && (
                      <StatCard
                        label="Estimated years to FI"
                        value={`~${results.yearsToFI}`}
                        note="Based on your contributions &amp; return"
                      />
                    )}
                  </div>

                  <ProgressBar pct={results.progressPct} />

                  <div className="calc-comparison">
                    <div className="calc-cmp-title">3.5% / 4% / 4.5% withdrawal comparison</div>
                    <div className={`calc-fire-cmp-head${showYearsCol ? ' has-years' : ''}`}>
                      <span>Rate</span>
                      <span>FIRE target</span>
                      <span>Gap</span>
                      {showYearsCol && <span>Est. years</span>}
                    </div>
                    {results.comparison.map((row) => {
                      const isActive = Math.abs(activeRate - row.rate) < 0.001
                      return (
                        <FireCompRow
                          key={row.rate}
                          {...row}
                          isActive={isActive}
                          showYearsCol={showYearsCol}
                        />
                      )
                    })}
                  </div>

                  <p className="calc-disclaimer">
                    Illustrative only. Based on your assumptions, with annual compounding. Returns are not guaranteed. Not financial advice.
                  </p>
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

      {/* ── Guide content ───────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section calc-guide-section">
          <div className="calc-guide">

            <h2 className="calc-guide-h2">What is a FIRE number?</h2>
            <p className="calc-guide-p">
              A FIRE number is the invested portfolio value you need to cover your living costs
              indefinitely — without relying on employment income. The idea behind financial
              independence is that once your portfolio is large enough, its investment returns can
              fund your spending in perpetuity (or for a very long time).
            </p>
            <p className="calc-guide-p">
              The term FIRE stands for Financial Independence, Retire Early. The "retire early"
              part is optional — many people pursue financial independence simply to have the
              option to work on their own terms, not because they plan to stop working entirely.
              The number is the same regardless of what you do once you reach it.
            </p>

            <h2 className="calc-guide-h2">The 25x rule and the 4% withdrawal rate</h2>
            <p className="calc-guide-p">
              The most widely cited shortcut is the <strong>25x rule</strong>: multiply your
              annual spending by 25 to get your FIRE number. This comes directly from a 4%
              withdrawal rate: if you withdraw 4% of your portfolio each year, you need a
              portfolio worth 25 times your annual spending.
            </p>
            <p className="calc-guide-p">
              The 4% figure is derived from historical research (notably the US-based
              "Trinity Study") which found that, across most historical periods, a 4% withdrawal
              rate sustained a 30-year retirement when invested in a diversified equity and bond
              portfolio. That research is based on US market data and a specific asset allocation.
              It is a useful benchmark — not a guarantee, and not a figure that automatically
              translates to the UK.
            </p>
            <p className="calc-guide-p">
              This calculator lets you set any withdrawal rate, and shows how the target changes
              across the 3.5%, 4%, and 4.5% benchmarks so you can see the sensitivity yourself.
            </p>

            <h2 className="calc-guide-h2">Why 3.5%, 4%, and 4.5% matter</h2>
            <p className="calc-guide-p">
              Small changes in withdrawal rate have a large effect on your target. A 4.5% rate
              requires a portfolio of roughly 22× annual spending; a 3.5% rate requires around
              28.5×. The difference between them on a £30,000 spending level is roughly £185,000
              in additional portfolio value. Choosing a lower rate gives more buffer against
              longevity and poor returns; choosing a higher rate means reaching the target sooner
              but with less margin.
            </p>
            <p className="calc-guide-p">
              Neither 3.5% nor 4.5% is more "correct" than 4%. The right rate depends on factors
              this calculator cannot model: your other income sources, your investment allocation,
              how flexible your spending is, and how long you might need the portfolio to last.
            </p>

            <h2 className="calc-guide-h2">What this calculator includes and excludes</h2>
            <p className="calc-guide-p">
              The calculator uses a simple annual compounding model. It grows your current
              portfolio at the assumed return, adds your annual contributions, and counts the
              years until the portfolio meets the FIRE target. The passive income input reduces
              the annual spending gap before calculating the target — if you have rental income
              or dividends that cover part of your costs, those reduce how large a portfolio
              you need from investments.
            </p>
            <ul className="calc-guide-ul">
              <li>
                <strong>Not included:</strong> taxes, ISA and SIPP wrappers, State Pension,
                property equity, inflation adjustment, sequence-of-returns risk, or spending
                changes over time.
              </li>
              <li>
                <strong>Current assets:</strong> enter only your investable portfolio — stocks,
                funds, SIPPs, ISAs. Exclude property unless you plan to sell it for income.
              </li>
              <li>
                <strong>Passive income:</strong> use this for income you already receive or
                expect to receive regardless of your portfolio (e.g. rental income, a defined
                benefit pension). Do not include portfolio returns here — those are captured
                in the annual return assumption.
              </li>
            </ul>

            <h2 className="calc-guide-h2">UK framing</h2>
            <p className="calc-guide-p">
              In the UK, most investable wealth sits inside ISAs and SIPPs. ISA withdrawals are
              tax-free; SIPP withdrawals are taxed as income above the personal allowance (with
              25% typically tax-free). This means the gross FIRE number this calculator produces
              is a reasonable planning target for your total investable portfolio, but the
              after-tax income it generates may differ depending on how and where the assets are
              held. The State Pension (currently up to approximately £11,500 per year) can also
              significantly reduce the portfolio size needed once you reach state pension age —
              enter expected State Pension income in the passive income field to reflect this.
            </p>

            <div className="calc-guide-note">
              <strong>Important:</strong> All outputs are illustrative only. This calculator uses
              simple assumptions and does not model taxes, the State Pension, inflation,
              sequence-of-returns risk, or changes in contributions and spending over time.
              It is not financial advice. For personalised planning, consider speaking with a
              regulated financial adviser.
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <div className="calc-guide">
            <h2 className="calc-guide-h2">Common questions</h2>

            <div className="faq-grid">
              <div className="faq-card">
                <h3>What is a FIRE number?</h3>
                <p>
                  Your FIRE number is the invested portfolio size that, at your chosen withdrawal
                  rate, would cover your annual spending without needing employment income.
                  At a 4% withdrawal rate, it is 25 times your annual spending. At 3.5%,
                  it is around 28.5 times. Use the calculator above to find the figure based on
                  your own spending and assumptions.
                </p>
              </div>

              <div className="faq-card">
                <h3>How do I calculate financial independence?</h3>
                <p>
                  The basic formula is: <em>FIRE number = (annual spending − passive income) ÷
                  withdrawal rate</em>. For example, £30,000 spending with no passive income at a
                  4% withdrawal rate gives £750,000. The gap is the difference between your current
                  portfolio and that target. Divide the gap by your annual savings rate (adjusted
                  for investment returns) to get a rough timeline.
                </p>
              </div>

              <div className="faq-card">
                <h3>Is the 4% rule reliable?</h3>
                <p>
                  It is a useful starting point, not a rule. It derives from US historical data
                  over 30-year retirement periods and does not guarantee the same result in other
                  markets, time periods, or with different asset allocations. A lower withdrawal
                  rate (3.5% or below) gives more margin for longer retirements or lower returns.
                  A higher rate (4.5%+) assumes the portfolio needs to last fewer years or that
                  spending will flex downward if returns disappoint.
                </p>
              </div>

              <div className="faq-card">
                <h3>How long will it take me to reach FI?</h3>
                <p>
                  The calculator estimates this when you have annual contributions or a
                  return assumption greater than zero. It uses a simple annual compounding
                  model: grow the portfolio each year at the assumed return, add contributions,
                  and count the years until the portfolio reaches the target. If the target is
                  not reachable within 60 years under your assumptions, it returns no estimate —
                  which usually means increasing contributions or return assumptions would help.
                </p>
              </div>

              <div className="faq-card">
                <h3>Does this include pensions, ISAs, and property?</h3>
                <p>
                  For current assets, enter the total value of your investable portfolio — ISAs,
                  SIPPs, general investment accounts, and similar liquid investments. Exclude
                  property unless you plan to sell it. The FIRE number this calculator produces
                  is a gross portfolio target; the actual tax treatment of withdrawals from
                  each wrapper (ISA vs SIPP) is not modelled. Property equity and the State
                  Pension are not included automatically — you can factor the State Pension into
                  the passive income field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <div className="calc-cta-block">
            <div className="calc-cta-copy">
              <h2 className="calc-cta-h2">Save your FIRE target and track your progress with Paddock.</h2>
              <p className="calc-cta-sub">
                Track your wider wealth, model future outcomes, and keep your data
                private — no bank connection required.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    goTo('signup')
                    track('fire_cta_click', { location: 'bottom_cta' })
                  }}
                >
                  Start planning — it&apos;s free
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigateTo('/track-isas-pensions-savings')}
                >
                  How Paddock handles ISAs and pensions
                </button>
              </div>
              <p className="hero-foot">Free to start · No credit card required · Setup in under 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
