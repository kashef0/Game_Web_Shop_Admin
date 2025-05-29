import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definierar formen
interface AuthState {
  user: {
    _id: string;
    name: string;
    email: string;
    profilePic: string;
    role: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  error?: string | null;
  status?: "idle" | "loading" | "succeeded" | "failed";
}
// Initialt tillstånd för auth slicen
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};
// Skapar auth slice med reducers för att hantera olika actions
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
     // action uppdaterar användarinfo token och sätter isAuthenticated till true
    login: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    // uppdaterar användarinfo och token
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    // tömmer user och token, och sätter isAuthenticated till false
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
     // sätter ett autentiseringsfel och status till failed
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "failed";
    },
    // rensar fel och sätter status till succeeded
    setAuthSuccess: (state) => {
      state.error = null;
      state.status = "succeeded";
      
    },
  },
});
// exporterar actions som kan användas för att dispatcha från komponenter
export const { login, logout, setCredentials, setAuthError, setAuthSuccess } =
  authSlice.actions;
export default authSlice.reducer;
