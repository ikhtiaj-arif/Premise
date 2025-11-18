export const CreditAmount = ({
  data,
  creditData,
  isAgreementChecked,
  setAgreementChecked,
}) => {
  return (
    <div className="border-b border-b-[#0000001A] text-[#101828] font-[400] text-sm md:text-base mb-10">
      <div className="bg-secondary  px-5  py-3 mb-5">Amount Payable</div>
      <div className="p-5 bg-[#F9FAFB] border-b border-b-[#0000001A]">
        <div className="space-y-3 ">
          <div className="flex justify-between items-center">
            <span className="text-textColor">Price (USD)</span>
            <span className="">{data?.base_usd?.toFixed(2) || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-textColor">Taxes (USD)</span>
            <span className="">{data?.gst_amount?.toFixed(2) || 0}</span>
          </div>

          {/* Tax Breakdown */}
          <div className="pl-3 space-y-2 border-l-2 border-[#0000001A] ml-3">
            {creditData?.user_details?.state_code === "07" ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-textColor">CGST-9% (Output)</span>
                  <span className="text-[#7B809A] text-[14px]">
                    {data?.cgst_calculate?.toFixed(2) || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center ">
                  <span className="text-textColor">SGST-9% (Output)</span>
                  <span className="text-[#7B809A] text-[14px]">
                    {" "}
                    {data?.sgst_calculate?.toFixed(2) || 0}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center ">
                <span className="text-textColor">IGST-18% (Output)</span>
                <span className="text-[#7B809A] text-[14px]">
                  {data?.gst_amount?.toFixed(2) || 0}
                </span>
              </div>
            )}
          </div>

          <div className="border-t text-primary border-gray-300 pt-3 flex justify-between items-center">
            <span>Total Payable (USD)</span>
            <span className=" ">
              {data?.final_payable_usd?.toFixed(2) || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-secondary text-[#0F0E13] px-4 py-3 flex justify-between items-center">
        <span className="">Total Payable ({data?.currency})</span>
        <span className="font-[600]">
          {data?.net_payable_in_local_currency?.toFixed(2) || 0}
        </span>
      </div>
    </div>
  );
};
