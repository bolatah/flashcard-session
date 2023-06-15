import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import { getSession, signIn, signOut } from "next-auth/react";
import { IUser } from "@/types/User";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;
export default authSlice;

export const signInInstance = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await signIn();
    const session = await getSession();
    if (!session) return;
    else {
      const { name, email } = session.user ?? {};
      console.log(name, email);
      dispatch(
        setUser({
          name: name as string,
          email: email as string,
        })
      );
    }
  } catch (error: any) {
    const errorMessage: string = error.message;
    dispatch(setError(errorMessage));
  } finally {
    dispatch(setLoading(false));
  }
};

export const signOutInstance = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut();
    dispatch(setUser(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};
