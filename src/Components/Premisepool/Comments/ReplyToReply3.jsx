import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRegTrashAlt, FaThumbsUp } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import { MyContext } from "../../../App";
import {
  useCreateReplyMutation,
  useDeleteLikeOfReplyMutation,
  useUpdateLikeOfReplyMutation,
} from "../../../app/EndPoints/commentReply/reply";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../../features/TimeAgo";
import userIcon from "../../../img/Icons/userImg.png";
import BtnLoading from "../../../shared/BtnLoading";
import { URL } from "../../utils";
import ReplyLikeUsersPop from "../ReplyLikeUsersPop";
import UserType from "../UserType";
import ConfirmationModal from "./ConfirmationModal";

const ReplyToReply3 = ({
  handleAddToBeat,
  setCommentText,
  childReply,
  currentReplyId,
  owner,
  user,
  replyRefetch,
  reply,
  replyToCommentID,
  commentIdx,
}) => {
  const replyBy = childReply?.user;

  const createdTime = childReply?.created_at;
  const replyLikes = childReply?.likes;
  // console.log("currentReplyId", childReply);
  const {
    selectedPremiseObj,
    selectedSpProjectID,
    createdSpProjectID,
    currentlyOpenedCommentID,
    setCurrentlyOpenedCommentID,
  } = useContext(MyContext);
  const [openDltPop, setOpenDltPop] = useState(false);
  const [currentReply2Id, setCurrentReply2Id] = useState(childReply?.id);
  const [idToDlt, setIdToDlt] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [isReplyLiked, setIsReplyLiked] = useState(false);
  const [likePopup, setLikePopup] = useState(false);
  const [childReplyField, setChildReplyField] = useState(false);
  const [childReplies, setChildReplies] = useState(false);

  const [likeReply, likeReplyRes] = useUpdateLikeOfReplyMutation();
  const [deleteReply, deleteReplyRes] = useDeleteLikeOfReplyMutation();
  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const replyToReplyRef = useRef(null);
  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(replyBy?.id);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  useEffect(() => {
    if (replyLikes?.includes(user)) {
      setIsReplyLiked(true);
    } else {
      setIsReplyLiked(false);
    }
  }, [replyLikes, user, isReplyLiked]);

  const handleLikeUnlikeReply = async (id) => {
    const res = await likeReply(id);
    if (res) {
      replyRefetch();
    }
  };

  const handleDeleteReply = async (id) => {
    const deleteData = {
      id,
     
    };
    setDisableBtn(true);
    // console.log(id);
    const res = await deleteReply(deleteData);
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
      replyRefetch();
      setDisableBtn(false);
    }
  };
  // console.log("childReply", childReply?.user?.id, "user", user, "owner", owner);
  const childReplyRef = useRef();
  const handlePostReplyToReply = async (e, isEnterKey = false) => {
    const childReplyText = childReplyRef.current.value;
    if (e) {
      e.preventDefault();
    }
    if (childReplyText.length === 0) {
      alert("You can't send an empty reply!");
      return;
    }

    setDisableBtn(true);
    let replyData = {
      // reply: replyToCommentID,
      reply: currentlyOpenedCommentID,
      text: childReplyText,
      parent: currentReplyId,
      C: commentIdx,
    };

    const response = await createReplyMutation(replyData);
    if (response) {
      childReplyRef.current.value = "";
      // setReplyChildTextCount(0);
      replyRefetch();

      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setChildReplyField(false);
      setChildReplies(true);
    }
    setDisableBtn(false);
  };

  const [replyChildTextCount, setReplyChildTextCount] = useState(0);
  const [childReplyText, setChildReplyText] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !disableBtn) {
      event.preventDefault(); // Prevents default form submission behavior
      handlePostReplyToReply(event, true);
      // replyToReplyRef.current.blur();
    }
  };

  const handleReplyTextChange = (event) => {
    const childReply = event.target.value;
    setReplyChildTextCount(childReply?.length);
    setChildReplyText(childReply);
  };

  return (
    <>
      <div className="w-full max-w-[601px] ml-[0px]">
        <div className="flex gap-[8px]">
          <div className="flex flex-col items-center gap-1">
            {replyBy?.id === 1 ? (
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
              </div>
            ) : (
              <a
                // data-reply-reply
                target="_blank"
                rel="noreferrer"
                // href={`${URL}/memberpage/#/user/${created_by?.id}`}

                href={
                  replyBy?.id === user
                    ? `${URL}/memberpage/#/personaldetails`
                    : `${URL}/memberpage/#/user/${replyBy?.id}/personaldetails`
                }
              >
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
                </div>
              </a>
            )}
          </div>
          <div className="border w-[78%] md:w-[86%] lg:w-[89%] border-[##EAEAEA] bg-[#f8f8f8] rounded-[8px] p-1 ">
            <div className="flex justify-between my-1 relative">
              <div className="text-[#1E1E1E] pl-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
                {replyBy?.id === 1 ? (
                  <p className="notranslate text-[14px] font-[500] ">
                    {childReply?.user?.first_name} {childReply?.user?.last_name}
                  </p>
                ) : (
                  <a
                    // data-reply-reply
                    target="_blank"
                    rel="noreferrer"
                    // href={`${URL}/memberpage/#/user/${created_by?.id}`}

                    href={
                      replyBy?.id === user
                        ? `${URL}/memberpage/#/personaldetails`
                        : `${URL}/memberpage/#/user/${replyBy?.id}/personaldetails`
                    }
                    className="flex items-center"
                  >
                    {childReply?.user?.first_name &&
                    childReply?.user?.last_name ? (
                      <p className="notranslate text-[14px] font-[500] hover:text-[#33b0ca]">
                        {childReply?.user?.first_name}{" "}
                        {childReply?.user?.last_name}
                      </p>
                    ) : (
                      <p className="text-[14px] font-[500] hover:text-[#33b0ca]">
                        {childReply?.user?.email.split("@")[0]}{" "}
                      </p>
                    )}
                    <UserType
                      type={childReply?.user?.centraldatabase?.type}
                      user_type={childReply?.user?.centraldatabase?.user_type}
                    />
                  </a>
                )}
              </div>

              <p className="text-[12px]  h-[15px] text-[#616161] font-[400]  leading-5  absolute top-[-9px] right-0">
                {" "}
                <TimeAgo timestamp={createdTime} />
              </p>
            </div>

            <p className="notranslate text-[#252525] text-[12px] lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
              {childReply?.text}
            </p>
          </div>{" "}
          {owner === user || replyBy?.id === user ? (
            <div className="flex gap-2 items-center pl-[2px]">
              <button
                // data-reply-reply
                // disabled={disableD}
                onClick={() => {
                  setIdToDlt(childReply?.id);
                  setOpenDltPop(true);
                }}
              >
                <FaRegTrashAlt
                  //   disabled={disableBtn}
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
        <div className="flex justify-between w-[86%] mr-[24px] md:mr-[29px] ml-auto">
          <div className="md:flex hidden ml-[30px] md:ml-0 gap-3 leading-[16px] mt-[2px] mb-[4px]">
            <>
              {/* <div>
                {
                  <button
                    onClick={() => setChildReplyField(!childReplyField)}
                    className="flex items-center gap-1 "
                  >
                    <IoIosUndo
                      className={`${
                        childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                      } text-[14px]`}
                    />
                    <p
                      className={`text-[12px] ${
                        childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                      } font-[400]  cursor-pointer`}
                    >
                      Reply
                    </p>
                  </button>
                }
              </div> */}
              {isReplyLiked ? (
                <div
                  // data-reply-reply
                  //   disabled={disable}
                  className="flex gap-[4px] items-center  text-[12px] leading-[14.52px]"
                >
                  <button>
                    <FaThumbsUp
                      onClick={() => handleLikeUnlikeReply(childReply?.id)}
                      className={`w-3 h-3 text-[#33B0CA]  `}
                    />
                  </button>
                  <p
                    data-te-toggle="tooltip"
                    title="Who Liked?"
                    onClick={() =>
                      childReply?.likes?.length > 0 && setLikePopup(true)
                    }
                    className={`text-[#616161] font-[400] mt-[0.8px] ${
                      childReply?.likes?.length > 0
                        ? "cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    {childReply?.likes?.length}{" "}
                    {/* {childReply?.likes?.length === 1 ? "Like" : "Likes"} */}
                  </p>
                </div>
              ) : (
                <div
                  // data-reply-reply
                  //   disabled={disable}
                  className="flex gap-[1.2px] items-center text-[12px] leading-[14.52px]"
                >
                  <button>
                    <FaThumbsUp
                      onClick={() => handleLikeUnlikeReply(childReply?.id)}
                      className={` w-3 h-3  text-[#252525] `}
                      // className={` w-3 h-3 ${
                      // //   disable ? " cursor-default" : "cursor-pointer"
                      // } `}
                    />
                  </button>
                  {childReply?.likes?.length !== 0 ? (
                    <p
                      data-te-toggle="tooltip"
                      title="Who Liked?"
                      onClick={() =>
                        childReply?.likes?.length > 0 && setLikePopup(true)
                      }
                      className={`${
                        childReply?.likes?.length > 0
                          ? "cursor-pointer"
                          : "cursor-default"
                      } text-[#616161] font-[400] mt-[0.8px] ml-[1.2px]`}
                    >
                      {childReply?.likes?.length}{" "}
                      {/* {childReply?.likes?.length === 1 ? "Like" : "Likes"} */}
                    </p>
                  ) : (
                    <p
                      onClick={() =>
                        childReply?.likes?.length > 0 && setLikePopup(true)
                      }
                      className=" text-[#616161] font-[400] mt-[0.8px]  ml-[1.2px] "
                    >
                      {/* {childReply?.likes?.length > 1 ? "Likes" : "Like"} */}
                    </p>
                  )}
                </div>
              )}
            </>
          </div>
          <div className="md:hidden flex ml-[30px] md:ml-0 gap-3">
            <>
              {/* <div>
                {
                  <button
                    onClick={() => setChildReplyField(!childReplyField)}
                    className="flex items-center gap-1 "
                  >
                    <IoIosUndo
                      className={`${
                        childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                      } text-[14px]`}
                    />
                    <p
                      className={`text-[12px] ${
                        childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                      } font-[400]  cursor-pointer`}
                    >
                      Reply
                    </p>
                  </button>
                }
              </div> */}
            </>
          </div>
          {isReplyLiked ? (
            <div
              // data-reply-reply
              //   disabled={disable}
              className="flex gap-[4px]  md:hidden items-center text-[12px] leading-[14.52px] ml-auto md:ml-[60px] "
            >
              <button>
                <FaThumbsUp
                  onClick={() => handleLikeUnlikeReply(childReply?.id)}
                  className={`w-3 h-3 text-[#33B0CA]  `}
                />
              </button>
              <p
                data-te-toggle="tooltip"
                title="Who Liked?"
                onClick={() =>
                  childReply?.likes?.length > 0 && setLikePopup(true)
                }
                className={`text-[#616161] font-[400] mt-[0.8px] ${
                  childReply?.likes?.length > 0
                    ? "cursor-pointer"
                    : "cursor-default"
                }`}
              >
                {childReply?.likes?.length}{" "}
                {/* {childReply?.likes?.length === 1 ? "Like" : "Likes"} */}
              </p>
            </div>
          ) : (
            <div
              // data-reply-reply
              //   disabled={disable}
              className="flex gap-[1.2px] ml-[60px] md:hidden items-center text-[12px] leading-[14.52px]"
            >
              <button>
                <FaThumbsUp
                  onClick={() => handleLikeUnlikeReply(childReply?.id)}
                  className={` w-3 h-3  text-[#252525] `}
                  // className={` w-3 h-3 ${
                  // //   disable ? " cursor-default" : "cursor-pointer"
                  // } `}
                />
              </button>
              {childReply?.likes?.length !== 0 ? (
                <p
                  data-te-toggle="tooltip"
                  title="Who Liked?"
                  onClick={() =>
                    childReply?.likes?.length > 0 && setLikePopup(true)
                  }
                  className={`${
                    childReply?.likes?.length > 0
                      ? "cursor-pointer"
                      : "cursor-default"
                  } text-[#616161] font-[400] mt-[0.8px] ml-[1.2px]`}
                >
                  {childReply?.likes?.length}{" "}
                  {/* {childReply?.likes?.length === 1 ? "Like" : "Likes"} */}
                </p>
              ) : (
                <p
                  onClick={() =>
                    childReply?.likes?.length > 0 && setLikePopup(true)
                  }
                  className=" text-[#616161] font-[400] mt-[0.8px]  ml-[1.2px] "
                >
                  {/* {childReply?.likes?.length > 1 ? "Likes" : "Like"} */}
                </p>
              )}
            </div>
          )}

          {childReply?.add_to_beat ? (
            <>
              {(owner === user || childReply?.user?.id === user) && (
                <button className="w-[48%] cursor-auto md:w-[22%]">
                  <p className="text-[12px] text-[#33B0CA] italic  font-[400] leading-[14.52px] ">
                    Added as Beat
                  </p>
                </button>
              )}
            </>
          ) : (
            <>
              {(owner === user || childReply?.user?.id === user) && (
                <button
                  onClick={() => {
                    handleAddToBeat(childReply);
                    setCommentText(childReply);
                    replyRefetch();
                  }}
                  className="w-[30%] md:w-[22%]"
                >
                  <p className="text-[12px] text-[#252525] hover:text-[#33B0CA] font-[400] leading-[14.52px] ">
                    Add as Beat
                  </p>
                </button>
              )}
            </>
          )}
        </div>

        {openDltPop && (
          <ConfirmationModal
            isOpen={openDltPop}
            onClose={() => setOpenDltPop(false)}
            onConfirm={() => handleDeleteReply(idToDlt)}
            title="Are you sure you want to delete this comment?"
            content="Are you sure you want to delete this item?"
          />
        )}
        {likePopup && (
          <ReplyLikeUsersPop setLikePopup={setLikePopup} userID={replyLikes} />
        )}
      </div>
      {childReplyField && (
        <div data-nest-reply className=" w-[91%]  mb-[8px] ml-auto">
          <form
            onSubmit={handlePostReplyToReply}
            className="relative w-[82.2%] md:w-[88.2%] mr-[33px] ml-auto text-[14px] 
              bg-[#fafafa] border rounded-[8px] border-[#eaeaea] focus:outline-none flex"
          >
            <textarea
              // data-reply-reply
              ref={childReplyRef}
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
                <IoMdSend className="text-[#33B0CA] w-6 h-6" />
              </button>
            )}
          </form>
          <div className=" text-right">
            <p className="text-[12px] font-[400] leading-[14px]  text-[#616161] mr-[33px]">
              {replyChildTextCount}/150
              {/* 0/150 */}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReplyToReply3;
