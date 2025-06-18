import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RestClientBuilder } from "../../../utils/RestClient";
import config from "../../../config/config";
import type { authState } from "../../../types/slice";
import { RESTServerRoute } from "../../../types/server";
import type { AccessToken, SignInUserForm } from "../../../types/type";

const initialState: authState = {
  signUpUser: {
    data: null,
    loading: false,
    error: null
  },
  signInUser: {
    data: null,
    loading: false,
    error: null
  }
};

// Define an async thunk for sign-in trainer action
export const signInUser = createAsyncThunk<AccessToken, SignInUserForm>(
  'user/login',
  async (signInData, { rejectWithValue }) => {
    try {
      const response = await RestClientBuilder.instance()
        .withBaseUrl(config.API_REST_ENDPOINT)
        .build()
        .post<AccessToken>(RESTServerRoute.REST_SIGNIN_USER, signInData);

      if (!response || !response.accessToken) {
        return rejectWithValue("Invalid response from server");
      }
      return response; // Return only necessary data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  }
);

// Define an async thunk for sign-up trainer action
export const signUpUser = createAsyncThunk<{ message: string }, any>(
  'user/register',
  async (signUpData, { rejectWithValue }) => {
    try {
      const response = await RestClientBuilder.instance()
        .withBaseUrl(config.API_REST_ENDPOINT)
        .withContentType("multipart/form-data")
        .build()
        .post<{ message: string }>(RESTServerRoute.REST_SIGNUP_USER, signUpData);
      return response; // Return only necessary data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "SignUp failed");
    }
  }
);


const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.signInUser.error = null;
      state.signUpUser.error = null;
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("storage"));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.signInUser.loading = true;
        state.signInUser.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.signInUser.loading = false;
        state.signInUser.data = action.payload;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.signInUser.loading = false;
        state.signInUser.error = action.payload as string;
      })
      // Handle signUpUser request
      .addCase(signUpUser.pending, (state) => {
        state.signUpUser.loading = true;
        state.signUpUser.error = null;
        state.signUpUser.data = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.signUpUser.loading = false;
        state.signUpUser.data = action.payload.message; // Set success message
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.signUpUser.loading = false;
        state.signUpUser.error = action.payload as string; // Set error message
      });
  }
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
