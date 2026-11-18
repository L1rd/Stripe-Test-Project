import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import {
  isKnownFlowScreen,
  type FlowScreenKey,
} from "../../app/router/flowRegistry";

const selectRawFlow = (state: RootState) => state.onboarding.flow;

export const selectSupportedFlow = createSelector(
  [selectRawFlow],
  (flow): FlowScreenKey[] => flow.filter(isKnownFlowScreen),
);

export const selectFlowStatus = (state: RootState) =>
  state.onboarding.flowStatus;

export const selectFlowError = (state: RootState) => state.onboarding.flowError;

export const selectFlowName = (state: RootState) => state.onboarding.flowName;

export const selectPhone = (state: RootState) => state.onboarding.phone;

export const selectEmail = (state: RootState) => state.onboarding.email;

export const selectPhoneInput = (state: RootState) =>
  state.onboarding.phoneInput;

export const selectPhoneCountry = (state: RootState) =>
  state.onboarding.phoneCountry;

export const selectQuizAnswers = (state: RootState) =>
  state.onboarding.quizAnswers;

export const selectFlowProgress = (
  state: RootState,
  currentStep: FlowScreenKey,
) => {
  const flow = selectSupportedFlow(state);
  const currentIndex = flow.indexOf(currentStep);

  if (currentIndex === -1 || flow.length === 0) {
    return {
      current: 0,
      total: flow.length,
      percentage: 0,
    };
  }

  return {
    current: currentIndex + 1,
    total: flow.length,
    percentage: Math.round(((currentIndex + 1) / flow.length) * 100),
  };
};
