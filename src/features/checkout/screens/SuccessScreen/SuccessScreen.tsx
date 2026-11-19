
import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import {
    SuccessContainer,
    SuccessIcon,
    SuccessTitle,
    SuccessDescription,
} from "./SuccessScreen.styles";
import { useTranslation } from "react-i18next";

export const SuccessScreen = () => {
    const { t } = useTranslation('checkout');

    return (
        <ScreenLayout title={""}>
            <SuccessContainer>
                <SuccessIcon aria-hidden="true">
                    ✓
                </SuccessIcon>

                <SuccessTitle>
                    {t('payment.successful')}
                </SuccessTitle>

                <SuccessDescription>
                    {t('payment.successfulDescription')}
                </SuccessDescription>
            </SuccessContainer>
        </ScreenLayout>
    );
};
