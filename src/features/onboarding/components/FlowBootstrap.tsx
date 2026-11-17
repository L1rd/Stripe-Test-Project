import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { useAppDispatch } from "../../../app/store/hooks";
import { fetchFlow } from "../onboardingSlice";

interface FlowBootstrapProps {
    children: ReactNode;
}

export function FlowBootstrap({
    children,
}: FlowBootstrapProps) {
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const flowName = searchParams.get("flow") || "default";

        void dispatch(fetchFlow(flowName));
    }, [dispatch, location.search]);

    return <>{children}</>;
}