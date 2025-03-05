import React from "react";
import { ToastContainer } from "react-toastify";
import Congrats from "../../../img/Icons/CongratsSaleDoodle.svg";
import crossIcon from "../../../img/Icons/crossIcon.png";

const CongratsPopup = ({
  popClose,
  requestType,
  selectedRequests,
  selectedUserNames,
}) => {
 
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[50vh] lg:h-[350px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[605px]  md:mx-auto relative lg:rounded-[8px]">
 
             {/* close popup */}
             <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <div className="flex flex-col  items-center justify-start">
          <img className="w-[100px] " src={Congrats} alt="Congrats"></img>
          <h2 className="font-[500] text-[20px] pt-2  text-center ">
            Congratulations On Monetizing Your Creativity!
          </h2>
        </div>
        {/* <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Your Premise Project is Up for Monetizing
        </h2> */}
        <div className="h-[1px] mt-4 w-[65%] mx-auto bg-[#a1a1a1]" />

        <p className="text-center text-[14px] mt-[40px] leading-[21px]  font-[400]  text-[#252525] "></p>
        {requestType === "sale" ? (
          <div>
            <p className="ml-[40px] text-left text-[14px] leading-[21px] my-[2px] font-[400]  text-[#252525] ">
              The monetizing preferences of the Premise Project are updated and
              has been informed
            </p>
            <p className="ml-[40px] text-left text-[14px] leading-[21px] my-[2px] font-[400]  text-[#252525] ">
              Your share of the sale proceeds will be transferred to your bank
              account as soon as the sale is effected.
            </p>
          </div>
        ) : (
          <div>
            <p className="ml-[40px] text-left text-[14px] leading-[21px] my-[2px] font-[400]  text-[#252525] ">
              {selectedUserNames?.map((name) => `${name}`).join(", ")}{" "}
              {selectedUserNames?.length === 1 ? "has" : "have"} been informed.
              Your share of the translations proceeds will be transferred to
              your bank account as soon as the Premise Project is translated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CongratsPopup;
