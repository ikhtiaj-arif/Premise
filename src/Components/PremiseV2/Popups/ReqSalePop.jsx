import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRequestForSaleOrTranslateMutation } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import SuccessPop from "./SuccessPop";

const ReqSalePop = ({ popClose, id, user, source_language, project_id }) => {
  const [reqSale] = useRequestForSaleOrTranslateMutation();
  const [successPop, setSuccessPop] = useState(false);

  const handleSaleRequestSubmit = async () => {
    try {
      const data = {
        premise_id: id,
        request_type: "Sale",

        user_id: user,
      };

      const response = await reqSale(data);

      if (response) {
        toast.success("Sale request submitted successfully!");
        setSuccessPop(true); // Open success popup first
        // setTimeout(() => popClose(null), 500);
      } else {
        toast.error("Failed to submit the sale request. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the request.");
      console.error("Error:", error);
    }
  };

  return successPop ? (
    <SuccessPop requestType={"sale"} popClose={setSuccessPop} parentClose={popClose} />
  ) : (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[50vh] lg:h-[314px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[436px]  md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Make the Premise Project your own!
        </h2>
        <div className="h-[1px] mt-[8px] w-full mx-auto bg-[#a1a1a1]" />
        <div>
          <p className="text-center text-[12px] leading-[14.5px] font-[400] my-[12px] text-[#616161] w-[80%] mx-auto">
            You may request the owner of this Premise Project to transfer its
            ownership to you for a price.
          </p>

          <h2 className="font-[400] text-[12px] leading-[14.5px] text-[#616161] text-left mt-[16px]">
            If Premise Project owner accepts your request :
          </h2>
          <div className="mt-[10px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              1.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              After transfer the Premise Project will be visible in Premise Pool
              as your own Premise instead of the current owner.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              2.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to brainstorm further on the Premise and add
              comment etc to the Beat Sheet.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              3.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to make the Premise private.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              4.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to monetize this Premise Project through sale or
              Sale.
            </p>
          </div>
        </div>

        <div className="w-[134px] mx-auto mt-[12px]">
          <button
            onClick={handleSaleRequestSubmit}
            className={`${"bg-[#33B0CA]"} mx-auto text-center text-[#fafafa] rounded-[8px] leading-[32px] px-[24px] text-[12px] font-[700] `}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReqSalePop;
