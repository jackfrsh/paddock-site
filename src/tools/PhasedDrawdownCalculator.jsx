import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { calculatePhasedDrawdown, LATE_PHASE_AGE } from './phasedDrawdownCalc'

function track(event, data = {}) {
  try {
    window.dispatchEvent(new CustomEvent('paddock:calc', { detail: { event, ...data } }))
  } catch {
    /* Analytics is optional. */
  }
}

function fmt(n) {
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtCompact(n) {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1000) return `£${Math.round(n / 1000)}k`
  return `£${Math.round(n)}`
}

function fmtPct(fraction) {
  if (!Number.isFinite(fraction)) return '—'
  return `${(fraction * 100).toFixed(1)}%`
}

function cleanNumber(value) {
  if (value === '' || value === null || value === undefined) return NaN
  const number = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(number) ? number : NaN
}

const DEFAULTS = {
  currentAge: '46',
  retirementAge: '62',
  statePensionAge: '68',
  planningAge: '95',
  currentPot: '500000',
  expectedReturn: '5',
  inflation: '2.5',
  statePensionAmount: '12548',
  incomeEarly: '40000',
  incomeMid: '40000',
  incomeLate: '30000',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I retire before State Pension age?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on whether your private pension and other savings can fund the years between stopping work and your State Pension starting. This calculator estimates that "bridge" and shows whether your pot is likely to last.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is phased pension drawdown?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Phased drawdown means planning for different levels of retirement income at different ages — typically more in the early, active years and less later. It can reduce the total pot you need compared with assuming a flat income for life.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is retirement spending really lower later in life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Research and many real-world retirement plans suggest spending often falls in later retirement as travel and activity reduce. It is not guaranteed, and care costs can rise, so this is an assumption to test rather than a rule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator financial advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This is an educational tool that produces estimates in today’s money. It is not regulated financial advice and does not account for tax, charges or your full circumstances.',
      },
    },
  ],
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

function NumInput({ id, value, onChange, min, max, step = 'any', prefix, suffix }) {
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
    />
  )
}

function StatCard({ label, value, note, highlight, tone }) {
  return (
    <div className={`calc-stat${highlight ? ' calc-stat-highlight' : ''}${tone ? ` phased-stat-${tone}` : ''}`}>
      <div className="calc-stat-value">{value}</div>
      <div className="calc-stat-label">{label}</div>
      {note ? <div className="calc-stat-note">{note}</div> : null}
    </div>
  )
}

function ToolLink({ href, children, navigateTo }) {
  return (
    <a
      href={href}
      className="guide-link-card"
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
          e.preventDefault()
          navigateTo(href)
        }
      }}
    >
      {children}
    </a>
  )
}

/**
 * Lightweight, dependency-free responsive SVG chart of projected pot balance
 * by age, with markers for State Pension age and the age-75 phase boundary.
 */
function PotChart({ series, retirementAge, statePensionAge, planningAge, exhaustedAge }) {
  if (!series || series.length < 2) return null

  const W = 720
  const H = 300
  const padL = 16
  const padR = 16
  const padT = 18
  const padB = 30

  const minAge = retirementAge
  const maxAge = planningAge
  const maxPot = Math.max(...series.map((p) => p.pot), 1)

  const x = (age) => padL + ((age - minAge) / (maxAge - minAge)) * (W - padL - padR)
  const y = (pot) => padT + (1 - pot / maxPot) * (H - padT - padB)

  const linePoints = series.map((p) => `${x(p.age).toFixed(1)},${y(p.pot).toFixed(1)}`).join(' ')
  const areaPoints = `${x(minAge).toFixed(1)},${(H - padB).toFixed(1)} ${linePoints} ${x(maxAge).toFixed(1)},${(H - padB).toFixed(1)}`

  // Y gridlines at 0 / 25 / 50 / 75 / 100% of max
  const gridYs = [0, 0.25, 0.5, 0.75, 1]
  // X labels: a handful of evenly spaced ages
  const ageSpan = maxAge - minAge
  const xLabels = [minAge, statePensionAge, LATE_PHASE_AGE, maxAge].filter(
    (a, i, arr) => a >= minAge && a <= maxAge && arr.indexOf(a) === i
  )

  const markerColour = 'rgba(196, 163, 90, 0.55)'

  return (
    <div className="phased-chart" role="img" aria-label={`Projected pension pot balance from age ${retirementAge} to ${planningAge}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="phased-chart-svg">
        <defs>
          <linearGradient id="potFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(75, 121, 168, 0.34)" />
            <stop offset="100%" stopColor="rgba(75, 121, 168, 0.02)" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {gridYs.map((g) => (
          <line
            key={g}
            x1={padL}
            x2={W - padR}
            y1={padT + (1 - g) * (H - padT - padB)}
            y2={padT + (1 - g) * (H - padT - padB)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* State Pension + age-75 markers */}
        {statePensionAge > minAge && statePensionAge < maxAge ? (
          <line x1={x(statePensionAge)} x2={x(statePensionAge)} y1={padT} y2={H - padB} stroke={markerColour} strokeWidth="1" strokeDasharray="4 4" />
        ) : null}
        {LATE_PHASE_AGE > minAge && LATE_PHASE_AGE < maxAge ? (
          <line x1={x(LATE_PHASE_AGE)} x2={x(LATE_PHASE_AGE)} y1={padT} y2={H - padB} stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="4 4" />
        ) : null}

        {/* area + line */}
        <polygon points={areaPoints} fill="url(#potFill)" />
        <polyline points={linePoints} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* exhaustion marker */}
        {exhaustedAge && exhaustedAge > minAge && exhaustedAge < maxAge ? (
          <circle cx={x(exhaustedAge)} cy={y(0)} r="4" fill="#d4893a" />
        ) : null}
      </svg>

      {/* axis labels rendered as HTML for crisp text under a non-uniform svg scale */}
      <div className="phased-chart-xaxis">
        {xLabels.map((a) => (
          <span key={a} className="phased-chart-xlabel" style={{ left: `${((a - minAge) / ageSpan) * 100}%` }}>
            {a}
          </span>
        ))}
      </div>
      <div className="phased-chart-legend">
        <span className="phased-legend-item"><span className="phased-legend-swatch swatch-pot" /> Projected pot</span>
        <span className="phased-legend-item"><span className="phased-legend-marker marker-sp" /> State Pension ({statePensionAge})</span>
        <span className="phased-legend-item"><span className="phased-legend-marker marker-75" /> Age {LATE_PHASE_AGE}</span>
      </div>
    </div>
  )
}

function ResultPanel({ result }) {
  const [tableOpen, setTableOpen] = useState(false)

  if (!result.ok) {
    return (
      <div className="calc-results-empty">
        <p className="calc-results-empty-text">Check the inputs on the left and your phased plan will appear here.</p>
      </div>
    )
  }

  const { inputs } = result
  const lasts = result.exhaustedAge === null
  const headline = lasts
    ? `Your pot is projected to last to age ${inputs.planningAge}`
    : `Your pot is projected to run out at age ${result.exhaustedAge}`

  const headlineCopy = lasts
    ? `On these assumptions, you could fund this phased plan and still have around ${fmt(result.remainingAtPlanning)} left at age ${inputs.planningAge} (in today's money).`
    : `On these assumptions, the phased plan runs short ${result.exhaustedAge - inputs.retirementAge} years into retirement. Lowering early income, retiring a little later, or growing the pot would help.`

  const cmp = result.comparison
  let phasedImpactCopy
  if (cmp.drawSavings > 0 && lasts && result.flat.exhaustedAge === null) {
    phasedImpactCopy = `Because your income need falls later, the phased plan draws ${fmt(cmp.drawSavings)} less from your pot over retirement and leaves about ${fmt(Math.max(0, cmp.extraAtPlanning))} more at age ${inputs.planningAge} than a flat ${fmt(inputs.incomeEarly)}-for-life plan.`
  } else if (cmp.yearsLonger > 0) {
    phasedImpactCopy = `Because your income need falls later, the phased plan's pot lasts about ${cmp.yearsLonger} year${cmp.yearsLonger === 1 ? '' : 's'} longer than a flat ${fmt(inputs.incomeEarly)}-for-life plan.`
  } else if (cmp.drawSavings > 0) {
    phasedImpactCopy = `The phased plan draws ${fmt(cmp.drawSavings)} less from your pot over retirement than a flat ${fmt(inputs.incomeEarly)}-for-life plan.`
  } else {
    phasedImpactCopy = `Your phases are level, so this plan matches a flat ${fmt(inputs.incomeEarly)}-for-life income. Lower your later-life income to see the phased advantage.`
  }

  return (
    <div className="calc-results">
      <div className="calc-results-header">
        <div className="calc-results-title">Your phased plan</div>
        <div className="calc-results-note">Today&apos;s money</div>
      </div>

      <div className={`bridge-result-callout ${lasts ? '' : 'shortfall'}`}>
        <div className="bridge-result-title">{headline}</div>
        <p>{headlineCopy}</p>
      </div>

      <PotChart
        series={result.series}
        retirementAge={inputs.retirementAge}
        statePensionAge={inputs.statePensionAge}
        planningAge={inputs.planningAge}
        exhaustedAge={result.exhaustedAge}
      />

      <div className="calc-stats phased-stats">
        <StatCard
          label="Your retirement bridge"
          value={result.bridgeYears > 0 ? `${result.bridgeYears} yr${result.bridgeYears === 1 ? '' : 's'}` : 'No bridge'}
          note={result.bridgeYears > 0
            ? `From ${inputs.retirementAge} to ${inputs.statePensionAge}, funded by your pot. About ${fmt(result.bridgeFundingBeforeGrowth)} before growth.`
            : 'Your State Pension starts at or before retirement.'}
        />
        <StatCard
          label="Private income needed after State Pension"
          value={fmt(result.privateIncomeAfterStatePension)}
          note={`Once your ${fmt(inputs.statePension)} State Pension begins, drawdown falls to this.`}
        />
        <StatCard
          label={lasts ? `Projected pot at age ${inputs.planningAge}` : 'Pot runs out at'}
          value={lasts ? fmt(result.remainingAtPlanning) : `Age ${result.exhaustedAge}`}
          highlight
          tone={lasts ? 'good' : 'warn'}
        />
        <StatCard
          label="Phased vs flat income"
          value={cmp.drawSavings > 0 ? `${fmt(cmp.drawSavings)} less drawn` : 'Level plan'}
          note={phasedImpactCopy}
        />
        <StatCard
          label="Highest-risk period"
          value={result.bridgeYears > 0 ? `Age ${inputs.retirementAge}–${inputs.statePensionAge}` : `Early retirement`}
          note="Before State Pension your pot carries the full income. Highest drawdown rate: "
        />
        <StatCard
          label="Peak / average drawdown rate"
          value={`${fmtPct(result.highestDrawdownPct)} / ${fmtPct(result.averageDrawdownPct)}`}
          note="Share of the pot withdrawn in the peak year and on average. Below ~4% is often considered cautious."
        />
      </div>

      <button
        type="button"
        className="bridge-advanced-toggle phased-table-toggle"
        onClick={() => setTableOpen((o) => !o)}
        aria-expanded={tableOpen}
      >
        Year-by-year breakdown
        <span>{tableOpen ? 'Hide' : 'Show'}</span>
      </button>

      {tableOpen ? (
        <div className="phased-table-wrap">
          <table className="phased-table">
            <thead>
              <tr>
                <th>Age</th>
                <th>Start pot</th>
                <th>Income</th>
                <th>State Pension</th>
                <th>Drawdown</th>
                <th>End pot</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.age} className={row.depleted ? 'phased-row-depleted' : ''}>
                  <td>{row.age}</td>
                  <td>{fmtCompact(row.startingPot)}</td>
                  <td>{fmtCompact(row.incomeTarget)}</td>
                  <td>{row.statePension > 0 ? fmtCompact(row.statePension) : '—'}</td>
                  <td>{fmtCompact(row.privateDraw)}</td>
                  <td>{fmtCompact(row.endingPot)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="calc-disclaimer">
        Estimates in today&apos;s money using a real return of {fmtPct(result.realReturn)}. Not financial advice;
        excludes tax, charges and future changes to pension rules.
      </p>
    </div>
  )
}

export default function PhasedDrawdownCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const result = useMemo(() => calculatePhasedDrawdown(form), [form])
  const currentAge = cleanNumber(form.currentAge)
  const retirementAge = cleanNumber(form.retirementAge)

  const setField = (key) => (value) => {
    setForm((current) => {
      const next = { ...current, [key]: value }
      // Gently keep retirement age at/after current age, and planning age after retirement.
      if (key === 'currentAge') {
        const c = cleanNumber(value)
        const ret = cleanNumber(next.retirementAge)
        if (Number.isFinite(c) && Number.isFinite(ret) && ret < c) next.retirementAge = String(c)
      }
      if (key === 'retirementAge') {
        const ret = cleanNumber(value)
        const plan = cleanNumber(next.planningAge)
        if (Number.isFinite(ret) && Number.isFinite(plan) && plan <= ret) next.planningAge = String(ret + 1)
      }
      return next
    })
  }

  const relatedTools = [
    ['/tools/pension-drawdown-calculator', 'Pension Drawdown Calculator'],
    ['/tools/retirement-bridge-calculator', 'ISA Retirement Bridge Calculator'],
    ['/tools/fire-number-calculator', 'FIRE Number Calculator'],
    ['/tools/net-worth-calculator', 'Net Worth Calculator'],
  ]

  return (
    <div className="landing-shell">
      <Helmet>
        <title>Phased Pension Drawdown Calculator UK | Paddock</title>
        <meta
          name="description"
          content="Free UK pension drawdown calculator with phased income — more early, less later. Model your bridge to State Pension and see if you can retire early."
        />
        <link rel="canonical" href="https://getpaddock.com/tools/phased-drawdown-calculator" />
        <meta property="og:title" content="Phased Pension Drawdown Calculator UK | Paddock" />
        <meta
          property="og:description"
          content="Free UK pension drawdown calculator with phased income — more early, less later. Model your bridge to State Pension and see if you can retire early."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools/phased-drawdown-calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Phased Pension Drawdown Calculator UK | Paddock" />
        <meta
          name="twitter:description"
          content="Free UK pension drawdown calculator with phased income — more early, less later. Model your bridge to State Pension and see if you can retire early."
        />
        <script type="application/ld+json">{JSON.stringify(FAQ_LD)}</script>
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Phased pension drawdown calculator</div>
          <h1 className="calc-h1">Can you retire before State Pension?</h1>
          <p className="calc-subhead">
            Most calculators assume you need the same income for life. This one models retirement in
            phases — more in your active early years, less later — and shows how you bridge the gap
            to your State Pension.
          </p>
          <p className="calc-trust">
            No bank connection. No login. Your numbers are worked out in your browser and never sent anywhere.
          </p>
        </div>
      </section>

      <section className="calc-section">
        <div className="container">
          <div className="calc-layout bridge-layout">
            <form className="calc-form-card" noValidate>
              <div className="calc-group">
                <div className="calc-group-title">Your timeline</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Current age" id="currentAge">
                    <NumInput id="currentAge" value={form.currentAge} onChange={setField('currentAge')} min="18" max="80" step="1" />
                  </CalcField>
                  <CalcField label="Planned retirement age" id="retirementAge">
                    <NumInput
                      id="retirementAge"
                      value={form.retirementAge}
                      onChange={setField('retirementAge')}
                      min={Number.isFinite(currentAge) ? String(currentAge) : '18'}
                      max="90"
                      step="1"
                    />
                  </CalcField>
                  <CalcField
                    label="State Pension age"
                    id="statePensionAge"
                    hint="Depends on your birth date and future rules — check yours on GOV.UK."
                  >
                    <NumInput id="statePensionAge" value={form.statePensionAge} onChange={setField('statePensionAge')} min="60" max="75" step="1" />
                  </CalcField>
                  <CalcField label="Planning age" id="planningAge" hint="How long the plan should last (life expectancy).">
                    <NumInput
                      id="planningAge"
                      value={form.planningAge}
                      onChange={setField('planningAge')}
                      min={Number.isFinite(retirementAge) ? String(retirementAge + 1) : '60'}
                      max="105"
                      step="1"
                    />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Your pot &amp; assumptions</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Current pension / retirement pot" id="currentPot" prefix="£">
                    <NumInput id="currentPot" value={form.currentPot} onChange={setField('currentPot')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField label="Estimated annual State Pension" id="statePensionAmount" hint="Full new State Pension is around £12,548." prefix="£">
                    <NumInput id="statePensionAmount" value={form.statePensionAmount} onChange={setField('statePensionAmount')} min="0" step="100" prefix="£" />
                  </CalcField>
                  <CalcField label="Expected annual return" id="expectedReturn" hint="Nominal, before inflation." suffix="%">
                    <NumInput id="expectedReturn" value={form.expectedReturn} onChange={setField('expectedReturn')} min="0" max="15" step="0.1" suffix="%" />
                  </CalcField>
                  <CalcField label="Inflation assumption" id="inflation" hint="Results are shown in today's money." suffix="%">
                    <NumInput id="inflation" value={form.inflation} onChange={setField('inflation')} min="0" max="10" step="0.1" suffix="%" />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Phased income (today&apos;s money)</div>
                <div className="calc-fields calc-fields-1 phased-income-fields">
                  <CalcField
                    label={`Phase 1 — retirement to State Pension (${form.retirementAge}–${form.statePensionAge})`}
                    id="incomeEarly"
                    prefix="£"
                  >
                    <NumInput id="incomeEarly" value={form.incomeEarly} onChange={setField('incomeEarly')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField
                    label={`Phase 2 — State Pension to 75 (${form.statePensionAge}–${LATE_PHASE_AGE})`}
                    id="incomeMid"
                    prefix="£"
                  >
                    <NumInput id="incomeMid" value={form.incomeMid} onChange={setField('incomeMid')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField
                    label={`Phase 3 — age ${LATE_PHASE_AGE} onwards`}
                    id="incomeLate"
                    prefix="£"
                  >
                    <NumInput id="incomeLate" value={form.incomeLate} onChange={setField('incomeLate')} min="0" step="1000" prefix="£" />
                  </CalcField>
                </div>
              </div>

              {!result.ok ? (
                <div className="calc-errors" role="alert">
                  {result.errors.map((error) => <div key={error} className="calc-error-item">{error}</div>)}
                </div>
              ) : null}
            </form>

            <div className="calc-results-panel bridge-results-panel" id="phased-drawdown-results">
              <ResultPanel result={result} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <div className="calc-cta-block">
            <h2 className="calc-cta-h2">Track this retirement plan against your real net worth.</h2>
            <p className="calc-cta-sub">
              Paddock is a calm, private dashboard for your pensions, ISAs, cash, investments and
              property — so you can watch your real pot move towards a plan like this one. No bank linking.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  goTo('signup')
                  track('phased_drawdown_cta_click', { location: 'mid_cta' })
                }}
              >
                Save this retirement plan in Paddock
              </button>
              <a
                href="/"
                className="btn btn-secondary"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}
              >
                Explore Paddock
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section calc-guide-section">
          <article className="calc-guide">
            <h2 className="calc-guide-h2">Pension drawdown calculator UK</h2>
            <p className="calc-guide-p">
              This is a free, UK-focused pension drawdown calculator with one important difference: it
              does not assume you need the same income every year for the rest of your life. Instead it
              models <strong>phased drawdown</strong> — different income in different stages of retirement —
              and works everything out in today&apos;s money so the numbers stay meaningful. Enter your pot,
              the age you&apos;d like to stop work, your State Pension details and what you&apos;d like to spend in
              each phase, and the projection updates instantly in your browser.
            </p>

            <h2 className="calc-guide-h2">Can you retire before State Pension?</h2>
            <p className="calc-guide-p">
              For many people the real question is not &ldquo;how big is my pension?&rdquo; but &ldquo;can I afford to stop
              working before my State Pension starts?&rdquo; State Pension age in the UK is currently rising and
              now sits at 66, moving to 67 between 2026 and 2028, with further increases planned. If you want
              to finish work in your late fifties or early sixties, your private pension and other savings have
              to carry the full cost of those early years on their own. This calculator makes that gap explicit
              and tells you whether your pot is likely to stretch.
            </p>

            <h2 className="calc-guide-h2">Why retirement spending may not be flat</h2>
            <p className="calc-guide-p">
              Traditional retirement planning assumes a single, flat income for thirty or more years. Real life
              is rarely like that. Many retirees spend more in the early, active years — travel, hobbies, helping
              family, doing the things work never allowed time for — and gradually spend less as they slow down.
              Spending often dips through the seventies and eighties before, for some, rising again if care is
              needed later. Planning a single flat number can therefore overstate how much you need, and may keep
              people working longer than necessary.
            </p>
            <p className="calc-guide-p">
              This tool lets you set three phases: an active early phase from retirement to State Pension age, a
              middle phase once the State Pension is helping with the bills, and a later phase from age 75. You can
              keep them equal if you prefer a flat plan, or taper the later phases down to see the effect.
            </p>

            <h2 className="calc-guide-h2">What is a retirement bridge?</h2>
            <p className="calc-guide-p">
              A retirement bridge is the money that carries you from the day you stop working to the day a new
              income source — usually the State Pension — begins. If you retire at 62 and your State Pension starts
              at 68, you have a six-year bridge to fund entirely yourself. At £40,000 a year that bridge alone needs
              roughly £240,000 before any investment growth. The calculator shows your bridge length and its cost,
              then continues the projection through to your planning age so you can see the whole picture, not just
              the gap.
            </p>

            <h2 className="calc-guide-h2">Why phased drawdown can reduce the pot you need</h2>
            <p className="calc-guide-p">
              Because money withdrawn early loses the most future growth, trimming income in the later phases can
              have a surprisingly large effect. A plan that takes £40,000 until 75 and then £30,000 can leave
              significantly more in the pot at the planning age — or last several years longer — than a flat
              £40,000-for-life plan, even though the early years look identical. The calculator runs both versions
              side by side and shows you the difference, so you can judge whether a phased approach gives you the
              freedom to retire earlier or to draw a little more while you&apos;re young enough to enjoy it.
            </p>

            <h2 className="calc-guide-h2">Important limitations</h2>
            <p className="calc-guide-p">
              This is an educational tool, not financial advice. Results are estimates and depend heavily on
              investment returns, inflation, charges, tax and future pension rules — all of which are uncertain.
              It models steady real returns rather than the ups and downs of real markets, and it does not account
              for the order in which returns arrive, which matters in drawdown. State Pension age and the State
              Pension amount can change. Pension withdrawals may be taxable depending on how and when you take them.
              For a decision as significant as when to retire, it is worth speaking to a regulated financial adviser.
            </p>

            <div className="calc-guide-note">
              Educational information only, shown in today&apos;s money. It does not account for tax, charges,
              sequence-of-returns risk, benefit entitlement or your full personal circumstances.
            </div>
          </article>
        </div>
      </section>

      <section className="section-border">
        <div className="container section calc-guide-section">
          <div className="calc-guide">
            <h2 className="calc-guide-h2">Common questions</h2>
            <div className="faq-grid">
              <div className="faq-card">
                <h3>Can I retire before State Pension age?</h3>
                <p>You can, if your private pension and savings can fund the years before it starts. This calculator estimates that bridge and whether your pot lasts.</p>
              </div>
              <div className="faq-card">
                <h3>What is phased pension drawdown?</h3>
                <p>Planning different income levels at different ages — typically more early, less later — which can reduce the total pot you need.</p>
              </div>
              <div className="faq-card">
                <h3>Is spending really lower later in life?</h3>
                <p>Often, yes, as activity reduces — but it isn&apos;t guaranteed and care costs can rise, so treat it as an assumption to test.</p>
              </div>
              <div className="faq-card">
                <h3>Is this financial advice?</h3>
                <p>No. It is an educational estimate in today&apos;s money and excludes tax, charges and your full circumstances.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <div className="calc-guide">
            <h2 className="calc-guide-h2">Related tools</h2>
            <div className="guide-links">
              {relatedTools.map(([href, label]) => (
                <ToolLink key={href} href={href} navigateTo={navigateTo}>{label} →</ToolLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
