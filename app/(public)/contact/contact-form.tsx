"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitIntakeAction } from "../../actions/intake";
import {
  INITIAL_INTAKE_FORM_STATE,
  type IntakeFormState,
} from "../../../lib/domain/form-state";
import type { IntakeField } from "../../../lib/domain/intake";

function fieldError(state: IntakeFormState, field: IntakeField): string | undefined {
  return state.status === "invalid" ? state.errors[field] : undefined;
}

export function ContactForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    submitIntakeAction,
    INITIAL_INTAKE_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="form-success__icon" aria-hidden="true">
          ✓
        </span>
        <p className="form-success__eyebrow">Inquiry received</p>
        <h2>Thank you for your consultation request.</h2>
        <p>
          Your inquiry has been securely recorded in the operator inbox. An
          operator will review your property details and follow up directly.
        </p>
        <Link className="text-link text-link--dark" href="/">
          Return to the overview <span aria-hidden="true">↗</span>
        </Link>
      </div>
    );
  }

  return (
    <form className="contact-form" action={formAction} noValidate>
      <input type="hidden" name="intakeToken" value={token} />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="companyFax">Leave this field empty</label>
        <input
          autoComplete="off"
          id="companyFax"
          name="companyFax"
          tabIndex={-1}
          type="text"
        />
      </div>

      {state.status === "invalid-token" ? (
        <div className="form-alert" role="alert">
          This form session has expired. Please refresh the page and try again.
        </div>
      ) : null}
      {state.status === "unavailable" ? (
        <div className="form-alert" role="alert">
          The intake service is temporarily unavailable. Your request was not
          recorded; please try again shortly.
        </div>
      ) : null}
      {state.status === "invalid" ? (
        <div className="form-alert" role="alert">
          Please check the highlighted fields and try again.
        </div>
      ) : null}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fullName">Your name <span aria-hidden="true">*</span></label>
          <input
            autoComplete="name"
            aria-describedby={fieldError(state, "fullName") ? "fullName-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "fullName"))}
            id="fullName"
            maxLength={160}
            name="fullName"
            required
            type="text"
          />
          {fieldError(state, "fullName") ? (
            <span className="field-error" id="fullName-error">
              {fieldError(state, "fullName")}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="email">Work email <span aria-hidden="true">*</span></label>
          <input
            autoComplete="email"
            aria-describedby={fieldError(state, "email") ? "email-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "email"))}
            id="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
          {fieldError(state, "email") ? (
            <span className="field-error" id="email-error">
              {fieldError(state, "email")}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="propertyName">Hotel or property <span aria-hidden="true">*</span></label>
          <input
            aria-describedby={fieldError(state, "propertyName") ? "propertyName-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "propertyName"))}
            id="propertyName"
            maxLength={160}
            name="propertyName"
            placeholder="Property name"
            required
            type="text"
          />
          {fieldError(state, "propertyName") ? (
            <span className="field-error" id="propertyName-error">
              {fieldError(state, "propertyName")}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="role">Your role <span className="optional-label">Optional</span></label>
          <input
            autoComplete="organization-title"
            aria-describedby={fieldError(state, "role") ? "role-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "role"))}
            id="role"
            maxLength={100}
            name="role"
            placeholder="For example, General Manager or Revenue Director"
            type="text"
          />
          {fieldError(state, "role") ? (
            <span className="field-error" id="role-error">
              {fieldError(state, "role")}
            </span>
          ) : null}
        </div>

        <div className="form-field form-field--wide">
          <label htmlFor="hotelWebsite">Property website <span className="optional-label">Optional</span></label>
          <input
            autoComplete="url"
            aria-describedby={fieldError(state, "hotelWebsite") ? "hotelWebsite-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "hotelWebsite"))}
            id="hotelWebsite"
            maxLength={200}
            name="hotelWebsite"
            placeholder="https://example.com"
            type="url"
          />
          {fieldError(state, "hotelWebsite") ? (
            <span className="field-error" id="hotelWebsite-error">
              {fieldError(state, "hotelWebsite")}
            </span>
          ) : null}
        </div>

        <div className="form-field form-field--wide">
          <label htmlFor="message">What would you like to explore? <span aria-hidden="true">*</span></label>
          <textarea
            aria-describedby={fieldError(state, "message") ? "message-error" : "message-note"}
            aria-invalid={Boolean(fieldError(state, "message"))}
            id="message"
            maxLength={1400}
            name="message"
            placeholder="A sentence or two is enough. Please do not include guest PII, payment info, credentials, or confidential hotel financial records."
            required
            rows={5}
          />
          {fieldError(state, "message") ? (
            <span className="field-error" id="message-error">
              {fieldError(state, "message")}
            </span>
          ) : (
            <span className="field-hint" id="message-note">
              Keep it high-level; no guest records or confidential credentials.
            </span>
          )}
        </div>
      </div>

      <div className="consent-field">
        <input
          aria-describedby={fieldError(state, "contactPermission") ? "contactPermission-error" : undefined}
          aria-invalid={Boolean(fieldError(state, "contactPermission"))}
          id="contactPermission"
          name="contactPermission"
          required
          type="checkbox"
          value="yes"
        />
        <label htmlFor="contactPermission">
          You may contact me regarding this inquiry. This permission applies exclusively to this request and does not authorize unsolicited marketing.
        </label>
      </div>
      {fieldError(state, "contactPermission") ? (
        <span className="field-error consent-error" id="contactPermission-error">
          {fieldError(state, "contactPermission")}
        </span>
      ) : null}

      <div className="form-submit-row">
        <button className="button button-primary" disabled={isPending} type="submit">
          {isPending ? "Submitting inquiry…" : "Submit inquiry"}
          <span aria-hidden="true">↗</span>
        </button>
        <span className="required-note">Fields marked * are required.</span>
      </div>
      <p className="form-privacy-note">
        <strong>Privacy Notice:</strong> We respect your confidentiality. Information submitted
        through this form is stored in a private, encrypted operator ledger solely to evaluate
        and respond to your property inquiry. We never sell your personal data or enroll you in
        unsolicited marketing lists. You may request data inspection or deletion at any time by
        contacting our operator team. Do not submit guest records, payment details, or PMS passwords.
      </p>
    </form>
  );
}
