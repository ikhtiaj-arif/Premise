import React, { useEffect } from "react";
import { useGetLikesByPremiseIdQuery } from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/Icons/crossIcon.png";

import LikeCount from "./LikeCount";

const LikePopup = ({ setLikePopup, id }) => {

  const { data: allLikes, isLoading, refetch } = useGetLikesByPremiseIdQuery(id);

  useEffect(() => {
    if (allLikes?.results?.length > 0) {
      
    }
  }, [allLikes?.results]);




  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-end sm:items-center justify-center bg-[#252525b0] bg-opacity-60 z-[21]">
      <div className="bg-[#fafafa]  rounded-[8px]  shadow-lg w-full h-[65vh] sm:h-auto sm:w-[400px] relative">
        <div className="mt-[15px] mx-[30px]">
          <div className="font-[500] ">
            <p className="text-left text-[16px] text-[#252525] mb-[8px]">
              Liked By
            </p>
            <div className="h-[1px] bg-[#eaeaea] w-full "/>
          </div>
          <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
            <img src={crossIcon} alt=""
              className="  w-8 h-8 cursor-pointer "
              onClick={() => setLikePopup(false)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-center pb-6 font-bold">Loading...</p>
        ) : (
          <div className="h-[53vh] md:h-[300px] premiseScroll overflow-y-auto pb-6 gap-5 mx-[30px]">
            {allLikes?.results?.map((like) => (
             <LikeCount like={like} />
            ))}


          </div>
        )}
      </div>
    </div>
  );
};

export default LikePopup;
