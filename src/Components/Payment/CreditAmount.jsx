export const CreditAmount = ({
  data,
  creditData,
  isAgreementChecked,
  setAgreementChecked,
}) => {
  return (
    <div className="w-full lg:w-[80%] h-full">
      <p
        style={{
          clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 0% 50%)",
          maxWidth: "70%",
          padding: "0.3rem 55px 0.3rem 0",
        }}
        className="bg-[#00c3ff] text-[#fafafa] text-center lg:text-[22px] text-[16px] font-[600]  relative border-none lg:bottom-[-22px] bottom-[-17px] "
      >
        Amount Payable
      </p>

      <div className="flex flex-col rounded-[8px] justify-between border-2 border-[#ccc] min-h-[285px] w-full ">
        <div className="p-5 mt-5 py-[4px]">
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3 className="">Price(USD)</h3>
            <p className="text-right">{data?.base_usd?.toFixed(2) || 0}</p>
          </div>
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3>Taxes & Charges(USD)</h3>

            <p className="text-right">{data?.gst_amount?.toFixed(2) || 0}</p>
          </div>
          {creditData?.user_details?.state_code === "07" && (
            <div className="flex items-center justify-between py-2">
              <h3 className="text-[14px] font-[400]">CGST-9%(Output)</h3>
              <div className="text-right">
                <p className="text-[14px] font-[400] ">
                  {data?.cgst_calculate?.toFixed(2) || 0}
                </p>
              </div>
            </div>
          )}
          {creditData?.user_details?.state_code === "07" && (
            <div className="flex items-center justify-between py-2">
              <h3 className="text-[14px] font-[400]">SGST-9%(Output)</h3>
              <div className="text-right">
                <p className="text-[14px] font-[400] ">
                  {data?.sgst_calculate?.toFixed(2) || 0}
                </p>
              </div>
            </div>
          )}
          {creditData?.user_details?.state_code !== "07" && (
            <div className="flex items-center justify-between py-2">
              <h3 className="text-[14px] font-[400]">IGST-18%(Output)</h3>
              <div className="text-right">
                <p className="text-[14px] font-[400] ">
                  {data?.gst_amount?.toFixed(2) || 0}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3>Total Payable(USD)</h3>
            <p className="text-right">
              {data?.final_payable_usd?.toFixed(2) || 0}
            </p>
          </div>
        </div>
        <div className="flex items-center text-white px-5 bg-[#00c3ff] lg:text-[16px] text-[14px] font-semibold justify-between py-2">
          <h3 className="">Total Payable({data?.currency})</h3>
          <p className="text-right">
            {data?.net_payable_in_local_currency?.toFixed(2) || 0}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <div className=" text-left flex gap-1 items-center">
          <input
            checked={isAgreementChecked}
            onChange={() => setAgreementChecked(!isAgreementChecked)}
            type="checkbox"
            id="terms"
          />
          <label htmlFor="terms" className=" text-[12px] md:text-[16px]">
            I agree with the{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.mnf.ai/terms-and-conditions`}
              className="text-[#5a83ef] underline"
            >
              Terms of Payment
            </a>
          </label>
        </div>
        <div></div>
      </div>
    </div>
  );
};
