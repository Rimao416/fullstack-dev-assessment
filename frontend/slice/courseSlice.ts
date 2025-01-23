import { API } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface ICourse {
  id: string;
  name: string;
  date: string; // Date as an ISO string
  subject: string;
  location: string;
  participants: number;
  notes?: string;
  price: number;
  trainer_price: number; // Add trainer price
  trainer: {
    _id: string;
    name: string;
    email: string;
    training_subjects: string[];
  } | null;
}

// Define the API slice for courses
export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API.defaults.baseURL,
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Query to fetch courses
    getCourses: builder.query<ICourse[], void>({
      query: () => "/courses",
      transformResponse: (response: { data: ICourse[] }) => {
        return response.data;
      },
    }),

    // Mutation to add a course
    addCourse: builder.mutation<ICourse, Partial<ICourse>>({
      query: (newCourse) => ({
        url: "/courses", // Endpoint URL to create a course
        method: "POST",
        body: newCourse,
      }),
    }),

    // Mutation to delete a course
    deleteCourse: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
    }),

    // Query to fetch a course by ID
    getCourseById: builder.query<ICourse, string>({
      query: (id) => `courses/${id}`,
      transformResponse: (response: { data: ICourse }) => {
        return response.data;
      },
    }),

    // Mutation to assign a trainer to a course
    assignTrainer: builder.mutation({
      query: ({ courseId, trainerEmail }) => ({
        url: `/courses/${courseId}/assign-trainer`,
        method: "PUT",
        body: { trainerEmail },
      }),
    }),

    // Mutation to update a course
    updateCourse: builder.mutation<ICourse, Partial<ICourse>>({
      query: ({ id, ...data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getStats: builder.query<{ totalCourses: number; totalTrainers: number; upcomingCourses: number; completedCourses: number }, void>({
      query: () => "/courses/stat",
    }),
  }),
});

// Export automatically generated hooks
export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useAssignTrainerMutation,
  useUpdateCourseMutation,
  useGetStatsQuery,
} = courseApi;
