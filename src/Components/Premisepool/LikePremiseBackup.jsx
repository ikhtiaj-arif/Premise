import React, { useEffect, useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import {
  useDeleteLikeMutation,
  useIsLikePremiseMutation,
  useLikePremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import Popup from "./Popup";
import "./Premise.css";

const LikePremise = ({ data, setIsLiked, refetch }) => {
  const { likes, id, user, isLiked } = data;
  // console.log(likes);

  const [postLike, resInfo] = useLikePremiseMutation();
  const [postIsLike, isResInfo] = useIsLikePremiseMutation();
  const [deletePremise, deleteInfo] = useDeleteLikeMutation();

  const [likePopup, setLikePopup] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (!likePopup) {
      refetch();
    }
  }, [likePopup, refetch]);

  useEffect(() => {
    async function fetchData() {
      const body = {
        premise: id,
        user: user,
      };
      const isLikeRes = await postIsLike(body);
      //console.log(isLikeRes?.data?.message);
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
    // console.log(deleteResponse);
    if (deleteResponse?.data?.message === true) {
      setDisable(false);
      setIsLiked(!isLiked);
    }
  };

  const handleLikeClick = async () => {
    setDisable(true);
    const postLikeResponse = await postLike(body);
    // console.log(postLikeResponse);
    if (postLikeResponse?.data) {
      setDisable(false);
      setIsLiked(!isLiked);
    }
  };

  return (
    <div className="">
      <div className="flex gap-2">
        {isLiked ? (
          <button disabled={disable}>
            <FaThumbsUp
              onClick={handleDisLikeClick}
              className={`w-8 h-8 text-[#33B0CA]   ${
                disable ? " cursor-default" : " cursor-pointer"
              }`}
            />
          </button>
        ) : (
          <button disabled={disable}>
            <FaRegThumbsUp
              onClick={handleLikeClick}
              className={`w-8 h-8 ${
                disable ? " cursor-default" : " cursor-pointer"
              }`}
            />
          </button>
        )}
        <div
          className="lg:mt-5 flex cursor-pointer text-[12px] font-[400]"
          onClick={() => setLikePopup(true)}
        >
          {likes}
          <span className="ml-[2px] ">{likes > 1 ? "Likes" : "Like"}</span>
        </div>
      </div>

      {likePopup && (
        <Popup popClose={setLikePopup} data={data} setIsLiked={setIsLiked} />
      )}
    </div>
  );
};
