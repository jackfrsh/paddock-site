import React from 'react'
import {
  GuideShell,
  H2,
  P,
  UL,
  Example,
  ProTip,
  GuideCTA,
  Divider,
  GuideLink,
} from '../components/GuideLayout'

export default function MultiCurrencyGuide({ navigateTo, goTo }) {
  return (
    <GuideShell
      seoTitle="Multi-Currency Net Worth Tracker | Track Wealth Across Currencies | Paddock"
      metaDescription="Track net worth across GBP, USD, EUR and more with one clear base-currency view. Learn how multi-currency wealth tracking works and why spreadsheets break."
      canonicalPath="/guides/multi-currency-net-worth-tracker"
      heroLabel="Multi-currency net worth tracker"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Multi-currency net worth tracker</div>

      <h1 className="guide-h1">
        A multi-currency net worth tracker for wealth across currencies
      </h1>

      <p className="guide-lead">
        If you hold wealth in more than one currency — for example a GBP savings
        account, a USD brokerage account, EUR cash, or overseas property —
        a normal spreadsheet quickly becomes unreliable. A multi-currency net worth
        tracker converts every account into one base currency using current exchange
        rates, so you can see your real net worth clearly and track progress without
        mixing currencies, stale FX rates, or bank-linking noise.
      </p>

      <H2>Why spreadsheets break for multi-currency net worth</H2>
      <P>
        Most spreadsheet trackers work well when everything is in one currency.
        They start to break when your finances spread across countries, wrappers,
        and accounts. If you add £80,000, $120,000, and €15,000 together without
        conversion, the total is meaningless. Even if you convert those balances
        once manually, the result drifts as exchange rates move.
      </P>
      <P>
        This is why multi-currency wealth tracking needs more than a one-off setup.
        You need one consistent base currency and current FX rates behind every
        total, milestone, and projection.
      </P>

      <Example>
        <strong>January snapshot:</strong><br />
        UK savings: £80,000<br />
        US brokerage: $120,000 (at GBP/USD 1.27 = £94,500)<br />
        EUR cash: €15,000 (at GBP/EUR 1.16 = £12,900)<br />
        <strong>Total: £187,400</strong><br /><br />

        <strong>June snapshot</strong> — same balances, only FX changed:<br />
        GBP/USD moves to 1.32 → US brokerage now = £90,900<br />
        GBP/EUR moves to 1.19 → EUR cash now = £12,600<br />
        <strong>Total: £183,500</strong><br /><br />

        Your balances did not change. You did not spend or lose money. But your
        reported net worth dropped by £3,900 purely from FX movement. If you are
        checking quarterly with stale rates, it becomes hard to tell whether your
        progress is real or just currency noise.
      </Example>

      <H2>What a base currency does</H2>
      <P>
        A base currency is the single reference currency your tracker uses for
        display and calculation. You choose the currency that matters most for your
        life and planning — usually the one you earn in, spend in, or expect to
        retire in — and every other holding is converted into that base.
      </P>
      <P>
        For many UK users, that will be GBP. For an expat or someone planning to
        retire abroad, it might be EUR or USD. The important thing is not choosing
        the “perfect” currency. It is using one base consistently, so your net worth,
        targets, and long-term planning all stay coherent.
      </P>

      <ProTip>
        The goal of a multi-currency net worth tracker is not to predict FX. It is
        to give you one clean, internally consistent view of your wealth.
      </ProTip>

      <H2>Why current FX rates matter</H2>
      <P>
        A lot of people convert their balances once when they set up a tracker and
        then leave those rates frozen. That makes the total feel precise while
        quietly becoming less accurate over time. A 5% move in GBP/USD can shift
        a $120K account by thousands of pounds in GBP terms.
      </P>
      <P>
        Current FX rates matter because they keep the dashboard honest. When you
        open your tracker, the number should reflect today’s reality rather than
        a conversion you typed in months ago.
      </P>

      <Divider />

      <H2>Common multi-currency tracking mistakes</H2>
      <UL>
        <li>
          <strong>Adding raw balances across currencies.</strong> £80K + $120K is
          not a usable net worth figure unless both are converted into the same base.
        </li>
        <li>
          <strong>Using stale exchange rates.</strong> A one-time conversion gets
          less useful the longer it sits there.
        </li>
        <li>
          <strong>Switching base currencies too often.</strong> Viewing your wealth
          in GBP one month and USD the next makes trend comparisons harder to trust.
        </li>
        <li>
          <strong>Ignoring FX in long-term planning.</strong> If your projection
          assumes foreign holdings never change in base-currency terms, it is hiding
          real uncertainty.
        </li>
        <li>
          <strong>Tracking overseas assets in the wrong unit.</strong> A property
          priced in EUR should be tracked in EUR and converted properly, not stored
          as a guessed GBP number forever.
        </li>
      </UL>

      <H2>Who benefits most from a multi-currency net worth tracker</H2>
      <P>
        This matters most if you:
      </P>
      <UL>
        <li>Earn in one currency and invest in another.</li>
        <li>Hold UK accounts alongside US or European accounts.</li>
        <li>Track ISAs, pensions, savings, brokerage accounts, or overseas property together.</li>
        <li>Plan to relocate or retire internationally in the next 5–15 years.</li>
        <li>Are an expat or have financial accounts spread across multiple countries.</li>
      </UL>

      <H2>Why manual tracking can work better than bank linking here</H2>
      <P>
        For multi-currency wealth tracking, manual entry is often cleaner than
        bank linking. Open banking connections are not always designed around
        overseas accounts, mixed wrappers, or long-term wealth planning. They can
        also add noise when what you really want is a calm monthly check-in.
      </P>
      <P>
        A manual-entry tracker lets you record the balances that matter, keep your
        categories clean, and rely on the app to handle the conversion logic. That
        is often a better fit for people tracking wealth rather than day-to-day
        spending.
      </P>

      <H2>How Paddock handles multi-currency net worth tracking</H2>
      <P>
        Paddock is a manual-entry, privacy-first wealth tracker built for clear
        long-term visibility. You choose a base currency — typically GBP — and add
        accounts in their real currencies. Paddock converts them into a single
        base-currency view so your dashboard, milestones, and planning stay aligned.
      </P>
      <P>
        That means you can track a Vanguard ISA in GBP, a US brokerage in USD,
        EUR cash, or overseas property without forcing everything into a brittle
        spreadsheet. There is no bank linking required. The aim is a calmer and
        more trustworthy way to see your full wealth.
      </P>
      <P>
        If you also want to understand where that wealth is heading over time,
        Paddock extends this into long-term planning and real-terms views. See the{' '}
        <a
          href="/guides/long-term-wealth-projection"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/guides/long-term-wealth-projection')
            }
          }}
          className="guide-inline-link"
        >
          long-term wealth projection guide
        </a>{' '}
        and the{' '}
        <a
          href="/guides/inflation-adjusted-net-worth"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/guides/inflation-adjusted-net-worth')
            }
          }}
          className="guide-inline-link"
        >
          inflation-adjusted net worth guide
        </a>.
      </P>

      <GuideCTA onClick={() => goTo('signup')}>
        Try Paddock free and track your net worth across currencies in one clear
        base-currency view — no bank linking required.
      </GuideCTA>

      <H2>Next steps</H2>
      <div className="guide-links">
        <GuideLink to="/guides/long-term-wealth-projection" navigateTo={navigateTo}>
          Long-term wealth projection guide →
        </GuideLink>
        <GuideLink to="/guides/inflation-adjusted-net-worth" navigateTo={navigateTo}>
          Inflation-adjusted net worth guide →
        </GuideLink>
      </div>
    </GuideShell>
  )
}