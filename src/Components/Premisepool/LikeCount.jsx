import React from "react";
import { useGetPremiseUserPictureQuery } from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";

const LikeCount = ({ like }) => {
  
  const likedUser = like?.user?.id;
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

        <h4 className="text-[14px] font-[500] text-[#252525]">
          {like?.user?.first_name} {like?.user?.last_name}
        </h4>
      </div>
      <div className="h-[1px] bg-[#EAEAEA] w-full " />
    </div>
  );
};

export default LikeCount;
