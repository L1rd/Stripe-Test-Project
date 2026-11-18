import { apiRequest } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type { PlansResponse } from "@/shared/api/api.types";

export const plansApi = {
  getPlans: () => apiRequest<PlansResponse>(API_ENDPOINTS.plans),
};
