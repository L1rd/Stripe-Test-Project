import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import onboardingReducer from "@/features/onboarding/onboardingSlice";
import checkoutReducer from "@/features/checkout/checkoutSlice";

import { persistConfig } from "./persistConfig";

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  checkout: checkoutReducer,
});

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
  },
};

export default storage;

const persistedReducer = persistReducer(
  {
    ...persistConfig,
    storage,
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

console.log("[Redux] Initial checkout state:", store.getState().checkout);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
