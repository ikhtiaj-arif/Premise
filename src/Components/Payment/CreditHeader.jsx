export const CreditHeader = ({ limitBridgePaymentData, mnf, currentUser }) => {
  //console.log("currentUser", currentUser);
  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };
  console.log("limitBridgePaymentData", limitBridgePaymentData);
  return (
    <div className="my-[1.3rem]">
      <div className="">
        <div className="space-y-2">
          <div className="flex flex-wrap items-start">
            <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
              Bill to:
            </p>
            <div className="flex-1 min-w-0">
              <p className="md:text-[16px] text-[12px] break-words">
                {currentUser?.first_name && currentUser?.last_name
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-start">
            <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
              Email Id:
            </p>
            <p className="md:text-[16px] text-[12px] break-words flex-1 min-w-0">
              {currentUser?.email || "N/A"}
            </p>
          </div>

          <div className="flex flex-wrap items-start">
            <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
              Contact Number:
            </p>
            <p className="md:text-[16px] text-[12px] break-words flex-1 min-w-0">
              {limitBridgePaymentData?.user_details?.phone_number || "N/A"}
            </p>
          </div>

          <div className="flex flex-wrap items-start">
            <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
              Address:
            </p>
            <p
              className="md:text-[16px] text-[12px] break-words flex-1 min-w-0 truncate"
              title={limitBridgePaymentData?.user_details?.address || "N/A"}
            >
              {limitBridgePaymentData?.user_details?.address
                ? limitBridgePaymentData?.user_details?.address.slice(0, 20) +
                  "..."
                : "N/A"}
            </p>
          </div>

          {limitBridgePaymentData?.user_details?.pricing_details?.currency ===
            "INR" && (
            <div className="flex flex-wrap items-start">
              <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
                GST Number:
              </p>
              <p className="md:text-[16px] text-[12px] flex-1">AA</p>
            </div>
          )}
          {limitBridgePaymentData?.pricing_details?.currency === "INR" && (
            <div className="flex flex-wrap items-start">
              <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
                State Code:
              </p>
              <p className="md:text-[16px] text-[12px] flex-1">
                {limitBridgePaymentData?.user_details?.state_code}
              </p>
            </div>
          )}
          {limitBridgePaymentData?.pricing_details?.currency !== "INR" && (
            <div className="flex flex-wrap items-start">
              <p className="md:text-[16px] text-[12px] w-[130px] md:w-[180px] shrink-0">
                LUT ARN :
              </p>
              <p className="md:text-[16px] text-[12px] flex-1">
                AD0702250158463
              </p>
            </div>
          )}
          {limitBridgePaymentData?.pricing_details?.currency !== "INR" && (
            <div className="block">
              <p className="md:text-[12px] w-full text-[12px]">
                Supply meant for export under LUT without payment of IGST
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
