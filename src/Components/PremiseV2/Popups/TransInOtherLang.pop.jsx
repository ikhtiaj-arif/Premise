import { useContext, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardBackspace } from "react-icons/md";
import { MyContext } from "../../../App";
import {
  useGetOnePremiseQuery,
  useTranslatePremiseV2Mutation,
} from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import PaymentInvoicePopup from "../../Payment/PaymentInvoicePopup";
import { sortedLanguages } from "../../Premisepool/Languages";

const TransInOtherLang = ({
  popClose,
  id,
  user,
  source_language,
  project_id,
  refetch,
  fromNew,
}) => {
  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

  useEffect(() => {
    if (id) premiseRefetch();
  }, [id]);

  const { projectRefetch } = useContext(MyContext);
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

      const res = await translatePremise(data);

      if (res) {
        projectRefetch();
        refetch();
      }
    } catch (error) {
      //toast.error("An error occurred while submitting.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-screen flex items-end sm:items-center bg-[#252525b0] justify-center z-[21]">
      {/* <ToastContainer /> */}
      <div
        className={`h-[91vh] pt-2 sm:h-[476px] px-[22px] ${
          fromNew ? "mt-0" : "mt-[60px]"
        }  xl:mt-[100px] w-full sm:w-[90%] md:w-[80%] bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[530px]  md:mx-auto rounded-[8px]`}
      >
        <div className=" relative">
          {/* close popup */}
          {/* close popup */}
          <div className="hidden sm:block absolute top-[-24px] right-[-40px] ml-4 ">
            <img
              src={crossIcon}
              alt=""
              className=" text-red-500  w-8 h-8 cursor-pointer"
              onClick={() => popClose(null)}
            />
          </div>
          <div className="flex items-center gap-1">
            <div className="sm:hidden ">
              <MdKeyboardBackspace
                alt=""
                className="text-[#252525] text-left text-[32px] cursor-pointer "
                onClick={() => popClose(null)}
              />
            </div>
            <h2 className="font-[600] text-[16px] leading-[19.9px] text-center mt-[18px]">
              Translate the Premise Project into another Language
            </h2>
          </div>
          <div className="h-[1px] mt-[8px] w-full mx-auto bg-[#a1a1a1]" />
          <div className=" h-[300px] overflow-y-auto lg:h-full lg:overflow-y-hidden">
            <p className="text-center text-[14px] leading-[14.5px] font-[400] my-[12px] text-[#616161] w-[80%] mx-auto">
              You can translate this Premise Project in any number of languages
              for a price of ${Number(premiseData?.pqr_value).toFixed(2)} per
              Language.
            </p>

            <h2 className="font-[500] text-[14px] leading-[14.5px] text-left mt-[24px]">
              Please Note :
            </h2>
            <div className="mt-[10px] pl-[8px] pr-[18px] flex gap-[4px]">
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                1.{" "}
              </p>
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                All components of the Premise Project viz Premise, comments,
                replies, brainstorms, suggestions, etc will be translated in
                Language.
              </p>
            </div>
            <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                2.{" "}
              </p>
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                The translated Premise Project will be posted in Premise Pool as
                your own Premise.
              </p>
            </div>
            <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                3.{" "}
              </p>
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                You will be able to brainstorm further on the translated Premise
                and add comment etc to the Beat (event) Sheet.
              </p>
            </div>
            <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                4.{" "}
              </p>
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                You will be able to make the translated Premise Project private.
              </p>
            </div>
            <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                5.{" "}
              </p>
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                You will be able to monetize the translated Premise Project
                through sale at a price determined by you.
              </p>
            </div>
            <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                6.{" "}
              </p>
              <p className="text-left text-[14px] leading-[14.5px] font-[400]  text-[#616161] ">
                You will also be entitled to monetize the translated Premise
                Project by allowing it’s further translation in any number of
                languages for a minimum value of $
                {Number(premiseData?.pqr_value).toFixed(2)}. However, 1/3 of the
                sale proceeds above ${Number(premiseData?.pqr_value).toFixed(2)}{" "}
                will be retained by My Next Film.
              </p>
            </div>
          </div>

          <div
            className={`h-[31px] mt-[18px] relative col-span-6 md:col-span-4  bg-[#fafafa]  rounded-[8px] border-[2px]  w-[82%] xxs:w-[74%] mx-auto`}
          >
            <select
              className="block appearance-none bg-[#fafafa] pl-[21px] h-[27px] rounded-[8px]  w-full px-[8px] text-[14px] text-[#616161] leading-[18px] focus:outline-none"
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
            <div className="absolute inset-y-0 right-[10px] md:right-[30px] bg-[#fafafa] flex items-center pointer-events-none">
              <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
            </div>
          </div>
          <div className="w-[110px] mx-auto py-[12px]">
            {targetLanguage ? (
              <button
                onClick={handlePayNow}
                className={`${"bg-[#00c3ff]"} mx-auto text-center text-[#fafafa] rounded-[8px] leading-[32px] px-[24px] text-[14px] font-[700] `}
              >
                Pay now
              </button>
            ) : (
              <button
                className={`${"bg-[#ACDDE7] text-white"} mx-auto text-center text-[#fafafa] rounded-[8px] leading-[32px] px-[16px] text-[14px] font-[700] cursor-not-allowed `}
              >
                Pay now
              </button>
            )}
          </div>
        </div>
      </div>
      {isPayment && (
        <PaymentInvoicePopup
          refetch={refetch}
          popClose={popClose}
          typeOfRequest="translate"
          premise_id={id}
          setPayment={setPayment}
          submit={handleTranslationSubmit}
          fromNew={fromNew}
        />
      )}
    </div>
  );
};

export default TransInOtherLang;
