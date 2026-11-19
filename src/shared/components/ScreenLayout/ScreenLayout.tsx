import type { ReactNode } from "react";

import {
    Card,
    Description,
    Header,
    Page,
    ProgressFill,
    ProgressLabel,
    ProgressTrack,
    Title,
} from "./ScreenLayout.styles";
import { useFlowNavigation } from "@/features/onboarding/hooks/useFlowNavigation";
import { useTranslation } from "react-i18next";


interface ScreenLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function ScreenLayout({
    title,
    description,
    children,
}: ScreenLayoutProps) {
    const { progress } = useFlowNavigation();
    const { t } = useTranslation();

    return (
        <Page>
            <Card>
                <ProgressLabel>
                    <span>{t('screenLayout.progressLabel')}</span>
                    <span>
                        {progress.current} / {progress.total}
                    </span>
                </ProgressLabel>

                <ProgressTrack
                    role="progressbar"
                    aria-valuenow={progress.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <ProgressFill $progress={progress.percentage} />
                </ProgressTrack>

                <Header>
                    <Title>{title}</Title>

                    {description && (
                        <Description>{description}</Description>
                    )}
                </Header>

                {children}
            </Card>
        </Page>
    );
}