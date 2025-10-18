import { apiSlice } from "../faseBaseQuery";

export const projectEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCharacters: builder.query({
      query: (id) => ({
        url: `/brainstorm/get_characters/${id}
`,
        method: "GET",
      }),
    }),

    getSavedCharacters: builder.query({
      query: (id) => ({
        url: `/brainstorm/get_saved_characters/${id}`,
        method: "GET",
      }),
    }),

    saveCharacters: builder.mutation({
      query: (data) => {
        const id = data.id;
        const body = data.body;
        return {
          url: `/brainstorm/save_characters/${id}`,
          method: "POST",
          body: body,
        };
      },
    }),
    postPremiseWithCharacters: builder.mutation({
      query: (data) => {
        const id = data.id;

        return {
          url: `/brainstorm/generate_initial_comments/${id}`,
          method: "POST",
        };
      },
    }),

    deleteCharacter: builder.mutation({
      query: (id) => {
        return {
          url: `/brainstorm/characters/${id}/delete/`,
          method: "DELETE",
        };
      },
    }),

    suggestCharacters: builder.mutation({
      query: (data) => ({
        url: `/brainstorm/edit_characters_suggest/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise"],
    }),

    notifyUserForPurchase: builder.mutation({
      query: (data) => {
       
        return {
          url: `/brainstorm/notify_user_for_purchase/`,
          method: "brainstorm",
          body: data,
        };
      },
    }),
    rejectPurchaseRequest: builder.mutation({
      query: (data) => {
        
        return {
          url: `/brainstorm/notify_users_on_rejection/`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useSaveCharactersMutation,
  usePostPremiseWithCharactersMutation,
  useGetSavedCharactersQuery,
  useDeleteCharacterMutation,
  useSuggestCharactersMutation,
  useNotifyUserForPurchaseMutation,
  useRejectPurchaseRequestMutation,
} = projectEndPoint;
