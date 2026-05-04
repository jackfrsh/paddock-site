import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { calculateRetirementBridge } from './retirementBridgeCalc'

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

function fmtYears(n) {
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return 'No gap'
  return `${n} ${n === 1 ? 'year' : 'years'}`
}

function cleanNumber(value) {
  if (value === '' || value === null || value === undefined) return NaN
  const number = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(number) ? number : NaN
}

const DEFAULTS = {
  currentAge: '46',
  retirementAge: '55',
  privatePensionAccessAge: '57',
  statePensionAge: '67',
  annualSpendingToday: '30000',
  currentBridgeAssets: '40000',
  monthlyBridgeContribution: '500',
  expectedAnnualGrowth: '5',
  inflationAssumption: '2.5',
  partTimeAnnualIncome: '0',
  safetyBuffer: '10',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a retirement bridge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A retirement bridge is the accessible savings you use between stopping work and the point when pension income becomes available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use an ISA to retire before pension age?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An ISA can be part of an early retirement bridge because it is generally accessible before private pension age, but whether it is suitable depends on your wider circumstances.',
      },
    },
    {
      '@type': 'Question',
      name: 'What age can I access my private pension in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most people can currently access private pensions from 55. The normal minimum pension age rises to 57 from 6 April 2028, although protected pension ages and scheme rules can differ.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is State Pension age the same as pension access age?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. State Pension age is separate from private pension access age. Check your exact State Pension age on GOV.UK.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator financial advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This calculator provides educational information only and is not financial advice.',
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

function StatCard({ label, value, note, highlight }) {
  return (
    <div className={`calc-stat${highlight ? ' calc-stat-highlight' : ''}`}>
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

function BridgeTimeline({ form }) {
  const currentAge = cleanNumber(form.currentAge)
  const retirementAge = cleanNumber(form.retirementAge)
  const privateAge = cleanNumber(form.privatePensionAccessAge)
  const stateAge = cleanNumber(form.statePensionAge)

  return (
    <div className="bridge-timeline" aria-label="Retirement bridge timeline">
      <div className="bridge-line" aria-hidden="true" />
      {[
        ['Current age', currentAge],
        ['Stop work', retirementAge],
        ['Private pension', privateAge],
        ['State Pension', stateAge],
      ].map(([label, age]) => (
        <div className="bridge-step" key={label}>
          <span className="bridge-dot" />
          <span className="bridge-step-label">{label}</span>
          <span className="bridge-step-age">{Number.isFinite(age) ? `Age ${age}` : '—'}</span>
        </div>
      ))}
    </div>
  )
}

function ResultPanel({ result, form }) {
  if (!result.ok) {
    return (
      <div className="calc-results-empty">
        <p className="calc-results-empty-text">Check the inputs above and the estimate will update here.</p>
      </div>
    )
  }

  const retirementAge = cleanNumber(form.retirementAge)
  const surplus = result.surplusOrShortfall >= 0
  const resultTitle =
    result.status === 'no_bridge_needed'
      ? 'No private pension bridge needed'
      : result.status === 'shortfall'
        ? 'You may have a bridge shortfall'
        : result.status === 'close'
          ? 'Your bridge looks close'
          : 'Your bridge looks covered'
  const resultCopy =
    result.status === 'no_bridge_needed'
      ? 'Your planned stop-work age is at or after your pension access age.'
      : result.status === 'shortfall'
        ? `You may need around ${fmt(Math.abs(result.surplusOrShortfall))} more by age ${retirementAge} to cover the gap to pension access.`
        : `You may have around ${fmt(result.projectedBridgePotAtRetirement)} by age ${retirementAge}, against an estimated bridge need of ${fmt(result.requiredBridgePot)}.`

  return (
    <div className="calc-results">
      <div className="calc-results-header">
        <div className="calc-results-title">Your bridge estimate</div>
        <div className="calc-results-note">Based on your assumptions</div>
      </div>

      <div className={`bridge-result-callout ${result.status}`}>
        <div className="bridge-result-title">{resultTitle}</div>
        <p>{resultCopy}</p>
      </div>

      <BridgeTimeline form={form} />

      <div className="calc-stats bridge-stats">
        <StatCard label="Bridge gap" value={fmtYears(result.bridgeYears)} />
        <StatCard label="Estimated bridge need" value={fmt(result.requiredBridgePot)} />
        <StatCard label="Projected bridge assets" value={fmt(result.projectedBridgePotAtRetirement)} />
        <StatCard
          label="Surplus / shortfall"
          value={result.status === 'no_bridge_needed'
            ? 'No bridge needed'
            : `${fmt(Math.abs(result.surplusOrShortfall))} ${surplus ? 'surplus' : 'shortfall'}`}
          highlight
        />
        <StatCard
          label="Inflation-adjusted annual spending"
          value={fmt(result.annualSpendingAtRetirement)}
          note={`At planned stop-work age ${retirementAge}`}
        />
        {result.status === 'shortfall' ? (
          <StatCard
            label="Estimated extra monthly contribution needed"
            value={fmt(result.monthlyContributionNeeded)}
            note="From now until your planned stop-work age"
          />
        ) : null}
      </div>

      <p className="calc-disclaimer">
        This is not a retirement income plan. It is a simple estimate of the accessible assets
        you may need before pension income starts.
      </p>
    </div>
  )
}

export default function RetirementBridgeCalculator({ navigateTo, goTo }) {
  const [form, setForm] = useState(DEFAULTS)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const result = useMemo(() => calculateRetirementBridge(form), [form])
  const currentAge = cleanNumber(form.currentAge)

  const setField = (key) => (value) => {
    setForm((current) => {
      const next = { ...current, [key]: value }
      if (key === 'currentAge') {
        const nextCurrentAge = cleanNumber(value)
        const nextRetirementAge = cleanNumber(next.retirementAge)
        if (Number.isFinite(nextCurrentAge) && Number.isFinite(nextRetirementAge) && nextRetirementAge < nextCurrentAge) {
          next.retirementAge = String(nextCurrentAge)
        }
      }
      return next
    })
  }

  const relatedTools = [
    ['/tools/pension-drawdown-calculator', 'Pension Drawdown Calculator'],
    ['/tools/fire-number-calculator', 'FIRE Number Calculator'],
    ['/tools/isa-growth-calculator', 'ISA Growth Calculator'],
    ['/tools/net-worth-calculator', 'Net Worth Calculator'],
  ]

  return (
    <div className="landing-shell">
      <Helmet>
        <title>ISA Retirement Bridge Calculator UK | Paddock</title>
        <meta
          name="description"
          content="Estimate how much you may need in ISA, cash or other accessible savings to bridge the gap between stopping work and accessing pension income."
        />
        <link rel="canonical" href="https://getpaddock.com/tools/retirement-bridge-calculator" />
        <meta property="og:title" content="ISA Retirement Bridge Calculator UK | Paddock" />
        <meta
          property="og:description"
          content="Estimate how much you may need in ISA, cash or other accessible savings to bridge the gap between stopping work and accessing pension income."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools/retirement-bridge-calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ISA Retirement Bridge Calculator UK | Paddock" />
        <meta
          name="twitter:description"
          content="Estimate the accessible savings you may need between stopping work and pension access."
        />
        <script type="application/ld+json">{JSON.stringify(FAQ_LD)}</script>
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Retirement bridge calculator</div>
          <h1 className="calc-h1">Can your ISA bridge you to retirement?</h1>
          <p className="calc-subhead">
            Estimate the savings you may need outside your pension to cover the gap between the
            age you want to stop work and the age your pension income begins.
          </p>
          <p className="calc-trust">
            No bank connection. No login required. Built for UK retirement planning.
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
                  <CalcField label="Age you want to stop work" id="retirementAge">
                    <NumInput
                      id="retirementAge"
                      value={form.retirementAge}
                      onChange={setField('retirementAge')}
                      min={Number.isFinite(currentAge) ? String(currentAge) : '18'}
                      max="80"
                      step="1"
                    />
                  </CalcField>
                  <CalcField
                    label="Private pension access age"
                    id="privatePensionAccessAge"
                    hint="Most people will be able to access private pensions from 57 from 6 April 2028, though protected pension ages and scheme rules can differ."
                  >
                    <NumInput id="privatePensionAccessAge" value={form.privatePensionAccessAge} onChange={setField('privatePensionAccessAge')} min="55" max="75" step="1" />
                  </CalcField>
                  <CalcField
                    label="State Pension age"
                    id="statePensionAge"
                    hint="The State Pension age is rising to 67 between 2026 and 2028. Users should check their exact age on GOV.UK."
                  >
                    <NumInput id="statePensionAge" value={form.statePensionAge} onChange={setField('statePensionAge')} min="66" max="70" step="1" />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Accessible bridge assets</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField
                    label="Annual spending needed during the bridge"
                    id="annualSpendingToday"
                    hint="Use today’s money. The calculator adjusts for inflation."
                    prefix="£"
                  >
                    <NumInput id="annualSpendingToday" value={form.annualSpendingToday} onChange={setField('annualSpendingToday')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField
                    label="Current bridge assets"
                    id="currentBridgeAssets"
                    hint="ISA, cash, GIA or other accessible savings you could use before pension income starts."
                    prefix="£"
                  >
                    <NumInput id="currentBridgeAssets" value={form.currentBridgeAssets} onChange={setField('currentBridgeAssets')} min="0" step="1000" prefix="£" />
                  </CalcField>
                  <CalcField label="Monthly bridge contribution" id="monthlyBridgeContribution" prefix="£">
                    <NumInput id="monthlyBridgeContribution" value={form.monthlyBridgeContribution} onChange={setField('monthlyBridgeContribution')} min="0" step="50" prefix="£" />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Assumptions</div>
                <div className="calc-fields calc-fields-2">
                  <CalcField label="Expected annual growth" id="expectedAnnualGrowth" suffix="%">
                    <NumInput id="expectedAnnualGrowth" value={form.expectedAnnualGrowth} onChange={setField('expectedAnnualGrowth')} min="0" max="12" step="0.1" suffix="%" />
                  </CalcField>
                  <CalcField label="Inflation assumption" id="inflationAssumption" suffix="%">
                    <NumInput id="inflationAssumption" value={form.inflationAssumption} onChange={setField('inflationAssumption')} min="0" max="10" step="0.1" suffix="%" />
                  </CalcField>
                </div>
              </div>

              <div className="calc-group bridge-advanced">
                <button
                  type="button"
                  className="bridge-advanced-toggle"
                  onClick={() => setAdvancedOpen((open) => !open)}
                  aria-expanded={advancedOpen}
                >
                  Advanced inputs
                  <span>{advancedOpen ? 'Close' : 'Open'}</span>
                </button>
                {advancedOpen ? (
                  <div className="calc-fields calc-fields-2 bridge-advanced-fields">
                    <CalcField label="Part-time annual income during bridge" id="partTimeAnnualIncome" prefix="£">
                      <NumInput id="partTimeAnnualIncome" value={form.partTimeAnnualIncome} onChange={setField('partTimeAnnualIncome')} min="0" step="1000" prefix="£" />
                    </CalcField>
                    <CalcField
                      label="Safety buffer"
                      id="safetyBuffer"
                      hint="Adds a margin of safety to the required bridge pot."
                      suffix="%"
                    >
                      <NumInput id="safetyBuffer" value={form.safetyBuffer} onChange={setField('safetyBuffer')} min="0" max="50" step="1" suffix="%" />
                    </CalcField>
                  </div>
                ) : null}
              </div>

              {!result.ok ? (
                <div className="calc-errors" role="alert">
                  {result.errors.map((error) => <div key={error} className="calc-error-item">{error}</div>)}
                </div>
              ) : null}
            </form>

            <div className="calc-results-panel bridge-results-panel" id="retirement-bridge-results">
              <ResultPanel result={result} form={form} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <div className="calc-cta-block">
            <h2 className="calc-cta-h2">Save this projection in Paddock.</h2>
            <p className="calc-cta-sub">
              Track your ISA, pension, cash, investments, and long-term retirement goal in one
              calm wealth dashboard.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  goTo('signup')
                  track('retirement_bridge_cta_click', { location: 'mid_cta' })
                }}
              >
                Save this projection in Paddock
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigateTo('/')}>
                Explore Paddock
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section calc-guide-section">
          <article className="calc-guide">
            <h2 className="calc-guide-h2">What is a retirement bridge?</h2>
            <p className="calc-guide-p">
              A retirement bridge is the money you use between the date you stop working and the
              date your pension income begins. For some people that gap may be only a year or two.
              For others, especially those hoping to step back from work in their fifties, it can be
              one of the most important parts of the plan.
            </p>
            <p className="calc-guide-p">
              The bridge usually sits outside a pension. It might include an ISA, cash savings, a
              general investment account, or other accessible assets. The role of the bridge is not
              to replace the full retirement plan. It is to cover the period before pension money is
              available, while leaving longer-term pension assets to do their job later.
            </p>

            <h2 className="calc-guide-h2">Why ISA and accessible savings matter before pension age</h2>
            <p className="calc-guide-p">
              Pensions are powerful long-term vehicles, but they come with access rules. An ISA is
              generally more flexible because money can usually be withdrawn when needed. That
              flexibility can make ISAs, cash, and other accessible savings useful for people who
              want the option to stop work before private pension age.
            </p>
            <p className="calc-guide-p">
              Flexibility has trade-offs. Pension contributions may receive tax relief, while ISA
              contributions do not. ISA withdrawals are usually tax-free, while pension withdrawals
              can be taxable depending on the route and amount. This calculator does not decide
              which wrapper is best. It simply estimates the accessible pot that may be needed for
              the years before pension income starts.
            </p>

            <h2 className="calc-guide-h2">Pension age vs State Pension age</h2>
            <p className="calc-guide-p">
              Private pension access age and State Pension age are separate. Most people can
              currently access private pensions from age 55, but the normal minimum pension age
              rises to 57 from 6 April 2028. Some people may have protected pension ages or
              scheme-specific rules, so it is worth checking your own pension paperwork.
            </p>
            <p className="calc-guide-p">
              State Pension age is different and depends on date of birth and government rules. The
              State Pension age is rising to 67 between 2026 and 2028. Users should check their
              exact State Pension age on GOV.UK, especially if a long-term retirement date depends
              on it.
            </p>

            <h2 className="calc-guide-h2">How much should your bridge cover?</h2>
            <p className="calc-guide-p">
              A bridge estimate starts with annual spending. Use a spending number in today’s money,
              then allow for inflation by the time you stop work. The bridge pot should usually cover
              withdrawals for each month between stopping work and private pension access. A margin
              of safety can help account for market movements, tax, unexpected costs, or spending
              that does not fall neatly into a monthly pattern.
            </p>
            <p className="calc-guide-p">
              This calculator projects your accessible assets to your planned stop-work age, then
              models withdrawals month by month through the bridge period. It allows the remaining
              bridge pot to keep growing, increases spending with inflation, and offsets withdrawals
              with any part-time income you choose to include.
            </p>

            <h2 className="calc-guide-h2">ISA vs pension for early retirement</h2>
            <p className="calc-guide-p">
              ISAs and pensions often work best together. A pension can be valuable for later-life
              retirement income, while an ISA can provide access before pension age. For someone
              targeting early retirement, the question is often not “ISA or pension?” but “how much
              flexibility do I need outside the pension?”
            </p>
            <p className="calc-guide-p">
              The right balance depends on tax position, employer contributions, pension access age,
              investment risk, and personal circumstances. This is educational information, not
              financial advice. A regulated adviser can help with recommendations where needed.
            </p>

            <h2 className="calc-guide-h2">How Paddock can help track the full picture</h2>
            <p className="calc-guide-p">
              Paddock is built for calm, manual-entry wealth tracking. You can track ISA balances,
              pensions, cash, investments, property, liabilities, and long-term goals without bank
              linking. That makes it useful for people who want a clear view of accessible assets
              and locked-away pension wealth side by side.
            </p>
            <p className="calc-guide-p">
              A retirement bridge is only one slice of the picture. The broader plan includes net
              worth, pension value, contributions, inflation, spending, and future milestones.
              Keeping those numbers in one dashboard can make planning feel less scattered and more
              deliberate.
            </p>

            <div className="calc-guide-note">
              This calculator and guide are educational information, not financial advice. It does
              not account for tax, pension scheme rules, charges, benefit entitlement, sequence risk,
              or your full personal circumstances.
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
                <h3>What is a retirement bridge?</h3>
                <p>A retirement bridge is the accessible money used between stopping work and pension income becoming available.</p>
              </div>
              <div className="faq-card">
                <h3>Can I use an ISA to retire before pension age?</h3>
                <p>An ISA can help fund early retirement because it is generally accessible before private pension age, subject to your wider plan.</p>
              </div>
              <div className="faq-card">
                <h3>What age can I access my private pension in the UK?</h3>
                <p>Most people can currently access private pensions from 55. The normal minimum pension age rises to 57 from 6 April 2028.</p>
              </div>
              <div className="faq-card">
                <h3>Is State Pension age the same as pension access age?</h3>
                <p>No. State Pension age is separate from private pension access age. Check your exact State Pension age on GOV.UK.</p>
              </div>
              <div className="faq-card">
                <h3>Is this calculator financial advice?</h3>
                <p>No. This calculator is educational information only and is not regulated financial advice.</p>
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
