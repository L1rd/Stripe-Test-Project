
import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import {
    SuccessContainer,
    SuccessIcon,
    SuccessTitle,
    SuccessDescription,
} from "./SuccessScreen.styles";

export const SuccessScreen = () => {
    return (
        <ScreenLayout title={""}>
            <SuccessContainer>
                <SuccessIcon aria-hidden="true">
                    ✓
                </SuccessIcon>

                <SuccessTitle>
                    Payment successful!
                </SuccessTitle>

                <SuccessDescription>
                    Thank you for your payment. Your transaction has been
                    successfully completed.
                </SuccessDescription>
            </SuccessContainer>
        </ScreenLayout>
    );
};
