import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { OperatorLoginForm } from "./login-form";
import { getOperatorSession } from "../../lib/server/operator-auth";
import { getOperatorConfig } from "../../lib/server/runtime-config";

export const metadata: Metadata = {
  title: "Operator sign in",
  robots: { index: false, follow: false },
};

export default async function OperatorPage() {
  await connection();
  const session = await getOperatorSession();
  if (session) redirect("/ops/leads");

  return (
    <main className="operator-page">
      <div className="operator-topbar page-container">
        <Link className="brand" href="/" aria-label="Hotel Growth OS home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-wordmark">
            <strong>hotel growth</strong>
            <span>operator space</span>
          </span>
        </Link>
        <Link className="operator-back-link" href="/">
          Back to concept <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <section className="operator-login-layout page-container" aria-labelledby="operator-title">
        <div className="operator-login-copy">
          <p className="eyebrow eyebrow--dark">
            <span className="eyebrow-dot" aria-hidden="true" />
            Private preview <span className="eyebrow-divider">/</span> Operator access
          </p>
          <h1 id="operator-title">
            A small inbox for <em>new requests.</em>
          </h1>
          <p>
            This local prototype stores only voluntary product-discovery
            requests. It is not a CRM and does not connect to a hotel, email
            provider, or guest system.
          </p>
          <div className="operator-boundary-list">
            <span><span aria-hidden="true">✓</span> Server-verified session</span>
            <span><span aria-hidden="true">✓</span> No automatic replies</span>
            <span><span aria-hidden="true">✓</span> Local file ledger only</span>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-panel__header">
            <span className="login-panel__icon" aria-hidden="true">H</span>
            <div>
              <p className="login-panel__eyebrow">Operator console</p>
              <h2>Sign in</h2>
            </div>
          </div>
          <OperatorLoginForm configured={Boolean(getOperatorConfig())} />
          <div className="login-panel__footer">
            <span>PRIVATE PREVIEW</span>
            <span>No customer systems connected</span>
          </div>
        </div>
      </section>

      <p className="operator-page__note page-container">
        Configure secrets on the server only. They are never included in the
        page or client bundle.
      </p>
    </main>
  );
}
