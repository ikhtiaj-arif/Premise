import React from "react";
import crossIcon from "../../../../img/Icons/crossIcon.png";

const SameNamePop = ({ popClose, title }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center  bg-[#252525b0] justify-center z-[21]">
      <div className=" h-auto mb-[20px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full sm:w-[80%] rounded-lg bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[475px]  md:mx-auto relative lg:rounded-[8px]">
         <div className="absolute right-[45%] top-[-60px] sm:top-[-12px] sm:right-[-12px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <div className="px-[20px] pt-[30px] pb-5 ">
          <h1 className="text-[16px] text-center">{title}</h1>
          <div className="w-full mx-auto text-center mt-3">
            <button
              onClick={() => popClose(null)}
              className={` text-white rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] 
                bg-[#33B0CA]`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SameNamePop;
