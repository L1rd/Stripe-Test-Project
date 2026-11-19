import type { FlowScreenKey } from "@/app/router/flowRegistry";

const screenLoaders = {
  phone: () => import("@/features/onboarding/screens/PhoneScreen/PhoneScreen"),
  email: () => import("@/features/onboarding/screens/EmailScreen/EmailScreen"),
  quiz_single: () =>
    import("@/features/onboarding/screens/QuizSingleScreen/QuizSingleScreen"),
  quiz_multi: () =>
    import("@/features/onboarding/screens/QuizMultiScreen/QuizMultiScreen"),
  checkout: () =>
    import("@/features/checkout/screens/CheckoutScreen/CheckoutScreen"),
  success: () =>
    import("@/features/checkout/screens/SuccessScreen/SuccessScreen"),
};

export function preloadScreen(screen: FlowScreenKey): void {
  void screenLoaders[screen]();
}
