import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import {
  useDeleteLikeMutation,
  useIsLikePremiseMutation,
  useLikePremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import LikePopup from "../Premisepool/LikePopup";
import { useSelector } from "react-redux";

const PopupLike = ({user,id, premiseRefetch, premiseData }) => {
  const [isLiked, setIsLiked] = useState(false);

  const [postLike, resInfo] = useLikePremiseMutation();
  const [postIsLike, isResInfo] = useIsLikePremiseMutation();
  const [deletePremise, deleteInfo] = useDeleteLikeMutation();

  const [disable, setDisable] = useState(false);
  const [likePopup, setLikePopup] = useState(false);

  console.log('user from popup like', user);

  useEffect(() => {
    async function fetchData() {
      const body = {
        premise: id,
        user: user,
      };
      const isLikeRes = await postIsLike(body);
      setIsLiked(isLikeRes?.data?.message);
    }
    if (user && id) {
      fetchData();
    }
  }, [user, id, postIsLike, setIsLiked]);

  const body = {
    premise: id,
    user: user,
  };

  const handleDisLikeClick = async () => {
    setDisable(true);
    const deleteResponse = await deletePremise(body);
    if (deleteResponse?.data?.message === true) {
      setDisable(false);
      setIsLiked(!isLiked);
      premiseRefetch();
    }
  };

  const handleLikeClick = async () => {
    setDisable(true);
    const postLikeResponse = await postLike(body);
    if (postLikeResponse?.data) {
      setDisable(false);
      setIsLiked(!isLiked);
      premiseRefetch();
    }
  };

  return (
    <div className=" flex gap-2 ml-[3px] ">
      {isLiked ? (
        <button>
          <FaThumbsUp
            onClick={handleDisLikeClick}
            className={`w-6 h-6 text-[#33B0CA]   
                                      `}
          />
        </button>
      ) : (
        <button>
          <FaThumbsUp
            onClick={handleLikeClick}
            className={`w-6 h-6 text-[#252525] 
                                      `}
          />
        </button>
      )}
      <p
        className={
          premiseData?.likes > 0
            ? "cursor-pointer  text-[14px] font-[500]"
            : "defaultCursor  text-[14px] font-[500]"
        }
        onClick={() => premiseData?.likes > 0 && setLikePopup(true)}
      >
        {premiseData?.likes}{" "}
        {premiseData?.likes > 1 ? (
          <span className="like-m">Likes</span>
        ) : (
          <span className="like-m">Like</span>
        )}
      </p>

      {likePopup && (
        <LikePopup setLikePopup={setLikePopup} id={premiseData?.id} />
      )}
    </div>
  );
};

export default PopupLike;
