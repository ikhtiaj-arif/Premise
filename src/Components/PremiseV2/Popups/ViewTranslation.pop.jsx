import React from "react";
import { ToastContainer } from "react-toastify";
import { useGetPremiseTransactionQuery } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import EachTranslateeCard from "./EachTranslateeCard";

const ViewTranslationPop = ({
  popClose,
  premiseId,
  popCloseCmnt,

  refetch,
  transText,
  viewText,
  handleVisibility,
  handleMonetizing,
}) => {
  const { data: transactionData, isLoading } =
    useGetPremiseTransactionQuery(premiseId);
  console.log("transactionData", transactionData);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[40vh] lg:h-[290px] mb-[20px]  lg:mb-0 xl:h-[313px] lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[617px] xl:w-[617px] md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <h2 className="font-[700] text-[16px] leading-[19.4px] text-center my-[18px]">
          View Translations
        </h2>
        {isLoading ? (
          <div className="text-center my-4">Loading...</div>
        ) : transactionData?.data?.length > 0 ? (
          <>
            <div className="grid grid-cols-12 mx-[12px] gap-2 overflow-y-auto">
              <div className="flex flex-col col-span-3 h-7">
                <h2 className="font-[500] text-[14px] leading-[21px] text-center ">
                  Translated In
                </h2>
                <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
              </div>
              <div className="flex flex-col col-span-4 h-7">
                <h2 className="font-[500] text-[14px] leading-[21px] text-center ">
                  Translation Allowed By
                </h2>
                <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
              </div>
              <div className="flex flex-col col-span-3 h-7">
                <h2 className="font-[500] text-[14px] leading-[21px] text-center ">
                  Translated For
                </h2>
                <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
              </div>
              <div className="col-span-2 flex flex-col h-7"></div>
            </div>
            <div className="h-[220px] overflow-y-auto">
              <div className="grid grid-cols-12 mx-[12px] gap-2 ">
                {transactionData?.data?.map((transaction, index) => (
                  <EachTranslateeCard
                    {...{
                      popCloseCmnt,
                      handleVisibility,
                      handleMonetizing,
                      refetch,
                      viewText,
                    }}
                    transaction={transaction}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center h-[40vh] lg:h-[209px] flex  justify-center items-center overflow-y-hidden text-gray-500">
            No translations available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTranslationPop;
