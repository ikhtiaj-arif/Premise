import React from "react";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import oppsPopup from "../../../../img/oopsImg.webp";

const WentWrongPop = ({ popClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[65%] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <div className=" h-[30vh] lg:h-[292px] mb-[20px] px-[22px] bottom-0 lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[634px]  md:mx-auto relative lg:rounded-[8px]">
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <div className="px-[14px] md:px-[20px] py-12 md:py-[30px]">
          <div className="flex items-center justify-center pt-[10px] pb-[26px]">
            <img className="w-[124px] h-[129px]" src={oppsPopup} alt="" />
          </div>
          <div>
            <h1 className="text-[16px] text-center font-[400]">
              The Requested action could not be completed as the server is busy.
            </h1>
            <h1 className="text-[16px] font-[600] text-center">
              Please try again after some time.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WentWrongPop;
