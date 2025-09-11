import React from "react";
import crossIcon from "../../img/Icons/crossIcon.png";
import userIcon from "../../img/Icons/userImg.png";
import CommentLikePopEach from "./CommentLikePopEach";
const CommentLikePopup = ({ setLikePopup, allLikes }) => {


  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-screen flex items-center justify-center bg-[#252525b0] bg-opacity-60 z-[21]">
    <div className="bg-[#fafafa]  rounded-[8px]  shadow-lg w-full h-[65vh] sm:h-auto sm:w-[400px] relative">
      <div className="mt-[15px] mx-[30px]">
        <div className="font-[500] ">
        <p className="text-left text-[16px] text-[#252525] mb-[8px]">
              Liked By
            </p>
            <div className="h-[1px] bg-[#616161] w-full "/>
          </div>
          <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
            <img src={crossIcon} alt=""
              className=" text-red-500  w-8 h-8 cursor-pointer"
              onClick={() => setLikePopup(false)}
            />
          </div>
        </div>

        {
          <div className="max-h-[300px] premiseScroll overflow-y-auto  pb-6 gap-5 mt-3 mx-[30px]">
            {allLikes?.map((like) => (
              <CommentLikePopEach
                key={like} like={like}

              >
              
              </CommentLikePopEach>
            ))}
          </div>
        }
      </div>
    </div>
  
  );
};

export default CommentLikePopup;
