import React from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import SiteFooter from '../components/SiteFooter'
import SignupLink from '../components/SignupLink'
import AppStoreBadgeLink from '../components/AppStoreBadgeLink'
import { FaqSection, QuickAnswer, TableSection } from '../components/PageSections'
import { ArticleDates } from '../components/GuideLayout'
import { formatDate } from '../ukFigures'
import {
  PRO_COMPARISON, PRO_FAQS, PRO_PUBLISHED, PRO_QUICK_ANSWER, PRO_REVIEWED,
} from '../pageContent/paddockPro'
import { PRO_PRICE, TRIAL, ANNUAL_MONTHS_FREE } from '../planFacts'
import planShot from '/src/assets/landing/paddock-plan.png'
import planShotWebp from '/src/assets/landing/paddock-plan.webp'
import outlookShot from '/src/assets/landing/paddock-outlook.png'
import outlookShotWebp from '/src/assets/landing/paddock-outlook.webp'

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

function plainClick(navigateTo, to) {
  return (e) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault()
      navigateTo(to)
    }
  }
}

function Shot({ src, webp, alt, caption, width, height }) {
  return (
    <div className="shot-wrap">
      <div className="shot-frame">
        <picture>
          <source srcSet={webp} type="image/webp" />
          <img src={src} alt={alt} className="shot-image" loading="lazy" width={width} height={height} />
        </picture>
      </div>
      <p className="shot-caption">{caption}</p>
    </div>
  )
}

export default function PaddockPro({ navigateTo }) {
  return (
    <div className="landing-shell">
      <section className="hero-section hero-section-guide">
        <div className="container">
          <div className="page-topbar">
            <a href="/" onClick={plainClick(navigateTo, '/')} className="brand page-brand page-brand-lg">
              Paddock<span>.</span>
            </a>
            <a href="/" className="guide-back-link" onClick={plainClick(navigateTo, '/')}>
              Back to home
            </a>
          </div>
          <Breadcrumbs />
          <div className="hero-copy">
            <div className="hero-kicker">Paddock Pro</div>
            <h1>
              See when your plan
              <br />
              gets you there.
            </h1>
            <p className="hero-sub">
              Paddock brings your ISAs, pensions, savings, property and debts into one private
              dashboard. Pro adds the long view: projections from 5 to 40 years, a freedom
              timeline and scenarios you can compare side by side.
            </p>
            <div className="hero-actions">
              <SignupLink location="hero">Start free</SignupLink>
              <a href="#pro-pricing" className="btn btn-secondary">See pricing</a>
            </div>
            <div className="hero-tags">
              <span>A free plan to start</span>
              <span>Manual entry</span>
              <span>No bank login</span>
              <span>No ads</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <ArticleDates published={PRO_PUBLISHED} reviewed={PRO_REVIEWED} formatDate={formatDate} />
        <QuickAnswer>{PRO_QUICK_ANSWER}</QuickAnswer>

        <SectionLabel>What Paddock does</SectionLabel>
        <h2>One place for the whole picture.</h2>
        <p className="section-copy narrow">
          Most people hold their wealth in several places: a workplace pension, a SIPP, one or two
          ISAs, some savings, perhaps a property and a mortgage. Each provider shows its own slice,
          and none of them shows whether the whole is heading where you want it to. Paddock adds
          the slices together so you can see total net worth and how it is moving.
        </p>
        <p className="section-copy narrow">
          You enter balances yourself, typically once a month. That is deliberate: it keeps bank
          credentials out of the product entirely, and long-term wealth does not need minute-by-minute
          updates to be understood.
        </p>
      </section>

      <section className="section-border">
        <div className="container section">
          <SectionLabel>Who it is for</SectionLabel>
          <h2>Pro is for the long view. Free may be all you need.</h2>
          <div className="split-columns">
            <div>
              <h3>Pro tends to suit you if&hellip;</h3>
              <div className="line" />
              <p>
                You hold more than five accounts, you want to see where your current pace leads
                over 5 to 40 years, or you want to compare what a different monthly contribution
                would do to your timeline.
              </p>
            </div>
            <div>
              <h3>Free is probably enough if&hellip;</h3>
              <div className="line" />
              <p>
                You mainly want one clear, private view of what you have today and how it changes
                over time. The free plan covers that for up to five accounts, with a one-year
                projection.
              </p>
            </div>
            <div>
              <h3>Paddock is not the right tool if&hellip;</h3>
              <div className="line" />
              <p>
                You want transactions pulled in automatically, day-to-day budgeting, or advice on
                what to buy. Paddock does none of those, by design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col">
          <div>
            <SectionLabel>The long view</SectionLabel>
            <h2>A timeline, not just a number.</h2>
            <p className="section-copy narrow">
              With Pro, the Plan view takes your current balances, monthly contributions and an
              assumed return, projects your net worth forward, compares it with the target you
              set, and shows the age at which your plan could reach it. You can then compare
              scenarios, such as higher contributions or a one-off deposit, against your current
              path.
            </p>
            <p className="section-copy narrow">
              Projections are estimates built from assumptions you control. They are not
              forecasts or guarantees.
            </p>
          </div>
          <Shot
            src={planShot}
            webp={planShotWebp}
            width={2515}
            height={1700}
            alt="Paddock Plan view showing a projected outcome against a target, a freedom timeline and a comparison with higher contributions"
            caption="The Plan view: projected outcome against a target, the freedom timeline and a scenario comparison. Demo account with made-up figures."
          />
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col two-col-flip">
          <Shot
            src={outlookShot}
            webp={outlookShotWebp}
            width={1118}
            height={950}
            alt="Paddock trajectory chart showing projected net worth against the required path to a target, with the independence age and the effect of extra monthly contributions"
            caption="The trajectory: projected path against the required path. Demo account with made-up figures."
          />
          <div>
            <SectionLabel>Why total wealth matters</SectionLabel>
            <h2>Pots that look fine alone can still fall short together.</h2>
            <p className="section-copy narrow">
              A pension that looks healthy and an ISA that looks healthy say little about whether
              the combined position will fund the life you want. Seeing everything together, in
              one currency and in today&apos;s money if you choose, is what makes the gap visible
              early enough to do something about it.
            </p>
            <div className="pill-links section-top-gap-sm">
              <a href="/how-to-track-your-net-worth" className="pill-link" onClick={plainClick(navigateTo, '/how-to-track-your-net-worth')}>
                How to track your net worth →
              </a>
              <a href="/guides/how-much-do-i-need-to-retire-uk" className="pill-link" onClick={plainClick(navigateTo, '/guides/how-much-do-i-need-to-retire-uk')}>
                How much do I need to retire? →
              </a>
            </div>
          </div>
        </div>
      </section>

      <TableSection {...PRO_COMPARISON} />

      <section className="section-border">
        <div className="container section">
          <SectionLabel>Privacy and manual entry</SectionLabel>
          <h2>Built to need as little of your data as possible.</h2>
          <div className="split-columns">
            <div>
              <h3>No bank connection.</h3>
              <div className="line" />
              <p>
                Open-banking apps need access to your accounts to work. Paddock does not, so
                there are no bank credentials for us to store, and no connection to expire.
              </p>
            </div>
            <div>
              <h3>Only what you choose to enter.</h3>
              <div className="line" />
              <p>
                The only financial data Paddock holds is the balances and assumptions you type in.
                It is used to run your dashboard and projections. There are no ads, and no data
                is sold.
              </p>
            </div>
            <div>
              <h3>The trade-off, stated plainly.</h3>
              <div className="line" />
              <p>
                Automatic syncing saves time, and manual entry costs a few minutes a month. If you
                would rather never type a balance, an open-banking app will suit you better. We
                compare the options openly in our{' '}
                <a href="/best-net-worth-tracking-apps-uk" className="guide-inline-link" onClick={plainClick(navigateTo, '/best-net-worth-tracking-apps-uk')}>
                  UK net worth app comparison
                </a>
                .
              </p>
            </div>
          </div>
          <p className="section-copy narrow">
            Read the{' '}
            <a href="/privacy" className="guide-inline-link" onClick={plainClick(navigateTo, '/privacy')}>privacy page</a>
            {' '}and the{' '}
            <a href="/security" className="guide-inline-link" onClick={plainClick(navigateTo, '/security')}>security page</a>
            {' '}for the detail.
          </p>
        </div>
      </section>

      <section id="pro-pricing" className="section-border">
        <div className="container section">
          <SectionLabel>Pricing</SectionLabel>
          <h2>£{PRO_PRICE.monthly} a month, or £{PRO_PRICE.annual} a year.</h2>
          <p className="section-copy narrow">
            The annual plan works out at {ANNUAL_MONTHS_FREE === 2 ? 'two months free' : 'less than paying monthly'}.
            It starts with a {TRIAL.annualDays}-day trial for new subscribers; the monthly plan has
            no trial. On the web, billing is handled by Stripe. On iOS, the subscription is
            bought and managed through the App Store, and the price shown there when you
            subscribe is the one that applies.
          </p>
          <div className="hero-actions">
            <SignupLink location="pricing">Create a free account</SignupLink>
            <AppStoreBadgeLink location="pricing" />
          </div>
          <p className="section-copy narrow section-top-gap-sm">
            You can start on the free plan and upgrade from inside the app whenever you want to.
            Nothing here asks you to pay before you have seen the product.
          </p>
        </div>
      </section>

      <FaqSection faqs={PRO_FAQS} />

      <section className="section-border">
        <div className="container final-cta">
          <h2>Start free. Upgrade if it helps.</h2>
          <p className="section-copy center narrow-center">
            Add your accounts, see your net worth in one place, and decide later whether the long
            view is worth £{PRO_PRICE.monthly} a month to you.
          </p>
          <div className="hero-actions center">
            <SignupLink location="bottom">Create a free account</SignupLink>
            <a href="/tools" className="btn btn-secondary" onClick={plainClick(navigateTo, '/tools')}>
              Try the free calculators
            </a>
          </div>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
