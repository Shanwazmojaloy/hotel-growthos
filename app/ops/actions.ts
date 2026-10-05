"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { OperatorLoginState } from "../../lib/domain/form-state";
import { createOperatorSession, matchesOperatorPassword } from "../../lib/domain/operator-session";
import {
  operatorSessionCookieOptions,
  OPERATOR_SESSION_COOKIE,
} from "../../lib/server/operator-auth";
import { getOperatorConfig } from "../../lib/server/runtime-config";

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
