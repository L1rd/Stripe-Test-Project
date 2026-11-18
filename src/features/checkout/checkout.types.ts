export type PaymentStatus =
  | "idle"
  | "creating"
  | "requires_payment_method"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "canceled"
  | "failed";

export type PaymentMethodType = "card" | "redirect";

export type RequestStatus =
  | "idle"
  | "loading"
  | "succeeded"
  | "failed";

export interface Plan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  period?: string;
  popular?: boolean;
}

export interface CheckoutState {
  plans: Plan[];
  plansStatus: RequestStatus;
  plansError: string | null;

  selectedPlanId: string | null;

  stripePublishableKey: string | null;
  configStatus: RequestStatus;
  configError: string | null;

  paymentId: string | null;
  clientSecret: string | null;
  paymentPlanId: string | null;
  idempotencyKey: string | null;

  paymentStatus: PaymentStatus;
  paymentStatusCheckStatus: RequestStatus;

  paymentMethod: PaymentMethodType | null;
  paymentError: string | null;
  paymentStatusCheckError: string | null;
}