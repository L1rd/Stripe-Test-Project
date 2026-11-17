export const FLOW_SCREENS = {
  phone: {
    path: "/phone",
    title: "Phone",
  },

  email: {
    path: "/email",
    title: "Email",
  },

  quiz_single: {
    path: "/quiz_single",
    title: "Single choice quiz",
  },

  quiz_multi: {
    path: "/quiz_multi",
    title: "Multiple choice quiz",
  },

  checkout: {
    path: "/checkout",
    title: "Checkout",
  },

  success: {
    path: "/success",
    title: "Success",
  },
} as const;

export type FlowScreenKey = keyof typeof FLOW_SCREENS;

export function isKnownFlowScreen(screen: string): screen is FlowScreenKey {
  return Object.hasOwn(FLOW_SCREENS, screen);
}
