import React from "react";

export const Amount = ({ data }) => {
  return (
    <div className="w-full lg:w-[80%] h-full">
      <p
        style={{
          clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 0% 50%)",
          maxWidth: "60%",
          padding: "0.3rem 55px 0.3rem 0",
        }}
        className="bg-[#33B0CA] text-[#fafafa] text-center font-[600] lg:text-[22px] text-[16px] relative border-none lg:bottom-[-22px] bottom-[-17px]"
      >
        Amount Paid
      </p>

      <div className="flex flex-col rounded-[8px] justify-between border-2 border-[#ccc] min-h-[285px] w-full ">
        <div className="p-5 mt-5 py-[4px]">
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3 className="">Price(USD)</h3>
            <p className="text-right">
              {data?.total_price?.toFixed(2) || 0}
            </p>
          </div>
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3 className="">Membership Discount(USD)</h3>

            <p className="text-right">
              {data?.discounted_amount?.toFixed(2) || 0}
            </p>
          </div>
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3 className="">Early Bird Discount(USD)</h3>

            <p className="text-right">
              {data?.early_bird_discount_amount?.toFixed(2) ||
                0}
            </p>
          </div>
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3>Taxes & Charges(USD)</h3>

            <p className="text-right">
              {data?.gst_calculate?.toFixed(2) || 0}
            </p>
          </div>
          {data?.state_code == "07" ? (
            <>
              <div className="flex items-center justify-between py-2 lg:text-[14px] text-[12px] text-[#616161] font-[400]">
                <h3 className="">CGST-9%(Output)</h3>
                <p className="text-right">
                  {data?.cgst_calculate?.toFixed(2) || 0}
                </p>
              </div>
              <div className="flex items-center justify-between py-2 lg:text-[14px] text-[12px] text-[#616161] font-[400]">
                <h3>SGST-9%(Output)</h3>
                <p className="text-right">
                  {data?.sgst_calculate?.toFixed(2) || 0}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between py-2 lg:text-[14px] text-[12px] text-[#616161] font-[400]">
              <h3 className="text-[14px]">IGST-18%(Output)</h3>
              <p className="text-right">
                {data?.gst_calculate?.toFixed(2) || 0}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] text-[#252525] font-[600]">
            <h3>Total Amount(USD)</h3>
            <p className="text-right">
              {data?.net_payable?.toFixed(2) || 0}
            </p>
          </div>
        </div>
        
        <div className="flex items-center text-white px-5 bg-[#33B0CA] lg:text-[16px] text-[14px] font-semibold justify-between py-2">
          <h3 className="">
            Total Paid({data?.currency_code})
          </h3>
          <p className="text-right">
            {(
              data?.net_payable * data?.rate
            )?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      <p className="lg:text-[20px] text-[14px] font-[500] mt-4">
        <span className=" text-[#DA2424]">Note : </span>
        <span className="text-[#616161]">
          This is the system generated invoice.
        </span>
      </p>
    </div>
  );
};