import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { IUser } from "@/interface/user";
import { API } from "../config";

// Définition de l'API RTK Query
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API.defaults.baseURL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation<IUser, Partial<IUser>>({
      query: (newUser) => ({
        url: "/auth/sign",
        method: "POST",
        body: newUser,
      }),
    }),
    login: builder.mutation<IUser, Partial<IUser>>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUser: builder.query<IUser, void>({
      query: () => "/trainers/me",
    }),
    refreshToken: builder.mutation<string, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      transformResponse: (response: { accessToken: string }) =>
        response.accessToken,
    }),
    updateUser: builder.mutation<IUser, Partial<IUser>>({
      query: (updatedUser) => ({
        url: "/user/updateProfile",
        method: "PUT",
        body: updatedUser,
      }),
      transformResponse: (response: { user: IUser }) => response.user,
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          console.error("Erreur lors de la déconnexion :", error);
        }
      },
    }),
  }),
});

// Export des hooks générés automatiquement
export const {
  useSignUpMutation,
  useLoginMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
  useUpdateUserMutation,
  useSignOutMutation,
} = authApi;

// Slice pour gérer les états locaux
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as IUser | null,
    loading: false,
    errors: {} as { [key: string]: string | null },
  },
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<IUser>>) => {
      state.user = { ...state.user, ...action.payload } as IUser;
    },
    logout: (state) => {
      state.user = null;
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
    setErrors: (
      state,
      action: PayloadAction<{ [key: string]: string | null }>
    ) => {
      state.errors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.signUp.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          Cookies.set("accessToken", payload.token);
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          Cookies.set("accessToken", payload.token);
        }
      )
      .addMatcher(
        authApi.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
        }
      )
      .addMatcher(
        authApi.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
        }
      )
      .addMatcher(
        authApi.endpoints.signOut.matchFulfilled,
        (state) => {
          state.user = null;
        }
      );
  },
});

// Export des actions et du reducer
export const { setCredentials, setErrors, logout } = authSlice.actions;
export default authSlice.reducer;
