import React from "react";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import userImg from "../../../img/Icons/userImg.png";
import { URL } from "../../utils";

const HideUnhideUesr = ({ user, handleToggleCheck, selectedUserIds }) => {
  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(user?.user_id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);
  // console.log("proImgUrl", proImgUrl);

  return (
    <div>
      <div
        key={user.user_id}
        className={`flex justify-between items-center cursor-pointer font-[500] w-[374.86px] mx-auto px-[12px] my-[6px] py-[5px] rounded-[8px]  hover:bg-[#eaeaea] ${
          user.isChecked && "bg-[#33B0CA] text-[#fafafa]"
        }`}
        onClick={() => handleToggleCheck(user?.user_id)}
      >
        <div className={`flex items-center gap-[4px] text-[14px] `}>
          {profileImg?.[0]?.profile_photo ? (
            <img
              src={proImgUrl}
              className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
              alt=""
            />
          ) : (
            <img
              src={userImg}
              className="h-[31.9px] w-[32px] mt-[6px]"
              alt=""
            />
          )}

          {user && user?.firstName ? (
            <p>
              {user.firstName} {user.lastName}
            </p>
          ) : (
            <p>{user?.email.split("@")[0]} </p>
          )}
        </div>
        <input
          type="checkbox"
          className=" h-4 w-4 cursor-pointer "
          checked={selectedUserIds.includes(user?.user_id)}
        />
      </div>
      <div className="h-[1px] w-full max-w-[353px] bg-[#EAEAEA] mx-auto" />
    </div>
  );
};

export default HideUnhideUesr;
