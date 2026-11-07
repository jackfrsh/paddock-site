/* Props for an in-text link that navigates inside the app but still renders a
   real href (so it works without JavaScript and for crawlers). */
export function inlineLink(navigateTo, to) {
  return {
    href: to,
    className: 'guide-inline-link',
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      navigateTo(to)
    },
  }
}
