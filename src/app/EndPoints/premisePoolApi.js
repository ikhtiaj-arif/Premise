import { apiSlice } from "./faseBaseQuery";

export const premiseSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPremise: builder.query({
      query: (query) => {
        const pn = query?.pn;
        const ps = query?.ps;
        const sort = query?.sort;
        const popularity = query?.popularity;
        const date = query?.date;
        const order = query?.order;
        const text = query?.text;
        const user = query?.user;
        const language = query?.language;
        const user_id = query?.user_id;
        const shared = query?.shared

      

        let url = `ideamall/premise?page=${pn}&page_size=${ps}&current_user=${user_id}&shared=${shared}`;

        // if(date){
        //   url = `${url}&created=created_at`;
        // }
        // if(popularity){
        //   url = `${url}&likes=-likes`;
        // }
        // if(date && !popularity){
        //   url = `${url}&created=created_at`;
        // }
        // if(!date && popularity){
        //   url = `${url}&likes=-likes`;
        // }
        // if(date && popularity){
        //   url = `${url}&likes=-likes&created=created_at`;
        // }

        if (text) {
          url = `${url}&text=${text}`;
        }

        if (user) {
          // console.log(user);
          url = `${url}&user=${user}`;
        }
        // if (shared) {
        //   console.log("sharedcondition", shared);
        //   url = `${url}&shared=${shared}`;
        // }

        if (language) {
          url = `${url}&language=${language}`;
        }

        if (sort === "date") {
          url = `${url}&created=created_at`;
          // if (order === "ascending") {
          //   url = `${url}&created=created_at`;
          // } else {
          //   url = `${url}&created=-created_at`;
          // }
        } else if (sort === "popularity") {
          url = `${url}&likes=-likes`;
          // if (order === "ascending") {
          //   url = `${url}&likes=likes`;
          // } else {
          //   url = `${url}&likes=-likes`;
          // }
        } else if (sort === "date&popularity") {
          url = `${url}&likes=-likes&created=created_at`;
        }

        // console.log(url);
        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["premise"],
    }),

    //get premise
    getOnePremise: builder.query({
      query: (id) => ({
        url: `ideamall/api/v2/premise/${id}`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),

    // delete premise
    //
    deletePremise: builder.mutation({
      query: (id) => ({
        url: `ideamall/api/v2/premise/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["premise"],
    }),

    // post premise
    postPremise: builder.mutation({
      query: (data) => ({
        url: `ideamall/api/v2/premise/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise"],
    }),

    // get premise details
    getPremiseDetails: builder.query({
      query: () => ({
        url: `ideamall/api/v2/premise-detail/`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),
    // get hidden premise
    getHiddenPremiseCount: builder.query({
      query: () => ({
        url: `ideamall/hidden_premise`,
        method: "GET",
      }), providesTags: ["premise-hidden-count"],
    }),

    // get premise like
    getLikePremise: builder.query({
      query: () => ({
        url: `ideamall/api/v2/premise-like/`,
        method: "GET",
      }),
      providesTags: ["premise-like"],
    }),
    // get all comments
    getCommentPremise: builder.query({
      query: () => ({
        url: `ideamall/api/v2/premise-comment/`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),
    // http://115.245.192.138/ideamall/commentApi/
    // ideamall/commentApi?premise_id=6c81ed44-c0cc-4814-8ae1-ae35b48a6062
    // get comments by premise id
    // ideamall/commentApi?premise_id=${id}
    // http://115.245.192.138/ideamall/GetCommentAPI/7e178f2b-6edb-48cc-84ea-a42c0fa75a9e

    getCommentByPremiseId: builder.query({
      query: (id) => ({
        url: `ideamall/GetCommentAPI/${id}`,
        method: "GET",
      }),
      providesTags: ["premise-comment"],
    }),

    // is comment liked
    isCommentLiked: builder.mutation({
      query: (data) => ({
        url: ``,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise-comment"],
    }),

    //like a comment
    LikeComment: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/commentLike`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["premise-comment"],
    }),
    // remove comment like
    RemoveLikeComment: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/commentLike`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["premise-comment"],
    }),
    // delete comment like
    deleteCommentLike: builder.mutation({
      query: (data) => ({
        url: ``,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise-comment"],
    }),
    //comment post
    commentPremise: builder.mutation({
      query: (data) => {
        return {
          url: `ideamall/api/v2/premise-comment/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["premise-comment"],
    }),
    //comment Delete
    // http://115.245.192.138/ideamall/commentDelete/4ac6de52-c51f-4fda-97e6-a977c130c092
    deleteComment: builder.mutation({
      query: (id) => {
        return {
          url: `ideamall/commentDelete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["premise-comment"],
    }),
    // get all likes by premise id
    getLikesByPremiseId: builder.query({
      query: (id) => ({
        url: `/ideamall/premiseLike?premise_id=${id}`,
        method: "GET",
      }),
      providesTags: ["premise-like"],
    }),

    // post is premise liked
    isLikePremise: builder.mutation({
      query: (data) => ({
        url: `ideamall/userLike`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise-comment"],
    }),

    //like post
    LikePremise: builder.mutation({
      query: (data) => {
        return {
          url: `ideamall/api/v2/premise-like/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["premise-like"],
    }),

    //send message broadcast post
    broadcastPremise: builder.mutation({
      query: (body) => {
        return {
          url: `/ideamall/get-room`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["premise-msg"],
    }),
    // get messages by broadcast id
    getMessageByPremiseId: builder.query({
      query: (broadcastId) => ({
        url: `/ideamall/messages?broadcast_id=${broadcastId}`,
        method: "GET",
      }),
      providesTags: ["premise-msg"],
    }),
    // get messages from user by broadcast id for owner
    allUserBroadcast: builder.query({
      query: (id) => ({
        url: `/ideamall/get-rooms?premise=${id}`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),
    //send message post
    sendMsgPremise: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/api/v2/premise-broadcastcontent/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["premise-msg"],
    }),

    //translate post request
    translatePremise: builder.mutation({
      query: (data) => {
        return {
          url: `ideamall/premise/translate`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["premise"],
    }),

    // delete like
    deleteLike: builder.mutation({
      query: (data) => ({
        url: `ideamall/deletePremiseLike`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise-like"],
    }),

    // edit premise
    editPremise: builder.mutation({
      query: (data) => {
        const id = data.id;
        const body = data.body;
        return {
          url: `ideamall/api/v2/premise/${id}/`,
          method: "PATCH",
          body: body,
        };
      },
      invalidatesTags: ["premise"],
    }),

    // user name premise
    // addUserNamePremise: builder.mutation({
    //   query: (data) => {
    //     const id = data.id;
    //     const body = data.body;
    //     return {
    //       url: `ideamall/api/v2/premise-user/${id}/`,
    //       // url: `/memberpage/centraldatabaseapi/${id}/`,
    //       method: "PUT",
    //       body: body,
    //     };
    //   },
    //   invalidatesTags: ["premise"],
    // }),


    addUserNamePremise: builder.mutation({
      query: (data) => {
        const id = data.id;
        const body = data.body;
        return {
          // url: `ideamall/api/v2/premise-user/${id}/`,
          url: `/memberpage/centraldatabaseapi/${id}`,
          method: "PATCH",
          body: body,
        };
      },
      invalidatesTags: ["premise, premise_user"],
    }),


    // premise user
    getPremiseUser: builder.query({
      query: () => ({
        url: `ideamall/current-user`,
        method: "GET",
      }),
      providesTags: ["premise, premise_user"],
    }),

    getPremiseUserPicture: builder.query({
      query: (id) => ({
        url: `/memberpage/profilepicture/${id}`,
        method: "GET",
      }),
      providesTags: ["premise-profilePic"],
    }),

    getUserByUserId: builder.query({
      query: (id) => ({  
        url: `/memberpage/centraldatabaseapi/${id}`,
        method: "GET",
      }),
      providesTags: ["premise-user"],
    }),

    getFilteredLang: builder.query({
      query: () => ({
        url: `ideamall/languages`,
        method: "GET",
      }),
      providesTags: ["filterLang"],
    }),

    getHideUnhidePremise: builder.query({
      query: (id) => ({
        url: `ideamall/hide-premise/${id}`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),
  }),
});

export const {
  
  useGetPremiseQuery,
  usePostPremiseMutation,
  useGetPremiseUserQuery,
  useDeletePremiseMutation,
  useLikePremiseMutation,
  useEditPremiseMutation,
  useDeleteLikeMutation,
  useGetPremiseDetailsQuery,
  useAddUserNamePremiseMutation,
  useTranslatePremiseMutation,
  useGetLikePremiseQuery,
  useIsLikePremiseMutation,
  useGetCommentPremiseQuery,
  useCommentPremiseMutation,
  useGetCommentByPremiseIdQuery,
  useIsCommentLikedMutation,
  useDeleteCommentLikeMutation,
  useLikeCommentMutation,
  useBroadcastPremiseMutation,
  useSendMsgPremiseMutation,
  useGetLikesByPremiseIdQuery,
  useDeleteCommentMutation,
  useGetMessageByPremiseIdQuery,
  useGetUserMsgQuery,
  useAllUserBroadcastQuery,
  useRemoveLikeCommentMutation,
  useGetFilteredLangQuery,
  useGetHideUnhidePremiseQuery,
  useGetOnePremiseQuery,
  useGetPremiseUserPictureQuery,
  useGetUserByUserIdQuery,
  useGetHiddenPremiseCountQuery
} = premiseSlice;
