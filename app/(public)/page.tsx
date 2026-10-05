import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="page-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Product concept <span className="eyebrow-divider">/</span> Copy placeholder
            </p>
            <h1 id="hero-title">
              A clearer operating picture for <em>hotel teams.</em>
            </h1>
            <p className="hero-description">
              Hotel Growth OS is an early product concept for bringing hotel
              performance into a more considered operating view. The offer and
              copy are placeholders while the product is being validated.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/contact">
                Start a conversation <span aria-hidden="true">↗</span>
              </Link>
              <a className="text-link" href="#product">
                Explore the concept <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              No live hotel connection. No guest records. No automated outreach.
            </p>
          </div>

          <div
            className="preview-scene"
            role="img"
            aria-label="Illustrative, synthetic hotel performance dashboard concept. No real hotel data is shown."
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
                <span className="sample-tag">SAMPLE ONLY</span>
              </div>
              <div className="preview-card__heading">
                <div>
                  <span className="preview-muted">PROPERTY NAME</span>
                  <strong>Hotel name placeholder</strong>
                </div>
                <span className="preview-period">Period · —</span>
              </div>
              <div className="preview-metrics">
                <div className="preview-metric">
                  <span>Occupancy</span>
                  <strong>—<small>%</small></strong>
                  <span className="preview-metric__note">Source needed</span>
                </div>
                <div className="preview-metric">
                  <span>Room nights</span>
                  <strong>—</strong>
                  <span className="preview-metric__note">Definition needed</span>
                </div>
                <div className="preview-metric">
                  <span>Revenue basis</span>
                  <strong className="preview-withheld">Withheld</strong>
                  <span className="preview-metric__note">Not connected</span>
                </div>
              </div>
              <div className="preview-chart">
                <div className="preview-chart__labels">
                  <span>Illustrative trend</span>
                  <span>Sample layout</span>
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
                  <span>Data shape only</span>
                  <span>Not hotel results</span>
                </div>
              </div>
              <div className="preview-card__footer">
                <span className="status-dot" aria-hidden="true" />
                Synthetic concept view
                <span className="preview-card__footer-right">Inputs not connected</span>
              </div>
            </div>
            <div className="scene-caption">
              <span>01 / 01</span>
              <span>Interface direction · illustrative only</span>
            </div>
          </div>
        </div>
      </section>

      <section className="scope-strip" aria-label="Current prototype boundaries">
        <div className="page-container scope-strip__inner">
          <div>
            <span className="scope-index">01</span>
            <span>Concept-stage product</span>
          </div>
          <div>
            <span className="scope-index">02</span>
            <span>No guest data in this slice</span>
          </div>
          <div>
            <span className="scope-index">03</span>
            <span>No PMS or CRM connection</span>
          </div>
        </div>
      </section>

      <section className="concept-section" id="product" aria-labelledby="concept-title">
        <div className="page-container concept-grid">
          <div className="concept-intro">
            <p className="eyebrow eyebrow--dark">A working direction</p>
            <h2 id="concept-title">
              Start with the <em>right questions.</em>
            </h2>
            <p>
              The current slice is deliberately small: a product concept, a
              request form, and a private local inbox. It does not connect to
              hotel systems or make operational decisions.
            </p>
            <Link className="text-link text-link--dark" href="/contact">
              Share a product question <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="concept-list">
            <article className="concept-item">
              <span className="concept-item__number">01</span>
              <div>
                <h3>Context before conclusions</h3>
                <p>
                  Example direction: make reporting assumptions and source
                  coverage visible before a number is interpreted.
                </p>
              </div>
              <span className="concept-item__status">PLACEHOLDER</span>
            </article>
            <article className="concept-item">
              <span className="concept-item__number">02</span>
              <div>
                <h3>Metrics with their definitions</h3>
                <p>
                  Example direction: show what a measure includes, where it came
                  from, and when a value should be withheld.
                </p>
              </div>
              <span className="concept-item__status">PLACEHOLDER</span>
            </article>
            <article className="concept-item">
              <span className="concept-item__number">03</span>
              <div>
                <h3>Human-led next steps</h3>
                <p>
                  Example direction: keep decisions and external actions with
                  the hotel team unless a separate approval exists.
                </p>
              </div>
              <span className="concept-item__status">PLACEHOLDER</span>
            </article>
          </div>
        </div>
      </section>

      <section className="closing-section" aria-labelledby="closing-title">
        <div className="page-container closing-panel">
          <div>
            <p className="eyebrow">Product discovery</p>
            <h2 id="closing-title">Help shape what this becomes.</h2>
            <p>
              This is placeholder product copy, not a live service promise. A
              conversation is a way to validate the problem and scope—not an
              invitation to send guest or financial records.
            </p>
          </div>
          <Link className="button button-light" href="/contact">
            Request a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
