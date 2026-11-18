import type { PaymentStatus } from "@/shared/api/api.types";

export type FlowStep = string;

export type FlowStatus = "idle" | "loading" | "succeeded" | "failed";

export type QuizAnswer = string | string[];

export interface OnboardingState {
  flowName: string;
  flow: FlowStep[];
  flowStatus: FlowStatus;
  flowError: string | null;

  phone: string;
  phoneInput: string;
  phoneCountry: string;

  email: string;

  quizAnswers: Record<string, QuizAnswer>;
}


export type PlansStatus = "idle" | "loading" | "succeeded" | "failed";

export type PaymentProcessStatus =
  | "idle"
  | "creating"
  | "error"
  | PaymentStatus;