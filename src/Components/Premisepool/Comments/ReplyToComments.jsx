import React, { useEffect, useRef, useState } from "react";
import { FaRegThumbsUp, FaRegTrashAlt, FaThumbsUp } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useCreateReplyMutation,
  useCreateSuggestedReplyMutation,
  useDeleteLikeOfReplyMutation,
  useUpdateLikeOfReplyMutation,
} from "../../../app/EndPoints/commentReply/reply";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../../features/TimeAgo";
import forwardIcon from "../../../img/Icons/forwardIcon.png";
import userIcon from "../../../img/Icons/userImg.png";
import BtnLoading from "../../../shared/BtnLoading";
import { URL } from "../../utils";
import ReplyLikeUsersPop from "../ReplyLikeUsersPop";
import ConfirmationModal from "./ConfirmationModal";
import ReplyToReply from "./ReplyToReply";

const ReplyToComments = ({
  // handleSuggest,
  commentIdx,
  reply,
  owner,
  setProjectBeatOpen,
  setCommentText,
  replyRefetch,
  user,
  replyToCommentID,
  handleAddToBeat,
}) => {
  const [isReplyLiked, setIsReplyLiked] = useState(false);
  const [openDltPop, setOpenDltPop] = useState(false);
  const [replySubmitDisable, setReplySubmitDisable] = useState(false);
  const [idToDlt, setIdToDlt] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [likePopup, setLikePopup] = useState(false);
  const [childReplyField, setChildReplyField] = useState(false);
  const [suggestDisable, setSuggestDisable] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [childReplyText, setChildReplyText] = useState("");
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);

  const latestReplyRef = useRef(null);
  const replyLikes = reply?.likes;
  const replyRef = useRef(null);
  const createdTime = reply?.created_at;

  const [likeReply, likeReplyRes] = useUpdateLikeOfReplyMutation();
  const [deleteReply, deleteReplyRes] = useDeleteLikeOfReplyMutation();
  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const [suggestion, suggestionRes] = useCreateSuggestedReplyMutation();

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(reply?.user?.id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  useEffect(() => {
    if (childReplyField && replyRef.current) {
      replyRef.current.focus();
    }
  }, [childReplyField, replyToCommentID]);

  // for reply
  useEffect(() => {
    if (replyLikes?.includes(user)) {
      setIsReplyLiked(true);
    } else {
      setIsReplyLiked(false);
    }
  }, [replyLikes, user, isReplyLiked]);

  // close tabs
  // useEffect(() => {
  //   const closeMenu = (e) => {
  //     if (
  //       !replyRef?.current?.contains(e.target) &&
  //       !e.target.closest("[data-nest-reply]")
  //     ) {
  //       if (!e.target.closest(".absolute")) {
  //         setChildReplyField(false);
  //       }
  //     }
  //   };
  //   document.body.addEventListener("mousedown", closeMenu);
  //   return () => document.body.removeEventListener("mousedown", closeMenu);
  // }, []);

  const handleLikeUnlikeReply = async (id) => {
    const res = await likeReply(id);
    if (res) {
      replyRefetch();
    }
  };

  const handleDeleteReply = async (id) => {
    setDisableBtn(true);
    const res = await deleteReply(id);
    if (res?.data) {
      replyRefetch();
      toast.success("Comment Deleted!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableBtn(false);
    } else {
      toast.error("Failed to delete comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableBtn(false);
    }
  };
  const [replyChildTextCount, setReplyChildTextCount] = useState(0);
  const handleReplyTextChange = (event) => {
    const childReply = event.target.value;
    setReplyChildTextCount(childReply.length);
    setChildReplyText(childReply);
  };

  const handlePostReplyToReply = async (e, isEnterKey = false) => {
    setDisableBtn(true);
    if (e) {
      e.preventDefault();
    }
    const childReplyText = replyRef.current.value;
    const data = {
      reply: replyToCommentID,
      text: childReplyText,
      parent: reply?.id,
      C: commentIdx,
    };
    const response = await createReplyMutation(data);
    if (response) {
      replyRef.current.value = "";
      setReplyChildTextCount(0);
      replyRefetch();
      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
    }
    setDisableBtn(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !disableBtn) {
      event.preventDefault(); // Prevents default form submission behavior
      handlePostReplyToReply(event, true);
      replyRef.current.blur();
    }
  };

  const handleSuggest = async (text) => {
    setSuggestDisable(true);

    const data = {
      reply: replyToCommentID,
      ques_text: text,
      parent: reply?.id,
      C: commentIdx,
    };
    const res = await suggestion(data);
    if (res) {
      replyRefetch();
      setSuggestDisable(false);
      setChildReplyField(true);
    }
  };

  return (
    <div
      data-reply
      className="bg-[#fff] lg:bg-[#FAFAFA] w-[90%] ml-auto mr-[17px]  rounded-sm flex items-center gap-1"
    >
      <div className=" w-full">
        <div className="bg-[#fff] lg:bg-[#Fafafa]  w-full ">
          <div className="flex gap-[8px]">
            {reply?.user?.id === 1 ? (
              <div>
                {profileImg?.[0]?.profile_photo ? (
                  <img
                    src={proImgUrl}
                    className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
                    alt=""
                  />
                ) : (
                  <img
                    src={userIcon}
                    className="h-[31.9px] w-[36px] mt-[6px]"
                    alt=""
                  />
                )}
              </div>
            ) : (
              <a
                target="_blank"
                rel="noreferrer"
                // href={`${URL}/memberpage/#/user/${created_by?.id}`}

                href={
                  reply?.id === user
                    ? `${URL}/memberpage/#/personaldetails`
                    : `${URL}/memberpage/#/user/${reply?.id}/personaldetails`
                }
              >
                {" "}
                <div>
                  {profileImg?.[0]?.profile_photo ? (
                    <img
                      src={proImgUrl}
                      className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
                      alt=""
                    />
                  ) : (
                    <img
                      src={userIcon}
                      className="h-[31.9px] w-[32px] mt-[6px]"
                      alt=""
                    />
                  )}
                </div>{" "}
              </a>
            )}

            <div className="border w-full border-[##EAEAEA] bg-[#fafafa] rounded-[8px] p-1 ">
              <div className="flex justify-between my-1 relative">
                <div className="text-[#1E1E1E] pl-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
                  {reply?.user?.id === 1 ? (
                    <p className="text-[14px] font-[500] ">
                      {reply?.user?.first_name} {reply?.user?.last_name}
                    </p>
                  ) : (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        reply?.id === user
                          ? `${URL}/memberpage/#/personaldetails`
                          : `${URL}/memberpage/#/user/${reply?.user?.id}/personaldetails`
                      }
                    >
                      <p className="text-[14px] font-[500] hover:text-[#33b0ca] ">
                        {reply?.user?.first_name} {reply?.user?.last_name}
                      </p>
                    </a>
                  )}
                </div>
                <p className="text-[12px]  h-[15px] text-[#616161] font-[400]  leading-5  absolute top-[-9px] right-0">
                  {" "}
                  <TimeAgo timestamp={createdTime} />
                </p>
              </div>
              <p className="text-[#252525] text-[12px] lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                {reply?.text}
              </p>
            </div>
            {owner === user || reply?.user?.id === user ? (
              <div className="flex gap-2 items-center pl-[2px]">
                {/* <button className={` "cursor-pointer"}`}>
                <img src={editIcon} alt=" " className={`h-5 w-7`} />
              </button> */}
                <button
                  // disabled={disableD}
                  onClick={() => {
                    setIdToDlt(reply?.id);
                    setOpenDltPop(true);
                  }}
                  // className={` ${disableD ? "cursor-default" : "cursor-pointer"}`}
                >
                  <FaRegTrashAlt
                    disabled={disableBtn}
                    className="h-5 w-5 text-[#909090]"
                  />
                </button>
              </div>
            ) : (
              <div className={`px-3 'cursor-default'}`}>
                <div className="" />
              </div>
            )}
          </div>

          <div
            data-nest-reply
            className="flex justify-between items-center mb-[4px] ml-[44px] mr-[10px]"
          >
            <div className=" flex items-center gap-2 text-sm ">
              {isReplyLiked ? (
                <div
                  //   disabled={disable}
                  className="flex gap-[4px] items-center text-[12px]"
                >
                  <button>
                    <FaThumbsUp
                      onClick={() => handleLikeUnlikeReply(reply?.id)}
                      className={`w-3 h-3 text-[#33B0CA]  `}
                    />
                  </button>
                  <p
                    onClick={() =>
                      reply?.likes?.length > 0 && setLikePopup(true)
                    }
                    className={`text-[#616161] font-[400] mt-[0.8px] ${
                      reply?.likes?.length > 0
                        ? "cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    {reply?.likes?.length}{" "}
                    {reply?.likes?.length === 1 ? "Like" : "Likes"}
                  </p>
                </div>
              ) : (
                <div
                  //   disabled={disable}
                  className="flex gap-[1.2px] items-center text-[12px]"
                >
                  <button>
                    <FaRegThumbsUp
                      onClick={() => handleLikeUnlikeReply(reply?.id)}
                      className={` w-3 h-3 `}
                      // className={` w-3 h-3 ${
                      // //   disable ? " cursor-default" : "cursor-pointer"
                      // } `}
                    />
                  </button>
                  {reply?.likes?.length !== 0 ? (
                    <p
                      onClick={() =>
                        reply?.likes?.length > 0 && setLikePopup(true)
                      }
                      className={`${
                        reply?.likes?.length > 0
                          ? "cursor-pointer"
                          : "cursor-default"
                      } text-[#616161] font-[400] mt-[0.8px] ml-[1.2px]`}
                    >
                      {reply?.likes?.length}{" "}
                      {reply?.likes?.length === 1 ? "Like" : "Likes"}
                    </p>
                  ) : (
                    <p className=" text-[#616161] font-[400] mt-[0.8px]   ml-[1.2px] ">
                      {reply?.likes?.length > 1 ? "Likes" : "Like"}
                    </p>
                  )}
                </div>
              )}

              <div>
                <button
                  // data-reply
                  onClick={() => {
                    setChildReplyField(!childReplyField);
                  }}
                >
                  {reply?.child_replies.length > 0 ? (
                    <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px]">
                      {reply?.child_replies?.length}{" "}
                      {reply?.child_replies?.length > 1 ? "Replies" : "Reply"}
                    </p>
                  ) : (
                    <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px]">
                      Reply
                    </p>
                  )}
                </button>
              </div>
              {owner === user &&
                reply?.text?.includes("?") &&
                reply?.user?.id === 1 && (
                  <button
                    className="px-2  rounded-[4px] py-[2px] bg-[#33B0CA]"
                    onClick={() => handleSuggest(reply?.text)}
                  >
                    {suggestDisable ? (
                      <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                        Suggesting...
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                        Suggest
                      </p>
                    )}
                  </button>
                )}
            </div>

            {(owner === user || reply?.user?.id === user) && (
              <button
                onClick={() => {
                  handleAddToBeat(reply);
                  setCommentText(reply);
                }}
                className="w-[48%] md:w-[24%]"
              >
                <p className="text-[12px] text-[#616161] hover:text-[#33B0CA] font-[400] leading-[14.52px] ">
                  Add to Beat Sheet
                </p>
              </button>
            )}
          </div>
          {/* nested replies */}
          {childReplyField && (
            <div data-nest-reply className=" w-[90%]  mb-[8px] ml-auto">
              <form
                onSubmit={handlePostReplyToReply}
                className="relative w-[88.2%] mr-[33px] ml-auto text-[14px] 
              bg-[#fafafa] border rounded-[8px] border-[#eaeaea] focus:outline-none flex"
              >
                <textarea
                  // data-reply-reply
                  ref={replyRef}
                  type="text"
                  name="reply"
                  maxLength={150}
                  id=""
                  className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] px-[8px] w-[100%] h-[44.27px]  lg:h-[37px] focus:border-none focus:outline-none text-[14px] pr-[45px] font-[400]"
                  placeholder="Enter your reply..."
                  required
                  onChange={handleReplyTextChange}
                  onKeyDown={handleKeyDown}
                />
                {disableBtn ? (
                  <div className=" absolute right-[16px] bottom-[20%] ">
                    <BtnLoading />
                  </div>
                ) : (
                  <button
                    // data-reply-reply
                    className="md:w-[21px] absolute right-[16px] bottom-[20%]"
                    disabled={disableBtn}
                    type="submit"
                    // onClick={handlePostReplyToReply}
                  >
                    <img
                      src={forwardIcon}
                      alt=""
                      className="w-full my-auto cursor-pointer"
                    />
                  </button>
                )}
              </form>
              <div className=" text-right">
                <p className="text-[12px] font-[400] leading-[14px]  text-[#616161] mr-[33px]">
                  {replyChildTextCount}/150
                </p>
              </div>
              {reply?.child_replies &&
                reply?.child_replies?.map((childReply, idx) => (
                  <ReplyToReply
                    // data-reply-reply
                    childReply={childReply}
                    owner={owner}
                    user={user}
                    replyRefetch={replyRefetch}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {likePopup && (
        <ReplyLikeUsersPop setLikePopup={setLikePopup} userID={reply?.likes} />
      )}
      {openDltPop && (
        <ConfirmationModal
          isOpen={openDltPop}
          onClose={() => setOpenDltPop(false)}
          onConfirm={() => handleDeleteReply(idToDlt)}
          title="Are you sure you want to delete this comment?"
          content="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
};

export default ReplyToComments;
