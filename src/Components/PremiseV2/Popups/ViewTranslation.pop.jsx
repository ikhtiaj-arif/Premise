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
  handleMonetizing, }) => {
  const { data: transactionData, isLoading } =
    useGetPremiseTransactionQuery(premiseId);
  console.log("transactionData", transactionData);



  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[100vh] lg:h-[290px] mb-[20px]  lg:mb-0 xl:h-[313px] lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[617px] xl:w-[617px] md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt="Close"
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
        ) : transactionData?.data?.length > 0 ? (
          <div className="grid grid-cols-12 mx-[12px] h-[230px] overflow-y-auto">
            {transactionData.data.map((transaction, index) => (
              <EachTranslateeCard
                {...{
                  popCloseCmnt,
                  handleVisibility,
                  handleMonetizing,
                  refetch,
                  viewText,

                }}
                transaction={transaction} key={index} />
            ))}
          </div>
        ) : (
          <div className="text-center my-4 text-gray-500">
            No translations available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTranslationPop;
