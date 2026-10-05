"use client";

import { useActionState } from "react";
import { INITIAL_OPERATOR_LOGIN_STATE } from "../../lib/domain/form-state";
import { loginOperatorAction } from "./actions";

export function OperatorLoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, isPending] = useActionState(
    loginOperatorAction,
    INITIAL_OPERATOR_LOGIN_STATE,
  );

  if (!configured || state.status === "unavailable") {
    return (
      <div className="login-unavailable" role="status">
        <span className="login-unavailable__mark" aria-hidden="true">!</span>
        <div>
          <strong>Operator access is not configured.</strong>
          <p>
            Set a strong HGO_APP_SECRET and an OPS_PASSWORD of at least 16
            characters in the server environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="login-form" action={formAction}>
      {state.status === "invalid" ? (
        <p className="form-alert" role="alert">
          That password did not match. Try again or ask the project owner to
          verify the operator configuration.
        </p>
      ) : null}
      <div className="form-field">
        <label htmlFor="operator-password">Operator password</label>
        <input
          autoComplete="current-password"
          id="operator-password"
          maxLength={1_024}
          minLength={16}
          name="password"
          required
          type="password"
        />
      </div>
      <button className="button button-primary login-submit" disabled={isPending} type="submit">
        {isPending ? "Checking…" : "Sign in"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="login-note">This prototype uses one server-configured operator password.</p>
    </form>
  );
}
