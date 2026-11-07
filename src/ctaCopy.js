/* Wording for the call to action under each calculator's result.

   Each calculator gets its own next step, written for the question that
   calculator answers. The calculators themselves are free and need no account,
   so this appears only after the visitor has their answer.

   Rules for this copy: no urgency, no pressure, no claim that Paddock tells
   anyone what to do with their money, and nothing the product does not do.
   Paddock tracks the balances a person enters; it does not import calculator
   results, so the wording is about tracking real balances against an estimate.

   Wording tests: change a string here, record the date in
   docs/acquisition-reporting.md, and compare click-through before and after in
   the weekly report. Visitors are not split into groups at random because
   nothing is stored on the device. */

export const RESULT_CTA = Object.freeze({
  retirement_age: {
    headline: 'Check this estimate against your real pots.',
    body: 'Add your actual pension, ISA and savings balances to Paddock and see how far you are from the pot this estimate says you need. You enter the numbers yourself; there is no bank login.',
    button: 'Track my real balances',
  },
  fire: {
    headline: 'See how close you are to your number.',
    body: 'A FIRE number is a target. Paddock adds up your real ISAs, pensions and savings so you can watch the gap close over time. You enter the balances yourself; there is no bank login.',
    button: 'Track progress to this number',
  },
  isa_growth: {
    headline: 'Compare this projection with your real ISAs.',
    body: 'Keep your ISA balances next to your pensions and savings in Paddock, and see how the real figures move against a projection like this one. Manual entry, no bank login.',
    button: 'Track my ISAs',
  },
  net_worth: {
    headline: 'Turn this snapshot into a trend.',
    body: 'This is one moment in time. Paddock keeps your balances over the months, so you can see which way your net worth is moving. Private by design, with no bank connection.',
    button: 'Track my net worth over time',
  },
  pension_drawdown: {
    headline: 'Follow your real pension pot, not just the scenario.',
    body: 'Add your actual pensions and other accounts to Paddock to see your whole retirement picture in one private place, then compare it with the scenario you have just run.',
    button: 'Track my pension and other accounts',
  },
  phased_drawdown: {
    headline: 'Keep an eye on the pots behind this plan.',
    body: 'Paddock tracks the pensions, ISAs and savings you actually hold, so you can see whether they are on course for a plan like this one. Manual entry, no bank login.',
    button: 'Track the pots behind this plan',
  },
  retirement_bridge: {
    headline: 'Watch the pots that would fund the bridge.',
    body: 'Add your real ISA, pension and savings balances to Paddock and see how they are progressing towards the amount this estimate suggests you may need before pension income starts.',
    button: 'Track my accessible savings',
  },
})

export const DEFAULT_RESULT_CTA = Object.freeze({
  headline: 'Track your real progress against this estimate.',
  body: 'Enter your actual balances in Paddock and see how you are doing over time. No bank access required.',
  button: 'Create a free account',
})

export const FREE_NOTE = 'Free to start. No bank login. Manual entry.'
