import React, { useContext, useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useUpdateLikeOfReplyMutation } from "../../../app/EndPoints/commentReply/reply";
import { MyContext } from "../../../App";
import { useDislikeCommentReplyMutation } from "../../../app/EndPoints/premisePoolApi";

const ReplyLike = ({ reply, setLikePopup, replyRefetch }) => {
  const { currentUser } = useContext(MyContext);
  const [likeReply, { isLoading: isLLoading }] = useUpdateLikeOfReplyMutation();
  const [dislikeReply, { isLoading: isDLoading }] =
    useDislikeCommentReplyMutation();

  const [isReplyLiked, setIsReplyLiked] = useState(false);
  const [isDisReplyLiked, setIsDisReplyLiked] = useState(false);

  useEffect(() => {
    const replyLikes = reply?.likes?.map((e) => e);
    //console.log('replyLikes', replyLikes);
    if (replyLikes?.includes(currentUser?.id)) {
      setIsReplyLiked(true);
    } else {
      setIsReplyLiked(false);
    }
  }, [currentUser, reply, replyRefetch]);

  useEffect(() => {
    const replyLikes = reply?.dislikes?.map((e) => e);
    //console.log('replyLikes', replyLikes);
    if (replyLikes?.includes(currentUser?.id)) {
      setIsDisReplyLiked(true);
    } else {
      setIsDisReplyLiked(false);
    }
  }, [currentUser, reply, replyRefetch]);

  const handleLikeUnlikeReply = async (id, tag) => {
    const res = (await tag) === "like" ? likeReply(id) : dislikeReply(id);
    replyRefetch();
    
  };
  return (
    <div className=" flex gap-2 items-center">
      {/* like */}
      <div
        disabled={isLLoading || isDLoading}
        className="flex gap-[1.2px] items-center text-[14px]"
      >
        <button>
          <FaThumbsUp
            onClick={() => handleLikeUnlikeReply(reply?.id, "like")}
            className={` w-6 h-5 ${
              isReplyLiked ? "text-[#33B0CA]" : "text-[#252525]"
            } ${
              isLLoading || isDLoading ? " cursor-default" : "cursor-pointer"
            } `}
          />
        </button>
        {reply?.likes?.length !== 0 && (
          <p
            data-te-toggle="tooltip"
            title="Who Liked?"
            onClick={() => setLikePopup(true)}
            className={` cursor-pointer
             text-[#616161] font-[400] mt-[0.8px]`}
          >
            {reply?.likes?.length}
          </p>
        )}
      </div>
      {/* dislike */}
      <div
        disabled={isLLoading || isDLoading}
        className={` ${
          isReplyLiked ? " hidden" : "flex"
        }  flex gap-[1.2px] items-center text-[14px]`}
      >
        <button>
          <FaThumbsDown
            onClick={() => handleLikeUnlikeReply(reply?.id, "dislike")}
            className={` w-6 h-5 ${
              isDisReplyLiked ? "text-[#33B0CA]" : "text-[#252525]"
            } ${
              isLLoading || isDLoading ? " cursor-default" : "cursor-pointer"
            } `}
          />
        </button>
      </div>
    </div>
  );
};

export default ReplyLike;
