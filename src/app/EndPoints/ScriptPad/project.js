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
    }),
    updateSpProject: builder.mutation({
            query: (data) => {
              const id = data.id
              return {
                url: `/scriptpad2/api/spproject/${id}/`,
                method: "PATCH",
                body: data,
              };
            },
          }),
    getMyAllProject : builder.query({
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
      saveScreenPlay: builder.mutation({
        query: (formData) => {
          return {
            url: `/scriptpad2/update_screenplay/`,
            method: "PUT",
            body: formData,
          };
        },
      }),
   
  }),
});

export const {
    useCreateProjectMutation,
    useGetMyAllProjectQuery,
    useGetScreenPlayMutation,
    useUpdateSceneMutation, 
    useSaveScreenPlayMutation,
    useUpdateSpProjectMutation

} = projectEndPoint;
