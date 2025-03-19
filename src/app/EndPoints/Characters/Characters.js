import { apiSlice } from "../faseBaseQuery";

export const projectEndPoint = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCharacters: builder.query({
      query: (id) => ({
        url: `/ideamall/get_characters/${id}
`,
        method: "GET",
      }),
    }),

    getSavedCharacters: builder.query({
      query: (id) => ({
        url: `/ideamall/get_saved_characters/${id}`,
        method: "GET",
      }),
    }),

    saveCharacters: builder.mutation({
      query: (data) => {
        const id = data.id;
        const body = data.body;
        return {
          url: `/ideamall/save_characters/${id}`,
          method: "POST",
          body: body,
        };
      },
    }),
    postPremiseWithCharacters: builder.mutation({
      query: (data) => {
        const id = data.id;

        return {
          url: `/ideamall/generate_initial_comments/${id}`,
          method: "POST",
        };
      },
    }),

    deleteCharacter: builder.mutation({
      query: (id) => {
        return {
          url: `/ideamall/characters/${id}/delete/`,
          method: "DELETE",
        };
      },
    }),

    suggestCharacters: builder.mutation({
      query: (data) => ({
        url: `ideamall/edit_characters_suggest/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise"],
    }),

  }),
});

export const {
  useGetCharactersQuery,
  useSaveCharactersMutation,
  usePostPremiseWithCharactersMutation,
  useGetSavedCharactersQuery,
  useDeleteCharacterMutation,
  useSuggestCharactersMutation
} = projectEndPoint;
