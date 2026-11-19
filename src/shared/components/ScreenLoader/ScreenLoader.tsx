
import { useTranslation } from "react-i18next";
import {
    LoaderContainer,
    LoaderContent,
    LoaderSpinner,
    LoaderText,
    LoaderTitle,
} from "./ScreenLoader.styles";

interface ScreenLoaderProps {
    message?: string;
}

export function ScreenLoader({
    message,
}: ScreenLoaderProps) {
    const { t } = useTranslation();

    return (
        <LoaderContainer
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <LoaderContent>
                <LoaderSpinner aria-hidden="true" />
                <LoaderTitle>{t('loader.title')}</LoaderTitle>
                <LoaderText>{message || t('loader.message')}</LoaderText>
            </LoaderContent>
        </LoaderContainer>
    );
}
