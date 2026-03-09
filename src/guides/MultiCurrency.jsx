import React from 'react'
import { GuideShell, H2, P, UL, Example, ProTip, GuideCTA, Divider, GuideLink } from '../components/GuideLayout'

export default function MultiCurrencyGuide({ navigateTo, goTo }) {
  return (
    <GuideShell title="Guide" onBack={() => navigateTo('/guides')} navigateTo={navigateTo}>
      <div className="guide-kicker">Multi-currency net worth tracker</div>

      <h1 className="guide-h1">Multi-currency net worth tracking explained</h1>

      <p className="guide-lead">
        If you hold assets in more than one currency — a GBP savings account, a
        USD brokerage, overseas property, or EUR cash — tracking your net worth
        in a single-currency spreadsheet quietly becomes inaccurate. A multi-currency
        net worth tracker solves this by converting everything into one base currency
        using up-to-date exchange rates, so your totals, milestones, and projections
        stay internally consistent.
      </p>

      <H2>The problem with mixing currencies</H2>
      <P>
        Without automatic conversion, what looks like a total is actually a pile
        of numbers in different units. Adding £80,000 + $120,000 + €15,000
        does not give you a meaningful net worth figure. Even if you convert
        manually once — say on 1 January — your reported total drifts as exchange
        rates move throughout the year. That drift can be substantial.
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
        reported net worth dropped by £3,900 purely from FX movement. If you were
        only checking once a quarter using stale rates, you would not know whether
        your progress was real or just currency noise.
      </Example>

      <H2>What a base currency does</H2>
      <P>
        Choosing a base currency means picking one reference unit — typically the
        currency you earn in, spend in, or plan to retire in — and converting
        all other holdings into that base for display and calculation. This gives
        you a single coherent number for your net worth, your milestones, and
        your projections.
      </P>
      <P>
        For most UK-based users, GBP is the natural base. If you are planning
        to retire abroad — say in Spain or Portugal — you might choose EUR instead.
        The important thing is consistency: all your tracking, projections, and
        milestones should use the same base.
      </P>

      <ProTip>
        The goal of multi-currency tracking is not to predict FX movements. It is
        to keep your dashboard internally consistent so that changes in your net
        worth reflect real financial decisions, not just rate fluctuations you have
        no control over.
      </ProTip>

      <H2>Why daily rate checking matters</H2>
      <P>
        Many people convert their balances manually once — when they first set up
        a tracker — and then leave those rates frozen. Over weeks and months, the
        conversion becomes increasingly stale. A 5% shift in GBP/USD, which is
        well within normal annual range, can move a $120K holding by £4,500 in
        GBP terms without you knowing.
      </P>
      <P>
        Daily FX checking does not mean you need to act on rate movements. It means
        your dashboard reflects reality. When you log in and see your net worth,
        the number is current — not a snapshot from three months ago.
      </P>

      <Divider />

      <H2>Common multi-currency tracking mistakes</H2>
      <UL>
        <li><strong>Adding raw amounts across currencies.</strong> £80K + $120K is not £200K. Without conversion, the total is meaningless — yet many spreadsheet trackers do exactly this.</li>
        <li><strong>Using stale exchange rates.</strong> A one-time conversion becomes progressively wrong. If you track monthly, a quarterly FX update introduces months of drift.</li>
        <li><strong>Switching base currencies inconsistently.</strong> Viewing your net worth in GBP one month and USD the next makes trend comparisons unreliable. Pick one base and keep it.</li>
        <li><strong>Ignoring FX impact on projections.</strong> A long-term projection that assumes your USD holdings stay constant in GBP terms is implicitly assuming stable exchange rates for decades. That is unlikely.</li>
        <li><strong>Not tracking overseas property in the right currency.</strong> If you own a property valued in EUR, tracking it in GBP without conversion means your net worth does not reflect the property's actual GBP equivalent.</li>
      </UL>

      <H2>Who benefits most from multi-currency tracking</H2>
      <P>
        Multi-currency net worth tracking is especially valuable if you:
      </P>
      <UL>
        <li>Earn in one currency but invest in another — for example, GBP salary with a US brokerage account.</li>
        <li>Hold a globally diversified portfolio across UK ISAs, US ETFs, or European funds.</li>
        <li>Own overseas property or have foreign cash holdings.</li>
        <li>Plan to relocate internationally in the next 5–15 years and want to understand your wealth in your future base currency.</li>
        <li>Are an expat with financial accounts spread across multiple countries.</li>
      </UL>

      <H2>How Paddock handles multi-currency tracking</H2>
      <P>
        Paddock supports multiple currencies per account. You set a base currency —
        typically GBP — and every account balance is converted using a daily exchange
        rate. Your net worth dashboard, milestones, trend charts, and projections all
        use the same base, so numbers stay coherent.
      </P>
      <P>
        This is designed around manual input rather than bank linking. You enter
        balances for each account — whether that is a Vanguard ISA in GBP, a
        Schwab brokerage in USD, or a savings account in EUR — and Paddock handles
        the conversion and aggregation. Pro extends this into long-horizon modelling with
        inflation-adjusted views and scenario comparisons — covered in
        the <a href="/guides/long-term-wealth-projection" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/long-term-wealth-projection') } }} className="guide-inline-link">long-term projection guide</a> and
        the <a href="/guides/inflation-adjusted-net-worth" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/inflation-adjusted-net-worth') } }} className="guide-inline-link">inflation-adjusted guide</a>.
      </P>

      <GuideCTA onClick={() => goTo('signup')}>
        Track your net worth across currencies with daily FX rates and
        a clear base-currency view. Free to start, no bank linking required.
      </GuideCTA>

      <H2>Next steps</H2>
      <div className="guide-links">
        <GuideLink to="/guides/long-term-wealth-projection" navigateTo={navigateTo}>
          How long-term wealth projections work →
        </GuideLink>
        <GuideLink to="/guides/inflation-adjusted-net-worth" navigateTo={navigateTo}>
          Inflation-adjusted net worth: real vs nominal →
        </GuideLink>
      </div>
    </GuideShell>
  )
}
