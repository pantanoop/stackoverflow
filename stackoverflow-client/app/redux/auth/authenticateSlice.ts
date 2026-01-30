import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createUser, googlesignin } from "./service/authApi";

export type User = {
  userid?: string;
  email: string | null;
  username?: string | null;
};

export type AuthState = {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/register",

  async (credentials: any, { rejectWithValue }) => {
    console.log(credentials, "credentials in register");
    try {
      return await createUser(credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const googleLogin = createAsyncThunk(
  "user/loginGoogle",

  async (credentials: any, { rejectWithValue }) => {
    console.log(credentials, "credentials in login google");
    try {
      return await googlesignin(credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const authenticateSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
    addCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        console.log("register pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("register fulfilled", action.payload);
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log("register rejected");
        console.log("register error", state.error);
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
      })
      .addCase(googleLogin.pending, (state) => {
        console.log("login pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        console.log("login fulfilled", action.payload);
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        console.log("login rejected");
        console.log("login google error", state.error);
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
      });
  },
});

export const { addCurrentUser, logout } = authenticateSlice.actions;
export default authenticateSlice.reducer;
