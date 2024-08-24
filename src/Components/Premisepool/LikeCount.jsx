import React from "react";
import { useGetPremiseUserPictureQuery } from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";

const LikeCount = ({ like }) => {
  console.log(like?.user);
  const likedUser = like?.user?.id;
  const firstName = like?.user?.first_name;
  const lastName = like?.user?.last_name;
  const email = like?.user?.email;
  const username = email.split("@")[0];

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(likedUser);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  return (
    <div>
      <div className="flex gap-[16px] items-center my-[8px]">
        {profileImg?.[0]?.profile_photo ? (
          <img src={proImgUrl} className="w-8 h-8 rounded-full" alt="" />
        ) : (
          <img src={userIcon} className="w-8 h-8" alt="" />
        )}
        {firstName ? (
          <h4 className="text-[14px] font-[500] text-[#252525]">
            {firstName} {lastName}
          </h4>
        ) : (
          <h4 className="text-[14px] font-[500] text-[#252525]">{username}</h4>
        )}
      </div>
      <div className="h-[1px] bg-[#EAEAEA] w-full " />
    </div>
  );
};

export default LikeCount;
