import React, { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { calculateDrawdown } from './pensionCalc'

// ─── Analytics ───────────────────────────────────────────────────────────────
// Dispatches a DOM event — a no-op until the site wires an analytics listener.
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
  pot: '100000',
  currentAge: '45',
  retirementAge: '65',
  targetEndAge: '90',
  monthlyContribution: '500',
  annualReturn: '5',
  annualFee: '0.5',
  inflationRate: '2.5',
  lumpSum: '0',
  withdrawalMode: 'percentage',
  annualWithdrawalPct: '4',
  fixedMonthlyAmount: '1500',
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

function ModeToggle({ value, onChange }) {
  return (
    <div className="calc-mode-toggle" role="group" aria-label="Withdrawal mode">
      <button
        type="button"
        className={`calc-mode-btn${value === 'percentage' ? ' active' : ''}`}
        onClick={() => {
          onChange('percentage')
          track('mode_switch', { mode: 'percentage' })
        }}
        aria-pressed={value === 'percentage'}
      >
        % of pot
      </button>
      <button
        type="button"
        className={`calc-mode-btn${value === 'fixed' ? ' active' : ''}`}
        onClick={() => {
          onChange('fixed')
          track('mode_switch', { mode: 'fixed' })
        }}
        aria-pressed={value === 'fixed'}
      >
        Fixed monthly
      </button>
    </div>
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

function ComparisonRow({ rate, monthlyIncome, annualIncome, exhaustedAge, targetEndAge, isActive }) {
  const durationLabel =
    exhaustedAge !== null
      ? `Exhausted ~age ${exhaustedAge}`
      : `Lasts beyond age ${targetEndAge}`

  return (
    <div className={`calc-cmp-row${isActive ? ' active' : ''}`}>
      <div className="calc-cmp-rate">
        <span className="calc-cmp-rate-value">{rate}</span>
      </div>
      <div className="calc-cmp-income">
        <span className="calc-cmp-monthly">{fmt(monthlyIncome)}<span className="calc-cmp-per">/mo</span></span>
        <span className="calc-cmp-annual">{fmt(annualIncome)}/yr</span>
      </div>
      <div className={`calc-cmp-duration${exhaustedAge !== null ? ' depletes' : ' lasts'}`}>
        {durationLabel}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PensionDrawdownCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState([])
  const [hasCalculated, setHasCalculated] = useState(false)

  const setField = useCallback((key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const buildInputs = useCallback(() => ({
    pot: parseNum(form.pot),
    currentAge: parseNum(form.currentAge),
    retirementAge: parseNum(form.retirementAge),
    targetEndAge: parseNum(form.targetEndAge),
    monthlyContribution: parseNum(form.monthlyContribution),
    annualReturn: parsePct(form.annualReturn),
    annualFee: parsePct(form.annualFee),
    inflationRate: parsePct(form.inflationRate),
    lumpSum: parseNum(form.lumpSum),
    withdrawalMode: form.withdrawalMode,
    annualWithdrawalPct: parsePct(form.annualWithdrawalPct),
    fixedMonthlyAmount: parseNum(form.fixedMonthlyAmount),
  }), [form])

  const runCalculation = useCallback(() => {
    const inputs = buildInputs()
    const result = calculateDrawdown(inputs)
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
      track('calculate', {
        mode: form.withdrawalMode,
        retirementAge: form.retirementAge,
        withdrawalRate: form.withdrawalMode === 'percentage' ? form.annualWithdrawalPct : null,
      })
      // Scroll to results on mobile
      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById('calc-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
    }
  }

  const targetEndAge = parseNum(form.targetEndAge)

  return (
    <div className="landing-shell">
      <Helmet>
        <title>Pension Drawdown Calculator UK — How Long Will My Pension Last? | Paddock</title>
        <meta
          name="description"
          content="Free UK pension drawdown calculator. Enter your pot, retirement age and assumptions to project how long your pension could last — no login required."
        />
        <link rel="canonical" href="https://getpaddock.com/tools/pension-drawdown-calculator" />
        <meta property="og:title" content="Pension Drawdown Calculator UK | Paddock" />
        <meta
          property="og:description"
          content="Free UK pension drawdown calculator. Project how long your pension pot could last in drawdown, with a 3%/4%/5% comparison."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools/pension-drawdown-calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pension Drawdown Calculator UK | Paddock" />
        <meta
          name="twitter:description"
          content="Free UK pension drawdown calculator. Project how long your pension pot could last in drawdown, with a 3%/4%/5% comparison."
        />
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Pension planning tool</div>
          <h1 className="calc-h1">Pension drawdown calculator UK</h1>
          <p className="calc-subhead">
            Enter your pension pot, retirement age, and drawdown assumptions to see how
            far your pension could go — and how different withdrawal rates compare.
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

              {/* Group 1 */}
              <div className="calc-group">
                <div className="calc-group-title">Your pension</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Current pension pot" id="pot" prefix="£">
                    <NumInput
                      id="pot"
                      value={form.pot}
                      onChange={setField('pot')}
                      min="0"
                      step="1000"
                      prefix="£"
                      placeholder="100,000"
                    />
                  </CalcField>
                  <CalcField label="Current age" id="currentAge">
                    <NumInput
                      id="currentAge"
                      value={form.currentAge}
                      onChange={setField('currentAge')}
                      min="18"
                      max="80"
                      step="1"
                      placeholder="45"
                    />
                  </CalcField>
                  <CalcField label="Retirement age" id="retirementAge">
                    <NumInput
                      id="retirementAge"
                      value={form.retirementAge}
                      onChange={setField('retirementAge')}
                      min="18"
                      max="90"
                      step="1"
                      placeholder="65"
                    />
                  </CalcField>
                  <CalcField label="Target end age" id="targetEndAge" hint="Age to project drawdown to">
                    <NumInput
                      id="targetEndAge"
                      value={form.targetEndAge}
                      onChange={setField('targetEndAge')}
                      min="50"
                      max="100"
                      step="1"
                      placeholder="90"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 2 */}
              <div className="calc-group">
                <div className="calc-group-title">Contributions &amp; growth</div>
                <div className="calc-fields calc-fields-3">
                  <CalcField label="Monthly contribution" id="monthlyContribution" prefix="£">
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
                  <CalcField label="Annual return" id="annualReturn" hint="Before fees" suffix="%">
                    <NumInput
                      id="annualReturn"
                      value={form.annualReturn}
                      onChange={setField('annualReturn')}
                      min="0"
                      max="20"
                      step="0.1"
                      suffix="%"
                      placeholder="5"
                    />
                  </CalcField>
                  <CalcField label="Annual fee" id="annualFee" hint="Platform + fund OCF" suffix="%">
                    <NumInput
                      id="annualFee"
                      value={form.annualFee}
                      onChange={setField('annualFee')}
                      min="0"
                      max="5"
                      step="0.1"
                      suffix="%"
                      placeholder="0.5"
                    />
                  </CalcField>
                </div>
              </div>

              {/* Group 3 */}
              <div className="calc-group">
                <div className="calc-group-title">Drawdown</div>
                <div className="calc-field">
                  <label className="calc-label">Withdrawal mode</label>
                  <ModeToggle value={form.withdrawalMode} onChange={setField('withdrawalMode')} />
                </div>

                {form.withdrawalMode === 'percentage' ? (
                  <div className="calc-fields calc-fields-1">
                    <CalcField
                      label="Annual withdrawal rate"
                      id="annualWithdrawalPct"
                      hint="% of pot taken each year"
                      suffix="%"
                    >
                      <NumInput
                        id="annualWithdrawalPct"
                        value={form.annualWithdrawalPct}
                        onChange={setField('annualWithdrawalPct')}
                        min="0"
                        max="20"
                        step="0.5"
                        suffix="%"
                        placeholder="4"
                      />
                    </CalcField>
                  </div>
                ) : (
                  <div className="calc-fields calc-fields-1">
                    <CalcField
                      label="Fixed monthly withdrawal"
                      id="fixedMonthlyAmount"
                      hint="Flat amount each month (nominal)"
                      prefix="£"
                    >
                      <NumInput
                        id="fixedMonthlyAmount"
                        value={form.fixedMonthlyAmount}
                        onChange={setField('fixedMonthlyAmount')}
                        min="0"
                        step="100"
                        prefix="£"
                        placeholder="1500"
                      />
                    </CalcField>
                  </div>
                )}
              </div>

              {/* Group 4 */}
              <div className="calc-group">
                <div className="calc-group-title">Other assumptions</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Lump sum at retirement" id="lumpSum" hint="Taken before drawdown starts" prefix="£">
                    <NumInput
                      id="lumpSum"
                      value={form.lumpSum}
                      onChange={setField('lumpSum')}
                      min="0"
                      step="1000"
                      prefix="£"
                      placeholder="0"
                    />
                  </CalcField>
                  <CalcField label="Inflation rate" id="inflationRate" hint="For context only" suffix="%">
                    <NumInput
                      id="inflationRate"
                      value={form.inflationRate}
                      onChange={setField('inflationRate')}
                      min="0"
                      max="10"
                      step="0.1"
                      suffix="%"
                      placeholder="2.5"
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
                  Calculate projection
                </button>
              </div>
            </form>

            {/* ── Results ── */}
            <div className="calc-results-panel" id="calc-results">
              {!results && !hasCalculated ? (
                <div className="calc-results-empty">
                  <div className="calc-results-empty-icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect x="4" y="8" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 16h12M10 21h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="calc-results-empty-text">
                    Enter your assumptions and click <strong>Calculate projection</strong> to see your results.
                  </p>
                </div>
              ) : results ? (
                <div className="calc-results">
                  <div className="calc-results-header">
                    <div className="calc-results-title">Your projection</div>
                    <div className="calc-results-note">Based on your assumptions</div>
                  </div>

                  <div className="calc-stats">
                    <StatCard
                      label="Pot at retirement"
                      value={fmt(results.potAtRetirement)}
                      note={results.lumpSumApplied > 0 ? `Before ${fmt(results.lumpSumApplied)} lump sum` : null}
                      highlight
                    />
                    <StatCard
                      label="Starting monthly income"
                      value={fmt(results.monthlyIncome)}
                      note={`${fmt(results.annualIncome)} / year`}
                    />
                    {results.lumpSumApplied > 0 && (
                      <StatCard
                        label="Available for drawdown"
                        value={fmt(results.potAfterLumpSum)}
                        note="After lump sum"
                      />
                    )}
                  </div>

                  <div className="calc-longevity">
                    {results.exhaustedAge !== null ? (
                      <div className="calc-longevity-depletes">
                        <span className="calc-longevity-label">Pot exhausted at approximately</span>
                        <span className="calc-longevity-age">age {results.exhaustedAge}</span>
                        <span className="calc-longevity-note">
                          Based on your assumptions — {
                            results.exhaustedAge < targetEndAge
                              ? `${Math.round(targetEndAge - results.exhaustedAge)} years before your target end age`
                              : 'at your target end age'
                          }
                        </span>
                      </div>
                    ) : (
                      <div className="calc-longevity-survives">
                        <span className="calc-longevity-label">Pot may last beyond</span>
                        <span className="calc-longevity-age">age {targetEndAge}</span>
                        <span className="calc-longevity-note">
                          Remaining pot: {fmt(results.potAtTargetAge)} at age {targetEndAge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="calc-comparison">
                    <div className="calc-cmp-title">3% / 4% / 5% withdrawal comparison</div>
                    <div className="calc-cmp-head">
                      <span>Rate</span>
                      <span>Income</span>
                      <span>Longevity</span>
                    </div>
                    {results.comparison.map((row) => {
                      const isActive =
                        form.withdrawalMode === 'percentage' &&
                        Math.abs(parseFloat(form.annualWithdrawalPct) / 100 - row.rate) < 0.001
                      return (
                        <ComparisonRow
                          key={row.rate}
                          rate={row.rateLabel}
                          monthlyIncome={row.monthlyIncome}
                          annualIncome={row.annualIncome}
                          exhaustedAge={row.exhaustedAge}
                          targetEndAge={targetEndAge}
                          isActive={isActive}
                        />
                      )
                    })}
                  </div>

                  <p className="calc-disclaimer">
                    Illustrative only. Based on your assumptions, with monthly compounding. Returns and longevity are not guaranteed. Not financial advice.
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

            <h2 className="calc-guide-h2">How the calculator works</h2>
            <p className="calc-guide-p">
              The calculator runs in two phases. In the <strong>accumulation phase</strong>, it
              projects your current pot forward to your retirement age using monthly compounding.
              Your annual return is reduced by the fee rate before compounding, so a 5% gross
              return with a 0.5% annual fee compounds at a net 4.5%. Monthly contributions are
              added throughout.
            </p>
            <p className="calc-guide-p">
              In the <strong>drawdown phase</strong>, it simulates month-by-month withdrawals
              from your pot, with the remaining balance continuing to grow at the same net rate.
              The simulation runs until the pot is exhausted or until your target end age —
              whichever comes first. The 3% / 4% / 5% comparison runs the same simulation three
              times with different withdrawal rates so you can see how the rate choice affects longevity.
            </p>
            <p className="calc-guide-p">
              Inflation is shown in your assumptions but is not applied to the output figures.
              All income amounts are in today's nominal terms. In practice, the real purchasing
              power of a fixed drawdown amount will fall over time as prices rise.
            </p>

            <h2 className="calc-guide-h2">What is pension drawdown?</h2>
            <p className="calc-guide-p">
              Pension drawdown (formally flexi-access drawdown) lets you keep your pension pot
              invested after retirement and take withdrawals as you choose, rather than converting
              the pot into a guaranteed annuity income. You can take as much or as little as you
              want each year, subject to income tax on withdrawals above your personal allowance.
            </p>
            <p className="calc-guide-p">
              The key trade-off is flexibility versus certainty. Drawdown keeps your pot exposed
              to investment returns — which can work in your favour if markets perform well — but
              it also means the pot can be depleted if withdrawals are too high or returns
              disappoint. An annuity removes that longevity risk by guaranteeing income for life,
              but you lose the pot if you die early and have no flexibility to take more in some
              years and less in others.
            </p>
            <p className="calc-guide-p">
              Most people in drawdown use a blend: perhaps some guaranteed income from the State
              Pension and a defined-benefit scheme, with a separate drawdown pot for additional
              flexibility. This calculator models the drawdown pot in isolation.
            </p>

            <h2 className="calc-guide-h2">What affects how long your pension lasts?</h2>
            <p className="calc-guide-p">
              The longevity of a pension pot in drawdown depends on four main factors:
            </p>
            <ul className="calc-guide-ul">
              <li>
                <strong>Withdrawal rate.</strong> The most powerful lever. Taking 3% per year from
                a pot that earns 4.5% net allows the pot to grow. Taking 6% from the same pot
                depletes it steadily. Small changes in rate have large effects over decades.
              </li>
              <li>
                <strong>Investment return after fees.</strong> The net return is what matters —
                not the gross return. A 0.5% fee difference on a large pot can amount to tens of
                thousands of pounds over a long retirement.
              </li>
              <li>
                <strong>Sequence of returns.</strong> This calculator uses a constant average
                return, but in practice, a run of poor returns early in retirement is far more
                damaging than the same average return achieved in a different order. The average
                masks this risk.
              </li>
              <li>
                <strong>Inflation.</strong> A fixed nominal withdrawal amount buys less over time.
                If you hold your withdrawals flat in nominal terms, your real income falls each year
                inflation runs above zero.
              </li>
              <li>
                <strong>Lump sum.</strong> Taking a lump sum at retirement reduces the pot available
                for drawdown. A £25,000 tax-free lump sum on a £400,000 pot leaves £375,000 for
                income — roughly 6% less monthly income at a 4% drawdown rate.
              </li>
            </ul>

            <h2 className="calc-guide-h2">What do the 3%, 4%, and 5% comparisons mean?</h2>
            <p className="calc-guide-p">
              The comparison table shows what the same pot would produce at three common withdrawal
              rate benchmarks. These are not rules or recommendations — they are illustrative
              scenarios that help you see how rate choice affects both income and longevity.
            </p>
            <p className="calc-guide-p">
              The 4% figure is sometimes referred to in the context of historical research (notably
              the US-based "Trinity Study") which found that a 4% withdrawal rate had historically
              sustained a 30-year retirement across most market scenarios. That research used US data,
              assumed a specific asset allocation, and does not account for the UK tax position,
              State Pension income, or your personal circumstances. It is a starting point for
              thinking, not a guarantee.
            </p>
            <p className="calc-guide-p">
              Whether 3%, 4%, or 5% is appropriate for you depends on factors this calculator
              cannot know: your State Pension entitlement, other income sources, how long you might
              live, your risk tolerance, and what level of income you need. A lower withdrawal rate
              generally gives more longevity margin but lower early income; a higher rate gives more
              income but less buffer against a long retirement or poor returns.
            </p>

            <div className="calc-guide-note">
              <strong>Important:</strong> All outputs are illustrative only. This calculator models
              a simplified scenario based on the assumptions you enter. It does not account for
              taxes, the State Pension, changes in contributions or withdrawals, or sequencing risk.
              It is not financial advice. If you are planning your retirement income, consider
              speaking with a regulated financial adviser.
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
                <h3>How long will my pension last?</h3>
                <p>
                  It depends on how much you withdraw each year, what your pot earns net of fees,
                  and how large the pot is when drawdown begins. Use the calculator above to model
                  your specific numbers — and run the 3% / 4% / 5% comparison to see how
                  sensitive the result is to your withdrawal rate.
                </p>
              </div>

              <div className="faq-card">
                <h3>What is pension drawdown?</h3>
                <p>
                  Drawdown (flexi-access drawdown) lets you keep your pension pot invested after
                  retirement and take withdrawals as needed, rather than converting to an annuity.
                  You stay invested, your pot can grow, but it can also be depleted if withdrawals
                  outpace returns over time.
                </p>
              </div>

              <div className="faq-card">
                <h3>Is 4% a rule or a guarantee?</h3>
                <p>
                  Neither. It is a benchmark derived from historical US market data, sometimes
                  called the "4% guideline." It suggests that withdrawing 4% in year one and
                  adjusting for inflation has historically lasted 30 years across most scenarios.
                  It is not guaranteed, does not account for UK specifics, and should be treated
                  as a rough reference point only.
                </p>
              </div>

              <div className="faq-card">
                <h3>How much can I take from my pension each month?</h3>
                <p>
                  There is no legal cap on how much you can withdraw from a flexi-access drawdown
                  pension. Withdrawals above your personal allowance are subject to income tax at
                  your marginal rate. The practical limit is how much your pot can sustain before
                  it depletes — which is what this calculator helps you think through.
                </p>
              </div>

              <div className="faq-card">
                <h3>What affects drawdown longevity most?</h3>
                <p>
                  Withdrawal rate and net investment return are the two dominant factors. A pot
                  earning 4.5% net with a 3% withdrawal rate will tend to grow. The same pot
                  with a 6% withdrawal rate will steadily deplete. Inflation erodes the real
                  value of fixed withdrawals over time, and a poor sequence of early returns can
                  be permanently damaging in a way that averages do not capture.
                </p>
              </div>

              <div className="faq-card">
                <h3>Does this calculator account for taxes?</h3>
                <p>
                  No. The calculator models gross pot and gross income figures. In practice,
                  pension withdrawals above your personal allowance are taxed as income. The
                  25% tax-free lump sum (or tax-free cash) is also not modelled — you can
                  approximate this by entering a lump sum in the "other assumptions" section.
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
              <h2 className="calc-cta-h2">Save this projection and track it over time.</h2>
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
                    track('cta_click', { location: 'bottom_cta' })
                  }}
                >
                  Start planning — it&apos;s free
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigateTo('/track-isas-pensions-savings')}
                >
                  How Paddock handles pensions
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
