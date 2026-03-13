import React, { useEffect, useMemo, useState } from 'react'

import homeShot from '/src/assets/slides/PaddockHero.png'
import outlookShot from '/src/assets/slides/PaddockOutlook.png'
import insightsShot from '/src/assets/slides/PaddockInsights.png'
import accountsShot from '/src/assets/slides/PaddockAccounts.png'
import homeShotWebp from '/src/assets/slides/PaddockHeroWebP.webp'
import outlookShotWebp from '/src/assets/slides/PaddockOutlookWebP.webp'
import insightsShotWebp from '/src/assets/slides/PaddockInsightsWebP.webp'
import accountsShotWebp from '/src/assets/slides/PaddockAccountsWebp.webp'

const slides = [
  {
    id: 1,
    eyebrow: 'Dashboard',
    title: 'See your wealth clearly',
    body:
      'A calm dashboard for net worth, milestones, and long-term progress — designed to make the numbers feel instantly readable.',
    src: homeShot,
    webp: homeShotWebp,
    alt: 'Paddock dashboard showing net worth, milestones and progress',
    caption: 'Net worth dashboard with milestones, trajectory and plan progress.',
  },
  {
    id: 2,
    eyebrow: 'Accounts',
    title: 'Bring everything into one place',
    body:
      'Track cash, ISAs, pensions, property and more in one structured view, with multi-currency support and a cleaner workflow than spreadsheets.',
    src: accountsShot,
    webp: accountsShotWebp,
    alt: 'Paddock scenario and account planning view',
    caption: 'Structured wealth tracking across the accounts that matter most.',
  },
  {
    id: 3,
    eyebrow: 'Projection',
    title: 'See where your wealth is heading',
    body:
      'Long-term projections make the path ahead clearer, with visible assumptions and a calmer sense of momentum.',
    src: outlookShot,
    webp: outlookShotWebp,
    alt: 'Paddock outlook view showing long-term wealth projection',
    caption: 'Long-term projection with visible assumptions and trajectory.',
  },
  {
    id: 4,
    eyebrow: 'Trust',
    title: 'Private by design',
    body:
      'No ads. No bank linking. Just a deliberate, premium space to understand and build wealth with confidence.',
      src: insightsShot,
      webp: insightsShotWebp,
    alt: 'Paddock dashboard interface representing private, focused wealth tracking',
    caption: 'Private, focused wealth tracking in a calm and premium interface.',
  },
]

function SlideImage({ src, webp, alt }) {
  return (
    <picture>
      {webp ? <source srcSet={webp} type="image/webp" /> : null}
      <img src={src} alt={alt} className="hero-showcase-image" loading="eager" />
    </picture>
  )
}

export default function HeroSlideshow({ goTo }) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const active = useMemo(() => slides[index], [index])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !isPlaying) return

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [isPlaying])

  const goPrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setIndex((prev) => (prev + 1) % slides.length)

  return (
    <section className="container hero-showcase-section" aria-label="Paddock product walkthrough">
      <div className="hero-showcase">
        <div className="hero-showcase-copy">
          <div className="section-label">Product walkthrough</div>

          <div className="hero-showcase-meta">{active.eyebrow}</div>

          <h2>{active.title}</h2>

          <p className="section-copy hero-showcase-text">{active.body}</p>

          <div className="hero-showcase-actions">
            <button
              type="button"
              className="hero-showcase-control"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              ←
            </button>

            <button
              type="button"
              className="hero-showcase-control"
              onClick={() => setIsPlaying((value) => !value)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type="button"
              className="hero-showcase-control"
              onClick={goNext}
              aria-label="Next slide"
            >
              →
            </button>
          </div>

          <div className="hero-showcase-dots" aria-label="Slide navigation">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-showcase-dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${slide.id}`}
              />
            ))}
          </div>

          <div className="hero-showcase-caption">{active.caption}</div>

          <div className="hero-showcase-cta">
            <button type="button" className="btn btn-primary" onClick={() => goTo('signup')}>
              Get started — it’s free
            </button>
          </div>
        </div>

        <div className="hero-showcase-visual">
          <div className="hero-showcase-frame">
            <div className="hero-showcase-notch" />
            <div key={active.id} className="hero-showcase-screen hero-showcase-fade">
              <SlideImage src={active.src} webp={active.webp} alt={active.alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}