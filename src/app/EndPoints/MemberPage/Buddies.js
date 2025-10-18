import { apiSlice } from "../faseBaseQuery";

export const projectEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //   createReply: builder.mutation({
    //     query: (data) => {
    //       return {
    //         url: `/brainstorm/premise-Reply`,
    //         method: "POST",
    //         body: data,
    //       };
    //     },
    //   }),
    getAllUsers: builder.query({
      query: (id) => ({
        url: `/memberpage/find_friends1/`,
        method: "GET",
      }),
    }),
    getAllBuddies: builder.query({
      query: (id) => ({
        url: `/memberpage/get_friend_list/${id}`,
        method: "GET",
      }),
    }),

    createHideUnhide: builder.mutation({
      query: (data) => {
        const body = data.body;
        return {
          // url: `brainstorm/api/v2/premise-user/${id}/`,
          url: `brainstorm/premise`,
          method: "POST",
          body: body,
        };
      },
    }),
    //   deleteLikeOfReply : builder.mutation({
    //       query: (id) => ({
    //         url: `/brainstorm/premise-Reply/${id}`,
    //         method: "DELETE",
    //       }),
    //     }),
    BeatSuggestion: builder.mutation({
      query: (data) => {
        const body = data;
        return {
          // url: `brainstorm/beats_recommend/`,
          url: `brainstorm/beats_recommend/`,
          method: "POST",
          body: body,
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateHideUnhideMutation,
  useGetAllBuddiesQuery,
  useBeatSuggestionMutation
} = projectEndPoint;
