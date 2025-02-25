import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useTranslatePremiseV2Mutation } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import { sortedLanguages } from "../../Premisepool/Languages";
import PaymentInvoicePopup from "../../Payment/PaymentInvoicePopup";

const TransInOtherLang = ({
  popClose,
  id,
  user,
  source_language,
  project_id,
  refetch,
}) => {
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatePremise] = useTranslatePremiseV2Mutation();
  const [isPayment, setPayment] = useState(false);

  const handleOptionChange = (e) => {
    setTargetLanguage(e.target.value);
  };
  const handlePayNow = () => {
    setPayment(true);
  };

  const handleTranslationSubmit = async (transaction_id) => {
    try {
      const data = {
        premise_id: id,
        // request_type: "Translation",
        target_language: targetLanguage,
        user_id: user,
        transaction_id: transaction_id,
      };

      const response = await translatePremise(data);

      if (response) {
        toast.success("Translation successful!");
        if (response) {
          popClose(null);
          refetch();
        }
      } else {
        toast.error("Failed to translate. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <ToastContainer />
      <div className=" h-[100vh] lg:h-[484px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[430px]  md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Translate the Premise Project in another Language
        </h2>
        <div className="h-[1px] mt-[8px] w-full mx-auto bg-[#a1a1a1]" />
        <div>
          <p className="text-center text-[12px] leading-[14.5px] font-[400] my-[12px] text-[#616161] w-[80%] mx-auto">
            You can translate this Premise Project in any number of languages
            for a price of $PQR/3 per Language.
          </p>

          <h2 className="font-[700] text-[12px] leading-[14.5px] text-left mt-[24px]">
            Please Note :
          </h2>
          <div className="mt-[10px] pl-[8px] pr-[18px] flex gap-[4px]">
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              1.{" "}
            </p>
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              All components of the Premise Project viz Premise, comments,
              replies, brainstorms, suggestions, etc will be translated in
              Language.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              2.{" "}
            </p>
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              The translated Premise Project will be posted in Premise Pool as
              your own Premise.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              3.{" "}
            </p>
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to brainstorm further on the translated Premise
              and add comment etc to the Beat Sheet.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              4.{" "}
            </p>
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to make the translated Premise Project private.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              5.{" "}
            </p>
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will be able to monetize the translated Premise Project
              through sale at a price determined by you.
            </p>
          </div>
          <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              6.{" "}
            </p>
            <p className="text-left text-[12px] leading-[14.5px] font-[400]  text-[#616161] ">
              You will also be entitled to monetize the translated Premise
              Project by allowing it’s further translation in any number of
              languages for a minimum value of $PQR X 1.2. However, 1/3 of the
              sale proceeds above $PQR will be retained by My Next Film.
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
        <div className="w-[100px] mx-auto mt-[12px]">
          <button
            onClick={handlePayNow}
            className={`${"bg-[#33B0CA]"} mx-auto text-center text-[#fafafa] rounded-[8px] leading-[32px] px-[24px] text-[12px] font-[700] `}
          >
            Pay now
          </button>
        </div>
      </div>

      {isPayment && (
        <PaymentInvoicePopup
          typeOfRequest="translate"
          premise_id={id}
          setPayment={setPayment}
          submit={handleTranslationSubmit}
        />
      )}
    </div>
  );
};

export default TransInOtherLang;
