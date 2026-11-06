# UK figures: how they are kept correct

Every UK tax, pension, ISA and State Pension number the site quotes comes from
`src/ukFigures.js`. Pages and calculators import it. Nobody types a pound amount
or an age into prose.

## What is stored for each figure

Name, value, unit, source organisation and URL, effective-from and effective-to
dates, status, last checked, next review, how it was verified, named reviewer,
and notes.

Status is one of `in_force`, `legislated`, `announced`, `proposed`, `abandoned`
or `superseded`. Pages must not describe anything other than `in_force` as
current law. An abandoned rule keeps its row (with the date it was dropped and
what replaced it) so the site can still explain old provider pages. The £12,000
Cash ISA cap for under-65s is the example.

## Rules for editing

1. Never overwrite a historical value. Close the old row with `effectiveTo` and
   add a new row with a new `effectiveFrom`. Past dates keep using the old value.
2. Set `lastChecked` to the day you read the source page, and `verification` to
   `source_page_read` only if you read the page itself (not a news report).
3. Put a person's name in `reviewer` once they have checked the row. Until then
   the checker prints a warning for every live row.
4. Add a golden test in `src/ukFigures.test.js` for any figure a calculator
   depends on, using a worked example from the source where one exists.

## Automated checks

`npm run check:figures` fails when:

- a row is malformed, has no https source, or is not `source_page_read`;
- a review is overdue, or a row was last checked more than 120 days ago;
- an announced rule's start date has passed but its status has not been updated;
- a required figure (ISA allowance, annual allowance, Personal Allowance, State
  Pension, minimum pension age) has no row for today, which is what happens on
  6 April if the new tax year's row has not been added;
- site copy mentions a tax year that has ended (for example `2025/26`), or types
  in a figure that the central file owns.

`npm test` runs the golden tests (GOV.UK's own Lifetime ISA examples, the State
Pension weekly-to-annual sum, the 25% tax-free example, tax-year boundaries,
date lookups that must not rewrite history) and the validator's negative tests.

`npm run check` runs lint, tests and the figures check. It is deliberately not
part of `npm run build`: a lapsed figure should block a deliberate release, not
break the live site on 6 April.

## Checklist: after each Budget or fiscal event

1. Read the GOV.UK rates and allowances pages and the HMRC tax-free savings
   newsletter again. Search results and news are not enough.
2. For each change, add a row (do not edit the old one) and set its status.
3. Update `lastChecked` on rows you re-read and still stand.
4. Run `npm run check`. Fix every error. Read the warnings.
5. Search the site for wording that describes a changed rule.

## Checklist: before 6 April each year

1. Add next tax year's rows for the ISA allowance, annual allowance, Personal
   Allowance, State Pension and every income-tax band (announced figures are
   `announced` until the new year starts, then `in_force`).
2. Change statuses from `announced` to `in_force` on 6 April.
3. Check every page that mentions "this tax year" or the previous year.

## Known gaps

- No row has a named reviewer yet.
- 2027/28 savings tax rates (24%, 44%, 49% in some secondary reports) are not
  stored because only secondary sources were found.
- The legislative vehicle for the minimum pension age rise to 57 was not read.
- The CGT annual exempt amount is not stored (not verified).
- The revocation of the 2026 Cash ISA limit regulations is announced by HMRC and
  was not confirmed as done when last checked.
