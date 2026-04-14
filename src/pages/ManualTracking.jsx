import React from 'react'
import {
  GuideShell,
  H2,
  P,
  UL,
  Callout,
  GuideCTA,
  Divider,
  GuideLink,
} from '../components/GuideLayout'

export default function ManualTracking({ navigateTo, goTo }) {
  return (
    <GuideShell
      seoTitle="Why I Track Wealth Manually Instead of Using Open Banking Apps | Paddock"
      metaDescription="A founder's perspective on why manual, privacy-first wealth tracking can be better than open banking sync — for people with ISAs, pensions, multi-currency accounts, and a long time horizon."
      canonicalPath="/why-i-track-wealth-manually-instead-of-using-open-banking-apps"
      heroLabel="Founder perspective"
      backLabel="Back to Paddock"
      onBack={() => navigateTo('/')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Founder perspective</div>

      <h1 className="guide-h1">
        Why I track wealth manually instead of using open banking apps
      </h1>

      <p className="guide-lead">
        For a while, I wanted what most finance apps promised: one view, everything
        connected, no maintenance. Set it up once and the numbers update themselves.
        I understood the appeal. I still do. But the more serious my financial life
        became — a pension that mattered, savings in a second currency, ISAs
        accumulating in the background, a rough estimate on a property — the less I
        trusted what the synced total was telling me. Not because the technology was
        unreliable. Because I was never quite sure what it included and what it quietly
        left out.
      </p>

      <H2>What open banking tools get right</H2>
      <P>
        The automatic syncing model is genuinely good for certain things. If you want
        to see where your money went last month — which category absorbed your spending,
        whether a subscription renewed unexpectedly, how your food bill compared to
        last quarter — a connected tool does that better than anything manual. Setup
        is fast. Maintenance is close to zero for simple cases. For someone whose
        financial life fits neatly into two domestic bank accounts and a credit card,
        these tools deliver exactly what they promise.
      </P>
      <P>
        I want to be clear about that before going any further. This is not an argument
        that sync tools are bad. It is an argument that they are built for a particular
        kind of financial life, and that as your financial life gets more complex, the fit
        starts to show its edges.
      </P>

      <H2>Where the problems appeared</H2>
      <P>
        My situation is not especially complicated. But it does not fit the model those
        tools are built around.
      </P>
      <P>
        The pension had no open banking connection. I had to either ignore it or accept a
        figure from a provider integration that sometimes worked and sometimes showed
        nothing. The EUR savings account was invisible entirely — not a UK provider, not
        supported. The ISA values were updated on a delay, sometimes days behind. The
        property was something I estimated myself and entered manually anyway, because
        nobody was going to sync it for me.
      </P>
      <P>
        At some point I looked at the net worth total these tools were showing me and
        realised I was looking at an incomplete picture, presented with confidence. The
        problem was not the number being slightly off. The problem was not knowing{' '}
        <em>how</em> off it was — or what was missing.
      </P>
      <P>
        There is also the question of what these tools are primarily built for. The UX —
        the spending graphs, the category breakdowns, the weekly budget summaries — is
        designed around spending awareness. Which is useful. But it is not the same as
        wealth tracking. Knowing where money went is different from understanding what
        you have and where it is heading. The framing shapes what you end up paying
        attention to, and I kept finding myself looking at transaction noise instead of
        long-term position.
      </P>
      <P>
        Finally, there is the privacy question. I want to be precise here, because this
        can slide into something it is not. Open banking is a regulated standard. The
        companies that implement it go through proper authorisation processes. This is not
        an argument that sync tools are dangerous.
      </P>
      <P>
        But there is still something worth considering. When you connect a financial account
        to a third-party aggregator, you are extending a chain: your account, your
        provider, the aggregation layer, the app. That chain can work correctly for years.
        It can also break, change terms, or be acquired by someone whose data practices
        differ from the original. For a spending overview, that trade-off is probably fine.
        For tracking wealth — where the balances are larger, the account types more
        sensitive, and the time horizon measured in decades — I found I wanted less chain
        sitting between me and my numbers, not more.
      </P>

      <Divider />

      <H2>What I found when I started entering the numbers myself</H2>
      <P>
        I started a spreadsheet. Not because I wanted to maintain a spreadsheet, but
        because it was the only way to include everything — the pension, the EUR account,
        the ISAs, the property estimate, the mortgage balance. I needed one place where
        I could add any account in any currency and get one honest total.
      </P>
      <P>
        What I did not expect was that the act of entering the numbers would change how
        I related to them.
      </P>
      <P>
        Once a month, I sit down and type in the real balances. I check the pension value.
        I look up the EUR rate and convert the savings account. I update the property
        estimate. I adjust the mortgage. By the time I am done — fifteen or twenty minutes,
        usually — I understand exactly where I am. Not because a chart told me. Because
        I just touched every number myself.
      </P>
      <P>
        That is a different quality of knowing. It is slower. It is also more trustworthy.
      </P>

      <Callout>
        Deliberate is not a workaround for automation. It is a different relationship with
        the numbers — and for serious wealth tracking, I have come to believe it is the
        better one.
      </Callout>

      <H2>Who this matters most for</H2>
      <P>
        This argument is not universal. It is specific to a certain kind of financial life.
        The manual approach makes the most sense if:
      </P>
      <UL>
        <li>
          Your wealth is spread across ISAs, a pension or SIPP, cash savings, and
          possibly a property or overseas account — more accounts than any single sync
          tool covers cleanly.
        </li>
        <li>
          You are thinking in decades rather than months. Building toward financial
          independence, planning a pension drawdown, or simply trying to see what your
          wealth looks like at a twenty-year horizon — that kind of thinking needs a
          wealth view, not a spending view.
        </li>
        <li>
          Privacy matters to you. Not in a conspiratorial way. Just in the sense that you
          would rather understand and control what sits between you and your most
          significant financial accounts.
        </li>
        <li>
          You have tried aggregator tools and felt vaguely unsatisfied — like the number
          looked plausible but you could not quite trust it.
        </li>
        <li>
          You have a spreadsheet that works but is becoming fragile: hard to update on
          mobile, missing FX automation, accumulating formulas you have to explain to
          yourself every time you open it.
        </li>
      </UL>

      <H2>Where Paddock comes in</H2>
      <P>
        I built Paddock because I wanted a better version of what I was doing in a
        spreadsheet.
      </P>
      <P>
        The core of it:{' '}
        <a
          href="/guides/multi-currency-net-worth-tracker"
          className="guide-inline-link"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/guides/multi-currency-net-worth-tracker')
            }
          }}
        >
          multi-currency accounts
        </a>{' '}
        with daily FX rates. ISAs, SIPPs, savings, property, and liabilities in one place.
        Long-term projections. Clean net worth snapshots over time. A dashboard that
        tracks wealth rather than transactions. And no bank connection required — at any
        point, for any feature.
      </P>
      <P>
        The accounts are added manually. The balances are updated by you. That is not a
        limitation of the product. It is the point of it.
      </P>
      <P>
        If you are specifically thinking about retirement and pension planning, the{' '}
        <a
          href="/tools/pension-drawdown-calculator"
          className="guide-inline-link"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/tools/pension-drawdown-calculator')
            }
          }}
        >
          pension drawdown calculator
        </a>{' '}
        is a free tool on the site — no account required. If you want to see how Paddock
        compares to other options, there is a longer comparison on the{' '}
        <a
          href="/best-net-worth-tracking-apps-uk"
          className="guide-inline-link"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/best-net-worth-tracking-apps-uk')
            }
          }}
        >
          best net worth tracking apps UK
        </a>{' '}
        page.
      </P>

      <H2>The honest trade-off</H2>
      <P>
        Manual entry takes time. Not a lot — for most people, twenty minutes a month is
        enough to update a complete wealth picture. But it is not zero. If frictionless,
        fully automatic sync is what you need above all else, there are better tools for
        that, and you should use them.
      </P>
      <P>
        Paddock is built for the people for whom that trade-off is worth making: because
        the accounts do not fit neatly into what sync tools cover, because the privacy
        posture matters, or because deliberate tracking is simply a better fit for how
        they want to manage their financial life.
      </P>

      <Divider />

      <P>
        Convenience and trust are not the same thing. For a daily spending overview, they
        usually point in the same direction. For tracking real wealth — across years,
        currencies, and account types that do not always sit neatly inside automated tools —
        they sometimes point in opposite directions.
      </P>
      <P>
        Deliberate beats fragile. That is what Paddock is built on.
      </P>

      <GuideCTA
        onClick={() => goTo('signup')}
        buttonText="Try Paddock — it's free"
      >
        Private, manual-entry wealth tracking for ISAs, pensions, savings, property,
        and multi-currency accounts. No bank connection required.
      </GuideCTA>

      <H2>Related</H2>
      <div className="guide-links">
        <GuideLink to="/guides/multi-currency-net-worth-tracker" navigateTo={navigateTo}>
          Multi-currency portfolio tracker guide →
        </GuideLink>
        <GuideLink to="/best-net-worth-tracking-apps-uk" navigateTo={navigateTo}>
          Best net worth tracking apps UK — comparison →
        </GuideLink>
      </div>
    </GuideShell>
  )
}
