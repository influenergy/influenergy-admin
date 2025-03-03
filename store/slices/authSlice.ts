import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  // token: string | null;
  isAuthenticated: boolean;
  user: {
    fullName: string;
    email: string;
  } | null;
}

const initialState: AuthState = {
  // token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ fullName: string; email: string }>
    ) => {
      // state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = {
        fullName: action.payload.fullName,
        email: action.payload.email,
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
