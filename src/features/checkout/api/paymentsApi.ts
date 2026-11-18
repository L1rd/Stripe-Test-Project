import { apiRequest } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentResponse,
} from "@/shared/api/api.types";

export const paymentsApi = {
  createPayment: (payload: CreatePaymentRequest, idempotencyKey: string) =>
    apiRequest<CreatePaymentResponse>(API_ENDPOINTS.payments, {
      method: "POST",
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    }),

  getPayment: (paymentId: string) =>
    apiRequest<PaymentResponse>(API_ENDPOINTS.paymentById(paymentId)),
};
