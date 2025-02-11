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
        className="bg-[#33B0CA] text-[#fafafa] text-center font-[600] text-[16px] relative border-none bottom-[-17px]"
      >
        Amount Payable
      </p>

      <div className="flex flex-col rounded-[8px] justify-between border-2 border-[#ccc] min-h-[285px] w-full ">
        <div className="p-5 mt-5 py-[4px]">
          <div className="flex items-center justify-between py-2">
            <h3 className="text-[14px]">Price(USD)</h3>
            <div className="text-right">
              <p className="text-[14px] font-medium">
                ${data?.total_price?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-[14px]">Membership Discount(USD)</h3>
            <div className="text-right">
              <p className="text-[14px] font-medium">
                ${data?.discounted_amount?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-[14px]">Taxes(USD)</h3>
            <div className="text-right">
              <p className="text-[14px] font-medium">
                ${data?.gst_calculate?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-[14px]">Total Payable(USD)</h3>
            <div className="text-right">
              <p className="text-[14px] font-medium">
                ${data?.net_payable?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center text-white px-5 bg-[#33B0CA] justify-between py-2">
          <h3 className="text-[14px]">
            Total Payable({data?.currency_code})
          </h3>
          <div className="text-right">
            <p className="text-[14px] font-medium">
              {(data?.net_payable *
                data?.rate)?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
