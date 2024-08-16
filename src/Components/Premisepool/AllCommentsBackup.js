import React, { useEffect, useState } from "react";
import { FaRegThumbsUp, FaRegTrashAlt, FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetAllReplyOfACommentQuery } from "../../app/EndPoints/commentReply/reply";
import {
  useDeleteCommentMutation,
  useGetPremiseUserPictureQuery,
  useLikeCommentMutation,
  useRemoveLikeCommentMutation,
} from "../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../features/TimeAgo";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";
import BeatEditPop from "./AddToBeat/BeatEditPop";
import CommentLikePopup from "./CommentLikePopup";
import ConfirmationModal from "./Comments/ConfirmationModal";
import ReplyToComments from "./Comments/ReplyToComments";

const AllComments = ({
  comments,
  data,
  refetch,
  openReplyField,
  setOpenReplyField,
  replyToCommentID,
  setReplyToCommentID,
  replyResStat,
  setCommentOwner,
  setOpenAllReplies,
  openAllReplies,
  commentRefetch,
  setReplyField,
  replyField
}) => {
  const user = useSelector((state) => state?.user?.id);
  // console.log("comments", comments);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(comments?.user?.id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  const [isLiked, setIsLiked] = useState(false);
  const [totalCommentLikes, setTotalCommentLikes] = useState([]);

  const [likePopup, setLikePopup] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disableD, setDisableD] = useState(false);
  const [projectBeatOpen, setProjectBeatOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [openDltPop, setOpenDltPop] = useState(false);
  const [idToDlt, setIdToDlt] = useState({});
  const [likeComment, likeCommentRes] = useLikeCommentMutation();
  const [removeLikeComment, removeLikeCommentRes] =
    useRemoveLikeCommentMutation();
  const [deleteComment, deleteCommentRes] = useDeleteCommentMutation();
  const {
    data: replyData,
    isLoading: isReplyLoading,
    isError,
    refetch: replyRefetch,
  } = useGetAllReplyOfACommentQuery(comments?.id);

  useEffect(() => {
    replyRefetch();
  }, [replyResStat]);

  const owner = data?.created_by?.id;
  const likesId = comments?.likes?.map((e) => e.id);

  const handleLikeComment = async (id) => {
    setDisable(true);
    const body = {
      user: user,
      comment: id,
    };
    const postLikeResponse = await likeComment(body);

    if (postLikeResponse?.data?.message === "Like Added") {
      setIsLiked(true);
      commentRefetch();
      setDisable(false);
      // setLikeCount((pre) => (pre === null ? likes : pre + 1));
    } else {
      setIsLiked(false);
      commentRefetch();
      setDisable(false);
      // setLikeCount((pre) => (pre === null ? likes : pre - 1));
    }
  };
  const handleRemoveLikeComment = async (id) => {
    setDisable(true);
    const body = {
      user: user,
      comment: id,
    };
    const postLikeResponse = await removeLikeComment(body);

    if (postLikeResponse?.data?.message === "Like Removed") {
      setIsLiked(true);
      commentRefetch();
      setDisable(false);
    } else {
      setIsLiked(false);
      commentRefetch();
      setDisable(false);
    }
  };

  const handleDeleteComment = async (id) => {
    setDisableD(true);
    const res = await deleteComment(id);
    if (res?.data) {
      commentRefetch();
      toast.success("Comment Deleted!", {
        position: toast.POSITION.TOP_CENTER,
      });
      setDisableD(false);
      setDisable(false);
    } else {
      toast.error("Failed to delete comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
      setDisable(false);
      setDisableD(false);
    }
  };

  //for comment
  useEffect(() => {
    setTotalCommentLikes(comments?.likes);
    if (likesId?.includes(user)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [comments, user, likesId]);

  const [commenterName, setCommenterName] = useState("");

  const commentLikes = comments?.likes?.length;
  const commentLikedBy = comments?.likes;
  const commentOwnerName = `${comments?.user?.first_name} ${comments?.user?.last_name}`;

  const createdTime = comments?.created_at;
  const commentOwnerMail = comments?.user?.email;
  const modifiedEmail = commentOwnerMail.split("@")[0];


  useEffect(() => {
    if (commentOwnerName?.length > 1) {
      setCommenterName(commentOwnerName);
    } else {
      setCommenterName(modifiedEmail);
    }
  }, [commentOwnerName, modifiedEmail]);


  //delete reply
  const handleDeleteReply = (id) => {};

  return (
    <div className=" flex flex-col  justify-end w-full  ">
      {/* each comment  */}
      <div>
        <div className="bg-[#fff] lg:bg-[#FAFAFA] w-[95%] mx-auto  rounded-sm flex gap-1 ">
          {/* comment like */}
          <div className="lg:bg-[#FAFAFA]  w-full ">
            <div className="flex flex-row-reverse">
              <button
                onClick={() => {
                  setProjectBeatOpen(true);
                  setCommentText(comments);
                }}
                className=""
              >
                <p className="text-[12px] mt-[10px] text-[#33B0CA] font-[400] leading-[14.52px] pb-[5px] md:pb-[2px]">
                  Edit & Add to Beat Sheet
                </p>
              </button>
            </div>

            <div className="flex gap-[8px]">
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
              {/* <img src={userIcon} alt="" className="h-[31.9px] w-[32px] mt-[6px]" /> */}
              <div className="border w-full bg-[#f8f8f8] border-[#EAEAEA] rounded-[8px] p-1 ">
                <div className="flex justify-between my-1 ">
                  <div className="text-[#1E1E1E] pl-[4px] pr-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
                    <p className="text-[14px] font-[500] ">{commenterName}</p>
                  </div>
                </div>
                <p className="text-[#252525] text-[12px] lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                  {comments?.text}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="notranslate flex mb-[10px] items-center gap-[10px] text-sm ml-10  mt-[2px]">
                {isLiked ? (
                  <button
                    disabled={disable}
                    className="flex gap-[4px] items-center text-[12px]"
                  >
                    <FaThumbsUp
                      onClick={() => handleRemoveLikeComment(comments?.id)}
                      className={`w-3 h-3 text-[#33B0CA] ${
                        disable ? " cursor-default" : "cursor-pointer"
                      } `}
                    />
                    <p
                      className={` text-[#616161] font-[400] mt-[0.8px]  ${
                        commentLikes > 0 ? "cursor-pointer  " : "defaultCursor "
                      }`}
                      onClick={() => commentLikes > 0 && setLikePopup(true)}
                    >
                      {commentLikes} {commentLikes === 1 ? "Like" : "Likes"}
                    </p>
                  </button>
                ) : (
                  <button className="flex gap-[4px] items-center text-[12px]">
                    <FaRegThumbsUp
                      onClick={() => handleLikeComment(comments?.id)}
                      className={` w-3 h-3 ${
                        disable ? " cursor-default" : "cursor-pointer"
                      } `}
                    />

                    {commentLikes !== 0 ? (
                      <p
                        className={`"text-[12px] text-[#616161] font-[400] mt-[0.8px]"  ${
                          commentLikes > 0
                            ? "cursor-pointer  "
                            : "defaultCursor "
                        }`}
                        onClick={() => commentLikes > 0 && setLikePopup(true)}
                      >
                        {commentLikes} {commentLikes > 1 ? "Likes" : "Like"}
                      </p>
                    ) : (
                      <p
                        className={`"text-[12px] text-[#616161] font-[400] mt-[0.8px]"  ${
                          commentLikes > 0
                            ? "cursor-pointer  "
                            : "defaultCursor "
                        }`}
                        onClick={() => commentLikes > 0 && setLikePopup(true)}
                      >
                        {commentLikes > 1 ? "Likes" : "Like"}
                      </p>
                    )}
                  </button>
                )}
                {replyData?.length > 0 ? (
                  <>
                    <button
                      onClick={() => {
                        setOpenAllReplies(!openAllReplies);
                        setOpenReplyField(comments?.id);
                        setReplyToCommentID(comments?.id);
                        setCommentOwner(commentOwnerName);
                        setReplyField(!replyField)
                      }}
                      className=""
                    >
                      <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px]">
                        {replyData?.length}{" "}
                        {replyData?.length > 1 ? "Replies" : "Reply"}
                      </p>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setOpenReplyField(comments?.id);
                        setOpenAllReplies(!openAllReplies);
                        setReplyToCommentID(comments?.id);
                        setCommentOwner(commentOwnerName);
                        setReplyField(!replyField)
                      }}
                      className=""
                    >
                      <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px]">
                        Reply
                      </p>
                    </button>
                  </>
                )}
              </div>
              <p className="text-[12px] text-[#616161] font-[400] mt-[-8.2px] leading-5 ">
                {" "}
                <TimeAgo timestamp={createdTime} />
              </p>
            </div>
          </div>
          <div></div>
          {owner === user || comments?.user?.id === user ? (
            <div className="flex gap-2 items-center pl-[2px]">
              {/* <button className={` "cursor-pointer"}`}>
                <img src={editIcon} alt=" " className={`h-5 w-7`} />
              </button> */}
              <button
                disabled={disableD}
                onClick={() => {
                  setIdToDlt(comments?.id);
                  setOpenDltPop(true);
                }}
                className={` ${disableD ? "cursor-default" : "cursor-pointer"}`}
              >
                <FaRegTrashAlt className="h-5 w-5 text-[#909090]" />
              </button>
            </div>
          ) : (
            <div className={`px-3 'cursor-default'}`}>
              <div className="" />
            </div>
          )}

          {likePopup && (
            <CommentLikePopup
              setLikePopup={setLikePopup}
              allLikes={comments?.likes}
            />
          )}
        </div>
      </div>

      {/* comment reply */}
      {/* when theres reply present */}

      {openAllReplies && (
        <div>
          {replyToCommentID && replyToCommentID === comments.id && (
            <div>
              {" "}
              {replyData
                ?.slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((reply, index) => (
                  <ReplyToComments
                    key={index} // Make sure to provide a unique key when mapping over an array
                    reply={reply}
                    index={index}
                    owner={owner}
                    setProjectBeatOpen={setProjectBeatOpen}
                    setCommentText={setCommentText}
                    replyRefetch={replyRefetch}
                    user={user}
                  />
                ))}
            </div>
          )}{" "}
        </div>
      )}

      {/* when theres no reply */}
      {projectBeatOpen && (
        // <BeatProjectPop popClose={() => setProjectBeatOpen(false)} />
        <BeatEditPop
          popClose={() => setProjectBeatOpen(false)}
          commentText={commentText}
          data={data}
          setIsLiked={setIsLiked}
          refetch={refetch}
        />
      )}
      <div className="h-[1px] w-[90%] mx-auto bg-[#eaeaea] mt-[4px]" />
      {openDltPop && (
        <ConfirmationModal
          isOpen={openDltPop}
          onClose={() => setOpenDltPop(false)}
          onConfirm={() => handleDeleteComment(idToDlt)}
          title="Are you sure you want to delete this comment?"
          content="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
};

export default AllComments;
