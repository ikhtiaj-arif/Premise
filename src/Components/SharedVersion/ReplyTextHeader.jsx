import { BiPlusCircle } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import userIcon from "../../img/Icons/userImg.png"; // replace with your image path

const ReplyTextHeader = () => {
  // ✅ Static dummy data
  const commenterName = "John Doe";
  const commentText =
    "This is a static example comment. This is the comment that is being replied.";
  const profileImg = "https://randomuser.me/api/portraits/men/32.jpg";
  const createdTime = "2 hours ago";
  const repliesCount = 3;
  const isDeleted = false;

  return (
    <div className="mt-[10px] w-[89%]  mx-auto rounded-sm flex gap-1">
      <div className="w-full relative">
        <div className="flex gap-[8px]">
          {/* ✅ User Image */}
          <a
            data-reply
            className="h-[31.9px] w-[32px] mt-[6px]"
            rel="noreferrer"
            href="#"
          >
            <img
              src={profileImg || userIcon}
              className="h-[31.9px] w-[32px] rounded-full object-cover border border-[#eaeaea] cursor-pointer"
              alt="user"
            />
          </a>

          {/* ✅ Comment Box */}
          <div className="flex w-full gap-2">
            <div
              data-reply
              className="border w-full  bg-[#f8f8f8] border-[#EAEAEA] rounded-[8px] p-1"
            >
              <div className="flex justify-between my-1 relative">
                <div className="text-[#1E1E1E] pl-[4px] pr-[4px] pt-[4px] h-[15px] flex gap-2 items-center">
                  <a href="#">
                    <p className="notranslate text-[14px] leading-[17px] font-[500] hover:text-[#00c3ff] cursor-pointer">
                      3. {commenterName}
                    </p>
                  </a>
                </div>

                {!isDeleted && (
                  <p className="text-[14px] h-[15px] text-[#616161] font-[400] leading-5 absolute top-[-9px] right-0">
                    {createdTime}
                  </p>
                )}
              </div>

              {isDeleted ? (
                <p className="text-[#a4a4a4] text-[14px] italic font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                  Deleted
                </p>
              ) : (
                <p className="notranslate text-[#252525] text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                  {commentText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Replies / Actions */}
        {!isDeleted && (
          <div className="flex justify-between items-center my-[2px]">
            <div className="flex mb-[4px] items-center gap-[12px] text-sm ml-10 mt-[2px] leading-[20px]">
              {/* Replies Count */}
              {repliesCount > 0 ? (
                <button
                  onClick={() => alert("Opening replies...")}
                  className="flex items-center gap-[2px]"
                >
                  <BiPlusCircle className="text-[18px] font-[500] cursor-pointer text-[#252525]" />
                  <p className="text-[14px] text-[#616161] font-[500] leading-[16.52px] flex items-center gap-[4px]">
                    {repliesCount}{" "}
                    <span className="hidden lg:block">
                      {repliesCount > 1 ? "Replies" : "Reply"}
                    </span>
                  </p>
                </button>
              ) : null}

              {/* Reply Button */}
              {/* <button
                onClick={() => alert("Replying...")}
                className="flex items-center gap-1"
              >
                <IoIosUndo className="h-4 w-4 text-[#252525]" />
                <p className="text-[14px] hidden lg:block text-[#252525] font-[400] leading-[16.52px] cursor-pointer">
                  Reply
                </p>
              </button> */}

              {/* Suggestion Button */}
              {/* <button
                onClick={() => alert("Suggesting...")}
                className="px-2 rounded-[4px] pt-[2px] pb-[3px] bg-[linear-gradient(30deg,#741CFF,#00c3ff)]"
              >
                <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]">
                  Suggestion
                </p>
              </button> */}
            </div>

            {/* Add as Beat */}
            <div className="flex gap-[12px] items-center">
              <button onClick={() => alert("Added as beat")}>
                <p className="text-[14px] text-[#008000] hover:text-[#00c3ff] font-[400] leading-[16.52px]">
                  Add as Beat
                </p>
              </button>

              {/* Mobile Translator + Delete */}
              <div className="lg:hidden flex md:flex-row gap-2 items-center right-0 top-[28%]">
                <button
                  className="text-[13px] text-[#00c3ff] hover:underline cursor-pointer"
                  onClick={() => alert("Translating comment...")}
                >
                  Translate
                </button>
                <button onClick={() => alert("Deleting comment...")}>
                  <FaRegTrashAlt className="h-5 w-5 text-[#909090]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyTextHeader;
