import React, { useState, useMemo, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import {
  CURRENCIES,
  CURRENCY_SYMBOLS,
  ASSET_ROWS,
  LIABILITY_ROWS,
  calculateNetWorth,
} from './netWorthCalc'

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
function fmt(n, currency = 'GBP') {
  if (!isFinite(n) || isNaN(n)) return '—'
  const code = CURRENCIES.includes(currency) ? currency : 'GBP'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
  }).format(n)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, note, highlight, className }) {
  return (
    <div className={`calc-stat${highlight ? ' calc-stat-highlight' : ''}${className ? ` ${className}` : ''}`}>
      <div className="calc-stat-value">{value}</div>
      <div className="calc-stat-label">{label}</div>
      {note ? <div className="calc-stat-note">{note}</div> : null}
    </div>
  )
}

function SplitBar({ totalAssets, totalLiabilities }) {
  const total = totalAssets + totalLiabilities
  if (total === 0) return null
  const assetPct = (totalAssets / total) * 100
  const liabPct = (totalLiabilities / total) * 100
  return (
    <div className="nw-split-bar-wrap">
      <div className="nw-split-bar-labels">
        <span>Assets {assetPct.toFixed(0)}%</span>
        <span>{liabPct.toFixed(0)}% Liabilities</span>
      </div>
      <div className="nw-split-bar">
        <div className="nw-split-bar-assets" style={{ width: `${assetPct}%` }} />
        <div className="nw-split-bar-liabilities" style={{ width: `${liabPct}%` }} />
      </div>
    </div>
  )
}

function BreakdownRow({ label, amountBase, pct, type, currency }) {
  return (
    <div className="nw-breakdown-row">
      <span className="nw-breakdown-label">{label}</span>
      <div className="nw-breakdown-bar-track">
        <div
          className={`nw-breakdown-bar-fill ${type}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="nw-breakdown-value">{fmt(amountBase, currency)}</span>
    </div>
  )
}

function NwRow({ rowDef, value, onChange, showCurrency }) {
  const { key, label } = rowDef
  const symbol = CURRENCY_SYMBOLS[value.currency] || '£'

  return (
    <div className="nw-row">
      <span className="nw-row-label">{label}</span>
      <div className="calc-input-wrap">
        <span className="calc-input-prefix">{symbol}</span>
        <input
          type="number"
          id={`nw-${key}`}
          className="calc-input has-prefix"
          value={value.amount}
          onChange={(e) => onChange(key, 'amount', e.target.value)}
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="0"
          aria-label={label}
        />
      </div>
      {showCurrency && (
        <select
          className="nw-currency-select"
          value={value.currency}
          onChange={(e) => onChange(key, 'currency', e.target.value)}
          aria-label={`Currency for ${label}`}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  )
}

// ─── Default state ────────────────────────────────────────────────────────────

function makeDefaultRows(currency) {
  const rows = {}
  for (const { key } of [...ASSET_ROWS, ...LIABILITY_ROWS]) {
    rows[key] = { amount: '', currency }
  }
  return rows
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NetWorthCalculator({ navigateTo, goTo }) {
  const [baseCurrency, setBaseCurrency] = useState('GBP')
  const [showMultiCurrency, setShowMultiCurrency] = useState(false)
  const [rows, setRows] = useState(() => makeDefaultRows('GBP'))
  const hasTracked = useRef(false)

  const handleRowChange = useCallback((key, field, val) => {
    setRows((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }))
  }, [])

  const handleBaseCurrencyChange = useCallback((newBase) => {
    setBaseCurrency(newBase)
    track('nw_base_currency_change', { currency: newBase })
  }, [])

  const handleMultiCurrencyToggle = useCallback((checked) => {
    setShowMultiCurrency(checked)
    if (checked) track('nw_multi_currency_enable')
  }, [])

  // Live calculation — always runs
  const results = useMemo(() => {
    return calculateNetWorth({ baseCurrency, rows })
  }, [baseCurrency, rows])

  // Track first meaningful result
  useMemo(() => {
    if (!hasTracked.current && !results.isEmpty) {
      hasTracked.current = true
      track('nw_first_result', { baseCurrency })
    }
  }, [results.isEmpty, baseCurrency])

  const netWorthClass = results.netWorth > 0
    ? 'nw-positive'
    : results.netWorth < 0
    ? 'nw-negative'
    : ''

  const assetRowsWithValues = ASSET_ROWS.filter(
    ({ key }) => results.assetBreakdown[key]?.amountBase > 0
  )
  const liabilityRowsWithValues = LIABILITY_ROWS.filter(
    ({ key }) => results.liabilityBreakdown[key]?.amountBase > 0
  )

  return (
    <div className="landing-shell">
      <Helmet>
        <title>Net Worth Calculator UK — Total Your Assets and Liabilities | Paddock</title>
        <meta
          name="description"
          content="Free UK net worth calculator. Enter your assets and liabilities to see your total net worth instantly — cash, investments, pensions, property, and debts. No login required."
        />
        <link rel="canonical" href="https://getpaddock.com/tools/net-worth-calculator" />
        <meta property="og:title" content="Net Worth Calculator UK | Paddock" />
        <meta
          property="og:description"
          content="Free net worth calculator. Add your assets and liabilities to see your total net worth. Supports multi-currency. No account needed."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools/net-worth-calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Net Worth Calculator UK | Paddock" />
        <meta
          name="twitter:description"
          content="Free net worth calculator. Total your assets and liabilities instantly — no login required."
        />
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Wealth snapshot tool</div>
          <h1 className="calc-h1">Net worth calculator UK</h1>
          <p className="calc-subhead">
            Enter your assets and liabilities to see your total net worth — including cash,
            investments, pensions, property, and debts. Results update as you type.
          </p>
          <p className="calc-trust">
            Your numbers stay in your browser and are never sent anywhere.
          </p>
        </div>
      </section>

      {/* ── Calculator ──────────────────────────────────────────────────── */}
      <section className="calc-section">
        <div className="container">
          <div className="calc-layout">

            {/* ── Form ── */}
            <div className="calc-form-card">

              {/* Controls: base currency + multi-currency toggle */}
              <div className="nw-controls">
                <div className="nw-base-currency">
                  <span className="nw-base-label">Base currency</span>
                  <select
                    className="nw-base-select"
                    value={baseCurrency}
                    onChange={(e) => handleBaseCurrencyChange(e.target.value)}
                    aria-label="Base currency"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <label className="nw-multicurrency-toggle">
                  <input
                    type="checkbox"
                    checked={showMultiCurrency}
                    onChange={(e) => handleMultiCurrencyToggle(e.target.checked)}
                  />
                  Multi-currency
                </label>
              </div>

              {/* Assets */}
              <div className="calc-group">
                <div className="calc-group-title">Assets</div>
                <div className={`nw-rows${showMultiCurrency ? '' : ' nw-rows--single'}`}>
                  {ASSET_ROWS.map((rowDef) => (
                    <NwRow
                      key={rowDef.key}
                      rowDef={rowDef}
                      value={rows[rowDef.key]}
                      onChange={handleRowChange}
                      showCurrency={showMultiCurrency}
                      baseCurrency={baseCurrency}
                    />
                  ))}
                </div>
              </div>

              {/* Liabilities */}
              <div className="calc-group">
                <div className="calc-group-title">Liabilities</div>
                <div className={`nw-rows${showMultiCurrency ? '' : ' nw-rows--single'}`}>
                  {LIABILITY_ROWS.map((rowDef) => (
                    <NwRow
                      key={rowDef.key}
                      rowDef={rowDef}
                      value={rows[rowDef.key]}
                      onChange={handleRowChange}
                      showCurrency={showMultiCurrency}
                      baseCurrency={baseCurrency}
                    />
                  ))}
                </div>
              </div>

              {results.invalidRows.length > 0 && (
                <div className="calc-errors" role="alert">
                  <div className="calc-error-item">
                    Some amounts are not valid numbers and have been treated as 0.
                  </div>
                </div>
              )}

            </div>

            {/* ── Results ── */}
            <div className="calc-results-panel">
              {results.isEmpty ? (
                <div className="nw-results-empty">
                  Enter your assets and liabilities on the left to see your net worth.
                </div>
              ) : (
                <div className="calc-results">
                  <div className="calc-results-header">
                    <div className="calc-results-title">Your net worth</div>
                    <div className="calc-results-note">Based on the amounts you entered</div>
                  </div>

                  {/* Primary stats */}
                  <div className="calc-stats">
                    <StatCard
                      label="Net worth"
                      value={fmt(results.netWorth, baseCurrency)}
                      note={results.netWorth >= 0 ? 'Assets exceed liabilities' : 'Liabilities exceed assets'}
                      highlight
                      className={netWorthClass}
                    />
                    <StatCard
                      label="Total assets"
                      value={fmt(results.totalAssets, baseCurrency)}
                    />
                    <StatCard
                      label="Total liabilities"
                      value={fmt(results.totalLiabilities, baseCurrency)}
                    />
                  </div>

                  {/* Split bar */}
                  <SplitBar
                    totalAssets={results.totalAssets}
                    totalLiabilities={results.totalLiabilities}
                  />

                  {/* Asset breakdown */}
                  {assetRowsWithValues.length > 0 && (
                    <div className="nw-breakdown">
                      <div className="nw-breakdown-title">Assets</div>
                      {assetRowsWithValues.map(({ key, label }) => (
                        <BreakdownRow
                          key={key}
                          label={label}
                          amountBase={results.assetBreakdown[key].amountBase}
                          pct={results.assetBreakdown[key].pct}
                          type="asset"
                          currency={baseCurrency}
                        />
                      ))}
                    </div>
                  )}

                  {/* Liability breakdown */}
                  {liabilityRowsWithValues.length > 0 && (
                    <div className="nw-breakdown">
                      <div className="nw-breakdown-title">Liabilities</div>
                      {liabilityRowsWithValues.map(({ key, label }) => (
                        <BreakdownRow
                          key={key}
                          label={label}
                          amountBase={results.liabilityBreakdown[key].amountBase}
                          pct={results.liabilityBreakdown[key].pct}
                          type="liability"
                          currency={baseCurrency}
                        />
                      ))}
                    </div>
                  )}

                  {/* Multi-currency note */}
                  {results.hasMultiCurrency && (
                    <div className="nw-fx-note">
                      Conversion rates are approximate and illustrative. They are not live market
                      rates and should not be used for financial transactions.
                    </div>
                  )}

                  <p className="calc-disclaimer">
                    Based on the amounts you enter. Not financial advice.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Guide ───────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section calc-guide-section">
          <div className="calc-guide">

            <h2 className="calc-guide-h2">What is net worth?</h2>
            <p className="calc-guide-p">
              Net worth is the total value of everything you own minus everything you owe.
              It is the single number that best describes your financial position at a point in
              time: what would be left if you sold all your assets and settled all your debts.
            </p>
            <p className="calc-guide-p">
              The formula is simple: <em>Net worth = total assets − total liabilities</em>.
              A positive net worth means your assets exceed your debts. A negative net worth —
              common early in life or after large loans — means you owe more than you own. In both
              cases, the number is useful: it tells you where you are and gives you a baseline
              to track progress against.
            </p>

            <h2 className="calc-guide-h2">Why net worth matters more than income</h2>
            <p className="calc-guide-p">
              Income tells you how much money flows through your life. Net worth tells you how
              much you have kept. Two people on the same salary can have very different net
              worths depending on their saving rate, debt levels, and investment decisions. A high
              income that is spent immediately leaves no lasting wealth. A moderate income with
              disciplined saving and investing can build substantial net worth over decades.
            </p>
            <p className="calc-guide-p">
              For long-term financial planning — whether you are aiming for early retirement,
              financial independence, or just a clearer picture of where you stand — net worth
              is a more meaningful measure than annual income. It reflects the accumulated
              outcome of your financial decisions, not just the current flow.
            </p>

            <h2 className="calc-guide-h2">Assets: what to include</h2>
            <p className="calc-guide-p">
              Assets are things you own that have financial value. In this calculator, they are
              grouped into five categories:
            </p>
            <ul className="calc-guide-ul">
              <li>
                <strong>Cash and savings</strong> — current accounts, savings accounts, Cash ISAs,
                Premium Bonds, and any other liquid cash holdings.
              </li>
              <li>
                <strong>Investments</strong> — Stocks and Shares ISAs, general investment accounts,
                shares, funds, bonds, and similar assets.
              </li>
              <li>
                <strong>Pensions</strong> — defined contribution pension pots (SIPPs, workplace
                pensions). For defined benefit pensions, you can enter a transfer value if known,
                though the appropriate treatment is debated — see below.
              </li>
              <li>
                <strong>Property</strong> — the current market value of any property you own,
                including your primary residence if you choose to include it.
              </li>
              <li>
                <strong>Other assets</strong> — vehicles, business equity, collectibles, or
                any other assets with meaningful value.
              </li>
            </ul>

            <h2 className="calc-guide-h2">Should I include my pension in net worth?</h2>
            <p className="calc-guide-p">
              Yes — with some caveats. A defined contribution pension (SIPP, workplace pension)
              is a real financial asset and it is reasonable to include the current pot value in
              your net worth calculation. When it comes to projections or planning, remember that
              SIPP withdrawals are typically taxed as income above the 25% tax-free lump sum, so
              the gross pot value overstates what you will actually receive in spending power.
            </p>
            <p className="calc-guide-p">
              A defined benefit (final salary) pension is harder to value. Some people include
              the transfer value (CETV) if they can obtain it, but this is not a number most
              people have to hand. Including it where available gives a more complete picture.
              If you do not have a transfer value, it is reasonable to note the annual income
              entitlement separately and exclude it from the net worth total.
            </p>

            <h2 className="calc-guide-h2">Should I include my home in net worth?</h2>
            <p className="calc-guide-p">
              Your primary residence is a real asset and most people include it. The key
              consideration is that your home is not liquid: you cannot easily spend a portion
              of it without moving. Many people track two net worth numbers — one including
              property and one excluding it (the liquid or "investable" net worth). The liquid
              figure is often more useful for retirement and financial independence planning,
              since it reflects the wealth you can actually deploy.
            </p>
            <p className="calc-guide-p">
              If you include your home, enter the current estimated market value. Your mortgage
              goes in the liabilities section, so the property's contribution to net worth is
              automatically the equity (value minus outstanding mortgage).
            </p>

            <h2 className="calc-guide-h2">Tracking across currencies</h2>
            <p className="calc-guide-p">
              If you hold accounts in more than one currency — a common situation for UK
              residents who work internationally, hold foreign investments, or have overseas
              property — toggle on multi-currency mode. This lets you assign a currency to
              each row and see the total converted into your base currency.
            </p>
            <p className="calc-guide-p">
              The conversion rates used here are approximate and illustrative. They give a
              reasonable planning-level view of your position but should not be treated as
              precise market rates. For day-to-day accuracy, you may want to update your
              entries using a current rate from a live source.
            </p>

            <h2 className="calc-guide-h2">Why seeing everything in one place matters</h2>
            <p className="calc-guide-p">
              Most people hold their wealth in several separate places: a current account, an
              ISA, a workplace pension, a SIPP, a property. Each is managed by a different
              institution, reported in a different format, and updated on a different schedule.
              It is almost impossible to have an accurate mental model of your total position
              without deliberately aggregating it all.
            </p>
            <p className="calc-guide-p">
              This calculator gives you a one-time snapshot. For ongoing tracking — seeing how
              your net worth changes month by month, year by year, and understanding what is
              driving it — a dedicated tool like Paddock lets you save and update your figures
              over time without sharing your data with banks or third parties.
            </p>

            <div className="calc-guide-note">
              <strong>Important:</strong> This calculator is for indicative planning purposes
              only. It does not account for taxes, inflation, pension access restrictions,
              or other factors that affect the real-terms value of your assets. It is not
              financial advice.
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
                <h3>What is net worth?</h3>
                <p>
                  Net worth is the total value of your assets minus the total value of your
                  liabilities. Assets include cash, investments, pensions, property, and other
                  things of value you own. Liabilities include mortgages, loans, credit card
                  balances, and other debts. Net worth = assets − liabilities.
                </p>
              </div>

              <div className="faq-card">
                <h3>How do I calculate my net worth?</h3>
                <p>
                  List everything you own with a financial value (assets) and everything you
                  owe (liabilities). Add up the asset values, add up the liability values,
                  and subtract liabilities from assets. This calculator does that automatically
                  as you type — just enter the amounts in each category and the total updates
                  immediately.
                </p>
              </div>

              <div className="faq-card">
                <h3>Should I include my pension in my net worth?</h3>
                <p>
                  Yes, for most people. A defined contribution pension (SIPP or workplace pension)
                  is a real financial asset. Enter the current transfer value or pot value. Bear in
                  mind that pension withdrawals above the 25% tax-free amount are taxed as income,
                  so the gross figure overstates what you can spend. A defined benefit pension is
                  harder to value — use the transfer value (CETV) if available.
                </p>
              </div>

              <div className="faq-card">
                <h3>Should I include my home in my net worth?</h3>
                <p>
                  Most people include it. Enter the current estimated market value under Property
                  and your outstanding mortgage under Liabilities — the net contribution to your
                  total will be the equity. Some people track a separate "liquid net worth"
                  excluding property, since the primary residence is not readily deployable.
                  Both views are useful.
                </p>
              </div>

              <div className="faq-card">
                <h3>Can I track accounts in different currencies?</h3>
                <p>
                  Yes. Toggle on multi-currency mode at the top of the calculator. Each row gets
                  a currency selector, and the totals are converted into your chosen base currency
                  using approximate indicative rates. The rates are not live — they are reasonable
                  for planning purposes but should not be used for financial transactions.
                </p>
              </div>

              <div className="faq-card">
                <h3>Do I need to connect my bank accounts?</h3>
                <p>
                  No. This calculator is completely manual — you type in the values yourself.
                  Nothing is connected to your bank. No open banking permissions are required.
                  Your numbers stay in your browser and are never sent to any server. The same
                  approach applies to Paddock, the app this calculator is part of: manual entry,
                  no bank connection, no sharing of credentials.
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
              <h2 className="calc-cta-h2">Save and track your net worth over time with Paddock.</h2>
              <p className="calc-cta-sub">
                Track ISAs, pensions, savings, property, and more in one private dashboard —
                no bank connection required. See how your wealth changes month by month.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    goTo('signup')
                    track('nw_cta_click', { location: 'bottom_cta' })
                  }}
                >
                  Start tracking — it&apos;s free
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigateTo('/net-worth-tracker')}
                >
                  How Paddock tracks net worth
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
