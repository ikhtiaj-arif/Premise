import invoiceLogo from "../../img/invoice.png";
import logo from "../../img/mnf_logo_text.png";
// import logo from "../../assets/MNF_Beta_Dark.webp";

export const CreditHeader = ({ limitBridgePaymentData, mnf, currentUser }) => {
  const getFormattedDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    if (isNaN(date)) return ""; // safeguard for invalid date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className=" pt-2 md:pb-2 md:border-b-2 bg-[#0F0E13] text-white">
        <div className="flex  justify-between items-center w-full px-4">
          <img
            src={logo}
            alt="brand logo"
            className="logo w-[150px] md:w-[200px] h-full   "
          />
          <img
            src={invoiceLogo}
            alt="brand logo"
            className="logo hidden md:flex w-[64px] h-[64px] rounded-full "
          />
        </div>
        <div className="text-sm lg:text-[16px] leading-6 flex flex-col md:flex-row justify-between mt-1 ">
          {/* left */}
          <div className="text-left px-6 md:pl-4 pb-3 md:pb-0 space-y-1">
            <h4 className=" text-secondary text-[18px] font-[600]">
              My Next Film Pvt. Ltd.
            </h4>
            <p>CIN - U92419DL2021PTC381570</p>
            <p>4/1, Prem Nagar, New Delhi, Delhi,</p>
            <p>PIN: 110058, India</p>
            <div>
              <p className="mt-4">GST: 07AAOCM6290K1ZT</p>
              <p>State Code: 07</p>
            </div>
          </div>

          {/* right */}
          <div className=" flex justify-between md:text-right text-left bg-white text-primary md:bg-[#0F0E13] md:text-white px-4 md:pr-6 pt-3 md:pt-0">
            <div className=" space-y-1">
              <h2 className=" text-secondary mb-2 text-base md:text-lg">
                INVOICE
              </h2>
              <p className="text-[12px]  sm:text-[14px]">
                Type :{" "}
                {limitBridgePaymentData?.purchase_type === "credit_topup" &&
                  "Credit Topup"}
              </p>
              <p>Bill Date : {getFormattedDate()}</p>
              {limitBridgePaymentData?.wallet_summary?.tier !== "Basic" && (
                <p>
                  Valid Upto :{" "}
                  {getFormattedDate(
                    limitBridgePaymentData?.wallet_summary?.expiry_date
                  )}
                </p>
              )}
              <a className=" text-secondary underline" href="https://mnf.ai/">
                mnf.ai
              </a>
            </div>
            <img
              src={invoiceLogo}
              alt="brand logo"
              className="logo md:hidden flex w-[44px] h-[44px] rounded-full "
            />
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="border-b border-b-[#0000001A] p-4">
        <h2 className="text-secondary text-base md:text-lg font-[500] mb-4 inline-block border-b border-b-secondary">
          Customer Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm lg:text-[16px] text-[#101828] font-[400]">
          <div className="space-y-2 ">
            <p>
              <span>Bill To :</span>{" "}
              <span>
                {" "}
                {currentUser?.first_name && currentUser?.last_name
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : currentUser?.email}
              </span>
            </p>
            <p>
              <span>Address :</span>{" "}
              <span>
                {limitBridgePaymentData?.user_details?.address || "N/A"}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span>Email Id :</span>{" "}
              <span>
                {limitBridgePaymentData?.user_details?.email || "N/A"}
              </span>
            </p>
            <p>
              <span>Contact Number :</span>{" "}
              <span>
                {limitBridgePaymentData?.user_details?.country_code &&
                limitBridgePaymentData?.user_details?.phone_number &&
                limitBridgePaymentData.user_details.country_code !== "0" &&
                limitBridgePaymentData.user_details.phone_number !== "0"
                  ? `+${limitBridgePaymentData.user_details.country_code}-${limitBridgePaymentData.user_details.phone_number}`
                  : "N/A"}
              </span>
            </p>
            <p>
              <span>
                {limitBridgePaymentData?.pricing_details?.currency === "INR"
                  ? "State Code : "
                  : "LUT ARN :"}
              </span>{" "}
              <span>
                {limitBridgePaymentData?.pricing_details?.currency === "INR"
                  ? limitBridgePaymentData?.user_details?.state_code
                  : "AD0702250158447"}
              </span>
            </p>
            {limitBridgePaymentData?.pricing_details?.currency !== "INR" && (
              <p className=" text-[12px] ">
                Supply meant for export under LUT without payment of IGST
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
