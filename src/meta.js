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
    title: 'Paddock | Net Worth Tracker UK | Manual Wealth Tracking',
    description:
      'Track ISAs, pensions, savings, property and investments in one privacy-first UK wealth tracker. Manual entry, no bank linking.',
    canonical: 'https://getpaddock.com/',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Paddock',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web, iOS',
      url: 'https://getpaddock.com/',
      description:
        'Track ISAs, pensions, savings, property and investments in one privacy-first UK wealth tracker. Manual entry, no bank linking.',
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
    title: 'Multi-Currency Portfolio Tracker UK — Track Investments Across Currencies | Paddock',
    description:
      'Track investments, ISAs, pensions, savings, and other accounts across GBP, USD, EUR and more in one base-currency view. No bank connection required. Private, manual-entry wealth tracking with Paddock.',
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
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Paddock a budgeting app?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Paddock is built around wealth tracking rather than day-to-day budgeting. The focus is on net worth, long-term progress and a clearer overall financial picture.' },
        },
        {
          '@type': 'Question',
          name: 'Do I need to link bank accounts?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Paddock is manual-entry by design. That keeps the experience simpler, more deliberate and more private.' },
        },
        {
          '@type': 'Question',
          name: 'Should pensions be included in net worth?',
          acceptedAnswer: { '@type': 'Answer', text: 'Many people include pensions because they are a major part of long-term wealth. What matters most is staying consistent in how you measure your position over time.' },
        },
        {
          '@type': 'Question',
          name: 'How often should I update my numbers?',
          acceptedAnswer: { '@type': 'Answer', text: 'Monthly is enough for most people. The goal is not constant checking. It is a steady view of how your wealth is changing over time.' },
        },
      ],
    },
  },

  track_isas_pensions_savings: {
    title: 'Track ISAs, Pensions and Savings Together | Paddock',
    description:
      'See ISAs, pensions and savings together in one calm wealth dashboard. Track long-term progress clearly with privacy-first manual tracking.',
    canonical: 'https://getpaddock.com/track-isas-pensions-savings',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I track multiple ISAs?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. The point is to build a complete view, not force everything into one account type. Multiple ISA balances can all contribute to the same broader wealth picture.' },
        },
        {
          '@type': 'Question',
          name: 'Should pensions be included?',
          acceptedAnswer: { '@type': 'Answer', text: 'For many people, yes. Pensions are often one of the largest parts of long-term wealth, so excluding them can make the total picture less useful.' },
        },
        {
          '@type': 'Question',
          name: 'Do I need live account syncing?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Paddock is manual by design. That keeps the workflow cleaner and lets you update on a cadence that suits long-term wealth tracking.' },
        },
        {
          '@type': 'Question',
          name: 'Is this only for investing?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. It is for seeing the broader picture across cash, savings, investments and pensions, so you can understand total progress more clearly.' },
        },
      ],
    },
  },

  spreadsheet_alternative: {
    title: 'Spreadsheet Alternative for Net Worth Tracking | Paddock',
    description:
      'Replace fragile spreadsheets with a calmer way to track net worth, progress and long-term wealth in one premium dashboard.',
    canonical: 'https://getpaddock.com/spreadsheet-alternative-net-worth-tracking',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Paddock automatic?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. It is manual-entry by design. The difference is that the structure and review experience are cleaner than maintaining a spreadsheet over time.' },
        },
        {
          '@type': 'Question',
          name: 'Why not just keep using a spreadsheet?',
          acceptedAnswer: { '@type': 'Answer', text: 'You can. Paddock becomes more useful when your current sheet feels harder to maintain, less readable, or too fragmented to support a calm long-term review.' },
        },
        {
          '@type': 'Question',
          name: 'Can I still think in categories and accounts?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. That is part of the point. Paddock keeps the structure without forcing you to build and maintain the structure yourself.' },
        },
        {
          '@type': 'Question',
          name: 'Is this for budgeting?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. It is for wealth tracking. The focus is on total net worth, long-term progress and a clearer overall financial position.' },
        },
      ],
    },
  },

  how_to_track_net_worth: {
    title: 'How to Track Your Net Worth Manually | Paddock',
    description:
      'Learn how to track your net worth clearly, including what to include, how often to update it, and why consistency matters more than noise.',
    canonical: 'https://getpaddock.com/how-to-track-your-net-worth',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Should I include my pension in net worth?',
          acceptedAnswer: { '@type': 'Answer', text: 'Many people do, because pensions are often one of the biggest parts of long-term wealth. The important thing is to use a consistent approach over time.' },
        },
        {
          '@type': 'Question',
          name: 'Should I include my home?',
          acceptedAnswer: { '@type': 'Answer', text: 'You can. If property is a meaningful part of your balance sheet, including it can make the picture more complete. Consistency is what matters most.' },
        },
        {
          '@type': 'Question',
          name: 'How often should I track my net worth?',
          acceptedAnswer: { '@type': 'Answer', text: 'Monthly is usually enough. That cadence is often frequent enough to stay aware without turning wealth tracking into constant checking.' },
        },
        {
          '@type': 'Question',
          name: 'Do I need automatic bank syncing?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. For long-term wealth tracking, manual updates can often be enough, especially when the goal is clarity rather than live transaction monitoring.' },
        },
      ],
    },
  },

  tools_hub: {
    title: 'UK Wealth Calculators | Pension, FIRE & Net Worth Tools | Paddock',
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
    title: 'Why I Track Wealth Manually Instead of Using Open Banking Apps | Paddock',
    description:
      "A founder's perspective on why manual, privacy-first wealth tracking can be better than open banking sync — for people with ISAs, pensions, multi-currency accounts, and a long time horizon.",
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
      'Compare UK net worth tracking apps including Paddock, Emma, Moneyhub and spreadsheets for ISAs, pensions, savings and multi-currency wealth.',
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
              acceptedAnswer: { '@type': 'Answer', text: 'It depends on what you are trying to do. If you want automatic syncing and spending insights, Emma or Moneyhub are strong options. If you want a private, deliberate view of total wealth — ISAs, pensions, savings, property, and multi-currency accounts — with long-term projections and no bank linking, Paddock is built for that.' },
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

  tools_isa_growth: {
    title: 'ISA Growth Calculator UK — Project Your ISA Value | Paddock',
    description:
      'Free ISA growth calculator. Enter your balance, monthly contributions and return assumption to see how your ISA could grow over time. Includes a 3%, 5%, and 7% return comparison. No login required.',
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
    title: 'Best Moneyhub Alternative 2026 — UK Wealth Tracker Apps Compared',
    description:
      'Moneyhub is closing in August 2026. Here\'s an honest comparison of the best UK alternatives for tracking ISAs, SIPPs and net worth.',
    canonical: 'https://getpaddock.com/moneyhub-alternative',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Moneyhub is closing — here are the best alternatives for UK investors',
          description:
            'An honest comparison of Paddock, WealthR, WealthView and Emma for UK users who need to migrate away from Moneyhub before August 2026.',
          url: 'https://getpaddock.com/moneyhub-alternative',
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
          mainEntity: [
            {
              '@type': 'Question',
              name: 'When is Moneyhub closing?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Moneyhub is closing its consumer-facing app in August 2026. Users should export their data and migrate to an alternative before that date.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the best Moneyhub alternative for UK investors?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Paddock is the strongest like-for-like alternative for UK wealth tracking. It supports ISAs, SIPPs, savings, property and multi-currency accounts, offers long-term projections, and takes a privacy-first manual-entry approach with no bank linking required. It works on both web and iOS.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does Paddock link to my bank?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Paddock is entirely manual-entry. You enter your own balances — typically once a month — without connecting bank accounts or sharing any credentials. Your data never leaves your control.',
              },
            },
          ],
        },
      ],
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
