import React from "react";
import { ToastContainer } from "react-toastify";
import crossIcon from "../../../img/Icons/crossIcon.png";
import Congrats from "../../../img/thumb.png";

const SuccessPop = ({ popClose, requestType,parentClose }) => {
  const handleClose = () => {
    popClose(null);
    parentClose(null);
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
      <ToastContainer />
      <div className=" h-[50vh] lg:h-[300px] pt-10 mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:w-[605px]  md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={handleClose}
          />
        </div>

        <div className="h-[50px] flex flex-col  items-center justify-start">
          <img className="w-[100px] " src={Congrats} alt="Congrats"></img>
          {requestType === "translation" ? (
            <h2 className="font-[500] text-[20px] pt-[40px]  text-center ">
              Translation Request Sent.
            </h2>
          ) : (
            <h2 className="font-[500] text-[20px] pt-[40px]  text-center ">
              Sale Request Sent.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPop;
