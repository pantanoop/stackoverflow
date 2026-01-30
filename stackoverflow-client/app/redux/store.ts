import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authenticateSlice";
import tagReducer from "../redux/tags/tagSlice";
import questionReducer from "./questions/questionSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authenticator", "questions"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    authenticator: authReducer,
    tags: tagReducer,
    questions: questionReducer,
  }),
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

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
