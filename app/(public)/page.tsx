import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="page-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Hotel Growth OS <span className="eyebrow-divider">/</span> Hospitality Architecture
            </p>
            <h1 id="hero-title">
              A clearer operating picture for <em>hotel teams.</em>
            </h1>
            <p className="hero-description">
              Hotel Growth OS provides independent and boutique hotels with a
              unified operating view of direct bookings, distribution channels,
              and revenue performance.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/contact">
                Request a consultation <span aria-hidden="true">↗</span>
              </Link>
              <a className="text-link" href="#product">
                Explore the architecture <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              Property-level aggregate analytics. Zero guest PII exposure. Direct channel focus.
            </p>
          </div>

          <div
            className="preview-scene"
            role="img"
            aria-label="Illustrative hotel performance dashboard concept showing occupancy and channel mix trends."
          >
            <div className="preview-orbit preview-orbit--one" />
            <div className="preview-orbit preview-orbit--two" />
            <div className="preview-card">
              <div className="preview-card__topline">
                <div className="preview-kicker">
                  <span className="preview-kicker__mark" aria-hidden="true">
                    H
                  </span>
                  <span>Property overview</span>
                </div>
                <span className="sample-tag">MODEL VIEW</span>
              </div>
              <div className="preview-card__heading">
                <div>
                  <span className="preview-muted">PROPERTY DEMO</span>
                  <strong>The Grand Meridian</strong>
                </div>
                <span className="preview-period">Rolling 30 Days</span>
              </div>
              <div className="preview-metrics">
                <div className="preview-metric">
                  <span>Occupancy</span>
                  <strong>84.2<small>%</small></strong>
                  <span className="preview-metric__note">PMS aggregate</span>
                </div>
                <div className="preview-metric">
                  <span>Direct share</span>
                  <strong>41.8<small>%</small></strong>
                  <span className="preview-metric__note">Direct engine</span>
                </div>
                <div className="preview-metric">
                  <span>Net RevPAR</span>
                  <strong>$186</strong>
                  <span className="preview-metric__note">Net of commissions</span>
                </div>
              </div>
              <div className="preview-chart">
                <div className="preview-chart__labels">
                  <span>Direct booking momentum</span>
                  <span>Trailing 12 weeks</span>
                </div>
                <svg
                  className="preview-chart__svg"
                  viewBox="0 0 500 116"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M0 93.5H500" stroke="currentColor" strokeOpacity=".12" />
                  <path d="M0 59.5H500" stroke="currentColor" strokeOpacity=".12" />
                  <path d="M0 25.5H500" stroke="currentColor" strokeOpacity=".12" />
                  <path
                    d="M4 86C38 78 48 88 78 71C111 52 127 66 154 56C189 43 203 62 236 49C267 36 286 52 312 39C345 23 361 43 391 28C424 12 445 28 496 9"
                    stroke="#C45A3C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 86C38 78 48 88 78 71C111 52 127 66 154 56C189 43 203 62 236 49C267 36 286 52 312 39C345 23 361 43 391 28C424 12 445 28 496 9V116H4V86Z"
                    fill="url(#preview-fill)"
                    fillOpacity=".24"
                  />
                  <defs>
                    <linearGradient id="preview-fill" x1="250" y1="9" x2="250" y2="116">
                      <stop stopColor="#C45A3C" />
                      <stop offset="1" stopColor="#C45A3C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="preview-chart__axis">
                  <span>Direct channel growth</span>
                  <span>Reduced OTA reliance</span>
                </div>
              </div>
              <div className="preview-card__footer">
                <span className="status-dot" aria-hidden="true" />
                Live performance simulation
                <span className="preview-card__footer-right">Continuous telemetry</span>
              </div>
            </div>
            <div className="scene-caption">
              <span>01 / 01</span>
              <span>Executive dashboard · unified metrics</span>
            </div>
          </div>
        </div>
      </section>

      <section className="scope-strip" aria-label="Current prototype boundaries">
        <div className="page-container scope-strip__inner">
          <div>
            <span className="scope-index">01</span>
            <span>Direct-channel growth</span>
          </div>
          <div>
            <span className="scope-index">02</span>
            <span>Zero guest PII exposure</span>
          </div>
          <div>
            <span className="scope-index">03</span>
            <span>Property-isolated security</span>
          </div>
        </div>
      </section>

      <section className="concept-section" id="product" aria-labelledby="concept-title">
        <div className="page-container concept-grid">
          <div className="concept-intro">
            <p className="eyebrow eyebrow--dark">Architecture & Principles</p>
            <h2 id="concept-title">
              Built on <em>disciplined principles.</em>
            </h2>
            <p>
              Hotel Growth OS connects distribution channels, direct booking engines,
              and revenue benchmarks into an actionable operating system without
              compromising guest privacy or operational stability.
            </p>
            <Link className="text-link text-link--dark" href="/contact">
              Discuss your property <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="concept-list">
            <article className="concept-item">
              <span className="concept-item__number">01</span>
              <div>
                <h3>Context before conclusions</h3>
                <p>
                  Understand underlying channel mix, pacing, and net margins
                  before taking pricing or marketing actions.
                </p>
              </div>
              <span className="concept-item__status">CORE PILLAR</span>
            </article>
            <article className="concept-item">
              <span className="concept-item__number">02</span>
              <div>
                <h3>Net revenue clarity</h3>
                <p>
                  Isolate gross room revenue from high OTA commission fees
                  to reflect true net revenue per available room.
                </p>
              </div>
              <span className="concept-item__status">CORE PILLAR</span>
            </article>
            <article className="concept-item">
              <span className="concept-item__number">03</span>
              <div>
                <h3>Human-guided operations</h3>
                <p>
                  Maintain complete human operator oversight over rate adjustments,
                  distribution contracts, and strategic campaign decisions.
                </p>
              </div>
              <span className="concept-item__status">CORE PILLAR</span>
            </article>
          </div>
        </div>
      </section>

      <section className="closing-section" aria-labelledby="closing-title">
        <div className="page-container closing-panel">
          <div>
            <p className="eyebrow">Direct Channel Growth</p>
            <h2 id="closing-title">Take control of your distribution.</h2>
            <p>
              Connect with our hospitality team for a confidential review of
              your property&apos;s direct acquisition potential.
            </p>
          </div>
          <Link className="button button-light" href="/contact">
            Request a consultation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
