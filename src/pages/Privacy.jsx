import React from 'react'
import { GuideShell, H2, P, UL } from '../components/GuideLayout'
import { websiteMeasurementCopy } from '../privacyCopy'

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

      <H2>Who processes your data</H2>
      <P>
        Paddock does not sell your data, does not use it for advertising and does not share it with
        anyone for their own purposes. To run the service, though, some providers process data on our
        behalf, and you should know who they are:
      </P>
      <UL>
        <li><strong>Supabase</strong> handles sign-in and password management for the app.</li>
        <li><strong>Railway</strong> hosts the app and its database, where your accounts, balances, goals and planning assumptions are stored.</li>
        <li><strong>Stripe</strong> processes card payments for Paddock Pro bought on the web, and <strong>Apple</strong> processes payments for Paddock Pro bought through the App Store.</li>
        <li><strong>Google</strong> handles sign-in if you choose &ldquo;Continue with Google&rdquo;.</li>
      </UL>
      <P>
        These providers process data only to provide their service to us. They are not used to build an
        advertising profile of you.
      </P>

      <H2>Data handling</H2>
      <P>
        The information you enter into Paddock, such as account balances, goals and planning
        assumptions, is stored in the app&apos;s database and used to power your dashboard and
        projections. You can ask for a copy of your data or for it to be deleted, and deleting your
        account removes it from the app.
      </P>

      <H2>This website</H2>
      {websiteMeasurementCopy().map((block, i) => (
        block.type === 'ul' ? (
          <UL key={i}>
            {block.items.map((item) => (
              <li key={item.strong}><strong>{item.strong}</strong>{item.text}</li>
            ))}
          </UL>
        ) : <P key={i}>{block.text}</P>
      ))}

      <H2>Contact</H2>
      <P>
        If you have questions about how Paddock handles your data, you can reach us
        at hello@getpaddock.com.
      </P>
    </GuideShell>
  )
}
