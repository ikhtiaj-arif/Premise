import { useEffect, useState } from "react";
import userIcon from "../../../img/Icons/userImg.png";

const MainComment = ({ comment }) => {
  console.log(comment);
  const [commenterName, setCommenterName] = useState();
  const commentOwnerName = `${comment?.user?.first_name} ${comment?.user?.last_name}`;
  const commentOwnerMail = comment?.user?.email;
  const modifiedEmail = commentOwnerMail?.split("@")[0];

  useEffect(() => {
    if (commentOwnerName?.length > 1) {
      setCommenterName(commentOwnerName);
    } else {
      setCommenterName(modifiedEmail);
    }
  }, [commentOwnerName, modifiedEmail]);

  console.log(commenterName);

  return (
    <div className=" px-4 py-2 ">
      <div className="flex  gap-[8px]">
        {comment?.user?.id === 1 ? (
          <div data-reply>
            <img
              src={userIcon}
              className="h-[31.9px] w-[32px] mt-[6px]"
              alt=""
            />
          </div>
        ) : (
          <a
            data-reply
            className="h-[31.9px] w-[32px]  mt-[6px]"
            target="_blank"
            rel="noreferrer"
            // href={
            //   comments?.user?.id === user
            //     ? `${URL}/memberpage/#/personaldetails`
            //     : `${URL}/memberpage/#/user/${comments?.user?.id}/personaldetails`
            // }
          >
            <img src={userIcon} className="h-[31.9px] w-[36px] " alt="" />
          </a>
        )}
        <div
          data-reply
          className="border w-[78%] md:w-[86%] lg:w-[88.8%]  mr-auto bg-[#f8f8f8] border-[#EAEAEA]  rounded-[8px] p-1 "
        >
          <div className="flex justify-between my-1 relative">
            <div
              className={`${
                comment?.is_deleted ? "text-[#a4a4a4]" : "text-[#1E1E1E]"
              } text-[#1E1E1E]  pl-[4px] pr-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center`}
            >
              {comment?.user?.id === 1 ? (
                <p className="notranslate text-[14px] font-[500] ">
                  {comment?.c_value}. {commenterName}
                  {/* <span className="ml-3 text-[#00c3ff] italic font-[400]"> {" (Character Development- Catalyze)"}</span> */}
                </p>
              ) : (
                <a
                  target="_blank"
                  rel="noreferrer"
                  // href={
                  //   comments?.user?.id === user
                  //     ? `${URL}/memberpage/#/personaldetails`
                  //     : `${URL}/memberpage/#/user/${comment?.user?.id}/personaldetails`
                  // }
                >
                  <div className="flex items-center">
                    <p className="notranslate text-[14px] leading-[17px] font-[500] hover:text-[#00c3ff]">
                      {comment?.c_value}. {commenterName}
                    </p>
                    {/* <user_type
                                  type={comment?.user?.centraldatabase?.type}
                                  user_type={
                                    comment?.user?.centraldatabase?.user_type
                                  }
                                /> */}
                  </div>
                </a>
              )}
            </div>
          </div>
          {comment?.is_deleted ? (
            <div>
              <p className="text-[#a4a4a4] text-[12px] italic lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                Deleted
              </p>
            </div>
          ) : (
            <div>
              <p className="notranslate text-[#252525] text-[12px]  lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                {comment?.text?.replace(/^\s*\d+\.\s*/, "")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComment;
