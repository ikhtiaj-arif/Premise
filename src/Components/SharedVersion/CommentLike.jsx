import { useContext, useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  useDislikeCommentMutation,
  useLikeCommentMutation,
  useRemoveLikeCommentMutation,
} from "../../app/EndPoints/premisePoolApi";

const CommentLike = ({
  disable,
  comments,
  setLikePopup,
  commentLikes,
  setDisable,
  commentRefetch,
}) => {
  const { currentUser } = useContext(MyContext);
  const [likeComment, { isLoading: isLLoading }] = useLikeCommentMutation();
  const [dislikeComment, { isLoading: isDLoading }] =
    useDislikeCommentMutation();

  const [removeLikeComment, { isLoading: isRLoading }] =
    useRemoveLikeCommentMutation();

  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);

  useEffect(() => {
    const likesId = comments?.likes?.map((e) => e);
    if (likesId?.includes(currentUser?.id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [comments, currentUser, commentRefetch]);

  useEffect(() => {
    const dislikesId = comments?.dislikes?.map((e) => e);
    if (dislikesId?.includes(currentUser?.id)) {
      setIsDisLiked(true);
    } else {
      setIsDisLiked(false);
    }
  }, [comments, currentUser, commentRefetch]);

  const handleLikeDislike = async (id, tag) => {
    setDisable(true);
    const body = {
      user: currentUser?.id,
      comment: id,
    };
    const postLikeResponse =
      (await tag) === "like"
        ? likeComment(body)
        : tag === "removeLike"
        ? removeLikeComment(body)
        : dislikeComment(body);
    if (postLikeResponse?.data?.message) {
      commentRefetch();
      setDisable(false);
    } else {
      commentRefetch();
      setDisable(false);
    }
  };
  return (
    <div className=" flex gap-1 items-center">
      {/* like */}
      <div>
        <button
          disabled={disable || isLLoading || isRLoading || isDLoading}
          className="flex gap-[2px] items-center text-[12px] leading-[14.52px]"
        >
          <FaThumbsUp
            onClick={() =>
              isLiked
                ? handleLikeDislike(comments?.id, "removeLike")
                : handleLikeDislike(comments?.id, "like")
            }
            className={`w-6 h-5  ${
              isLiked ? "text-[#00c3ff]" : "text-[#252525]"
            }  ${
              disable || isLLoading || isRLoading || isDLoading
                ? " cursor-default"
                : "cursor-pointer"
            } `}
          />
          {commentLikes > 0 && (
            <p
              data-te-toggle="tooltip"
              title="Who Liked?"
              className={` text-[#616161] font-[400] mt-[0.8px]  ${
                commentLikes > 0 ? "cursor-pointer  " : "defaultCursor "
              }`}
              onClick={() => setLikePopup(true)}
            >
              {commentLikes}
              {/* {commentLikes === 1 ? "Like" : "Likes"} */}
            </p>
          )}
        </button>
      </div>
      {/* dislike */}
      <div>
        <button
          disabled={disable || isLLoading || isRLoading || isDLoading}
          className={` ${
            isLiked ? " hidden" : "flex"
          }  gap-[2px] items-center text-[12px] leading-[14.52px]`}
        >
          <FaThumbsDown
            onClick={() => handleLikeDislike(comments?.id, "dislike")}
            className={`w-6 h-5 ${
              isDisLiked ? "text-[#00c3ff]" : "text-[#252525]"
            }  ${
              disable || isLLoading || isRLoading || isDLoading
                ? " cursor-default"
                : "cursor-pointer"
            } `}
          />
        </button>
      </div>
    </div>
  );
};

export default CommentLike;
