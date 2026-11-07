import React from 'react'
import { GuideShell, H2, P, UL } from '../components/GuideLayout'

export default function Privacy({ navigateTo }) {
  return (
    <GuideShell
  canonicalPath="/privacy"
  onBack={() => navigateTo('/')}
  navigateTo={navigateTo}
  backLabel="Back to Paddock"
>
      <div className="guide-kicker">Privacy</div>
      <h1 className="guide-h1">Privacy at Paddock</h1>

      <p className="guide-lead">
        Paddock is designed to help you understand your wealth without turning your data into a product.
        Data collection is minimal, product decisions are straightforward, and the ad-driven patterns
        common in consumer finance tools have no place here.
      </p>

      <H2>Built around privacy</H2>
      <P>
        Paddock is built around manual input, clear modelling, and a private dashboard experience.
        The product exists to help you track and plan with intention — not to maximise engagement
        through advertising or unnecessary data collection.
      </P>

      <H2>No advertising model</H2>
      <P>
        Paddock is not supported by third-party advertising. There are no ad networks, no tracking
        pixels, and no data shared with advertisers. The experience is designed to remain focused,
        calm, and free from ad clutter.
      </P>

      <H2>No bank linking</H2>
      <P>
        Paddock does not require bank connections to function. You can build and maintain your
        wealth model without granting access to your financial accounts. You choose what you
        enter, and you can ask for a copy of your data or for it to be deleted.
      </P>

      <H2>Authentication and billing</H2>
      <P>
        Account sign-in and password management are handled through industry-standard authentication
        infrastructure with secure session handling. Billing and subscription management are processed
        by Stripe. These services support secure access and paid plans — they are not used to build
        an advertising profile or share data with third parties.
      </P>

      <H2>Data handling</H2>
      <P>
        The information you enter into Paddock — account balances, goals, and planning assumptions — is
        stored securely and used solely to power your dashboard and projections. It is not sold, shared
        with third parties, or used for purposes beyond operating the product.
      </P>

      <H2>This website</H2>
      <P>
        The calculators and guides on getpaddock.com run in your browser. The figures you type
        into a calculator are not sent to us, stored, or placed in the page address.
      </P>
      <P>
        We count how the website is used, in aggregate, so we can see which pages help and which
        do not. Two things do this:
      </P>
      <UL>
        <li>
          <strong>Cloudflare Web Analytics</strong> counts page views, where visits came from
          and how quickly pages load. Cloudflare describes it as cookieless and as not tracking
          visitors across sites.
        </li>
        <li>
          <strong>A small counter of anonymous events</strong> runs on our own Cloudflare
          account. It records that a calculator was used or completed, or that a sign-up or App
          Store link was clicked, with the page it happened on and a broad category for how the
          visit began (search, direct, social or other). Each event is a fixed label from a
          short list. It contains no figures, nothing you typed and no identifier, we do not
          store your IP address or browser details with it, and it is not linked to any account.
          Events are kept for up to three months. If your browser sends Global Privacy Control
          or Do Not Track, this counter records nothing.
        </li>
      </UL>
      <P>
        Our own counter sets no cookies and uses none of your browser&apos;s storage, and Cloudflare
        says the same of Web Analytics. We do not use Google Analytics, advertising pixels or
        social media trackers on this website.
      </P>
      <P>
        Links from this website to the sign-up page include a short label naming the page you
        came from, such as the name of a calculator, so we can see which pages lead to accounts.
        It contains nothing you typed.
      </P>

      <H2>Contact</H2>
      <P>
        If you have questions about how Paddock handles your data, you can reach us
        at hello@getpaddock.com.
      </P>
    </GuideShell>
  )
}
