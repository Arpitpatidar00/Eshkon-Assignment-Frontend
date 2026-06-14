import { configureStore, combineReducers } from "@reduxjs/toolkit";
import draftPageReducer from "./slices/draftPageSlice";
import uiReducer from "./slices/uiSlice";
import publishReducer from "./slices/publishSlice";

const rootReducer = combineReducers({
  draftPage: draftPageReducer,
  ui: uiReducer,
  publish: publishReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // redux-persist actions contain non-serializable values
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
