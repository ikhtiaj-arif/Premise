import React, { useEffect, useState } from "react";
import { FaRegThumbsUp, FaRegTrashAlt, FaThumbsUp } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useDeleteLikeOfReplyMutation,
  useUpdateLikeOfReplyMutation,
} from "../../../app/EndPoints/commentReply/reply";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../../features/TimeAgo";
import userIcon from "../../../img/Icons/userImg.png";
import { URL } from "../../utils";
import ReplyLikeUsersPop from "../ReplyLikeUsersPop";
import ConfirmationModal from "./ConfirmationModal";

const ReplyToReply = ({ childReply, owner, user, replyRefetch }) => {
  const replyBy = childReply?.user;
  const currentReplyId = childReply?.id;
  const createdTime = childReply?.created_at;
  const replyLikes = childReply?.likes;
  // console.log("childReply", replyLikes);

  const [openDltPop, setOpenDltPop] = useState(false);
  const [idToDlt, setIdToDlt] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [isReplyLiked, setIsReplyLiked] = useState(false);
  const [likePopup, setLikePopup] = useState(false);

  const [likeReply, likeReplyRes] = useUpdateLikeOfReplyMutation();
  const [deleteReply, deleteReplyRes] = useDeleteLikeOfReplyMutation();

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
    setDisableBtn(true);
    // console.log(id);
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

  return (
    <div className="w-full ml-auto mb-[4px]">
      <div className="flex gap-[8px]">
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
                className="h-[31.9px] w-[36px] mt-[6px]"
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
        <div className="border w-[78%] md:w-[86%] lg:w-[89%] border-[##EAEAEA] bg-[#f8f8f8] rounded-[8px] p-1 ">
          <div className="flex justify-between my-1 relative">
            <div className="text-[#1E1E1E] pl-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
              {replyBy?.id === 1 ? (
                <p className="text-[14px] font-[500] ">
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
                >
                  <p className="text-[14px] font-[500] hover:text-[#33b0ca]">
                    {childReply?.user?.first_name} {childReply?.user?.last_name}
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
            {childReply?.text}
          </p>
        </div>{" "}
        {owner === user || replyBy?.id === user ? (
          <div className="flex gap-2 items-center pl-[2px]">
            <button
              // data-reply-reply
              // disabled={disableD}
              onClick={() => {
                setIdToDlt(currentReplyId);
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
      <div className="w-[93%] ml-auto">
        {isReplyLiked ? (
          <div
            // data-reply-reply
            //   disabled={disable}
            className="flex gap-[4px] items-center text-[12px] leading-[14.52px]"
          >
            <button>
              <FaThumbsUp
                onClick={() => handleLikeUnlikeReply(childReply?.id)}
                className={`w-3 h-3 text-[#33B0CA]  `}
              />
            </button>
            <p
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
              {childReply?.likes?.length === 1 ? "Like" : "Likes"}
            </p>
          </div>
        ) : (
          <div
            // data-reply-reply
            //   disabled={disable}
            className="flex gap-[1.2px] items-center text-[12px] leading-[14.52px]"
          >
            <button>
              <FaRegThumbsUp
                onClick={() => handleLikeUnlikeReply(childReply?.id)}
                className={` w-3 h-3 `}
                // className={` w-3 h-3 ${
                // //   disable ? " cursor-default" : "cursor-pointer"
                // } `}
              />
            </button>
            {childReply?.likes?.length !== 0 ? (
              <p
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
                {childReply?.likes?.length === 1 ? "Like" : "Likes"}
              </p>
            ) : (
              <p
                onClick={() =>
                  childReply?.likes?.length > 0 && setLikePopup(true)
                }
                className=" text-[#616161] font-[400] mt-[0.8px]  ml-[1.2px] "
              >
                {childReply?.likes?.length > 1 ? "Likes" : "Like"}
              </p>
            )}
          </div>
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
  );
};

export default ReplyToReply;
