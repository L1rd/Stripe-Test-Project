import type { ComponentType } from "react";

import type { FlowScreenKey } from "./flowRegistry";

import { PhoneScreen } from "./screens/PhoneScreen/PhoneScreen";
import { EmailScreen } from "./screens/EmailScreen/EmailScreen";
import { PlaceholderScreen } from "./screens/PlaceholderScreen";
import { QuizSingleScreen } from "./screens/QuizSingleScreen/QuizSingleScreen";
import { QuizMultiScreen } from "./screens/QuizMultiScreen/QuizMultiScreen";

const CheckoutScreen = () => (
    <PlaceholderScreen title="Checkout" />
);

const SuccessScreen = () => (
    <PlaceholderScreen title="Success" />
);

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