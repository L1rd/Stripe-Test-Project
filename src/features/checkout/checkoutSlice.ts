import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { ApiError } from "@/shared/api/apiClient";
import type {
  CreatePaymentResponse,
  PaymentResponse,
} from "@/shared/api/api.types";

import type {
  CheckoutState,
  PaymentStatus,
  PaymentMethodType,
  Plan,
} from "./checkout.types";
import { plansApi } from "./api/plansApi";
import { paymentsApi } from "./api/paymentsApi";
import { paymentConfigApi } from "./api/paymentConfigApi";

interface CreatePaymentPayload {
  planId: string;
  email: string;
  phone: string;
  idempotencyKey: string;
}

const initialState: CheckoutState = {
  plans: [],
  plansStatus: "idle",
  plansError: null,

  selectedPlanId: null,

  stripePublishableKey: null,
  configStatus: "idle",
  configError: null,

  paymentId: null,
  clientSecret: null,
  paymentPlanId: null,
  idempotencyKey: null,

  paymentStatus: "idle",
  paymentMethod: null,
  paymentError: null,
  paymentStatusCheckStatus: "idle",
  paymentStatusCheckError: null,
};

// Fetch available plans
export const fetchPlans = createAsyncThunk<
  Plan[],
  void,
  { rejectValue: string }
>("checkout/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const response = await plansApi.getPlans();

    return response.plans;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Не вдалося завантажити тарифні плани.");
  }
});

export const fetchStripeConfig = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("checkout/fetchStripeConfig", async (_, { rejectWithValue }) => {
  try {
    const response = await paymentConfigApi.getConfig();

    return response.publishableKey;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Не вдалося завантажити налаштування Stripe.");
  }
});

// Create Stripe PaymentIntent
export const createPayment = createAsyncThunk<
  CreatePaymentResponse,
  CreatePaymentPayload,
  { rejectValue: string }
>("checkout/createPayment", async (payload, { rejectWithValue }) => {
  try {
    return await paymentsApi.createPayment(
      {
        planId: payload.planId,
        email: payload.email,
        phone: payload.phone,
      },
      payload.idempotencyKey,
    );
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Не вдалося створити платіж.");
  }
});

// Retrieve actual payment status from backend
export const fetchPaymentStatus = createAsyncThunk<
  PaymentResponse,
  string,
  { rejectValue: string }
>("checkout/fetchPaymentStatus", async (paymentId, { rejectWithValue }) => {
  try {
    return await paymentsApi.getPayment(paymentId);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Не вдалося перевірити статус платежу.");
  }
});

const clearPaymentState = (state: CheckoutState) => {
  state.paymentId = null;
  state.clientSecret = null;
  state.paymentPlanId = null;
  state.idempotencyKey = null;

  state.paymentStatus = "idle";
  state.paymentStatusCheckStatus = "idle";

  state.paymentMethod = null;
  state.paymentError = null;
  state.paymentStatusCheckError = null;
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,

  reducers: {
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
      state.plansStatus = "succeeded";
      state.plansError = null;
    },

    setSelectedPlan: (state, action: PayloadAction<string>) => {
      if (state.selectedPlanId !== action.payload) {
        clearPaymentState(state);
      }

      state.selectedPlanId = action.payload;
    },

    setPaymentError: (state, action: PayloadAction<string>) => {
      state.paymentError = action.payload;
    },

    clearPaymentError: (state) => {
      state.paymentError = null;
    },

    resetPayment: (state) => {
      clearPaymentState(state);
    },

    setPaymentId: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload;
    },

    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },

    setIdempotencyKey: (state, action: PayloadAction<string>) => {
      state.idempotencyKey = action.payload;
    },

    setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.paymentStatus = action.payload;
    },

    setPaymentMethod: (state, action: PayloadAction<PaymentMethodType>) => {
      state.paymentMethod = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Plans
      .addCase(fetchPlans.pending, (state) => {
        state.plansStatus = "loading";
        state.plansError = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.plansStatus = "succeeded";
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.plansStatus = "failed";
        state.plansError =
          action.payload ?? "Не вдалося завантажити тарифні плани.";
      })

      // Stripe config
      .addCase(fetchStripeConfig.pending, (state) => {
        state.configStatus = "loading";
        state.configError = null;
      })
      .addCase(fetchStripeConfig.fulfilled, (state, action) => {
        state.stripePublishableKey = action.payload;
        state.configStatus = "succeeded";
        state.configError = null;
      })
      .addCase(fetchStripeConfig.rejected, (state, action) => {
        state.configStatus = "failed";
        state.configError =
          action.payload ?? "Не вдалося завантажити налаштування Stripe.";
      })

      // Create payment
      .addCase(createPayment.pending, (state, action) => {
        state.paymentStatus = "creating";
        state.paymentError = null;

        state.paymentId = null;
        state.clientSecret = null;

        state.idempotencyKey = action.meta.arg.idempotencyKey;
        state.paymentPlanId = action.meta.arg.planId;
        state.paymentStatusCheckStatus = "idle";
        state.paymentStatusCheckError = null;
      })

      .addCase(createPayment.fulfilled, (state, action) => {
        state.paymentId = action.payload.id;
        state.clientSecret = action.payload.clientSecret;

        state.paymentPlanId = action.payload.planId ?? action.meta.arg.planId;

        state.paymentStatus = action.payload.status;
        state.paymentError = action.payload.errorMessage;

        state.paymentStatusCheckStatus = "idle";
        state.paymentStatusCheckError = null;
      })

      .addCase(createPayment.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.paymentError = action.payload ?? "Не вдалося створити платіж.";
      })

      // Retrieve payment status
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.paymentStatusCheckStatus = "loading";
        state.paymentStatusCheckError = null;
      })

      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatus = action.payload.status;
        state.paymentError = action.payload.errorMessage;

        state.paymentStatusCheckStatus = "succeeded";
        state.paymentStatusCheckError = null;
      })

      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.paymentStatusCheckStatus = "failed";
        state.paymentStatusCheckError =
          action.payload ?? "Не вдалося перевірити статус платежу.";
      });
  },
});

export const {
  setPlans,
  setSelectedPlan,
  setPaymentId,
  setClientSecret,
  setIdempotencyKey,
  setPaymentStatus,
  setPaymentMethod,
  setPaymentError,
  clearPaymentError,
  resetPayment,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
