import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { ApiError } from "@/shared/api/apiClient";
import { flowApi } from "./flowApi";

import type { OnboardingState, QuizAnswer } from "./onboarding.types";

import type { FlowResponse } from "@/shared/api/api.types";

const initialState: OnboardingState = {
  flowName: "default",
  flow: [],
  flowStatus: "idle",
  flowError: null,

  phone: "",
  phoneInput: "",
  phoneCountry: "UA",

  email: "",

  quizAnswers: {},
};

export const fetchFlow = createAsyncThunk<
  FlowResponse,
  string,
  { rejectValue: string }
>(
  "onboarding/fetchFlow",
  async (flowName, { rejectWithValue }) => {
    try {
      return await flowApi.getFlow(flowName);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Не вдалося завантажити сценарій онбордингу.");
    }
  },
  {
    condition: (_flowName, { getState }) => {
      const state = getState() as {
        onboarding: OnboardingState;
      };

      return (
        state.onboarding.flowStatus !== "loading" &&
        state.onboarding.flowStatus !== "succeeded"
      );
    },
  },
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,

  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },

    setPhoneInput: (state, action: PayloadAction<string>) => {
      state.phoneInput = action.payload;
    },

    setPhoneCountry: (state, action: PayloadAction<string>) => {
      state.phoneCountry = action.payload;
    },

    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },

    setQuizAnswer: (
      state,
      action: PayloadAction<{
        questionId: string;
        answer: QuizAnswer;
      }>,
    ) => {
      state.quizAnswers[action.payload.questionId] = action.payload.answer;
    },

    resetOnboarding: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFlow.pending, (state, action) => {
        state.flowStatus = "loading";
        state.flowError = null;
        state.flowName = action.meta.arg;
      })

      .addCase(fetchFlow.fulfilled, (state, action) => {
        state.flowName = action.payload.name;
        state.flow = action.payload.screens;
        state.flowStatus = "succeeded";
        state.flowError = null;
      })

      .addCase(fetchFlow.rejected, (state, action) => {
        state.flowStatus = "failed";
        state.flowError =
          action.payload ?? "Не вдалося завантажити сценарій онбордингу.";
      });
  },
});

export const {
  setPhone,
  setPhoneInput,
  setPhoneCountry,
  setEmail,
  setQuizAnswer,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
