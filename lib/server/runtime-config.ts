import "server-only";
import { randomBytes } from "node:crypto";
import { join } from "node:path";
import type { LeadStore } from "../domain/lead-ledger";
import { hasStrongSigningSecret } from "../domain/signed-token";
import { FileLeadStore } from "./file-lead-store";
import { SupabaseLeadStore } from "./supabase-lead-store";

const developmentGlobal = globalThis as typeof globalThis & {
  __hgoDevelopmentSigningSecret?: string;
};

function getDevelopmentSigningSecret(): string {
  developmentGlobal.__hgoDevelopmentSigningSecret ??= randomBytes(32).toString("base64url");
  return developmentGlobal.__hgoDevelopmentSigningSecret;
}

export function getAppSigningSecret(): string | null {
  const configuredSecret = process.env.HGO_APP_SECRET;
  if (configuredSecret !== undefined) {
    return hasStrongSigningSecret(configuredSecret) ? configuredSecret : null;
  }
  return process.env.NODE_ENV === "development" ? getDevelopmentSigningSecret() : null;
}

export function getOperatorConfig(): { secret: string; password: string } | null {
  const secret = getAppSigningSecret();
  const password = process.env.OPS_PASSWORD;
  if (!secret || !password || password.length < 16 || password.length > 1_024) {
    return null;
  }
  return { secret, password };
}

export function createDefaultLeadStore(): LeadStore {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    return new SupabaseLeadStore({
      url: supabaseUrl,
      apiKey: supabaseKey,
    });
  }

  return new FileLeadStore({
    filePath:
      process.env.HGO_LEDGER_PATH ??
      (process.env.VERCEL
        ? join("/tmp", "lead-ledger.json")
        : join(process.cwd(), ".local", "lead-ledger.json")),
  });
}
