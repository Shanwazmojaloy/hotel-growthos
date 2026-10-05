import type { Metadata } from "next";
import { connection } from "next/server";
import { createIntakeToken } from "../../../lib/domain/intake-token";
import { getAppSigningSecret } from "../../../lib/server/runtime-config";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a product discovery request to the Hotel Growth OS preview.",
};

export default async function ContactPage() {
  await connection();
  const secret = getAppSigningSecret();
  const token = secret ? createIntakeToken(secret) : null;

  return (
    <main className="contact-page">
      <section className="contact-section" aria-labelledby="contact-title">
        <div className="page-container contact-grid">
          <div className="contact-intro">
            <p className="eyebrow eyebrow--dark">
              <span className="eyebrow-dot" aria-hidden="true" />
              Product discovery <span className="eyebrow-divider">/</span> Placeholder copy
            </p>
            <h1 id="contact-title">
              Start with a <em>conversation.</em>
            </h1>
            <p className="contact-lede">
              A short note can help validate whether this concept is relevant.
              This form is a prototype intake path—not a live sales or hotel
              operations workflow.
            </p>
            <div className="contact-boundary">
              <span className="boundary-icon" aria-hidden="true">i</span>
              <div>
                <strong>Keep it high-level</strong>
                <p>
                  Please do not send guest details, payment information,
                  credentials, rates, or confidential hotel records.
                </p>
              </div>
            </div>
            <div className="contact-meta">
              <span className="contact-meta__label">Current connection status</span>
              <span className="contact-meta__value">
                <span className="status-dot" aria-hidden="true" />
                Local preview only
              </span>
            </div>
          </div>

          <div className="contact-form-panel">
            {token ? (
              <ContactForm token={token} />
            ) : (
              <div className="form-disabled" role="status">
                <h2>Requests are not enabled.</h2>
                <p>
                  The signing secret is not configured for this environment.
                  No information was collected.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
