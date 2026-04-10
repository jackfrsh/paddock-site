import { GuideLayout } from "../components/GuideLayout.jsx";
import { SiteFooter }from "../components/SiteFooter.jsx";

export default function Support() {
  return (
    <GuideLayout>
      <main className="mx-auto max-w-2xl px-4 py-16 text-slate-100">
        <h1 className="text-3xl font-semibold mb-4 tracking-tight">Support</h1>
        <p className="mb-8 text-lg text-slate-300">
          Need help or have a question? We’re here to help. Reach out and we’ll get back to you as soon as possible.
        </p>

        <section className="mb-10">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-medium mb-2">Contact Support</h2>
            <p className="mb-2 text-slate-300">
              Email us at{" "}
              <a href="mailto:hello@getpaddock.com" className="underline hover:text-blue-300">
                hello@getpaddock.com
              </a>
            </p>
            <p className="text-slate-400 text-sm">
              We aim to respond within 1 business day.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-medium mb-2">What to include in bug reports</h2>
            <ul className="list-disc pl-5 text-slate-300 text-base space-y-1">
              <li>What happened</li>
              <li>What you expected to happen</li>
              <li>Your device and iOS version</li>
              <li>Screenshots (if possible)</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-medium mb-2">We can help with</h2>
            <ul className="list-disc pl-5 text-slate-300 text-base space-y-1">
              <li>Account access</li>
              <li>Billing & subscriptions</li>
              <li>Bug reports</li>
              <li>General questions</li>
            </ul>
          </div>
        </section>

        <div className="flex gap-6 mt-8 text-slate-400 text-sm">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </main>
      <SiteFooter />
    </GuideLayout>
  );
}