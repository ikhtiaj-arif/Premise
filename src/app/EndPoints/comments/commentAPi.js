import { apiSlice } from "../faseBaseQuery";

export const commentEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findComment: builder.mutation({
      query: (data) => {
        return {
          url: `brainstorm/premise/comment_search`,
          method: "POST",
          body: data,
        };
      },
    }),
    translateComment: builder.mutation({
      query: (data) => {
        return {
          url: `brainstorm/comment/translation`,
          method: "POST",
          body: data,
        };
      },
    }),

  }),
});

export const { useFindCommentMutation, useTranslateCommentMutation } = commentEndPoint;
