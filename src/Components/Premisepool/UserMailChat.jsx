import React from "react";
import { useGetPremiseUserPictureQuery } from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";
import { useSelector } from "react-redux";
const UserMailChat = ({ mail }) => {
  const user = useSelector((state) => state?.user?.id);
 
  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(mail?.sender?.id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  const formattedDate = new Date(mail?.created_at).toLocaleDateString("en-US", {
    // timeZone: "GMT",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(mail?.created_at).toLocaleTimeString("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "numeric",
    minute: "numeric",
  });


  return (
    <div>
      <div key={mail?.id} className="flex gap-2   mb-2">
        {/* <img src={userIcon} alt="" className="w-6 h-6" /> */}
        {profileImg?.[0]?.profile_photo ? (
          <img
            src={proImgUrl}
            className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
            alt=""
          />
        ) : (
          <img src={userIcon} className="h-[31.9px] w-[32px] mt-[6px]" alt="" />
        )}
        <div className=" w-full md:w-[446px]">
          <div className="border bg-[#f8f8f8] border-[#EAEAEA] w-full  rounded-[8px] px-2 py-[2px]">
            <div className="flex items-center justify-between">
            <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        mail?.sender?.id === user
                          ? `${URL}/memberpage/#/personaldetails`
                          : `${URL}/memberpage/#/user/${mail?.sender?.id}/personaldetails`
                      }
                    >
              <h4 className=" text-[#252525] font-[500] text-[14px] leading-[18px]">
                {mail?.sender?.first_name} {mail?.sender?.last_name}
              </h4>
              </a>
            </div>
            <p className="font-[400] text-[#616161] text-[12px] leading-[18px] ">
              {mail?.message}
              {/* {mail?.created_at} */}
            </p>
          </div>
          <div className=" text-[#616161] font-[400] text-[12px] leading-[18px]">
            {formattedDate}, {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMailChat;
