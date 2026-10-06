import type { Metadata } from "next";
import { connection } from "next/server";
import { createIntakeToken } from "../../../lib/domain/intake-token";
import { getAppSigningSecret } from "../../../lib/server/runtime-config";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact & Consultation",
  description:
    "Request a direct channel consultation or explore Hotel Growth OS for your property.",
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
              Direct Channel Architecture <span className="eyebrow-divider">/</span> Consultation
            </p>
            <h1 id="contact-title">
              Start with a <em>confidential consultation.</em>
            </h1>
            <p className="contact-lede">
              Share your property profile and direct distribution objectives.
              Every submission is reviewed directly by our hospitality operations
              team—never routed to an automated sales sequence.
            </p>
            <div className="contact-boundary">
              <span className="boundary-icon" aria-hidden="true">i</span>
              <div>
                <strong>Confidentiality & Data Boundary</strong>
                <p>
                  All consultations are aggregate-first. Please do not submit
                  guest personal data (PII), payment card details, PMS
                  passwords, or confidential financial records.
                </p>
              </div>
            </div>
            <div className="contact-meta">
              <span className="contact-meta__label">Intake status</span>
              <span className="contact-meta__value">
                <span className="status-dot" aria-hidden="true" />
                Verified & encrypted ledger
              </span>
            </div>
          </div>

          <div className="contact-form-panel">
            {token ? (
              <ContactForm token={token} />
            ) : (
              <div className="form-disabled" role="status">
                <h2>Requests are temporarily offline.</h2>
                <p>
                  The secure signing service is not configured for this environment.
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
