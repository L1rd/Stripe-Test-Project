export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface FlowResponse {
  name: string;
  screens: string[];
}

export interface StripeConfigResponse {
  publishableKey: string;
}

export interface PlanResponse {
  id: string;
  name: string;
  amount: number;
  currency: string;
  period: string;
  popular?: boolean;
}

export interface PlansResponse {
  plans: PlanResponse[];
}

export interface CreatePaymentRequest {
  planId: string;
  email: string;
  phone: string;
}

export type PaymentStatus =
  | "requires_payment_method"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "canceled";

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  planId: string | null;
  amount: number;
  currency: string;
  errorMessage: string | null;
}

export interface CreatePaymentResponse extends PaymentResponse {
  clientSecret: string;
}

