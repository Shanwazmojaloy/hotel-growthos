import "server-only";
import { cookies } from "next/headers";
import {
  OPERATOR_SESSION_TTL_MS,
  verifyOperatorSession,
  type OperatorSessionClaims,
} from "../domain/operator-session";
import { getAppSigningSecret } from "./runtime-config";

export const OPERATOR_SESSION_COOKIE = "hgo_ops_session";

export function operatorSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(OPERATOR_SESSION_TTL_MS / 1_000),
    expires: new Date(Date.now() + OPERATOR_SESSION_TTL_MS),
  };
}

export async function getOperatorSession(): Promise<OperatorSessionClaims | null> {
  const secret = getAppSigningSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(OPERATOR_SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = verifyOperatorSession(token, secret);
  return result.valid ? result.claims : null;
}
