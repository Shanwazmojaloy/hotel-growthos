"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { OperatorLoginState, ReconcileActionState } from "../../lib/domain/form-state";
import { createOperatorSession, matchesOperatorPassword } from "../../lib/domain/operator-session";
import {
  getOperatorSession,
  operatorSessionCookieOptions,
  OPERATOR_SESSION_COOKIE,
} from "../../lib/server/operator-auth";
import { createDefaultLeadStore, getOperatorConfig } from "../../lib/server/runtime-config";

export async function loginOperatorAction(
  previousState: OperatorLoginState,
  formData: FormData,
): Promise<OperatorLoginState> {
  void previousState;
  const config = getOperatorConfig();
  if (!config) return { status: "unavailable" };

  if (!matchesOperatorPassword(formData.get("password"), config.password)) {
    return { status: "invalid" };
  }

  const token = createOperatorSession(config.secret);
  const cookieStore = await cookies();
  cookieStore.set(OPERATOR_SESSION_COOKIE, token, operatorSessionCookieOptions());
  redirect("/ops/leads");
}

export async function logoutOperatorAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(OPERATOR_SESSION_COOKIE);
  redirect("/ops");
}

export async function reconcileLeadAction(
  previousState: ReconcileActionState,
  formData: FormData,
): Promise<ReconcileActionState> {
  void previousState;
  const session = await getOperatorSession();
  if (!session) return { status: "unauthorized" };

  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || leadId.length === 0) {
    return { status: "error", message: "Missing lead ID." };
  }

  const note = formData.get("note");
  const noteStr = typeof note === "string" && note.trim().length > 0 ? note.trim() : undefined;

  const store = createDefaultLeadStore();
  if (!store.reconcileLead) {
    return { status: "error", message: "Reconciliation is not supported by the current storage backend." };
  }

  try {
    const reconciled = await store.reconcileLead({
      leadId,
      operatorId: session.sessionId,
      note: noteStr,
    });

    if (store.logAuditEvent) {
      await store.logAuditEvent("lead.reconciled", {
        operatorId: session.sessionId,
        leadId: reconciled.id,
        detail: noteStr ? { note: noteStr } : undefined,
      });
    }

    return { status: "success", leadId: reconciled.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reconciliation failed.";
    return { status: "error", message };
  }
}