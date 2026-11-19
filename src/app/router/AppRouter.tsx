import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import {
    selectFlowError,
    selectFlowName,
    selectFlowStatus,
    selectSupportedFlow,
} from "@/features/onboarding/onboardingSelectors";

import { fetchFlow } from "@/features/onboarding/onboardingSlice";
import { isKnownFlowScreen } from "@/app/router/flowRegistry";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { SCREEN_REGISTRY } from "@/app/router/screenRegistry";
import { fetchPaymentStatus } from "@/features/checkout/checkoutSlice";
import { preloadScreen } from "./screenPreloader";
import { ScreenLoader } from "@/shared/components/ScreenLoader/ScreenLoader";

// Styled components

const StatusPage = styled.main`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
`;

const StatusContent = styled.div`
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`;

const StatusTitle = styled.h1`
    margin: 0;
    color: ${({ theme }) => theme.colors.text};

    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
`;

const StatusText = styled.p`
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: #777;
`;

const ErrorText = styled(StatusText)`
    color: #dc4545;
`;

const RetryButton = styled.button`
    min-height: 48px;
    padding: 0 28px;
    border: none;
    border-radius: 12px;
    background: #222;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.85;
    }

    &:focus-visible {
        outline: 2px solid #555;
        outline-offset: 3px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

function FlowStatusView() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const status = useAppSelector(selectFlowStatus);
    const error = useAppSelector(selectFlowError);
    const flowName = useAppSelector(selectFlowName);

    if (status === "loading" || status === "idle") {
        return (
            <StatusPage>
                <StatusContent>
                    <StatusText role="status" aria-live="polite">
                        {t("common.loading")}
                    </StatusText>
                </StatusContent>
            </StatusPage>
        );
    }

    if (status === "failed") {
        return (
            <StatusPage>
                <StatusContent>
                    <StatusTitle>
                        {t("errors.loadFlow")}
                    </StatusTitle>

                    {error && <ErrorText>{error}</ErrorText>}

                    <RetryButton
                        type="button"
                        onClick={() => {
                            void dispatch(fetchFlow(flowName));
                        }}
                    >
                        {t("common.retry")}
                    </RetryButton>
                </StatusContent>
            </StatusPage>
        );
    }

    return null;
}

function FlowEntryRedirect() {
    const { t } = useTranslation();

    const flow = useAppSelector(selectSupportedFlow);
    const status = useAppSelector(selectFlowStatus);

    const location = useLocation();

    if (status !== "succeeded") {
        return <FlowStatusView />;
    }

    const firstStep = flow[0];

    if (!firstStep) {
        return (
            <StatusPage>
                <StatusContent>
                    <StatusText>{t("router.emptyFlow")}</StatusText>
                </StatusContent>
            </StatusPage>
        );
    }

    return (
        <Navigate
            to={{
                pathname: `/${firstStep}`,
                search: location.search,
            }}
            replace
        />
    );
}

function FlowStepResolver() {
    const { t } = useTranslation();
    const { step } = useParams();

    const flow = useAppSelector(selectSupportedFlow);
    const status = useAppSelector(selectFlowStatus);

    const location = useLocation();

    useEffect(() => {
        if (!step || !isKnownFlowScreen(step)) {
            return;
        }

        const currentIndex = flow.indexOf(step);
        const nextStep = flow[currentIndex + 1];

        if (nextStep) {
            preloadScreen(nextStep);
        }
    }, [step, flow]);

    if (status !== "succeeded") {
        return <FlowStatusView />;
    }

    if (!flow.length) {
        return (
            <StatusPage>
                <StatusContent>
                    <StatusText>{t("router.emptyFlow")}</StatusText>
                </StatusContent>
            </StatusPage>
        );
    }

    if (
        !step ||
        !isKnownFlowScreen(step) ||
        !flow.includes(step)
    ) {
        return (
            <Navigate
                to={{
                    pathname: `/${flow[0]}`,
                    search: location.search,
                }}
                replace
            />
        );
    }

    const Screen = SCREEN_REGISTRY[step];

    const screenElement = (
        <Suspense fallback={<ScreenLoader />}>
            <Screen />
        </Suspense>
    );

    if (step === "success") {
        return (
            <SuccessRouteGuard>
                {screenElement}
            </SuccessRouteGuard>
        );
    }

    return screenElement;
}

// Success route guard

function SuccessRouteGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const paymentId = useAppSelector(
        (state) => state.checkout.paymentId,
    );

    const paymentStatus = useAppSelector(
        (state) => state.checkout.paymentStatus,
    );

    const paymentStatusCheckError = useAppSelector(
        (state) => state.checkout.paymentStatusCheckError,
    );

    const [isChecking, setIsChecking] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!paymentId) {
            return;
        }

        void dispatch(fetchPaymentStatus(paymentId)).finally(() => {
            setIsChecking(false);
        });
    }, [dispatch, paymentId, retryCount]);

    if (!paymentId) {
        return <Navigate to="/checkout" replace />;
    }

    if (isChecking) {
        return (
            <StatusPage>
                <StatusContent>
                    <StatusText role="status" aria-live="polite">
                        {t("checkout.payment.status.verifying")}
                    </StatusText>
                </StatusContent>
            </StatusPage>
        );
    }

    if (paymentStatusCheckError) {
        return (
            <StatusPage>
                <StatusContent>
                    <StatusTitle>
                        {t("errors.loadPayment")}
                    </StatusTitle>

                    <ErrorText>
                        {paymentStatusCheckError}
                    </ErrorText>

                    <RetryButton
                        type="button"
                        onClick={() => {
                            setIsChecking(true);
                            setRetryCount((count) => count + 1);
                        }}
                    >
                        {t("common.retry")}
                    </RetryButton>
                </StatusContent>
            </StatusPage>
        );
    }

    if (paymentStatus !== "succeeded") {
        return <Navigate to="/checkout" replace />;
    }

    return <>{children}</>;
}

// App router

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<FlowEntryRedirect />} />

            <Route path="/:step" element={<FlowStepResolver />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}