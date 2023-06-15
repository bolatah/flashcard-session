import {
  Action,
  Middleware,
  ThunkAction,
  ThunkDispatch,
  configureStore,
} from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import thunkMiddleware from "redux-thunk";
import flashcardSlice from "./flashcardSlice";
import { createWrapper } from "next-redux-wrapper";
import { AppProps } from "next/app";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type AppPropsWithStore = AppProps & {
  store: ReturnType<typeof makeStore>;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunkDispatch = ThunkDispatch<AppState, undefined, Action>;
const middleware: Middleware[] = [thunkMiddleware];
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    flashcard: flashcardSlice.reducer,
  },
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});

const makeStore = () => store;

const wrapper = createWrapper<AppStore>(makeStore, { debug: true });

export default wrapper;
