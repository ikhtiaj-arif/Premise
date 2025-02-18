import React from "react";
import { useSelector } from "react-redux";
import { useGetPremiseUserPictureQuery } from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";
import UserType from "./UserType";
import { FaRegTrashAlt } from "react-icons/fa";
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

  const handleDeleteMessage = async (id) => {
console.log(id, "delete");
  }

  // console.log(mail);
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
        <div className=" w-[270px] md:w-[446px]">
          <div className="border bg-[#f8f8f8] break-words border-[#EAEAEA] w-full  rounded-[8px] px-2 py-[2px]">
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
                {mail?.sender?.first_name && mail?.sender?.last_name ? (
                  <div className="flex items-center">
                    <h4 className="notranslate text-[#252525] font-[500] text-[14px] leading-[18px]">
                      {mail?.sender?.first_name} {mail?.sender?.last_name}
                    </h4>
                    <UserType
                      type={mail?.sender?.centraldatabase?.type}
                      user_type={mail?.sender?.centraldatabase?.user_type}
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <h4 className="notranslate text-[#252525] font-[500] text-[14px] leading-[18px]">
                      {mail?.sender?.email.split("@")[0]}
                    </h4>
                    <UserType
                      type={mail?.sender?.centraldatabase?.type}
                      user_type={mail?.sender?.centraldatabase?.user_type}
                    />
                  </div>
                )}
              </a>
            </div>
            <p className="font-[400] text-[#616161] text-[12px] leading-[18px] ">
              {mail?.message}
              {/* {mail?.created_at} */}
            </p>
          </div>
          <div className=" text-[#616161] font-[400] text-[10px] leading-[14px] ml-[3px]">
            {formattedDate}, {formattedTime}
          </div>
        </div>
        {mail?.sender?.id === user && (
          <button
            data-reply
            // disabled={disableD}
            onClick={() => {
              handleDeleteMessage(mail?.id);
            }}
            // className={` ${
            //   disableD ? "cursor-default" : "cursor-pointer"
            // }`}
          >
            <FaRegTrashAlt className="h-5 w-5 text-[#909090] " />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserMailChat;
