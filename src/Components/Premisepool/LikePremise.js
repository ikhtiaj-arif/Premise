import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import {
  useDeleteLikeMutation,
  useLikePremiseMutation
} from "../../app/EndPoints/premisePoolApi";
import LikePopup from "./LikePopup";
import "./Premise.css";

const LikePremise = ({ data, refetch }) => {
  const { likes, id, user,user_liked } = data;


  const [isLiked, setIsLiked] = useState();
  const [postLike, resInfo] = useLikePremiseMutation();
  const [deletePremise, deleteInfo] = useDeleteLikeMutation();
  // const {
  //   data: likedUsersList,
  //   isLoading,
  //   refetch: likedUserRefetch,
  // } = useGetLikesByPremiseIdQuery(id);
  // console.log("id", id);



  // useEffect(() => {
  //   if (likedUsersList?.results) {
  //     const likedUsersIds = likedUsersList.results.map(
  //       (user) => user?.user?.id
  //     );
  //     if (likedUsersIds.includes(user)) {
  //       setIsLiked(true);
  //     } else {
  //       setIsLiked(false);
  //     }
  //   }
  // }, [likedUsersList, user?.id]);

  const [likePopup, setLikePopup] = useState(false);
  const [disable, setDisable] = useState(false);

  // useEffect(() => {
  //   if (!likePopup) {
  //     refetch();
  //   }
  // }, [likePopup, refetch]);

  useEffect(() => {
    async function fetchData() {
      const body = {
        premise: id,
        user: user,
      };
      // const isLikeRes = await postIsLike(body);
      //console.log(isLikeRes?.data?.message);
      // setIsLiked(isLikeRes?.data?.message);
    }
    if (user && id) {
      fetchData();
    }
  }, [user, id, setIsLiked]);

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
      refetch();
    }
  };

  const handleLikeClick = async () => {
    setDisable(true);
    const postLikeResponse = await postLike(body);
    if (postLikeResponse?.data) {
      setDisable(false);
      setIsLiked(!isLiked);
      refetch();
    }
  };

  return (
    <div className="">
      <div className=" flex gap-2">
        {user_liked ? (
          <button disabled={disable}>
            <FaThumbsUp
              onClick={handleDisLikeClick}
              className={`w-8 h-8 text-[#33B0CA]  ${
                disable ? "cursor-default" : "cursor-pointer "
              }`}
            />
          </button>
        ) : (
          <button disabled={disable}>
            <FaThumbsUp
              onClick={handleLikeClick}
              className={`w-8 h-8 text-[#252525]  ${
                disable ? "cursor-default" : "cursor-pointer "
              }`}
            />
          </button>
        )}
        <div
          className={`flex items-center  text-[14px] font-[500] ${
            likes > 0
              ? "cursor-pointer  text-[14px] font-[500]"
              : "defaultCursor  text-[14px] font-[500]"
          }`}
          onClick={() => likes > 0 && setLikePopup(true)}
        >
          {likes}
          <span className="ml-[2px] ">
            {likes > 1 ? (
              <span className="like-m">Likes</span>
            ) : (
              <span className="like-m">Like</span>
            )}
          </span>
        </div>
      </div>

      {likePopup && <LikePopup setLikePopup={setLikePopup} id={id} />}
    </div>
  );
};

export default LikePremise;
