import type { IntakeFieldErrors } from "./intake";

export type IntakeFormState =
  | { status: "idle" }
  | { status: "success"; duplicate: boolean }
  | { status: "invalid"; errors: IntakeFieldErrors }
  | { status: "invalid-token" }
  | { status: "unavailable" };

export const INITIAL_INTAKE_FORM_STATE: IntakeFormState = { status: "idle" };

export type OperatorLoginState =
  | { status: "idle" }
  | { status: "invalid" }
  | { status: "unavailable" };

export const INITIAL_OPERATOR_LOGIN_STATE: OperatorLoginState = { status: "idle" };
