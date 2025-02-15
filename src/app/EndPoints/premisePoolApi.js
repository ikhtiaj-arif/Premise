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
        const shared = query?.shared;
        const available_for_translation = query?.translation;
        const available_for_sale = query?.sale;

        let url = `ideamall/premise?page=${pn}&page_size=${ps}&current_user=${user_id}&shared=${shared}`;


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
        else if (available_for_sale) {
          url = `${url}&available_for_sale=${available_for_sale}`;
        }
        else if (available_for_translation) {
          url = `${url}&available_for_translation=${available_for_translation}`;
        }

        // console.log(url);
        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["premise"],
    }),

    // get hidden premise
    // getHiddenPremiseCount: builder.query({
    //   query: () => ({
    //     url: `ideamall/hidden_premise`,
    //     method: "GET",
    //   }), providesTags: ["premise-hidden-count"],
    // }),

    //hidden count according to filters

    getHiddenPremiseCount: builder.query({
      query: (query) => {
        const sort = query?.sort;
        const text = query?.text;
        const user = query?.user;
        const language = query?.language;
        const user_id = query?.user_id;
        const shared = query?.shared;

        let url = `ideamall/hidden_premise?current_user=${user_id}&shared=${shared}`;

        if (text) {
          url = `${url}&text=${text}`;
        }

        if (user) {
          // console.log(user);
          url = `${url}&user=${user}`;
        }

        if (language) {
          url = `${url}&language=${language}`;
        }

        if (sort === "date") {
          url = `${url}&created=created_at`;
        } else if (sort === "popularity") {
          url = `${url}&likes=-likes`;
        } else if (sort === "date&popularity") {
          url = `${url}&likes=-likes&created=created_at`;
        }

        // console.log(url);
        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["premise-hidden-count"],
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

    getUserPrivilegeStatus: builder.query({
      query: (id) => ({
        url: `pay/checkuseraccess/${id}/PP_PostPremise`,
        method: "GET",
      }),
    }),

    //get premise
    getPremiseBeatsData: builder.query({
      query: (id) => ({
        url: `ideamall/premise/beats/${id}`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),
    //get premise
    getPremiseEngagementsData: builder.query({
      query: (id) => ({
        url: `ideamall/premise/engagement/${id}`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),
    getPremiseBrainstormsData: builder.query({
      query: (id) => ({
        url: `ideamall/premise/brainstorm/${id}`,
        method: "GET",
      }),
      providesTags: ["premise"],
    }),

    //!V2
    //request translation/sale

    requestForSaleOrTranslate: builder.mutation({
      query: (data) => ({
        url: `ideamall/premise/request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise"],
    }),

    updateRequestForSaleOrTranslate: builder.mutation({
      query: (data) => ({
        url: `ideamall/premise/request`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["premise"],
    }),

    // translate premise v2
    //! payload type
    // const data = {
    //   user_id: user,
    //   premise_id: id,
    //   from_language: source_language,
    //   project_id,
    //   target_language: targetLanguage,
    // };
    
    translatePremiseV2: builder.mutation({
      query: (data) => ({
        url: `ideamall/premise/translation`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["premise"],
    }),

    // sale
    saleForPremise: builder.mutation({
      query: (data) => {
        const body = data.body;

        return {
          url: `ideamall/premise/sale`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [""],
    }),

    
    getPremiseTransaction: builder.query({
      query: (id) => ({
        url: `ideamall/premise/translation/${id}`,
        method: "GET",
      }),
    }),

    getSaleTranslationRequest: builder.query({
      query: (data) => ({
        url: `ideamall/premise/request/${data.id}/${data.type}`,
        method: "GET",
      }),
    }),

    //payment
    paymentData: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/paymentinvoice/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["pitching-elements"],
    }),
    paymentSend: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/paymentview/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["pitching-elements"],
    }),
    paymentSucess: builder.mutation({
      query: (data) => {
        return {
          url: `/ideamall/callbackview/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["pitching-elements"],
    }),

    // limit bridge calculations
    getCalculateProductPrice: builder.query({
      query: () => {
          return {
              url: `/pay/product_uint_details/?product_code=PD`,
              method: "GET",
          };
      },
    }),

    paymentUintDetails: builder.mutation({
      query: (data) => {
        return {
          url: `pay/buy_uints_payment_details/`,
          method: "POST",
          body: data,
        };
      },
    }),

    payNowPackage: builder.mutation({
      query: (data) => {
        return {
          url: `/pay/make_payment/`,
          method: "POST",
          body: data,
        };
      },
    }),

    callbackPackage: builder.mutation({
      query: (data) => {
        return {
          url: `/pay/custom_callback/`,
          method: "POST",
          body: data,
        };
      },
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
  useGetHiddenPremiseCountQuery,
  useGetUserPrivilegeStatusQuery,
  useTranslatePremiseV2Mutation,
  useGetPremiseTransactionQuery,
  useSaleForPremiseMutation,
  useGetPremiseBeatsDataQuery,
  useGetPremiseBrainstormsDataQuery,
  useGetPremiseEngagementsDataQuery,
  useRequestForSaleOrTranslateMutation,
  useGetSaleTranslationRequestQuery,
  useUpdateRequestForSaleOrTranslateMutation,
  usePaymentDataMutation,
  usePaymentSendMutation,
  usePaymentSucessMutation,
  useCallbackPackageMutation,
  usePaymentUintDetailsMutation,
  useGetCalculateProductPriceQuery,
  usePayNowPackageMutation
} = premiseSlice;
