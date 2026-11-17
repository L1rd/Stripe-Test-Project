import { useCallback } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";

import {
  selectFlowProgress,
  selectSupportedFlow,
} from "../onboardingSelectors";

import type { FlowScreenKey } from "../flowRegistry";

export function useFlowNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const flow = useAppSelector(selectSupportedFlow);

  const currentStep = location.pathname.split("/").filter(Boolean)[0] as
    | FlowScreenKey
    | undefined;

  const currentIndex = currentStep ? flow.indexOf(currentStep) : -1;

  const progress = useAppSelector((state) =>
    currentStep
      ? selectFlowProgress(state, currentStep)
      : {
          current: 0,
          total: flow.length,
          percentage: 0,
        },
  );

  const navigateToStep = useCallback(
    (step: FlowScreenKey) => {
      navigate(
        {
          pathname: `/${step}`,
          search: location.search,
        },
        {
          replace: true,
        },
      );
    },
    [navigate, location.search],
  );

  const goToNextStep = useCallback(() => {
    const nextStep = flow[currentIndex + 1];

    if (nextStep) {
      navigateToStep(nextStep);
    }
  }, [flow, currentIndex, navigateToStep]);

  const goToFirstStep = useCallback(() => {
    const firstStep = flow[0];

    if (firstStep) {
      navigateToStep(firstStep);
    }
  }, [flow, navigateToStep]);

  return {
    currentStep,
    currentIndex,
    totalSteps: flow.length,
    progress,
    goToNextStep,
    goToFirstStep,
    navigateToStep,
  };
}
