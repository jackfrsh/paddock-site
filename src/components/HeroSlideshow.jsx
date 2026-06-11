import React, { useEffect, useMemo, useState } from 'react'

import homeShot from '/src/assets/slides/PaddockHero.png'
import outlookShot from '/src/assets/slides/paddock-plan.png'
import insightsShot from '/src/assets/slides/paddock-decisions.png'
import accountsShot from '/src/assets/slides/PaddockAccounts.png'
import homeShotWebp from '/src/assets/slides/PaddockHeroWebP.webp'
import outlookShotWebp from '/src/assets/slides/paddock-plan.webp'
import insightsShotWebp from '/src/assets/slides/paddock-decisions.webp'
import accountsShotWebp from '/src/assets/slides/PaddockAccountsWebP.webp'

const slides = [
  {
    id: 1,
    eyebrow: 'Financial freedom gap',
    title: 'Know what the next pounds should do',
    body:
      'Model ISA timing, contribution changes and long-term trade-offs before you commit new money. Paddock helps turn balances into decisions.',
    src: insightsShot,
    webp: insightsShotWebp,
    alt: 'Paddock decisions view showing planning tools and next-step modelling',
    caption: 'Decision tools for ISA timing, contribution changes, goal progress and long-term trade-offs.',
  },
  {
    id: 2,
    eyebrow: 'Long-term projection',
    title: 'See the path, not just the total',
    body:
      'Long-term projections show where your current pace is taking you, what is required, and how far ahead or behind you are.',
    src: outlookShot,
    webp: outlookShotWebp,
    alt: 'Paddock projection view showing long-term wealth trajectory and target path',
    caption: 'Pension path and long-term projection with visible assumptions, target path and trajectory.',
  },
  {
    id: 3,
    eyebrow: 'Total wealth',
    title: 'See your wealth clearly',
    body:
      'A calm dashboard for net worth, milestones and long-term progress — designed to make the important numbers readable at a glance.',
    src: homeShot,
    webp: homeShotWebp,
    alt: 'Paddock dashboard showing net worth, milestones and progress',
    caption: 'Net worth dashboard with total wealth, milestones, trajectory and plan progress.',
  },
  {
    id: 4,
    eyebrow: 'Property and liabilities',
    title: 'Bring everything into one place',
    body:
      'Track cash, ISAs, pensions, property and more in one structured view, with a cleaner workflow than spreadsheets and support for multiple currencies.',
    src: accountsShot,
    webp: accountsShotWebp,
    alt: 'Paddock accounts view showing structured wealth tracking across account types',
    caption: 'Structured wealth tracking across ISAs, pensions, property, liabilities and the accounts that matter most.',
  },
]

function SlideImage({ src, webp, alt }) {
  return (
    <picture>
      {webp ? <source srcSet={webp} type="image/webp" /> : null}
      <img src={src} alt={alt} className="hero-showcase-image" loading="eager" fetchPriority="high" />
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
    }, 5200)

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
              Start planning — it’s free
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
