import { apiSlice } from "../faseBaseQuery";

export const projectEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (data) => {
        return {
          url: `/scriptpad2/api/spproject/`,
          method: "POST",
          body: data,
        };
      },
      providesTags: ["sp-porject"],
    }),
    updateSpProject: builder.mutation({
      query: (data) => {
        const id = data.id;
        return {
          url: `/scriptpad2/api/spproject/${id}/`,
          method: "PATCH",
          body: data,
        };
      },
    }),
    getMyAllProject: builder.query({
      query: () => ({
        url: `/scriptpad2/get_projects/`,
        method: "GET",
      }),
    }),
    getScreenPlay: builder.mutation({
      query: (formData) => {
        return {
          url: `/scriptpad2/get_screenplay/`,
          method: "POST",
          body: formData,
        };
      },
    }),
    updateScene: builder.mutation({
      query: (data) => {
        return {
          url: `/scriptpad2/update-scene/`,
          method: "POST",
          body: data,
        };
      },
    }),

    getStoryToScriptProject: builder.query({
      query: (id) => ({
        url: `/storytoscript/storytoscript`,
        method: "GET",
      }),
    }),

    updateAddedToBeat: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/beat_added/`,
          method: "POST",
          body: data,
        };
      },
    }),
    saveScreenPlay: builder.mutation({
      query: (formData) => {
        return {
          url: `/scriptpad2/update_screenplay/`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    deleteProject: builder.mutation({
      query: (data) => {
        return {
          url: `/scriptpad2/delete_project/`,
          method: "DELETE",
          body: data,
        };
      },
      
      // invalidatesTags: ["scriptPad"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetMyAllProjectQuery,
  useGetScreenPlayMutation,
  useUpdateSceneMutation,
  useSaveScreenPlayMutation,
  useUpdateSpProjectMutation,
  useUpdateAddedToBeatMutation,
  useDeleteProjectMutation,
  useGetStoryToScriptProjectQuery
} = projectEndPoint;
