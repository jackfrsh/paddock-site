// ─── Currency data ────────────────────────────────────────────────────────────

export const CURRENCIES = ['GBP', 'USD', 'EUR', 'CHF', 'AUD', 'CAD', 'JPY', 'SEK', 'NOK', 'DKK']

export const CURRENCY_SYMBOLS = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  CHF: 'Fr',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
}

/**
 * Approximate mid-market rates: 1 unit of currency = N GBP.
 * These are rough indicative values for planning purposes only.
 * They are not live rates and should be treated as illustrative.
 */
export const APPROX_RATES_TO_GBP = {
  GBP: 1.0,
  USD: 0.79,
  EUR: 0.85,
  CHF: 0.89,
  AUD: 0.50,
  CAD: 0.57,
  JPY: 0.0052,
  SEK: 0.073,
  NOK: 0.073,
  DKK: 0.114,
}

// ─── Row definitions ──────────────────────────────────────────────────────────

export const ASSET_ROWS = [
  { key: 'cash', label: 'Cash & savings' },
  { key: 'investments', label: 'Investments' },
  { key: 'pensions', label: 'Pensions' },
  { key: 'property', label: 'Property' },
  { key: 'otherAssets', label: 'Other assets' },
]

export const LIABILITY_ROWS = [
  { key: 'mortgage', label: 'Mortgage' },
  { key: 'loans', label: 'Loans & credit' },
  { key: 'otherLiabilities', label: 'Other liabilities' },
]

export const ALL_KEYS = [
  ...ASSET_ROWS.map((r) => r.key),
  ...LIABILITY_ROWS.map((r) => r.key),
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert an amount from `fromCurrency` to `baseCurrency` using static GBP pivot rates.
 */
export function convertToBase(amount, fromCurrency, baseCurrency) {
  if (fromCurrency === baseCurrency) return amount
  const fromRate = APPROX_RATES_TO_GBP[fromCurrency] ?? 1
  const baseRate = APPROX_RATES_TO_GBP[baseCurrency] ?? 1
  if (baseRate === 0) return amount
  return (amount * fromRate) / baseRate
}

/**
 * Parse a raw string/number into a non-negative float.
 * Returns 0 for empty, null, undefined, negative, or non-numeric inputs.
 */
export function parseAmount(val) {
  if (val === '' || val === null || val === undefined) return 0
  const n = parseFloat(String(val).replace(/,/g, ''))
  if (isNaN(n)) return 0
  if (n < 0) return 0
  return n
}

/**
 * Returns true if the raw value is non-empty and non-parseable, or explicitly negative.
 */
export function isInvalidAmount(val) {
  if (val === '' || val === null || val === undefined) return false
  const n = parseFloat(String(val).replace(/,/g, ''))
  if (isNaN(n)) return true
  if (n < 0) return true
  return false
}

// ─── Main calculation ─────────────────────────────────────────────────────────

/**
 * Calculate net worth from grouped asset/liability rows.
 *
 * @param {object} params
 * @param {string} params.baseCurrency - Base currency code (e.g. 'GBP')
 * @param {Record<string, { amount: string|number, currency: string }>} params.rows
 *   - One entry per row key (see ASSET_ROWS and LIABILITY_ROWS).
 *   - Rows may be absent or have empty amounts — treated as 0.
 *
 * @returns {{
 *   ok: true,
 *   totalAssets: number,
 *   totalLiabilities: number,
 *   netWorth: number,
 *   assetBreakdown: Record<string, { amountBase: number, pct: number }>,
 *   liabilityBreakdown: Record<string, { amountBase: number, pct: number }>,
 *   hasMultiCurrency: boolean,
 *   invalidRows: string[],
 *   isEmpty: boolean,
 * }}
 */
export function calculateNetWorth({ baseCurrency, rows }) {
  const safeBase = CURRENCIES.includes(baseCurrency) ? baseCurrency : 'GBP'
  const invalidRows = []

  // ── Assets ──
  let totalAssets = 0
  const rawAssets = {}

  for (const { key } of ASSET_ROWS) {
    const row = rows[key] || { amount: '', currency: safeBase }
    const currency = CURRENCIES.includes(row.currency) ? row.currency : safeBase
    if (isInvalidAmount(row.amount)) invalidRows.push(key)
    const amount = parseAmount(row.amount)
    const converted = convertToBase(amount, currency, safeBase)
    rawAssets[key] = converted
    totalAssets += converted
  }

  // ── Liabilities ──
  let totalLiabilities = 0
  const rawLiabilities = {}

  for (const { key } of LIABILITY_ROWS) {
    const row = rows[key] || { amount: '', currency: safeBase }
    const currency = CURRENCIES.includes(row.currency) ? row.currency : safeBase
    if (isInvalidAmount(row.amount)) invalidRows.push(key)
    const amount = parseAmount(row.amount)
    const converted = convertToBase(amount, currency, safeBase)
    rawLiabilities[key] = converted
    totalLiabilities += converted
  }

  // ── Net worth ──
  const netWorth = totalAssets - totalLiabilities

  // ── Breakdown with pct within group ──
  const assetBreakdown = {}
  for (const { key } of ASSET_ROWS) {
    assetBreakdown[key] = {
      amountBase: rawAssets[key],
      pct: totalAssets > 0 ? (rawAssets[key] / totalAssets) * 100 : 0,
    }
  }

  const liabilityBreakdown = {}
  for (const { key } of LIABILITY_ROWS) {
    liabilityBreakdown[key] = {
      amountBase: rawLiabilities[key],
      pct: totalLiabilities > 0 ? (rawLiabilities[key] / totalLiabilities) * 100 : 0,
    }
  }

  // ── Multi-currency detection ──
  const hasMultiCurrency = Object.values(rows).some(
    (row) => row && row.currency && row.currency !== safeBase
  )

  return {
    ok: true,
    totalAssets,
    totalLiabilities,
    netWorth,
    assetBreakdown,
    liabilityBreakdown,
    hasMultiCurrency,
    invalidRows,
    isEmpty: totalAssets === 0 && totalLiabilities === 0,
  }
}
