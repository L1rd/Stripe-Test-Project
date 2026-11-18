import { apiRequest } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type { StripeConfigResponse } from "@/shared/api/api.types";

export const paymentConfigApi = {
  getConfig: () => apiRequest<StripeConfigResponse>(API_ENDPOINTS.config),
};
