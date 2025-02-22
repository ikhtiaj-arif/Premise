import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useRequestForSaleOrTranslateMutation } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import { sortedLanguages } from "../../Premisepool/Languages";
import SuccessPop from "./SuccessPop";

const ReqTranslationPop = ({
  popClose,
  id,
  user,
  source_language,
  project_id,
}) => {
  const [targetLanguage, setTargetLanguage] = useState(null);
  const [successPop, setSuccessPop] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reqTranslation] = useRequestForSaleOrTranslateMutation();

  const handleOptionChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  const handleTranslationRequestSubmit = async () => {
    setProcessing(true);
    try {
      const data = {
        premise_id: id,
        request_type: "Translation",
        language: targetLanguage,
        user_id: user,
      };

      const response = await reqTranslation(data);

      if (response) {
        toast.success("Translation request submitted successfully!");
        setSuccessPop(true);
        setProcessing(false);
        // popClose(null); // Close the modal or pop-up
      } else {
        toast.error(
          "Failed to submit the translation request. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred while submitting the request.");
      console.error("Error:", error);
      setProcessing(false);
    }
  };

  return successPop ? (
    <SuccessPop
      requestType={"translation"}
      popClose={setSuccessPop}
      parentClose={popClose}
    />
  ) : (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[50vh] lg:h-[407px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[466px]  md:mx-auto relative lg:rounded-[8px]">
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
          Send a request to translate the Premise Project
        </h2>
        <div className="h-[1px] mt-[8px] w-full mx-auto bg-[#a1a1a1]" />
        <div>
          <p className="text-center text-[12px] leading-[14.5px] font-[400] my-[12px] text-[#616161] w-[80%] mx-auto">
            You may request the owner of this Premise Project for allowing its
            translation and copying in many languages for a price.
          </p>

          <h2 className="font-[400] text-[12px] leading-[14.5px] text-[#616161] text-left mt-[16px]">
            If Premise Project owner accepts your request :
          </h2>
          <div className="mt-[10px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              1.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              All components of the Premise Project viz Premise, comments,
              replies, brainstorms, suggestions, etc will be translated in the
              Languages of your choice.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              2.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              The translated Premise Projects will be posted in Premise Pool as
              your own Premises.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              3.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to brainstorm further on the Premises and add
              comment etc to the Beat Sheet.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              4.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to make the Premise Project private.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px]  flex gap-[4px]">
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              5.{" "}
            </p>
            <p className="text-left text-[10px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be entitled to monetize the translated Premise by
              allowing it’s further translation
            </p>
          </div>
        </div>

        <div
          className={`h-[31px] mt-[18px] relative col-span-6 md:col-span-4  bg-[#fafafa]  rounded-[8px] border-[2px] w-[76%] mx-auto`}
        >
          <select
            className="block appearance-none bg-[#fafafa] pl-[21px] h-[27px] rounded-[8px]  w-full px-[8px] text-[12px] text-[#616161] leading-[18px] focus:outline-none"
            required
            value={targetLanguage}
            onChange={handleOptionChange}
          >
            <option className="" value="" selected disabled>
              Choose the language for translation.
            </option>
            {Object.entries(sortedLanguages)?.map(([key, name]) =>
              key !== source_language ? (
                <option key={key} value={key}>
                  {name}
                </option>
              ) : null
            )}
          </select>
          <div className="absolute inset-y-0 right-[30px] bg-[#fafafa] flex items-center pointer-events-none">
            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
          </div>
        </div>
        <div className="w-[134px] mx-auto mt-[12px]">
          <button
          disabled={!targetLanguage || processing}
            onClick={handleTranslationRequestSubmit}
            className={`${ !targetLanguage ? "bg-[#616161]" : "bg-[#33B0CA]"} mx-auto text-center text-[#fafafa] rounded-[8px] leading-[32px] px-[24px] text-[12px] font-[700] `}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReqTranslationPop;
