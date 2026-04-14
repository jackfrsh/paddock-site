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
      seoTitle="Multi-Currency Portfolio Tracker UK — Track Investments Across Currencies | Paddock"
      metaDescription="Track investments, ISAs, pensions, savings, and other accounts across GBP, USD, EUR and more in one base-currency view. No bank connection required. Private, manual-entry wealth tracking with Paddock."
      canonicalPath="/guides/multi-currency-net-worth-tracker"
      heroLabel="Multi-currency wealth tracker"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Multi-currency portfolio tracker</div>

      <h1 className="guide-h1">
        Multi-currency portfolio tracker
      </h1>

      <p className="guide-lead">
        If you hold investments, savings, or pensions in more than one currency —
        a GBP ISA, a USD brokerage account, EUR savings, or overseas assets — a
        multi-currency portfolio tracker gives you one clear base-currency view of
        everything you own. Paddock is a privacy-first, manual-entry wealth tracker
        built for exactly this: tracking your full portfolio and net worth across
        currencies, without bank linking, in a single coherent view.
      </p>

      <H2>Why tracking investments across currencies is harder than it looks</H2>
      <P>
        Most portfolio trackers and spreadsheets work well when everything is in
        one currency. They break when your wealth spreads across countries, accounts,
        and wrappers. Adding £80,000, $120,000, and €15,000 together without
        conversion produces a number that means nothing. Even if you convert those
        balances once, the result quietly drifts as exchange rates move — and you
        stop being able to trust whether your progress is real or just currency noise.
      </P>
      <P>
        This is why a multi-currency wealth tracker needs more than a one-off setup.
        You need one consistent base currency and current FX rates behind every
        total, milestone, and projection.
      </P>

      <Example>
        <strong>January snapshot:</strong><br />
        UK ISA: £80,000<br />
        US brokerage: $120,000 (at GBP/USD 1.27 = £94,500)<br />
        EUR cash: €15,000 (at GBP/EUR 1.16 = £12,900)<br />
        <strong>Total: £187,400</strong><br /><br />

        <strong>June snapshot</strong> — same balances, only FX changed:<br />
        GBP/USD moves to 1.32 → US brokerage now = £90,900<br />
        GBP/EUR moves to 1.19 → EUR cash now = £12,600<br />
        <strong>Total: £183,500</strong><br /><br />

        Your balances did not change. You did not spend or lose money. But your
        reported net worth dropped by £3,900 purely from FX movement. With stale
        rates or a single-currency spreadsheet, this kind of distortion is invisible.
      </Example>

      <H2>What a base currency does</H2>
      <P>
        A base currency is the single reference currency your tracker uses for
        display and calculation. You choose the currency that matters most for your
        life and planning — usually the one you earn in, spend in, or expect to
        retire in — and every other holding is converted into that base.
      </P>
      <P>
        For most UK investors, that will be GBP. For an expat or someone planning
        to retire abroad, it might be EUR or USD. The important thing is not
        choosing the "perfect" currency. It is using one base consistently, so your
        portfolio, net worth, targets, and long-term planning all stay coherent.
      </P>

      <ProTip>
        The goal of a multi-currency portfolio tracker is not to predict FX. It is
        to give you one clean, internally consistent view of your total wealth —
        so your progress is real and readable.
      </ProTip>

      <H2>Why current FX rates matter</H2>
      <P>
        Many people convert their balances once when they set up a tracker and
        then leave those rates frozen. That makes the total feel precise while
        quietly becoming less accurate over time. A 5% move in GBP/USD can shift
        a $120K account by thousands of pounds in GBP terms.
      </P>
      <P>
        Current FX rates matter because they keep the dashboard honest. When you
        check your portfolio, the number should reflect today's reality rather than
        a conversion you typed in six months ago.
      </P>

      <Divider />

      <H2>Common multi-currency tracking mistakes</H2>
      <UL>
        <li>
          <strong>Adding raw balances across currencies.</strong> £80K + $120K is
          not a usable net worth or portfolio total unless both are converted into
          the same base.
        </li>
        <li>
          <strong>Using stale exchange rates.</strong> A one-time conversion gets
          less reliable the longer it sits there.
        </li>
        <li>
          <strong>Switching base currencies too often.</strong> Viewing your
          portfolio in GBP one month and USD the next makes progress comparisons
          impossible to trust.
        </li>
        <li>
          <strong>Ignoring FX in long-term planning.</strong> If your projection
          assumes foreign holdings never change in base-currency terms, it is
          hiding real uncertainty.
        </li>
        <li>
          <strong>Tracking overseas assets in the wrong unit.</strong> A position
          or property priced in EUR should be tracked in EUR and converted
          properly, not stored as a guessed GBP number forever.
        </li>
      </UL>

      <H2>What Paddock does as a multi-currency portfolio tracker</H2>
      <P>
        Paddock is a manual-entry, privacy-first wealth tracker built for clear
        long-term visibility across accounts and currencies. You choose a base
        currency — typically GBP — and add accounts in their native currencies.
        Paddock converts them into a single base-currency view so your dashboard,
        milestones, and projections stay aligned.
      </P>
      <P>
        That means you can track a Vanguard ISA in GBP, a US brokerage account in
        USD, a SIPP, EUR cash savings, or overseas property — all in one place,
        without forcing everything into a brittle spreadsheet. No bank connection
        is required.
      </P>
      <P>
        Paddock is broader than a pure portfolio tracker. It covers your total
        wealth: investments, pensions, savings, property, and liabilities. But
        for people specifically looking to track an investment portfolio across
        currencies, that is exactly what the accounts and dashboard are for.
      </P>
      <P>
        If you also want to understand where that wealth is heading, Paddock
        extends this into long-term projections and real-terms views. See the{' '}
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

      <GuideCTA
        onClick={() => goTo('signup')}
        buttonText="Start tracking — it's free"
      >
        Track your portfolio and net worth across currencies in one private
        base-currency view. No bank connection required.
      </GuideCTA>

      <H2>Why manual entry works well for multi-currency portfolios</H2>
      <P>
        For tracking wealth across currencies, manual entry is often a cleaner
        approach than open banking. Bank-linking tools are primarily built around
        domestic accounts and day-to-day spending. They are not always designed
        to handle overseas brokers, mixed wrappers like ISAs and SIPPs, or the
        deliberate, periodic check-ins that long-term wealth tracking requires.
      </P>
      <P>
        A manual-entry multi-currency wealth tracker gives you more control and
        more privacy. You decide what goes in. The data stays yours. And when you
        do check in, the process is intentional — which tends to produce more
        trustworthy numbers than a live sync that quietly changes behind your back.
      </P>
      <UL>
        <li><strong>No sync fragility.</strong> Connections to overseas brokers often break or are unavailable in the UK.</li>
        <li><strong>More privacy.</strong> Your account credentials and transaction history stay off third-party servers.</li>
        <li><strong>Clean categories.</strong> You decide how accounts are labelled and grouped — no imported junk data.</li>
        <li><strong>Deliberate tracking.</strong> A monthly check-in is usually enough for long-term wealth visibility.</li>
      </UL>

      <H2>Who benefits most</H2>
      <P>
        A multi-currency portfolio tracker matters most if you:
      </P>
      <UL>
        <li>Hold a GBP ISA or SIPP alongside a USD or EUR brokerage account.</li>
        <li>Invest through platforms that operate in multiple currencies — for example Vanguard UK (GBP) and Interactive Brokers (USD or EUR).</li>
        <li>Have foreign-currency savings, cash accounts, or overseas property to include in your total wealth picture.</li>
        <li>Earn in one currency and build wealth in another.</li>
        <li>Are an expat or plan to retire in a different country.</li>
        <li>Want to escape a spreadsheet that has become unreliable as your portfolio has grown.</li>
        <li>Value privacy over convenience and would rather not share credentials with a bank-linking aggregator.</li>
      </UL>

      <Divider />

      <H2>Common questions</H2>

      <div className="faq-grid">
        <div className="faq-card">
          <h3>What is a multi-currency portfolio tracker?</h3>
          <p>
            A multi-currency portfolio tracker is a tool that lets you record
            investments, savings, and other assets in their native currencies, then
            converts everything into one base currency so you can see your total
            wealth as a single coherent number. It handles the FX conversion
            automatically, so your portfolio total reflects current exchange rates
            rather than stale manual conversions.
          </p>
        </div>

        <div className="faq-card">
          <h3>How do I track investments in multiple currencies?</h3>
          <p>
            The cleanest approach is to record each account or holding in its own
            currency — GBP for your ISA, USD for your US brokerage — and let the
            tracker convert them into a single base currency. This keeps each
            position accurate in its native terms while giving you a reliable
            total. Paddock works this way: you set a base currency, add accounts
            in their real currencies, and the dashboard handles the rest.
          </p>
        </div>

        <div className="faq-card">
          <h3>Can I track ISAs, pensions, and savings together?</h3>
          <p>
            Yes. Paddock is designed to hold all of these in one place — ISAs,
            SIPPs, savings accounts, general investment accounts, property, and
            cash. Each account can be in its own currency. The dashboard
            aggregates them into one base-currency total so you can see total
            wealth clearly, not just individual account balances in isolation.
          </p>
        </div>

        <div className="faq-card">
          <h3>Do I need open banking or a bank connection?</h3>
          <p>
            No. Paddock is a manual-entry tracker. You enter balances yourself —
            typically once a month. This approach is better suited to long-term
            wealth tracking than live sync: it is more private, works for overseas
            accounts and brokers that open-banking tools cannot reach, and
            produces clean, deliberate data rather than noisy live transactions.
          </p>
        </div>

        <div className="faq-card">
          <h3>How does FX movement affect my total wealth?</h3>
          <p>
            When exchange rates move, the base-currency value of your foreign
            holdings changes even if the balances themselves are unchanged. A 5%
            GBP/USD move on a $120K account shifts its GBP value by around
            £4–5K. A good multi-currency tracker makes this visible rather than
            hiding it behind stale rates. That way you can tell the difference
            between genuine portfolio growth and pure FX noise.
          </p>
        </div>

        <div className="faq-card">
          <h3>Is Paddock only for UK investors?</h3>
          <p>
            Paddock is built with UK accounts and wrappers in mind — ISAs, SIPPs,
            the pension drawdown process — but anyone tracking multi-currency
            wealth can use it. The base currency is configurable, so you can work
            in GBP, USD, EUR, or another currency depending on where your
            financial life is centred.
          </p>
        </div>
      </div>

      <GuideCTA
        onClick={() => goTo('signup')}
        buttonText="Create your free account"
      >
        Track your portfolio and net worth across currencies — privately, clearly,
        without bank linking. Free to start.
      </GuideCTA>

      <H2>Related guides</H2>
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
