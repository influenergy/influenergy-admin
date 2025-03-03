import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slices/authSlice";
import creatorReducer from "./slices/creatorSlice";
import brandReducer from "./slices/brandSlice";
import tabReducer from "./slices/tabSlice";

// Handle storage for SSR (Next.js, etc.)
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

const storageFallback = typeof window !== "undefined" ? storage : createNoopStorage();

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  creators: creatorReducer,
  brands: brandReducer,
  tab: tabReducer,
});

// Persist Config
const persistConfig = {
  key: "root",
  storage: storageFallback,
  whitelist: ["auth", "creators", "brands", "tab"], // Persist all slices
};

// Apply persistence to the entire root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
