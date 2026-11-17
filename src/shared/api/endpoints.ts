export const API_ENDPOINTS = {
  config: "/config",
  plans: "/plans",

  flow: (name: string) => `/flow?name=${encodeURIComponent(name)}`,

  payments: "/payments",

  paymentById: (id: string) => `/payments/${encodeURIComponent(id)}`,
} as const;
