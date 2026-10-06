import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { LeadRecord } from "../../../lib/domain/lead-ledger";
import { getOperatorSession } from "../../../lib/server/operator-auth";
import { createDefaultLeadStore } from "../../../lib/server/runtime-config";
import { logoutOperatorAction } from "../actions";
import { ReconcileButton } from "./reconcile-button";

export const metadata: Metadata = {
  title: "Request inbox",
  robots: { index: false, follow: false },
};

function formatReceivedAt(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function RequestCard({ lead }: { lead: LeadRecord }) {
  const isReconciled = lead.status === "reconciled";

  return (
    <article className={`request-card${isReconciled ? " request-card--reconciled" : ""}`}>
      <div className="request-card__top">
        <div className="request-card__identity">
          <span className="request-avatar" aria-hidden="true">
            {lead.fullName.slice(0, 1).toLocaleUpperCase("en")}
          </span>
          <div>
            <h2>{lead.fullName}</h2>
            <p>{lead.email}</p>
          </div>
        </div>
        {isReconciled ? (
          <span className="request-status request-status--reconciled">
            <span className="status-dot" aria-hidden="true" />
            Reconciled
          </span>
        ) : (
          <span className="request-status">
            <span className="status-dot" aria-hidden="true" />
            New request
          </span>
        )}
      </div>
      <div className="request-card__details">
        <div>
          <span className="request-detail-label">Property</span>
          <strong>{lead.propertyName}</strong>
        </div>
        <div>
          <span className="request-detail-label">Role</span>
          <strong>{lead.role ?? "Not provided"}</strong>
        </div>
        <div>
          <span className="request-detail-label">Received · UTC</span>
          <strong>{formatReceivedAt(lead.receivedAt)}</strong>
        </div>
        {lead.hotelWebsite ? (
          <div className="request-card__website">
            <span className="request-detail-label">Property website</span>
            <span>{lead.hotelWebsite}</span>
          </div>
        ) : null}
      </div>
      <div className="request-card__message">
        <span className="request-detail-label">Request note</span>
        <p>{lead.message}</p>
      </div>
      <div className="request-card__consent">
        <span className="consent-check" aria-hidden="true">✓</span>
        Permission to reply recorded · {formatReceivedAt(lead.contactPermissionGrantedAt)} UTC
      </div>
      {isReconciled ? (
        <div className="request-card__reconciliation">
          <span className="consent-check" aria-hidden="true">✓</span>
          <span>
            Reconciled {lead.reconciledAt ? `· ${formatReceivedAt(lead.reconciledAt)} UTC` : ""}
            {lead.reconciliationNote ? ` · ${lead.reconciliationNote}` : ""}
          </span>
        </div>
      ) : (
        <div className="request-card__actions">
          <ReconcileButton leadId={lead.id} />
        </div>
      )}
    </article>
  );
}

export default async function LeadsPage() {
  await connection();
  const session = await getOperatorSession();
  if (!session) redirect("/ops");

  let leads: LeadRecord[] = [];
  let ledgerUnavailable = false;
  const store = createDefaultLeadStore();
  try {
    leads = await store.listLeads();
    if (store.logAuditEvent) {
      await store.logAuditEvent("leads.viewed", {
        operatorId: session.sessionId,
      }).catch(() => {
        // Audit logging is non-critical; silently continue on failure.
      });
    }
  } catch {
    ledgerUnavailable = true;
  }

  return (
    <main className="inbox-page">
      <header className="inbox-header">
        <div className="page-container inbox-header__inner">
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
          <div className="inbox-header__right">
            <span className="inbox-header__session">
              <span className="status-dot" aria-hidden="true" />
              Signed in · Operator
            </span>
            <form action={logoutOperatorAction}>
              <button className="sign-out-button" type="submit">
                Sign out <span aria-hidden="true">↗</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="inbox-content page-container" aria-labelledby="inbox-title">
        <div className="inbox-heading-row">
          <div>
            <p className="eyebrow eyebrow--dark">
              <span className="eyebrow-dot" aria-hidden="true" />
              Private operator view <span className="eyebrow-divider">/</span> Local preview
            </p>
            <h1 id="inbox-title">Request inbox</h1>
            <p className="inbox-subtitle">
              Product-discovery requests only. This is a local ledger, not a CRM.
            </p>
          </div>
          <div className="inbox-count" aria-label={`${leads.length} requests`}>
            <span className="inbox-count__number">{String(leads.length).padStart(2, "0")}</span>
            <span>Requests</span>
          </div>
        </div>

        <div className="inbox-boundary" role="note">
          <span className="boundary-icon" aria-hidden="true">i</span>
          <p>
            Replies are human-led. No email, CRM, hotel, or guest system is
            connected, and no follow-up is sent automatically.
          </p>
        </div>

        {ledgerUnavailable ? (
          <div className="inbox-state inbox-state--error" role="alert">
            <h2>The local ledger could not be read.</h2>
            <p>
              No data was changed. Check the server-side ledger file and its
              permissions before trying again.
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="inbox-state inbox-state--empty">
            <span className="empty-mark" aria-hidden="true">—</span>
            <p className="inbox-state__eyebrow">Nothing here yet</p>
            <h2>New requests will appear here.</h2>
            <p>
              The public form is a prototype path. Submit a test request to
              check the local workflow; use synthetic information only.
            </p>
            <Link className="text-link text-link--dark" href="/contact">
              Open the public form <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : (
          <div className="request-list" aria-label="Product discovery requests">
            {leads.map((lead) => <RequestCard key={lead.id} lead={lead} />)}
          </div>
        )}

        <div className="inbox-footnote">
          <span className="inbox-footnote__mark" aria-hidden="true">H</span>
          <p>
            Local prototype storage is not suitable for a multi-instance or
            production deployment. Replace it only after an approved storage
            and retention design exists.
          </p>
        </div>
      </section>
    </main>
  );
}