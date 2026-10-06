"use client";

import { useActionState } from "react";
import { INITIAL_RECONCILE_STATE } from "../../../lib/domain/form-state";
import { reconcileLeadAction } from "../actions";

export function ReconcileButton({ leadId }: { leadId: string }) {
  const [state, formAction, isPending] = useActionState(
    reconcileLeadAction,
    INITIAL_RECONCILE_STATE,
  );

  if (state.status === "success" && state.leadId === leadId) {
    return (
      <span className="reconcile-badge reconcile-badge--done" aria-live="polite">
        <span aria-hidden="true">✓</span> Reconciled
      </span>
    );
  }

  return (
    <form className="reconcile-form" action={formAction}>
      <input type="hidden" name="leadId" value={leadId} />
      <input
        className="reconcile-note-input"
        name="note"
        placeholder="Optional note"
        maxLength={500}
        type="text"
        aria-label="Reconciliation note"
      />
      <button
        className="button button-light reconcile-button"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving…" : "Mark reconciled"}
      </button>
      {state.status === "error" ? (
        <span className="reconcile-error" role="alert">{state.message}</span>
      ) : null}
    </form>
  );
}