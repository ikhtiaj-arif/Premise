import { apiSlice } from "../faseBaseQuery";

export const projectEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //   createReply: builder.mutation({
    //     query: (data) => {
    //       return {
    //         url: `/ideamall/premise-Reply`,
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
          // url: `ideamall/api/v2/premise-user/${id}/`,
          url: `ideamall/premise`,
          method: "POST",
          body: body,
        };
      },
    }),
    //   deleteLikeOfReply : builder.mutation({
    //       query: (id) => ({
    //         url: `/ideamall/premise-Reply/${id}`,
    //         method: "DELETE",
    //       }),
    //     }),
    BeatSuggestion: builder.mutation({
      query: (data) => {
        const body = data;
        return {
          url: `ideamall/beats_recommend/`,
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
