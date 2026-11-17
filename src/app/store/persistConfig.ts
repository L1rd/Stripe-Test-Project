import storage from "redux-persist/lib/storage";
import type { PersistConfig } from "redux-persist";
import type { RootState } from "./store";

export const persistConfig: PersistConfig<RootState> = {
  key: "onboarding",
  version: 1,
  storage,
  whitelist: ["onboarding", "checkout"],
};