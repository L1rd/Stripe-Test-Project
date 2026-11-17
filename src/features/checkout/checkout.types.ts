export type PaymentStatus =
  | "idle"
  | "creating"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed";

export type PaymentMethodType = "card" | "redirect";

export interface Plan {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

export interface CheckoutState {
  plans: Plan[];
  selectedPlanId: string | null;

  paymentId: string | null;
  idempotencyKey: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodType | null;
  paymentError: string | null;
}
