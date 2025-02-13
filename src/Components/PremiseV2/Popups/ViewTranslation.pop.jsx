import React from "react";
import { ToastContainer } from "react-toastify";
import { useGetPremiseTransactionQuery } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import EachTranslateeCard from "./EachTranslateeCard";

const ViewTranslationPop = ({ popClose, premiseId }) => {
  const { data: transactionData, isLoading } =
    useGetPremiseTransactionQuery(premiseId);
  console.log("transactionData", transactionData);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
      <ToastContainer />
      <div className=" h-[100vh] lg:h-[290px] mb-[20px]  lg:mb-0 xl:h-[313px] lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[617px] xl:w-[617px] md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />
        <h2 className="font-[700] text-[16px] leading-[19.4px] text-center my-[18px]">
          View Translations
        </h2>
        {isLoading ? (
          <div className="text-center my-4">Loading...</div>
        ) : (
          transactionData && (
            <div className="grid grid-cols-12 mx-[12px]">
              {transactionData?.data?.map((transaction, index) => (
                <EachTranslateeCard transaction={transaction} key={index} />
              ))}
            </div>
          )
        )}
        {/* <div className="grid grid-cols-12 mx-[12px]">
          <div className="flex flex-col col-span-3">
            <h2 className="font-[500] text-[14px] leading-[21px] text-center my-[ px]">
              Translated In
            </h2>
            <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
            <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
              Hindi
            </div>
            <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
              English
            </div>
          </div>
          <div className="flex flex-col col-span-4">
            <h2 className="font-[500] text-[14px] leading-[21px] text-center my-[ px]">
              Translation Allowed By
            </h2>
            <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
            <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
              Self
            </div>
            <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
              MD Moniruzzaman
            </div>
          </div>
          <div className="flex flex-col col-span-3">
            <h2 className="font-[500] text-[14px] leading-[21px] text-center my-[ px]">
              Translated For
            </h2>
            <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
            <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
              Self
            </div>
            <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
              Emran Khan
            </div>
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="h-[21px]" />
            <div className="h-[2px] mt-[4px] w-[86%] mx-auto " />
            <div className="my-[4px] text-center">
              <button
                className={`${"bg-[#33B0CA]"}  text-[#fafafa] rounded-[8px] leading-[24px] px-[18px] text-[12px] font-[700] `}
              >
                View
              </button>
            </div>
            <div className="my-[4px] text-center">
              <button
                className={`${"bg-[#33B0CA]"}  text-[#fafafa] rounded-[8px] leading-[24px] px-[18px] text-[12px] font-[700] `}
              >
                View
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ViewTranslationPop;
