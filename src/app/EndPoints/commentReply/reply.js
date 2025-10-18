import { apiSlice } from "../faseBaseQuery";

export const projectEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReply: builder.mutation({
      query: (data) => {
        return {
          url: `/brainstorm/premise-Reply`,
          method: "POST",
          body: data,
        };
      },
    }),

    getAllReplyOfAComment: builder.query({
      query: (id) => ({
        url: `/brainstorm/premise-Reply/${id}`,
        method: "GET",
      }),
    
      providesTags: ["reply-comment"],
    }),

    updateLikeOfReply: builder.mutation({
      query: (id) => ({
        url: `/brainstorm/premise-Reply/${id}`,
        method: "PATCH",
      }),   
      providesTags: ["reply-comment"],
    }),
    
    deleteLikeOfReply: builder.mutation({
      query: (body) => {
        // Check if isRejected exists in the body and build the query params accordingly
        const queryParams = body.isRejected ? `?isRejected=true` : "";
    
        return {
          url: `/brainstorm/premise-Reply/${body.id}${queryParams}`,
          method: "DELETE",
        };
      },
      providesTags: ["reply-comment"],
    }),
    
    createSuggestedReply: builder.mutation({
      query: (data) => {
        return {
          url: `/brainstorm/suggest-Reply`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useCreateReplyMutation,
  useGetAllReplyOfACommentQuery,
  useUpdateLikeOfReplyMutation,
  useDeleteLikeOfReplyMutation,
  useCreateSuggestedReplyMutation,
} = projectEndPoint;
