
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";


import {
    selectFlowError,
    selectFlowName,
    selectFlowStatus,
    selectSupportedFlow,
} from "@/features/onboarding/onboardingSelectors";

import { fetchFlow } from "@/features/onboarding/onboardingSlice";

import { isKnownFlowScreen } from "@/features/onboarding/flowRegistry";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { SCREEN_REGISTRY } from "@/features/onboarding/screenRegistry";

function FlowStatusView() {
    const dispatch = useAppDispatch();

    const status = useAppSelector(selectFlowStatus);
    const error = useAppSelector(selectFlowError);
    const flowName = useAppSelector(selectFlowName);

    if (status === "loading" || status === "idle") {
        return <p>Завантаження онбордингу...</p>;
    }

    if (status === "failed") {
        return (
            <main>
                <h1>Не вдалося завантажити онбординг</h1>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => {
                        void dispatch(fetchFlow(flowName));
                    }}
                >
                    Спробувати ще раз
                </button>
            </main>
        );
    }

    return null;
}

function FlowEntryRedirect() {
    const flow = useAppSelector(selectSupportedFlow);
    const status = useAppSelector(selectFlowStatus);

    const location = useLocation();

    if (status !== "succeeded") {
        return <FlowStatusView />;
    }

    const firstStep = flow[0];

    if (!firstStep) {
        return <p>У цьому сценарії немає доступних екранів.</p>;
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
    const { step } = useParams();

    const flow = useAppSelector(selectSupportedFlow);
    const status = useAppSelector(selectFlowStatus);

    const location = useLocation();

    if (status !== "succeeded") {
        return <FlowStatusView />;
    }

    if (!flow.length) {
        return <p>У цьому сценарії немає доступних екранів.</p>;
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

    return <Screen />;
}

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<FlowEntryRedirect />} />

            <Route path="/:step" element={<FlowStepResolver />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}