import React, { useContext, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { MyContext } from "../../../App";
import {
  useGetPremiseUserQuery,
  useTranslatePremiseV2Mutation,
} from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import PaymentInvoicePopup from "../../Payment/PaymentInvoicePopup";
import { sortedLanguages } from "../../Premisepool/Languages";
import Popup from "../../Premisepool/Popup";
import { hideUnhidePremise } from "../../Premisepool/PreiseUtils";

const AvailableForTranslationPop = ({
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
  const [translatedPremise, setTranslatedPremise] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { projectRefetch } = useContext(MyContext);

  const {
    data: userQuery,
    isUserLoading,
    refetch: userRefetch,
  } = useGetPremiseUserQuery();

  const handleOptionChange = (e) => {
    setTargetLanguage(e.target.value);
  };
  const handlePayNow = () => {
    setPayment(true);
  };
  const [openDotMenu, setOpenDotMenu] = useState(null);
  const [hideDisable, setHideDisable] = useState(false);

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, userRefetch, setOpenDotMenu);
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
        refetch();

        const {
          text,
          bg_color,
          bg_img,
          comments,
          created_at,
          likes,
          id,
          source_language,
          updated_at,
          // project_id
        } = response?.data?.data;
        const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          day: "numeric",
          month: "short",
        });
        const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          hour: "numeric",
          minute: "numeric",
        });
        const data = {
          stylings: JSON.parse(text?.split("+")[0]),
          bg_color,
          bg_img,
          comments,
          created_at,
          // created_by,
          likes,
          id,
          source_language,
          updated_at,
          dText: text?.split("+")[1],
          formattedDate,
          formattedTime,
          user,
          handleHideUnhidePremise,
          setHideDisable,
          hideDisable,
          openDotMenu,
          project_id: response?.data?.data?.projects?.pro_uuid,
          m_value: response?.data?.data?.m_value,
        };

        setTranslatedPremise(data);
        setOpenPop(true);
        console.log("object-res", response);
        setPayment(null);
        toast.success("Translation successful!");
      } else {
        toast.error("Failed to translate. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[40vh] lg:h-[204px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[430px]  md:mx-auto relative lg:rounded-[8px]">
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
          Translate the Premise Project in Language of your choice
        </h2>
        <div className="h-[1px] mt-[8px] w-full mx-auto bg-[#a1a1a1]" />
        <div>
          <p className="text-center text-[12px] leading-[14.5px] font-[400] my-[12px] text-[#616161] w-[80%] mx-auto">
            This Premise Project is available for translation and copying in
            many languages.
          </p>
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
            disabled={!targetLanguage || isProcessing} // Disable if no language is selected or already processing
            className={`mx-auto text-center rounded-[8px] text-white leading-[32px] px-[24px] text-[12px] font-[700] ${
              !targetLanguage || isProcessing
                ? "bg-[#ACDDE7] cursor-not-allowed"
                : "bg-[#33B0CA] "
            }`}
          >
            {isProcessing ? "Processing..." : "Pay now"}
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

      {openPop && translatedPremise && (
        <Popup
          popClose={() => {
            setOpenPop(null);
            setTranslatedPremise(null);
            // setAddPopup(null);
          }}
          setIsLiked={setIsLiked}
          data={translatedPremise}
          refetch={refetch}
          projectRefetch={projectRefetch}
        />
      )}
    </div>
  );
};

export default AvailableForTranslationPop;
