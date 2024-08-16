import React from "react";

const ShowLikePropPop = ({ setShowLikePopup, allLikes }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-end sm:items-center justify-center bg-[#252525b0] bg-opacity-60 z-[1]">
      <div className="bg-[#fafafa]  rounded-[8px]  shadow-lg w-full h-[65vh] sm:h-auto sm:w-[400px] relative">
        <div className="mt-[15px] mx-[30px]">
          <div className="font-[500] ">
            <p className="text-left text-[16px] text-[#252525] mb-[8px]">
              Liked By
            </p>
            <div className="h-[1px] bg-[#616161] w-full " />
          </div>
          <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
            <img
              src={crossIcon}
              alt=""
              className="  w-8 h-8 cursor-pointer "
              onClick={() => setShowLikePopup(false)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-center pb-6 font-bold">Loading...</p>
        ) : (
          <div className="max-h-[300px] premiseScroll overflow-y-auto pb-6 gap-5 mx-[30px]">
            {allLikes?.results?.map((like) => (
              <div key={like?.user?.id}>
                <div className="flex gap-4 items-center my-[8px]">
                  <img src={userIcon} className="w-8 h-8" alt="" />
                  <h4 className="text-[14px] font-[500] text-[#252525]">
                    {like?.user?.first_name} {like?.user?.last_name}
                  </h4>
                </div>
                <div className="h-[1px] bg-[#EAEAEA] w-full " />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowLikePropPop;
