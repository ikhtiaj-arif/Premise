import React from "react";
import {
  useGetPremiseUserPictureQuery,
  useGetUserByUserIdQuery,
} from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";
const CommentLikePopEach = ({ like }) => {
  const likedUser = like;

  const {
    data: userData,
    userLoading,
    refetch: userRefetch,
  } = useGetUserByUserIdQuery(like);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(likedUser);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  return (
    <div>
      <div className="flex gap-[16px] items-center mb-1">
        {profileImg?.[0]?.profile_photo ? (
          <img
            src={proImgUrl}
            className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
            alt=""
          />
        ) : (
          <img src={userIcon} className="h-[31.9px] w-[32px] mt-[6px]" alt="" />
        )}
        <h4 className="text-[14px] font-[500] text-[#252525]">
          {userData?.firstName} {userData?.lastName}
        </h4>
      </div>
      <div className="h-[2px] bg-[#EAEAEA] w-full " />
    </div>
  );
};

export default CommentLikePopEach;
