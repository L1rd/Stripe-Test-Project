import { apiRequest } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type { FlowResponse } from "@/shared/api/api.types";

export const flowApi = {
  getFlow(name: string): Promise<FlowResponse> {
    return apiRequest<FlowResponse>(API_ENDPOINTS.flow(name));
  },
};
