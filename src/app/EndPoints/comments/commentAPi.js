import { apiSlice } from "../faseBaseQuery";

export const commentEndPoint = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        findComment: builder.mutation({
          query: (data) => {
            return {
              url: `ideamall/premise/comment_search`,
              method: "POST",
              body: data,
            };
          },
        }),
    
})
})

export const {useFindCommentMutation} = commentEndPoint