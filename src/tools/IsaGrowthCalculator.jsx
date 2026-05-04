import React, { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { calculateIsa } from './isaCalc'

// ─── Analytics ───────────────────────────────────────────────────────────────
function track(event, data = {}) {
  try {
    window.dispatchEvent(
      new CustomEvent('paddock:calc', { detail: { event, ...data } })
    )
  } catch {
    /* Analytics is optional. */
  }
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

// ─── Defaults ────────────────────────────────────────────────────────────────
const DEFAULTS = {
  initialAmount: '10000',
  monthlyContribution: '500',
  years: '20',
  annualReturn: '5',
  annualFee: '0.15',
  targetValue: '',
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

function ProgressBar({ pct, label = 'Progress to target' }) {
  const clamped = Math.min(Math.max(pct, 0), 100)
  return (
    <div className="calc-progress">
      <div className="calc-progress-header">
        <span className="calc-progress-title">{label}</span>
        <span className="calc-progress-pct">{fmtPct(pct)}</span>
      </div>
      <div
        className="calc-progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="calc-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

function IsaCompRow({ rateLabel, projectedValue, totalGrowth, isActive }) {
  return (
    <div className={`calc-fire-cmp-row isa-cmp-row${isActive ? ' active' : ''}`}>
      <div className="calc-fire-cmp-rate">
        <span className="calc-fire-cmp-rate-value">{rateLabel}</span>
      </div>
      <div className="calc-fire-cmp-target">{fmt(projectedValue)}</div>
      <div className="calc-fire-cmp-gap">{fmt(totalGrowth)}</div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IsaGrowthCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState([])
  const [hasCalculated, setHasCalculated] = useState(false)

  const setField = useCallback((key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const buildInputs = useCallback(
    () => ({
      initialAmount: form.initialAmount,
      monthlyContribution: form.monthlyContribution,
      years: form.years,
      annualReturn: form.annualReturn,
      annualFee: form.annualFee,
      targetValue: form.targetValue,
    }),
    [form]
  )

  const runCalculation = useCallback(() => {
    const inputs = buildInputs()
    const result = calculateIsa(inputs)
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
      track('isa_calculate', { years: form.years, annualReturn: form.annualReturn })
      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById('isa-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }
  }

  const activeReturn = parseFloat(form.annualReturn)

  return (
    <div className="landing-shell">
      <Helmet>
        <title>ISA Growth Calculator UK — Project Your ISA Value | Paddock</title>
        <meta
          name="description"
          content="Free ISA growth calculator. Enter your balance, monthly contributions and return assumption to see how your ISA could grow over time. No login required."
        />
        <link rel="canonical" href="https://getpaddock.com/tools/isa-growth-calculator/" />
        <meta property="og:title" content="ISA Growth Calculator UK | Paddock" />
        <meta
          property="og:description"
          content="Free ISA growth calculator. Project your Stocks and Shares ISA over 5, 10, 20 or 30 years. See the 3%, 5%, and 7% growth comparison."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools/isa-growth-calculator/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ISA Growth Calculator UK | Paddock" />
        <meta
          name="twitter:description"
          content="Free ISA growth calculator. Project your ISA value over time with a 3%, 5%, and 7% return comparison."
        />
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">ISA planning tool</div>
          <h1 className="calc-h1">ISA growth calculator UK</h1>
          <p className="calc-subhead">
            Enter your current balance, monthly contributions, and a return assumption to see how
            your Stocks and Shares ISA could grow — with a 3% / 5% / 7% return comparison.
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

              {/* Group 1: Your ISA */}
              <div className="calc-group">
                <div className="calc-group-title">Your ISA</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Current ISA balance" id="initialAmount" prefix="£">
                    <NumInput
                      id="initialAmount"
                      value={form.initialAmount}
                      onChange={setField('initialAmount')}
                      min="0"
                      step="1000"
                      prefix="£"
                      placeholder="10,000"
                    />
                  </CalcField>
                  <CalcField
                    label="Monthly contribution"
                    id="monthlyContribution"
                    hint="Optional — amount added each month"
                    prefix="£"
                  >
                    <NumInput
                      id="monthlyContribution"
                      value={form.monthlyContribution}
                      onChange={setField('monthlyContribution')}
                      min="0"
                      step="50"
                      prefix="£"
                      placeholder="500"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 2: Horizon */}
              <div className="calc-group">
                <div className="calc-group-title">Time horizon</div>
                <div className="calc-fields calc-fields-1">
                  <CalcField
                    label="Years to grow"
                    id="years"
                    hint="Between 1 and 50"
                    suffix="years"
                  >
                    <NumInput
                      id="years"
                      value={form.years}
                      onChange={setField('years')}
                      min="1"
                      max="50"
                      step="1"
                      suffix="years"
                      placeholder="20"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 3: Assumptions */}
              <div className="calc-group">
                <div className="calc-group-title">Assumptions</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField
                    label="Annual return"
                    id="annualReturn"
                    hint="Nominal gross return"
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
                  <CalcField
                    label="Annual platform fee"
                    id="annualFee"
                    hint="Optional — e.g. 0.15% for a low-cost platform"
                    suffix="%"
                  >
                    <NumInput
                      id="annualFee"
                      value={form.annualFee}
                      onChange={setField('annualFee')}
                      min="0"
                      max="5"
                      step="0.05"
                      suffix="%"
                      placeholder="0.15"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 4: Optional target */}
              <div className="calc-group">
                <div className="calc-group-title">Target (optional)</div>
                <div className="calc-fields calc-fields-1">
                  <CalcField
                    label="Target ISA value"
                    id="targetValue"
                    hint="Optional — see how close you get"
                    prefix="£"
                  >
                    <NumInput
                      id="targetValue"
                      value={form.targetValue}
                      onChange={setField('targetValue')}
                      min="1"
                      step="10000"
                      prefix="£"
                      placeholder="e.g. 250,000"
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
                  Calculate ISA growth
                </button>
              </div>
            </form>

            {/* ── Results ── */}
            <div className="calc-results-panel" id="isa-results">
              {!results && !hasCalculated ? (
                <div className="calc-results-empty">
                  <div className="calc-results-empty-icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect x="5" y="20" width="4" height="8" rx="1" fill="currentColor" opacity="0.4" />
                      <rect x="11" y="14" width="4" height="14" rx="1" fill="currentColor" opacity="0.6" />
                      <rect x="17" y="8" width="4" height="20" rx="1" fill="currentColor" opacity="0.8" />
                      <rect x="23" y="3" width="4" height="25" rx="1" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="calc-results-empty-text">
                    Enter your ISA details and click <strong>Calculate ISA growth</strong> to see your projection.
                  </p>
                </div>
              ) : results ? (
                <div className="calc-results">
                  <div className="calc-results-header">
                    <div className="calc-results-title">Your ISA projection</div>
                    <div className="calc-results-note">After {form.years} {Number(form.years) === 1 ? 'year' : 'years'}</div>
                  </div>

                  <div className="calc-stats">
                    <StatCard
                      label="Projected value"
                      value={fmt(results.projectedValue)}
                      note={`At ${form.annualReturn}% annual return`}
                      highlight
                    />
                    <StatCard
                      label="Total contributed"
                      value={fmt(results.totalContributed)}
                      note="Initial balance + contributions"
                    />
                    <StatCard
                      label="Investment growth"
                      value={fmt(results.totalGrowth)}
                      note="Growth on top of contributions"
                    />
                  </div>

                  {results.targetProgressPct !== null && (
                    <ProgressBar
                      pct={results.targetProgressPct}
                      label={`Progress to ${fmt(parseFloat(form.targetValue))} target`}
                    />
                  )}

                  <div className="calc-comparison">
                    <div className="calc-cmp-title">3% / 5% / 7% growth comparison</div>
                    <div className="calc-fire-cmp-head isa-cmp-head">
                      <span>Return</span>
                      <span>Projected value</span>
                      <span>Growth</span>
                    </div>
                    {results.comparison.map((row) => {
                      const isActive = Math.abs(activeReturn - row.rate * 100) < 0.001
                      return (
                        <IsaCompRow
                          key={row.rate}
                          {...row}
                          isActive={isActive}
                        />
                      )
                    })}
                  </div>

                  <p className="calc-disclaimer">
                    Illustrative only. Uses monthly compounding. Returns are not guaranteed. ISA allowance rules and tax treatment may change. Not financial advice.
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

            <h2 className="calc-guide-h2">How ISA growth is calculated</h2>
            <p className="calc-guide-p">
              The calculator uses monthly compounding. Each month, your balance earns
              the net monthly return (annual return minus annual fee, converted to a monthly
              rate), and your monthly contribution is added. This is more precise than simple
              annual compounding and matches how most investment platforms accrue growth.
            </p>
            <p className="calc-guide-p">
              The net monthly rate is derived as: <em>(1 + net annual rate)^(1/12) − 1</em>,
              where the net annual rate is your gross return minus the platform fee. If your
              gross return is 5% and your platform fee is 0.15%, the net rate applied to
              compounding is 4.85% per year, converted to a monthly equivalent.
            </p>

            <h2 className="calc-guide-h2">What the 3%, 5%, and 7% comparison shows</h2>
            <p className="calc-guide-p">
              The comparison rows project the same initial balance and contributions at three
              different return assumptions: 3% (conservative), 5% (moderate), and 7%
              (optimistic). These are nominal, pre-tax figures. Over long time horizons,
              the difference between these assumptions is substantial — over 30 years, a
              £10,000 starting balance with £500 per month grows to roughly £500,000 at 5%
              but over £700,000 at 7%.
            </p>
            <p className="calc-guide-p">
              The comparison is designed to show return sensitivity, not to predict outcomes.
              Real investment returns are variable, sequence-dependent, and not guaranteed.
              The purpose of the comparison is to illustrate why the assumed return matters
              so much in long-horizon projections.
            </p>

            <h2 className="calc-guide-h2">The platform fee and why it matters</h2>
            <p className="calc-guide-p">
              The annual fee field represents a platform fee charged as a percentage of your
              portfolio. Most low-cost UK ISA platforms charge between 0.15% and 0.45% per
              year. This fee is deducted from your effective return in the model: a 5% gross
              return with a 0.25% fee produces a net return of 4.75%.
            </p>
            <p className="calc-guide-p">
              The effect of fees compounds over time. A 0.5% fee on a £10,000 portfolio
              costs roughly £50 in year one. On a £200,000 portfolio after 20 years of
              growth, the same fee rate costs £1,000 per year. The calculator lets you
              compare fee levels to see their long-term drag on outcomes.
            </p>
            <p className="calc-guide-p">
              Note: fund ongoing charges (OCF/TER) are separate from platform fees. If your
              funds charge 0.07% per year (e.g. a global index tracker) and your platform
              charges 0.15%, your total annual cost is 0.22%. You can enter the combined
              total here for a more accurate projection.
            </p>

            <h2 className="calc-guide-h2">What counts as an ISA contribution</h2>
            <p className="calc-guide-p">
              The annual ISA allowance in 2025/26 is £20,000 per person. This covers
              contributions to all ISA types combined: Cash ISA, Stocks and Shares ISA,
              Innovative Finance ISA, and Lifetime ISA (subject to its own £4,000 sub-limit).
              Junior ISAs have a separate allowance (£9,000 in 2025/26).
            </p>
            <p className="calc-guide-p">
              This calculator does not enforce the annual allowance limit — it models the
              mathematical outcome of any contribution level you enter. For planning, ensure
              your monthly contribution does not exceed the annual allowance over a tax year.
              At £500 per month, contributions total £6,000 per year — well within the
              £20,000 limit.
            </p>

            <h2 className="calc-guide-h2">Stocks and Shares ISA vs Cash ISA</h2>
            <p className="calc-guide-p">
              Cash ISAs currently offer rates in the range of 4–5% (as of 2025), which are
              competitive for short-term savings but are not inflation-beating over most
              longer horizons. Stocks and Shares ISAs carry more volatility but have
              historically returned more than cash over 10+ year periods.
            </p>
            <p className="calc-guide-p">
              This calculator is most relevant for Stocks and Shares ISAs with a medium to
              long time horizon. For Cash ISA planning, the same model works: enter the
              interest rate as your annual return and leave the fee at 0%.
            </p>

            <div className="calc-guide-note">
              <strong>Important:</strong> All projections are illustrative only. Investment
              returns are variable and not guaranteed. This calculator does not model inflation,
              taxes (ISA withdrawals are tax-free), changes in contributions, or the annual ISA
              allowance. It is not financial advice. For personalised planning, speak with a
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
                <h3>How much will my ISA be worth in 10 years?</h3>
                <p>
                  It depends on your starting balance, monthly contributions, and return assumption.
                  A £10,000 ISA with £500 per month at 5% annual return would grow to approximately
                  £88,000 after 10 years — of which around £70,000 is contributions and £18,000 is
                  investment growth. Use the calculator above with your own numbers to get a
                  personalised projection.
                </p>
              </div>

              <div className="faq-card">
                <h3>What is a realistic return for a Stocks and Shares ISA?</h3>
                <p>
                  There is no single realistic return — it depends on your asset allocation,
                  fund choice, and time period. Broad global equity index funds have historically
                  returned around 7–10% per year in nominal terms over long periods, before fees.
                  A 5–6% assumption net of fees is a common moderate planning figure. Lower
                  allocations to equities or higher allocations to bonds would typically produce
                  lower expected returns. Always model a range, not a single point.
                </p>
              </div>

              <div className="faq-card">
                <h3>Does the ISA allowance limit how much I can contribute?</h3>
                <p>
                  Yes. The 2025/26 ISA allowance is £20,000 per person per tax year across all
                  ISA types. The calculator does not enforce this limit — it projects whatever
                  monthly contribution you enter. At £500 per month (£6,000 per year) you are
                  well within the limit; at £2,000 per month (£24,000 per year) you would exceed
                  it and need to adjust. Check current HMRC guidance for allowance rules.
                </p>
              </div>

              <div className="faq-card">
                <h3>What platform fees should I enter?</h3>
                <p>
                  Common low-cost UK platform fees range from 0.15% (e.g. Vanguard, iWeb) to
                  0.35–0.45% (e.g. Hargreaves Lansdown, AJ Bell). Some platforms charge fixed
                  fees rather than percentage fees, which work differently and are not modelled
                  here. The fee field is for the total annual cost as a percentage of the portfolio,
                  including platform fee and any ongoing fund charges (OCF/TER).
                </p>
              </div>

              <div className="faq-card">
                <h3>Are ISA withdrawals tax-free?</h3>
                <p>
                  Yes. Withdrawals from a Stocks and Shares ISA or Cash ISA are free of Income Tax
                  and Capital Gains Tax. This is one of the main advantages of the ISA wrapper.
                  The projections in this calculator are gross of tax — because ISA growth and
                  withdrawals are tax-free, no tax adjustment is needed for an ISA-held investment.
                  This is different from a general investment account, where gains and income may
                  be subject to CGT and Income Tax.
                </p>
              </div>

              <div className="faq-card">
                <h3>How does this compare to a pension (SIPP)?</h3>
                <p>
                  Both ISAs and SIPPs offer tax-efficient growth, but in different ways. SIPP
                  contributions receive tax relief (20–45% depending on your tax rate), which
                  boosts the effective contribution. ISA contributions receive no upfront relief
                  but withdrawals are fully tax-free. SIPPs are accessible from age 57 (rising
                  to 58); ISAs can be accessed at any time. Many people hold both and use them
                  for different purposes. This calculator models ISA-style growth with no tax
                  deductions on withdrawal.
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
              <h2 className="calc-cta-h2">Track your ISA alongside your pensions, savings, and investments.</h2>
              <p className="calc-cta-sub">
                Paddock gives you one private dashboard for your full net worth — ISAs, SIPPs,
                savings accounts, property, and multi-currency holdings. No bank connection required.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    goTo('signup')
                    track('isa_cta_click', { location: 'bottom_cta' })
                  }}
                >
                  Start tracking — it&apos;s free
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
