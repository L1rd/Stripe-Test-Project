import { lazy, type ComponentType, type LazyExoticComponent } from "react";

import type { FlowScreenKey } from "@/app/router/flowRegistry";

export const SCREEN_REGISTRY: Record<
    FlowScreenKey,
    LazyExoticComponent<ComponentType>
> = {
    phone: lazy(() =>
        import("@/features/onboarding/screens/PhoneScreen/PhoneScreen").then(
            (module) => ({ default: module.PhoneScreen }),
        ),
    ),
    email: lazy(() =>
        import("@/features/onboarding/screens/EmailScreen/EmailScreen").then(
            (module) => ({ default: module.EmailScreen }),
        ),
    ),
    quiz_single: lazy(() =>
        import("@/features/onboarding/screens/QuizSingleScreen/QuizSingleScreen").then(
            (module) => ({ default: module.QuizSingleScreen }),
        ),
    ),
    quiz_multi: lazy(() =>
        import("@/features/onboarding/screens/QuizMultiScreen/QuizMultiScreen").then(
            (module) => ({ default: module.QuizMultiScreen }),
        ),
    ),
    checkout: lazy(() =>
        import("@/features/checkout/screens/CheckoutScreen/CheckoutScreen").then(
            (module) => ({ default: module.CheckoutScreen }),
        ),
    ),
    success: lazy(() =>
        import("@/features/checkout/screens/SuccessScreen/SuccessScreen").then(
            (module) => ({ default: module.SuccessScreen }),
        ),
    ),
};