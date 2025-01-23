// trainerSlice.js
import { API } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface ITrainer {
  _id: string;
  name: string;
  training_subjects: string[];
  location: string;
  email: string;
  password?: string; // Optional if needed for creation
}

export interface TrainerPayload {
  id: string;
  name: string;
  training_subjects: string[];
  location: string;
  email: string;
  password?: string; // Optional if needed
}

// Define the API slice for trainers
export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API.defaults.baseURL, // Replace with your URL
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Trainer"], // Add tags for cache invalidation
  endpoints: (builder) => ({
    // Fetch all trainers
    getTrainers: builder.query<ITrainer[], void>({
      query: () => "/trainers",
      transformResponse: (response: { data: ITrainer[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Trainer" as const,
                id: _id,
              })),
              { type: "Trainer", id: "LIST" },
            ]
          : [{ type: "Trainer", id: "LIST" }],
    }),

    // Fetch a single trainer
    getSingleTrainer: builder.query<ITrainer, string>({
      query: (id) => `/trainers/${id}`,
      transformResponse: (response: { data: ITrainer }) => response.data,
      providesTags: (result, error, id) => [{ type: "Trainer", id }],
    }),

    // Add a trainer
    addTrainer: builder.mutation<ITrainer, Partial<TrainerPayload>>({
      query: (trainer) => ({
        url: "/trainers",
        method: "POST",
        body: trainer,
      }),
      invalidatesTags: [{ type: "Trainer", id: "LIST" }],
    }),

    // Update an existing trainer
    updateTrainer: builder.mutation<ITrainer, Partial<TrainerPayload>>({
      query: ({ id, ...data }) => ({
        url: `/trainers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Trainer", id }],
    }),

    // Suggest a trainer
    suggestTrainer: builder.query<
      ITrainer,
      { courseSubject: string; courseDate: string }
    >({
      query: ({ courseSubject, courseDate }) =>
        `/trainers/suggest?courseSubject=${courseSubject}&courseDate=${courseDate}`,
      providesTags: [{ type: "Trainer", id: "LIST" }],
      transformResponse: (response: { data: { trainer: ITrainer } }) =>
        response.data.trainer,
    }),

    // Delete a trainer
    deleteTrainer: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Trainer", id }],
    }),
  }),
});

// Export the auto-generated hooks for querying and mutations
export const {
  useGetTrainersQuery,
  useGetSingleTrainerQuery,
  useAddTrainerMutation,
  useUpdateTrainerMutation,
  useSuggestTrainerQuery,
  useDeleteTrainerMutation,
} = trainerApi;