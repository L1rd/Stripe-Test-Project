import type { ComponentType } from "react";

import type { FlowScreenKey } from "@/app/router/flowRegistry";

import { PhoneScreen } from "@/features/onboarding/screens/PhoneScreen/PhoneScreen";
import { EmailScreen } from "@/features/onboarding/screens/EmailScreen/EmailScreen";
import { QuizSingleScreen } from "@/features/onboarding/screens/QuizSingleScreen/QuizSingleScreen";
import { QuizMultiScreen } from "@/features/onboarding/screens/QuizMultiScreen/QuizMultiScreen";
import { CheckoutScreen } from "@/features/checkout/screens/CheckoutScreen/CheckoutScreen";
import { SuccessScreen } from "@/features/checkout/screens/SuccessScreen/SuccessScreen";

export const SCREEN_REGISTRY: Record<
    FlowScreenKey,
    ComponentType
> = {
    phone: PhoneScreen,
    email: EmailScreen,
    quiz_single: QuizSingleScreen,
    quiz_multi: QuizMultiScreen,
    checkout: CheckoutScreen,
    success: SuccessScreen,
};