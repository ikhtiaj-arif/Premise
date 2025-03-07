import React, { useState } from "react";
import crossIcon from "../../../img/Icons/crossIcon.png";
import { useSaleForPremiseMutation } from "../../../app/EndPoints/premisePoolApi";
import PaymentInvoicePopup from "../../Payment/PaymentInvoicePopup";
import { toast } from "react-toastify";

const PaySalePopup = ({
  popClose,
  premiseId,
  sellingValue,
  Userid,
  refetch,
}) => {
  const [saleForPremise] = useSaleForPremiseMutation();
  const [isPayment, setPayment] = useState(false);

  const handlePayNow = () => {
    setPayment(true);
  };
  const handleSubmit = async (transaction_id) => {
    try {
      const response = await saleForPremise({
        body: {
          premise_id: premiseId,
          user_id: Userid,
          transaction_id: transaction_id,
        },
      }).unwrap();
      console.log("Success", response);
      if (response) {
        // popClose(null);
        // setPayment(null);
        // toast("Payment Successful");
        refetch();
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <div className="h-[40vh] lg:h-[350px] mb-[20px] px-[22px] lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA] lg:w-[430px] md:mx-auto relative lg:rounded-[8px]">
        {/* Close Button */}
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">

<img src={crossIcon} alt=""
  className=" text-red-500  w-8 h-8 cursor-pointer"
  onClick={() =>  popClose(null)}
/>
</div>

        {/* Title */}
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Make the Premise Project your own
        </h2>
        <div className="h-[1px] mt-[8px] w-full mx-auto bg-[#a1a1a1]" />

        {/* Description */}
        <p className="text-center text-[12px] leading-[14.5px] font-[400] my-[12px] text-[#616161] w-[80%] mx-auto">
          The Ownership of this Premise Project is available for a price of $
          {sellingValue}
        </p>

        {/* Note Section */}
        <h2 className="font-[800] text-[12px] leading-[14.5px] text-left mt-[24px]">
          Please Note :
        </h2>
        <div className="mt-[10px] pl-[8px] pr-[18px] flex gap-[4px]">
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            1.{" "}
          </p>
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            After transfer, the Premise Project will be visible in Premise Pool
            as your own Premise instead of the current owner.
          </p>
        </div>
        <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            2.{" "}
          </p>
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            You will be able to brainstorm further on the Premise and add
            comments to the Beat Sheet.
          </p>
        </div>
        <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            3.{" "}
          </p>
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            You will be able to make the Premise private.
          </p>
        </div>
        <div className="mt-[6px] pl-[8px] pr-[18px] flex gap-[4px]">
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            4.{" "}
          </p>
          <p className="text-left text-[13px] leading-[14.5px] font-[400] text-[#616161]">
            You will be able to monetize this Premise Project through sale or
            translation.
          </p>
        </div>

        {/* Pay Button */}
        <div className="w-[100px] mx-auto mt-[30px]">
          <button
            className="bg-[#33B0CA] mx-auto text-center text-[#fafafa] rounded-[8px] leading-[32px] px-[24px] text-[12px] font-[700]"
            onClick={handlePayNow}
          >
            Pay now
          </button>
        </div>
      </div>

      {isPayment && (
        <PaymentInvoicePopup popClose={popClose}
          typeOfRequest="sale"
          premise_id={premiseId}
          setPayment={setPayment}
          submit={handleSubmit}
        />
      )}
    </div>
  );
};

export default PaySalePopup;
