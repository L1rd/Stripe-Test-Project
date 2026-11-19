import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { useTranslation } from "react-i18next";

interface PlaceholderScreenProps {
    title: string;
}

export function PlaceholderScreen({
    title,
}: PlaceholderScreenProps) {
    const { t } = useTranslation();

    return (
        <ScreenLayout
            title={title}
            description={t('placeholder.description')}
        >
            <p>{title}</p>
        </ScreenLayout>
    );
}