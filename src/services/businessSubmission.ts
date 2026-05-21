export type BusinessSubmissionPayload = {
  rawText: string;
  planId: string;
  contactEmail?: string;
  contactPhone?: string;
};

export type ProcessedEventDraft = {
  title: string;
  category: string;
  vibe: string;
  tags: string[];
  moderationStatus: "draft" | "pending_payment" | "paid" | "approved" | "rejected";
};

export type PaymentIntent = {
  provider: "yookassa" | "cloudpayments";
  paymentId: string;
  confirmationUrl: string;
};

export function buildLocalEventDraft(rawText: string): ProcessedEventDraft {
  const normalized = rawText.toLowerCase();

  return {
    title: normalized.includes("вин") ? "Винный ужин на Таганке" : "Новое событие рядом",
    category: normalized.includes("ужин") || normalized.includes("кофе") ? "food" : "entertainment",
    vibe: normalized.includes("вечер") ? "камерный вечер" : "локальный план",
    tags: ["Таганка", "событие", "проверить"],
    moderationStatus: "pending_payment"
  };
}

export async function createPaymentIntent(
  payload: BusinessSubmissionPayload
): Promise<PaymentIntent> {
  throw new Error(
    `Payment backend is not connected yet. Send payload to the server instead: ${payload.planId}`
  );
}
