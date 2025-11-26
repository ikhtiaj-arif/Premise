import invoiceLogo from "../../img/invoice.png";
import logo from "../../img/mnf_logo_text.png";
// import logo from "../../assets/MNF_Beta_Dark.webp";

export const CreditHeader = ({ paymentData }) => {
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
                className="logo w-[198px] md:w-[270px] h-full   "
              />
              <img
                src={invoiceLogo}
                alt="brand logo"
                className="logo hidden md:flex w-[48px] h-[48px] lg:w-[64px] lg:h-[64px] rounded-full "
              />
            </div>
            <div className="text-[16px] font-[400] leading-6 flex flex-col md:flex-row justify-between mt-1 ">
              {/* left */}
              <div className="text-left px-6 md:pl-4 pb-3 md:pb-0 space-y-1">
                <h4 className=" text-secondary text-[16px] font-[400] lg:text-[18px] lg:font-[600]">My Next Film Pvt. Ltd.</h4>
                <p>CIN - U92419DL2021PTC381570</p>
                <p>4/1, Prem Nagar, New Delhi, Delhi,</p>
                <p>PIN: 110058, India</p>
                <div>
                  <p className="mt-4">GST: 07AAOCM6290K1ZT</p>
                  <p>State Code:  07</p>
                </div>
              </div>

              {/* right */}
              <div className=" flex justify-between md:text-right text-left bg-white text-primary md:bg-[#0F0E13] md:text-white px-4 md:pr-6 pt-3 md:pt-0">
                
                <div className=" space-y-2 pb-2 lg:pb-0">
                  <h2 className=" text-secondary mb-2 text-lg md:text-[16px]">
                    Order Summary
                  </h2>
                  <p className="">
                    <span className="text-[#4A5565] md:text-white">Type :</span> {paymentData?.purchase_type ==='credit_topup' && 'Credit Topup'}
                  </p>
                  <p><span className="text-[#4A5565] md:text-white">Bill Date : </span> {getFormattedDate()}</p>
                  {
                    paymentData?.wallet_summary?.tier !=='Basic' && (
                      <p><span className="text-[#4A5565] md:text-white">Valid Upto : </span>{getFormattedDate(paymentData?.wallet_summary?.expiry_date)}</p>
                    )
                  }
                  <a className=" text-secondary underline " href="https://mnf.ai/">
                    mnf.ai
                  </a>
                </div>
                <img
                  src={invoiceLogo}
                  alt="brand logo"
                  className="logo md:hidden flex w-[48px] h-[48px] lg:w-[64px] lg:h-[64px] rounded-full "
                />
              </div>
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="mx-4 py-4 border-t-[1px] lg:border-t-0 border-t-gray-50">
            <h2 className="text-secondary text-lg font-[500] mb-4 inline-block border-b border-b-secondary">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 text-[16px] text-[#101828] font-[400]">
              <div className="space-y-2 ">
                <p>
                  <span className="text-[#364153] mr-2">Bill To :</span>{" "}
                  <span >{paymentData?.user_details?.name || paymentData?.user_details?.email}</span>
                </p>
                {/* mobile */}
                <p className="md:hidden">
                  <span className="text-[#364153] mr-2">Email Id :</span>{" "}
                  <span>{paymentData?.user_details?.email}</span>
                </p>
                <p>
                  <span className="text-[#364153] mr-2">GST Number :</span>{" "}
                  <span >{paymentData?.user_details?.gst || 'N/A'}</span>
                </p>
                {/* mobile */}
                <p className="md:hidden">
                  <span className="text-[#364153] mr-2">Contact Number :</span>{" "}
                  <span>
                    {paymentData?.user_details?.phone_number &&
                    paymentData.user_details.phone_number !== "0" ? (
                      paymentData.user_details.country_code &&
                      paymentData.user_details.country_code !== "0" ? (
                        `+${paymentData?.user_details?.country_code}-${paymentData?.user_details?.phone_number}`
                      ) : (
                        paymentData?.user_details?.phone_number
                      )
                    ) : (
                      "N/A"
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-[#364153] mr-2">Address :</span>{" "}
                  <span >{paymentData?.user_details?.address || 'N/A'}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="hidden md:flex">
                  <span className="text-[#364153] mr-2">Email Id :</span>{" "}
                  <span>{paymentData?.user_details?.email}</span>
                </p>
                <p className="hidden md:flex">
                  <span className="text-[#364153] mr-2">Contact Number :</span>{" "}
                  <span>
                    {paymentData?.user_details?.phone_number &&
                    paymentData.user_details.phone_number !== "0" ? (
                      paymentData.user_details.country_code &&
                      paymentData.user_details.country_code !== "0" ? (
                        `+${paymentData?.user_details?.country_code}-${paymentData?.user_details?.phone_number}`
                      ) : (
                        paymentData?.user_details?.phone_number
                      )
                    ) : (
                      "N/A"
                    )}
                  </span>
                </p>
                <p>
                  <span className={paymentData?.pricing_details?.currency !== "INR" ? "text-[#000000] mr-2" : "text-[#364153] mr-2"}>{paymentData?.pricing_details?.currency === "INR" ? "State Code : " : "LUT ARN :"}</span>{" "}
                  <span >{paymentData?.pricing_details?.currency === "INR" ? paymentData?.user_details?.state_code : 'AD0702250158463'}</span>
                </p>
                {
                  paymentData?.pricing_details?.currency !== "INR" && 
                  <p className=" text-[12px] ">
                    Supply meant for export under LUT without payment of IGST
                  </p>
                }
              </div>
            </div>
          </div>
    </div>
  );
};