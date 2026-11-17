import { apiRequest } from "./apiClient";
import { API_ENDPOINTS } from "./endpoints";

import type { StripeConfigResponse } from "./api.types";

export const configApi = {
  getConfig(): Promise<StripeConfigResponse> {
    return apiRequest<StripeConfigResponse>(API_ENDPOINTS.config);
  },
};
