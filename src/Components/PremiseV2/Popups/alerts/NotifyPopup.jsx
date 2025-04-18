import React from "react";
import crossIcon from "../../../../img/Icons/crossIcon.png";

const NotifyPopup = ({ popClose, title }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <div className=" h-[30vh] lg:h-[205px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[550px]  md:mx-auto relative lg:rounded-[8px]">
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <div className="px-[20px] pt-[40px] pb-3 ">
          <h1 className="text-[16px] text-[#252525] font-[600] text-center">{title}</h1>
          <div className="w-full mx-auto text-center mt-3">
            <button
              onClick={() => popClose(null)}
              className={` text-white rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] 
                bg-[#33B0CA]`}
            >
              Notify me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyPopup;
