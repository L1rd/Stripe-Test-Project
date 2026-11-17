import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  CheckoutState,
  PaymentStatus,
  PaymentMethodType,
  Plan,
} from "./checkout.types";

const initialState: CheckoutState = {
  plans: [],
  selectedPlanId: null,

  paymentId: null,
  idempotencyKey: null,
  paymentStatus: "idle",
  paymentMethod: null,
  paymentError: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
    },

    setSelectedPlan: (state, action: PayloadAction<string>) => {
      state.selectedPlanId = action.payload;
    },

    setPaymentId: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload;
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

    setPaymentError: (state, action: PayloadAction<string>) => {
      state.paymentError = action.payload;
      state.paymentStatus = "failed";
    },

    resetPayment: (state) => {
      state.paymentId = null;
      state.idempotencyKey = null;
      state.paymentStatus = "idle";
      state.paymentMethod = null;
      state.paymentError = null;
    },
  },
});

export const {
  setPlans,
  setSelectedPlan,
  setPaymentId,
  setIdempotencyKey,
  setPaymentStatus,
  setPaymentMethod,
  setPaymentError,
  resetPayment,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
