import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  endpoints: (builder) => ({
    todos: builder.query({
      query: () => `/todos`,
    }),
    users: builder.query({
      query: () => `/users`,
    }),
  }),
});

export const { useTodosQuery, useUsersQuery } = api;
