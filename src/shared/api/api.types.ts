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
