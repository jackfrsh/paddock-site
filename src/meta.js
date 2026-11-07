import { breadcrumbList } from './breadcrumbs.js'
import { PUBLIC_ROUTES } from './seoRoutes.js'
import { HOME_FAQS } from './homeFaqs.js'
import { MONEYHUB_FAQS } from './moneyhubFaqs.js'
import { HOWTO_FAQS } from './pageContent/howToTrackNetWorth.js'
import { NWT_FAQS } from './pageContent/netWorthTracker.js'
import { SHEET_FAQS } from './pageContent/spreadsheetAlternative.js'
import { PRO_FAQS } from './pageContent/paddockPro.js'
import { TRACK_ISAS_FAQS } from './pageContent/trackIsas.js'

const faqPage = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
})

export const PAGE_META = {
  support: {
    title: 'Support | Paddock',
    description:
      'Contact Paddock support for help with your account, billing, bug reports, or general questions. Email hello@getpaddock.com for fast assistance.',
    canonical: 'https://getpaddock.com/support',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Support',
      url: 'https://getpaddock.com/support',
      description:
        'Contact Paddock support for help with your account, billing, bug reports, or general questions. Email hello@getpaddock.com for fast assistance.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  landing: {
    title: 'Paddock | Private UK Wealth Tracker & Net Worth Planner',
    description:
      'Track your net worth, ISAs, pensions, savings, investments and long-term goals in one private UK wealth dashboard. No bank linking, no ads, no data selling.',
    canonical: 'https://getpaddock.com/',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://getpaddock.com/#organization',
          name: 'Paddock',
          url: 'https://getpaddock.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://getpaddock.com/icon-512.png',
            width: 512,
            height: 512,
          },
          description:
            'A private UK wealth tracker and net worth planner for ISAs, pensions, savings, investments, property and long-term goals. No bank linking, no ads, no data selling.',
        },
        {
          '@type': 'WebSite',
          '@id': 'https://getpaddock.com/#website',
          name: 'Paddock',
          url: 'https://getpaddock.com/',
          publisher: { '@id': 'https://getpaddock.com/#organization' },
          inLanguage: 'en-GB',
        },
        {
          '@type': 'WebApplication',
          name: 'Paddock',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web, iOS',
          url: 'https://getpaddock.com/',
          publisher: { '@id': 'https://getpaddock.com/#organization' },
          description:
            'Track your net worth, ISAs, pensions, savings, investments and long-term goals in one private UK wealth dashboard. Manual entry, no bank linking, no ads, no data selling.',
        },
        {
          '@type': 'FAQPage',
          mainEntity: HOME_FAQS.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      ],
    },
  },

  guides_index: {
    title: 'Guides — Wealth Tracking & Planning | Paddock',
    description:
      'Clear, practical guides on long-term wealth projections, multi-currency net worth tracking, and inflation-adjusted planning.',
    canonical: 'https://getpaddock.com/guides',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Paddock Guides',
      url: 'https://getpaddock.com/guides',
      description:
        'Clear, practical guides on long-term wealth projections, multi-currency net worth tracking, and inflation-adjusted planning.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  guide_multi_currency: {
    title: 'Multi-Currency Net Worth Tracker UK | Paddock',
    description:
      'Track ISAs, pensions, savings and investments across GBP, USD, EUR and more in one base-currency net worth view. Private, manual entry — no bank linking.',
    canonical: 'https://getpaddock.com/guides/multi-currency-net-worth-tracker',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Multi-Currency Portfolio Tracker — Track Investments Across Currencies',
      description:
        'Track investments, ISAs, pensions, savings, and other accounts across GBP, USD, EUR and more in one base-currency view. No bank connection required.',
      url: 'https://getpaddock.com/guides/multi-currency-net-worth-tracker',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  guide_long_term_projection: {
    title: 'How Long-Term Wealth Projections Work | Paddock',
    description:
      'How long-term wealth projections work, what drives them, and how to use compound growth and contribution modelling to plan 5–40 years ahead.',
    canonical: 'https://getpaddock.com/guides/long-term-wealth-projection',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How Long-Term Wealth Projections Actually Work',
      description:
        'How long-term wealth projections work, what drives them, and how to use compound growth and contribution modelling to plan 5–40 years ahead.',
      url: 'https://getpaddock.com/guides/long-term-wealth-projection',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  guide_inflation_adjusted: {
    title: 'Inflation-Adjusted Net Worth: Real vs Nominal | Paddock',
    description:
      'Why inflation-adjusted net worth matters for long-term planning, with worked examples showing the difference between nominal and real-terms projections.',
    canonical: 'https://getpaddock.com/guides/inflation-adjusted-net-worth',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Inflation-Adjusted Net Worth: Why Real Terms Matter',
      description:
        'Why inflation-adjusted net worth matters for long-term planning, with worked examples showing the difference between nominal and real-terms projections.',
      url: 'https://getpaddock.com/guides/inflation-adjusted-net-worth',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  privacy: {
    title: 'Privacy | Paddock',
    description:
      'How Paddock handles your data: no ads, no bank linking, no tracking. Privacy built into the product.',
    canonical: 'https://getpaddock.com/privacy',
    ogType: 'website',
  },

  security: {
    title: 'Security | Paddock',
    description:
      'How Paddock keeps your data secure: industry-standard authentication, Stripe billing, encrypted connections.',
    canonical: 'https://getpaddock.com/security',
    ogType: 'website',
  },

  terms: {
    title: 'Terms of Use | Paddock',
    description: 'Terms of use for Paddock, the personal wealth dashboard.',
    canonical: 'https://getpaddock.com/terms',
    ogType: 'website',
  },

  net_worth_tracker: {
    title: 'Net Worth Tracker UK | Manual Wealth Tracking | Paddock',
    description:
      'Track cash, investments, pensions, property and liabilities in one privacy-first UK net worth tracker. Manual entry, no bank linking.',
    canonical: 'https://getpaddock.com/net-worth-tracker',
    ogType: 'website',
    jsonLd: faqPage(NWT_FAQS),
  },

  track_isas_pensions_savings: {
    title: 'Track ISAs, Pensions and Savings Together | Paddock',
    description:
      'See ISAs, pensions and savings together in one calm wealth dashboard. Track long-term progress clearly with privacy-first manual tracking.',
    canonical: 'https://getpaddock.com/track-isas-pensions-savings',
    ogType: 'website',
    jsonLd: faqPage(TRACK_ISAS_FAQS),
  },

  spreadsheet_alternative: {
    title: 'Spreadsheet Alternative for Net Worth Tracking | Paddock',
    description:
      'Replace fragile spreadsheets with a calmer way to track net worth, progress and long-term wealth in one premium dashboard.',
    canonical: 'https://getpaddock.com/spreadsheet-alternative-net-worth-tracking',
    ogType: 'website',
    jsonLd: faqPage(SHEET_FAQS),
  },

  how_to_track_net_worth: {
    title: 'How to Track Your Net Worth Manually | Paddock',
    description:
      'Learn how to track your net worth clearly, including what to include, how often to update it, and why consistency matters more than noise.',
    canonical: 'https://getpaddock.com/how-to-track-your-net-worth',
    ogType: 'website',
    jsonLd: faqPage(HOWTO_FAQS),
  },

  paddock_pro: {
    title: 'Paddock Pro: What It Includes and Costs | Paddock',
    description:
      'See what Paddock Pro adds to the free UK net worth tracker: 5 to 40 year projections, a freedom timeline and scenario comparison. £6 a month or £60 a year.',
    canonical: 'https://getpaddock.com/paddock-pro',
    ogType: 'website',
    jsonLd: faqPage(PRO_FAQS),
  },

  tools_hub: {
    title: 'UK Wealth Calculators | Pension, FIRE & Net Worth | Paddock',
    description:
      'Free UK wealth calculators for pension drawdown, FIRE, ISA growth and net worth tracking. No login required; numbers stay in your browser.',
    canonical: 'https://getpaddock.com/tools',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'UK Wealth Calculators',
      url: 'https://getpaddock.com/tools',
      description:
        'Free UK wealth calculators for pension drawdown, FIRE, ISA growth and net worth tracking. No login required.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  tools_retirement_bridge: {
    title: 'ISA Retirement Bridge Calculator UK | Paddock',
    description:
      'Estimate how much you may need in ISA, cash or other accessible savings to bridge the gap between stopping work and accessing pension income.',
    canonical: 'https://getpaddock.com/tools/retirement-bridge-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'ISA Retirement Bridge Calculator UK',
      url: 'https://getpaddock.com/tools/retirement-bridge-calculator',
      description:
        'Estimate how much you may need in ISA, cash or other accessible savings to bridge the gap between stopping work and accessing pension income.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  founder_manual_tracking: {
    title: 'Why I Track Wealth Manually, Not Open Banking Apps | Paddock',
    description:
      "A founder's take on why manual, privacy-first wealth tracking can beat open banking sync — for people with ISAs, pensions and multi-currency accounts.",
    canonical:
      'https://getpaddock.com/why-i-track-wealth-manually-instead-of-using-open-banking-apps',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Why I Track Wealth Manually Instead of Using Open Banking Apps',
      description:
        "A founder's perspective on manual entry, privacy, and why deliberate wealth tracking can be better than automatic sync for people with complex UK accounts.",
      url: 'https://getpaddock.com/why-i-track-wealth-manually-instead-of-using-open-banking-apps',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  best_net_worth_apps_uk: {
    title: 'Best Net Worth Tracking Apps UK | Manual Wealth Tracking | Paddock',
    description:
      'Compare UK net worth tracking apps including Paddock, Emma and spreadsheets for ISAs, pensions, savings and multi-currency wealth.',
    canonical: 'https://getpaddock.com/best-net-worth-tracking-apps-uk',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Best Net Worth Tracking Apps UK — Comparison & Review',
          description:
            'A practical comparison of the best net worth tracking apps in the UK for users tracking ISAs, pensions, savings, and multi-currency wealth.',
          url: 'https://getpaddock.com/best-net-worth-tracking-apps-uk',
          inLanguage: 'en-GB',
          isPartOf: { '@type': 'WebSite', name: 'Paddock', url: 'https://getpaddock.com' },
          publisher: { '@type': 'Organization', name: 'Paddock', url: 'https://getpaddock.com' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is the best net worth tracking app in the UK?',
              acceptedAnswer: { '@type': 'Answer', text: 'It depends on what you are trying to do. If you want automatic syncing and spending insights, Emma is a strong option. If you want a private, deliberate view of total wealth — ISAs, pensions, savings, property, and multi-currency accounts — with long-term projections and no bank linking, Paddock is built for that.' },
            },
            {
              '@type': 'Question',
              name: 'Can I track pensions and ISAs in one place?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes — Paddock is specifically designed to hold UK wealth accounts together. You can add a Stocks & Shares ISA, a SIPP, cash savings, and other accounts side by side, with everything converted into one base-currency net worth figure.' },
            },
            {
              '@type': 'Question',
              name: 'Do I need open banking to track my net worth?',
              acceptedAnswer: { '@type': 'Answer', text: 'No. Paddock is entirely manual-entry — there is no open banking, no bank credential sharing, and no third-party sync. You enter your own balances.' },
            },
            {
              '@type': 'Question',
              name: 'Are manual net worth trackers better for privacy?',
              acceptedAnswer: { '@type': 'Answer', text: 'Generally, yes. Open banking tools require you to share credentials or grant access to your financial accounts. With a manual tracker like Paddock, nothing is shared — you enter numbers yourself, and the data stays in the app.' },
            },
            {
              '@type': 'Question',
              name: 'What if I already use a spreadsheet?',
              acceptedAnswer: { '@type': 'Answer', text: 'Spreadsheets work well until they do not — usually when the number of accounts grows, FX rates need to be maintained, projections become complicated, or mobile access matters. Paddock handles those parts automatically, while keeping the deliberate manual-entry approach.' },
            },
            {
              '@type': 'Question',
              name: 'Is there a UK net worth tracker that works without bank linking?',
              acceptedAnswer: { '@type': 'Answer', text: 'Paddock is built specifically for this. It is a manual-entry, privacy-first wealth tracker with UK account types — ISAs, SIPPs, savings, property — multi-currency support with daily FX rates, and long-term projections. No bank connection is required at any point.' },
            },
          ],
        },
      ],
    },
  },

  tools_net_worth: {
    title: 'Net Worth Calculator UK | Assets, Pensions & Debts | Paddock',
    description:
      'Free UK net worth calculator for cash, investments, pensions, property and debts. Supports multi-currency and manual private tracking.',
    canonical: 'https://getpaddock.com/tools/net-worth-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Net Worth Calculator UK',
      url: 'https://getpaddock.com/tools/net-worth-calculator',
      description:
        'Free UK net worth calculator. Total your assets and liabilities — cash, investments, pensions, property, and debts — with optional multi-currency support.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  guide_how_much_retire_uk: {
    title: 'How Much Do I Need to Retire in the UK? | Paddock',
    description:
      'A step-by-step way to estimate the pot you need to retire in the UK: income wanted, minus State Pension, divided by a withdrawal rate, with worked examples and sources.',
    canonical: 'https://getpaddock.com/guides/how-much-do-i-need-to-retire-uk',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How Much Do I Need to Retire in the UK?',
      description:
        'A step-by-step way to estimate the pot you need to retire in the UK, with worked examples and primary sources.',
      url: 'https://getpaddock.com/guides/how-much-do-i-need-to-retire-uk',
      inLanguage: 'en-GB',
      author: { '@type': 'Organization', name: 'Paddock', url: 'https://getpaddock.com' },
      isPartOf: { '@type': 'WebSite', name: 'Paddock', url: 'https://getpaddock.com' },
      publisher: { '@type': 'Organization', name: 'Paddock', url: 'https://getpaddock.com' },
    },
  },

  guide_pension_drawdown_explained: {
    title: 'Pension Drawdown Explained (UK) | Paddock',
    description:
      'How flexi-access pension drawdown works in the UK: the tax-free 25%, tax on the rest, the money purchase annual allowance, the main risks and the alternatives.',
    canonical: 'https://getpaddock.com/guides/pension-drawdown-explained',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Pension Drawdown Explained',
      description:
        'How flexi-access pension drawdown works in the UK, with the rules, risks and alternatives and links to primary sources.',
      url: 'https://getpaddock.com/guides/pension-drawdown-explained',
      inLanguage: 'en-GB',
      author: { '@type': 'Organization', name: 'Paddock', url: 'https://getpaddock.com' },
      isPartOf: { '@type': 'WebSite', name: 'Paddock', url: 'https://getpaddock.com' },
      publisher: { '@type': 'Organization', name: 'Paddock', url: 'https://getpaddock.com' },
    },
  },

  tools_retirement_age: {
    title: 'Retirement Age Calculator UK | When Can I Retire? | Paddock',
    description:
      'Free UK retirement age calculator. See the earliest age your savings could cover the income you want, including the gap before your State Pension starts.',
    canonical: 'https://getpaddock.com/tools/retirement-age-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Retirement Age Calculator UK',
      url: 'https://getpaddock.com/tools/retirement-age-calculator',
      description:
        'Free retirement age calculator. Find the earliest age your savings could cover your income, allowing for the years before your State Pension starts.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  tools_isa_growth: {
    title: 'ISA Growth Calculator UK — Project Your ISA Value | Paddock',
    description:
      'Free ISA growth calculator. Enter your balance, monthly contributions and return to project your ISA over time, with a 3% / 5% / 7% comparison.',
    canonical: 'https://getpaddock.com/tools/isa-growth-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'ISA Growth Calculator UK',
      url: 'https://getpaddock.com/tools/isa-growth-calculator',
      description:
        'Free ISA growth calculator. Project your Stocks and Shares ISA over 5, 10, 20 or 30 years with a 3%, 5%, and 7% return comparison.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  tools_fire_number: {
    title: 'FIRE Number Calculator UK | Financial Independence | Paddock',
    description:
      'Free UK FIRE number calculator. Estimate your financial independence target, progress and timeline from spending and withdrawal assumptions.',
    canonical: 'https://getpaddock.com/tools/fire-number-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'FIRE Number Calculator UK',
      url: 'https://getpaddock.com/tools/fire-number-calculator',
      description:
        'Free FIRE number calculator. Find your financial independence target, track progress, and see how the 3.5%, 4%, and 4.5% withdrawal rates compare.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  moneyhub_alternative: {
    title: 'Moneyhub Alternatives (2026): UK Wealth Trackers Compared',
    description:
      'Moneyhub\'s consumer app has closed. Compare the best UK alternatives for tracking ISAs, SIPPs and net worth: Paddock, WealthR, WealthView and Emma.',
    canonical: 'https://getpaddock.com/moneyhub-alternative',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Moneyhub has closed — here are the best alternatives for UK investors',
          description:
            'An honest comparison of Paddock, WealthR, WealthView and Emma for UK users who used Moneyhub, whose consumer app closed in August 2026.',
          url: 'https://getpaddock.com/moneyhub-alternative',
          dateModified: '2026-11-06',
          inLanguage: 'en-GB',
          isPartOf: {
            '@type': 'WebSite',
            name: 'Paddock',
            url: 'https://getpaddock.com',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Paddock',
            url: 'https://getpaddock.com',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: MONEYHUB_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
      ],
    },
  },

  tools_phased_drawdown: {
    title: 'Phased Pension Drawdown Calculator UK | Paddock',
    description:
      'Free UK pension drawdown calculator with phased income — more early, less later. Model your bridge to State Pension and see if you can retire early.',
    canonical: 'https://getpaddock.com/tools/phased-drawdown-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Phased Pension Drawdown Calculator UK',
      url: 'https://getpaddock.com/tools/phased-drawdown-calculator',
      description:
        'Model phased retirement income and the bridge to State Pension. Compares a phased plan against a flat income-for-life plan, in today’s money.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },

  tools_pension_drawdown: {
    title: 'Pension Drawdown Calculator UK | How Long Will It Last? | Paddock',
    description:
      'Free UK pension drawdown calculator. Estimate how long your pension or SIPP could last with drawdown and withdrawal assumptions.',
    canonical: 'https://getpaddock.com/tools/pension-drawdown-calculator',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Pension Drawdown Calculator UK',
      url: 'https://getpaddock.com/tools/pension-drawdown-calculator',
      description:
        'Free UK pension drawdown calculator. Project how long your pension pot could last in drawdown, with a 3%/4%/5% withdrawal comparison.',
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Paddock',
        url: 'https://getpaddock.com',
      },
    },
  },
}

/* Every public page except the home page gets a BreadcrumbList, built from the
   same trail data as the visible breadcrumbs. A page that already has JSON-LD
   keeps it; the list is added to its @graph. */
for (const meta of Object.values(PAGE_META)) {
  const list = breadcrumbList(new URL(meta.canonical).pathname)
  if (!list) continue
  const existing = meta.jsonLd
  if (!existing) {
    meta.jsonLd = { '@context': 'https://schema.org', ...list }
  } else if (existing['@graph']) {
    existing['@graph'].push(list)
  } else {
    const { '@context': context = 'https://schema.org', ...rest } = existing
    meta.jsonLd = { '@context': context, '@graph': [rest, list] }
  }
}

/* Article pages get dateModified from the route's lastmod, the same date the
   sitemap uses, so the two cannot disagree. datePublished is only added where
   the page itself states when it was first published. */
const FIRST_PUBLISHED = {
  moneyhub_alternative: '2026-05',
  guide_how_much_retire_uk: '2026-11-06',
  guide_pension_drawdown_explained: '2026-11-06',
}
const routeByKey = Object.fromEntries(PUBLIC_ROUTES.map((r) => [r.key, r]))
for (const [key, meta] of Object.entries(PAGE_META)) {
  const nodes = meta.jsonLd?.['@graph'] ?? (meta.jsonLd ? [meta.jsonLd] : [])
  for (const node of nodes) {
    if (node['@type'] === 'Article') {
      if (routeByKey[key]?.lastmod) node.dateModified = routeByKey[key].lastmod
      if (FIRST_PUBLISHED[key]) node.datePublished = FIRST_PUBLISHED[key]
    }
    // Calculator pages describe a free in-browser application.
    if (key.startsWith('tools_') && key !== 'tools_hub' && node['@type'] === 'WebPage') {
      node['@type'] = 'WebApplication'
      node.applicationCategory = 'FinanceApplication'
      node.operatingSystem = 'Any (runs in the browser)'
      node.isAccessibleForFree = true
      node.offers = { '@type': 'Offer', price: '0', priceCurrency: 'GBP' }
      node.publisher = { '@type': 'Organization', name: 'Paddock', url: 'https://getpaddock.com' }
    }
  }
}
