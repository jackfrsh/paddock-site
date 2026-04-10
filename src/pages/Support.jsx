import React from "react";
import { GuideShell } from "../components/GuideLayout.jsx";

export default function Support({ navigateTo }) {
  return (
    <GuideShell
      seoTitle="Support | Paddock"
      metaDescription="Contact Paddock support for help with your account, billing, bug reports, or general questions. Email hello@getpaddock.com for fast assistance."
      canonicalPath="/support"
      heroLabel="Support"
      navigateTo={navigateTo}
      onBack={() => navigateTo("/")}
      backLabel="Back to Paddock"
    >
      <main className="min-h-screen text-white">
        <section className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
              Support
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Help with Paddock
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Need help with your account, billing, or something that does not
              look right? Email us and we will take a look.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-semibold tracking-tight">
                Contact support
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                The best way to reach us is by email. Include as much detail as
                you can so we can help quickly.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Email
                </div>

                <a
                  href="mailto:hello@getpaddock.com"
                  className="mt-2 inline-block text-lg font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white/60"
                >
                  hello@getpaddock.com
                </a>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-sm font-medium text-white">
                    Good things to include
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                    <li>What happened</li>
                    <li>What you expected to happen</li>
                    <li>Your device model and iOS version</li>
                    <li>Screenshots, if helpful</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-sm font-medium text-white">
                    We can help with
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                    <li>Account access</li>
                    <li>Billing and subscriptions</li>
                    <li>Bug reports</li>
                    <li>General product questions</li>
                  </ul>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <h2 className="text-lg font-semibold tracking-tight">
                  Before you email
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/68">
                  <li>Make sure you are on the latest version of the app.</li>
                  <li>
                    Check that your internet connection is working normally.
                  </li>
                  <li>
                    For billing issues, include the Apple receipt screenshot if
                    relevant.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <h2 className="text-lg font-semibold tracking-tight">Legal</h2>
                <div className="mt-4 space-y-3 text-sm text-white/68">
                  <a
                    className="block underline decoration-white/20 underline-offset-4 hover:decoration-white/60"
                    href="/privacy"
                  >
                    Privacy Policy
                  </a>
                  <a
                    className="block underline decoration-white/20 underline-offset-4 hover:decoration-white/60"
                    href="/terms"
                  >
                    Terms of Use
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </GuideShell>
  );
}