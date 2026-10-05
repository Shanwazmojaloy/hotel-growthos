"use server";

import type { IntakeFormState } from "../../lib/domain/form-state";
import { processIntakeSubmission } from "../../lib/domain/submit-intake";
import { createDefaultLeadStore, getAppSigningSecret } from "../../lib/server/runtime-config";

export async function submitIntakeAction(
  previousState: IntakeFormState,
  formData: FormData,
): Promise<IntakeFormState> {
  void previousState;
  const secret = getAppSigningSecret();
  if (!secret) return { status: "unavailable" };

  try {
    const result = await processIntakeSubmission({
      fields: Object.fromEntries(formData.entries()),
      secret,
      store: createDefaultLeadStore(),
    });

    switch (result.status) {
      case "success":
        return { status: "success", duplicate: result.duplicate };
      case "invalid":
        return { status: "invalid", errors: result.errors };
      case "invalid-token":
        return { status: "invalid-token" };
      case "unavailable":
        return { status: "unavailable" };
    }
  } catch {
    return { status: "unavailable" };
  }
}
