import React from 'react'
import { money } from '../pageContent/format.js'

/* Shared building blocks for the long-form landing pages: a short direct
   answer, reference tables, a worked example and an FAQ grid. The content
   lives in src/pageContent so meta.js can build the matching FAQPage markup
   from the same strings. */

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

export function QuickAnswer({ children, label = 'Quick answer' }) {
  return (
    <div className="quick-answer">
      <div className="quick-answer-label">{label}</div>
      <p className="quick-answer-text">{children}</p>
    </div>
  )
}

function SectionShell({ label, title, intro, children }) {
  return (
    <section className="section-border">
      <div className="container section">
        {label ? <SectionLabel>{label}</SectionLabel> : null}
        <h2>{title}</h2>
        {intro ? <p className="section-copy">{intro}</p> : null}
        {children}
      </div>
    </section>
  )
}

export function TableSection({ label, title, intro, columns, rows, highlightColumn, note }) {
  return (
    <SectionShell label={label} title={title} intro={intro}>
      <div className="cmp-table-wrap" role="region" aria-label={title} tabIndex={0}>
        <table className="cmp-table cmp-table-wide">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              {columns.map((heading, i) => (
                <th
                  key={heading || 'item'}
                  scope="col"
                  className={i === highlightColumn ? 'cmp-col-paddock' : undefined}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <th scope="row">{row[0]}</th>
                {row.slice(1).map((cell, i) => (
                  <td
                    key={columns[i + 1]}
                    className={i + 1 === highlightColumn ? 'cmp-col-paddock' : undefined}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="cmp-note">{note}</p> : null}
    </SectionShell>
  )
}

function ValueCells({ values }) {
  return values.map((value, i) => (
    <td key={i} className="num">
      {money(value)}
    </td>
  ))
}

export function ExampleSection({
  label = 'Worked example',
  title,
  intro,
  columns,
  groups,
  summary,
  note,
}) {
  return (
    <SectionShell label={label} title={title} intro={intro}>
      <div className="cmp-table-wrap" role="region" aria-label={title} tabIndex={0}>
        <table className="cmp-table example-table">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              <th scope="col">{columns[0] || 'Item'}</th>
              {columns.slice(1).map((heading) => (
                <th key={heading} scope="col" className="num">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.heading}>
              <tr className="example-group">
                <th scope="colgroup" colSpan={columns.length}>
                  {group.heading}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <ValueCells values={row.values} />
                </tr>
              ))}
              {group.total ? (
                <tr className="example-subtotal">
                  <th scope="row">{group.total.label}</th>
                  <ValueCells values={group.total.values} />
                </tr>
              ) : null}
            </tbody>
          ))}
          {summary ? (
            <tbody className="example-summary">
              {summary.map((row) => (
                <tr key={row.label} className={row.emphasis ? 'is-total' : undefined}>
                  <th scope="row">{row.label}</th>
                  <ValueCells values={row.values} />
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>
      {note ? <p className="cmp-note">{note}</p> : null}
    </SectionShell>
  )
}

export function FaqSection({ faqs, label = 'FAQ', title = 'Common questions.' }) {
  return (
    <SectionShell label={label} title={title}>
      <div className="faq-grid">
        {faqs.map((faq) => (
          <div className="faq-card" key={faq.q}>
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
