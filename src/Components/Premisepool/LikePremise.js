import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import {
    useDeleteLikeMutation,
    useLikePremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import "./Premise.css";

const LikePremise = ({ data, refetch }) => {
  const { likes, id, user, user_liked,setLikePopup,likePopup } = data;

  // const [likePopup, setLikePopup] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isLiked, setIsLiked] = useState(user_liked);
  const [postLike, postRes] = useLikePremiseMutation();
  const [deletePremise, deleteRes] = useDeleteLikeMutation();

  useEffect(() => {
    setIsLiked(user_liked);
  }, [user_liked]);

  const handleLikeClick = async () => {
    if (disable || isLiked) return;
    setDisable(true);
    try {
      const response = await postLike({ premise: id, user });
      if (response?.data) {
        setIsLiked(true);
        await refetch(); // Ensures fresh like count
      }
    } finally {
      setDisable(false);
    }
  };

  const handleDisLikeClick = async () => {
    if (disable || !isLiked) return;
    setDisable(true);
    try {
      const response = await deletePremise({ premise: id, user });
      if (response?.data?.message === true) {
        setIsLiked(false);
        await refetch();
      }
    } finally {
      setDisable(false);
    }
  };

  const handlePopupOpen = () => {
    if (likes > 0) {
      setLikePopup(true);
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-center pointer-events-auto">
        <button onClick={isLiked ? handleDisLikeClick : handleLikeClick} disabled={disable}>
          <FaThumbsUp
            className={`w-8 h-8 transition-colors ${
              isLiked ? "text-[#00c3ff]" : "text-[#252525]"
            } ${disable ? "cursor-default" : "cursor-pointer"}`}
          />
        </button>

        <div
          className={`flex items-center text-[14px] font-[500] ${
            likes > 0 ? "cursor-pointer" : "defaultCursor"
          }`}
          onClick={handlePopupOpen}
        >
          {likes}
          <span className="ml-[2px] like-m">{likes === 1 ? "Like" : "Likes"}</span>
        </div>
      </div>

      {/* {likePopup && <LikePopup setLikePopup={setLikePopup} id={id} />} */}
    </div>
  );
};

export default LikePremise;
