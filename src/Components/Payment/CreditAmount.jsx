export const CreditAmount = ({
  paymentData
}) => {
  return (
    <div  className="border-b border-b-[#0000001A] text-[#101828] font-[400] text-base mb-10">
      <div className="bg-secondary text-[#0F0E13] px-5  py-3 mb-5">
        Amount Payable
      </div>
      <div className="p-5 bg-[#F9FAFB] border-b border-b-[#0000001A]">
        <div className="space-y-3 ">
          <div className="flex justify-between items-center">
            <span className="text-textColor">Price (USD)</span>
            <span className="">${paymentData?.pricing_details?.base_usd?.toFixed(2) || 0.00}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-textColor">Taxes & charges (USD)</span>
            <span className="">${paymentData?.pricing_details?.gst_amount?.toFixed(2) || 0.00}</span>
          </div>

          {/* Tax Breakdown */}
          <div className="pl-3 space-y-2 border-l-2 border-[#0000001A] ml-3">
            {
              paymentData?.user_details?.state_code === "07" ?
              <>
                <div className="flex justify-between items-center ">
                  <span className="text-textColor">CGST-9% (Output)</span>
                  <span className="text-[#7B809A] text-[14px]">{paymentData?.pricing_details?.cgst_amount?.toFixed(2) || 0.00}</span>
                </div>
                <div className="flex justify-between items-center ">
                  <span className="text-textColor">SGST-9% (Output)</span>
                  <span className="text-[#7B809A] text-[14px]">{paymentData?.pricing_details?.sgst_calculate?.toFixed(2) || 0.00}</span>
                </div>
              </> :
              <div className="flex justify-between items-center ">
                <span className="text-textColor">IGST-18% (Output)</span>
                <span className="text-[#7B809A] text-[14px]">{paymentData?.pricing_details?.gst_amount?.toFixed(2) || 0.00}</span>
              </div>
            }
          </div>

          {
            paymentData?.pricing_details?.currency == "INR" &&
            <div className="border-t text-primary border-gray-300 pt-3 flex justify-between items-center">
              <span >Total Payable (USD)</span>
              <span className=" ">${paymentData?.pricing_details?.final_payable_usd?.toFixed(2) || 0.00}</span>
            </div>
          }

          
        </div>
      </div>
      <div className="bg-secondary text-[#0F0E13] px-4 py-3 flex justify-between items-center">
        {(() => {
          const isINR = paymentData?.pricing_details?.currency === "INR";
          const currencySymbol = isINR ? "₹" : "$";
          const amount = isINR
            ? paymentData?.pricing_details?.net_payable_in_local_currency ?? 0.00
            : paymentData?.pricing_details?.final_payable_usd ?? 0.00;

          return (
            <>
              <span>Total Payable ({isINR ? "INR" : "USD"})</span>
              <span className="font-[600]">
                {currencySymbol}{amount.toFixed(2)}
              </span>
            </>
          );
        })()}
      </div>

    </div>
  );
};