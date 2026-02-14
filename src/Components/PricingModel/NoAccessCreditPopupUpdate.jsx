// import { useContext, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { MyContext } from "../../App";
// import { useCreditToUsdMutation } from "../../app/EndPoints/premisePoolApi";
// import crossIcon from "../../img/croos_icon.png";
// import { baseURL } from "../utils";

// const NoAccessCreditPopupUpdate = ({
//   setNoAccessPopup,
//   noAccessPopup,
//   remaining_credits,
//   credit_rate,
//   service,
// }) => {
//   const navigate = useNavigate();
//   const required_amount = credit_rate - remaining_credits;
//   const { counts, setCounts, currentUser } = useContext(MyContext);
//   const [creditToUsd, { isLoading: isALoading }] = useCreditToUsdMutation();
//   const id = useParams();

//   const [selectedOption, setSelectedOption] = useState("topup_usd");
//   const [data, setData] = useState(0);

//   const [showMinText, setShowMinText] = useState(false);

//   const handleRadioChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleCreditSystem = async (event, field) => {
//     const value = event.target.value;

//     // Update local state first so UI is responsive
//     setData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // If cleared or 0, reset both fields
//     if (value === "" || Number(value) <= 0) {
//       setData({
//         credits: "",
//         usd_cost: "",
//       });
//       setCounts(0);
//       return;
//     }

//     try {
//       // Call API to convert credits ↔ USD
//       const res = await creditToUsd({ [field]: value });

//       if (res?.data) {
//         setData(res.data);
//         setCounts(res.data.usd_cost);
//       }
//     } catch (err) {
//       console.error("Conversion failed", err);
//     }
//   };

//   const handleGoClick = async () => {
//     if (selectedOption === "topup_usd") {
//       if (data?.usd_cost > 0) {
//         console.log("credit in go", data);
//         sessionStorage.setItem("limit_counts", JSON.stringify(counts));
//         navigate(`/payment/${id?.id}`);
//       } else {
//         setShowMinText(true);
//       }
//     } else if (selectedOption === "upgrade") {
//       window.location.href = baseURL + "/pay/pricing";
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
//       <div className=" md:static pb-20 md:pb-0 md:mt-0 absolute bottom-0 bg-white rounded-[12px] w-[100%] md:w-[550px]">
//         <div className="relative">
//           <div className="absolute right-[45%] top-[-60px] md:top-[-10px] md:right-[-10px]">
//             <img
//               src={crossIcon}
//               alt=""
//               className="w-[40px] h-[40px] z-[99999999] cursor-pointer"
//               onClick={() => {
//                 setNoAccessPopup(false);
//               }}
//             />
//           </div>

//           <div className="px-10 py-5">
//             <h1 className="text-[#252525] font-[500] leading-[36px] text-[16px] text-center ">
//               {noAccessPopup?.detail ||
//                 `Insufficient credits to perform this action`}
//             </h1>
//             <p className="text-[#616161] text-[14px] font-[400] text-center mb-2">
//               You need {required_amount} more credits for {service}
//             </p>
//             <div className="p-5 flex flex-col justify-center items-center text-[#00000] text-[16px] leading-6 font-[500] no_access_input border-t border-b border-[#EAEAEA]">
//               <div>
//                 {/* 1st option */}
//                 <div className="">
//                   <label className="flex items-start gap-2 ">
//                     <input
//                       type="radio"
//                       value="topup_usd"
//                       checked={selectedOption === "topup_usd"}
//                       onChange={handleRadioChange}
//                       className="mt-1"
//                     />
//                     {/* ${selectedOption === "topup_usd" ? 'text-[#00c3ff]':'text-[#616161]'} */}
//                     <p className={` flex flex-col text-left gap-1 `}>
//                       <span className="text-[#000000]">
//                         Top Up Your Account
//                       </span>
//                       <span className="text-[#616161] text-[14px] font-[400]">
//                         <input
//                           type="number"
//                           placeholder="0"
//                           value={data?.credits ?? ""}
//                           onChange={(e) => handleCreditSystem(e, "credits")}
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           className="w-[58px] h-[26px] border border-[#EAEAEA] rounded-[4px] p-1  text-center focus:outline-none  focus:border-2 focus:border-[#00c3ff]"
//                           disabled={selectedOption == "upgrade"}
//                         />{" "}
//                         Credits
//                       </span>
//                       <span className="text-[#616161] text-[14px] font-[400]">
//                         <input
//                           type="text"
//                           placeholder="0"
//                           value={data?.usd_cost ?? ""}
//                           onChange={(e) =>
//                             handleCreditSystem(e, "dollar_amount")
//                           }
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           className="w-[58px] h-[26px] border border-[#EAEAEA] text-[#00c3ff] rounded-[4px] p-1  text-center focus:outline-none  focus:border-2 focus:border-[#00c3ff]"
//                           disabled={selectedOption == "upgrade"}
//                         />{" "}
//                         USD
//                       </span>
//                     </p>
//                   </label>
//                 </div>
//                 {/* 2nd option */}
//                 <div>
//                   <label className="flex items-start gap-2 mt-3">
//                     <input
//                       type="radio"
//                       value="upgrade"
//                       checked={selectedOption === "upgrade"}
//                       onChange={handleRadioChange}
//                       className="mt-1"
//                     />
//                     {/* ${selectedOption === "upgrade" ? 'text-[#00c3ff]':'text-[#616161]'} */}
//                     <span
//                       className={` flex-1 capitalize text-left text-[#00000]`}
//                     >
//                       Upgrade Your Package
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* button */}
//             <div className="text-center">
//               <button
//                 disabled={isALoading}
//                 className={`${
//                   isALoading
//                     ? "bg-[#99e6ff] text-[#0F0E1380]"
//                     : "bg-[#00c3ff] text-[##0F0E13]"
//                 }  px-3 h-[32px] text-[14px] w-2/4 mt-1 font-[500] rounded-[8px]`}
//                 onClick={handleGoClick}
//               >
//                 Go
//               </button>
//             </div>

//             {showMinText && (
//               <div className="text-red-500 text-center pb-2 font-semibold">
//                 Please add your preference.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoAccessCreditPopupUpdate;

import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useCreditToUsdMutation } from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/cross_icon.webp";
import banner from "../../img/topup-banner.png";
import { baseURL } from "../utils";
import "./NoAccess.css";

const NoAccessCreditPopupUpdate = ({
  setNoAccessPopup,
  noAccessPopup,
  remaining_credits,
  credit_rate,
  service,
}) => {
  // console.log("setNoAccessPopup",setNoAccessPopup);
  const navigate = useNavigate();
  const id = useParams();

  const { counts, setCounts, currentUser } = useContext(MyContext);
  const [creditToUsd, { isLoading }] = useCreditToUsdMutation();
  console.log("noAccessPopup", noAccessPopup);

  const [selectedOption, setSelectedOption] = useState("topup_usd");
  const [data, setData] = useState({ credits: "", usd_cost: "" });
  const [showMinText, setShowMinText] = useState(false);

  const required_amount = credit_rate - remaining_credits;

  /* ---------- OLD CREDIT CONVERSION LOGIC ---------- */
  const handleCreditSystem = async (event, field) => {
    const value = event.target.value;
    setShowMinText(false);

    setData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (!value || Number(value) <= 0) {
      setData({ credits: "", usd_cost: "" });
      setCounts(0);
      return;
    }

    try {
      const res = await creditToUsd({ [field]: value });

      if (res?.data) {
        setData(res.data);
        setCounts(res.data.usd_cost);
      }
    } catch (err) {
      console.error("Conversion failed", err);
    }
  };

  /* ---------- OLD GO BUTTON LOGIC ---------- */
  const handleGoClick = () => {
    if (selectedOption === "topup_usd") {
      if (data?.usd_cost > 0) {
        sessionStorage.setItem("limit_counts", JSON.stringify(counts));
        navigate(`/payment/${id?.id}`);
      } else {
        setShowMinText(true);
      }
    } else if (selectedOption === "upgrade") {
      window.location.href = baseURL + "/pay/pricing";
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[9999]">
      <div className="bg-white sm:rounded-[10px] w-full h-screen sm:w-[478px] sm:h-[642px] overflow-hidden">
        <div className="relative">
          {/* Close */}
          <div className="absolute top-[15px] right-[15px] z-[999]">
            <img
              src={crossIcon}
              alt="close"
              className="w-[28px] h-[28px] cursor-pointer"
              onClick={() => setNoAccessPopup(false)}
            />
          </div>

          {/* Banner */}
          <div className="relative">
            <img
              src={banner}
              alt="Banner"
              className="w-full h-[250px] sm:h-auto aspect-[16/9] object-cover"
            />

            <div className="w-full absolute top-[140px] sm:top-[145px] left-1/2 -translate-x-1/2 text-center px-4">
              <h1 className="text-white font-medium text-sm sm:text-lg mb-2">
                {noAccessPopup?.detail ||
                  `Insufficient credits`}
              </h1>

              <p className="text-white text-sm sm:text-base">
                You need {required_amount} additional credits to perform this
                action.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-3 sm:px-10 sm:py-5">
            <div className="border-2 border-[#741CFF33] rounded-[16px] bg-white mt-[-35px] sm:mt-[-60px] relative z-10 shadow-xl p-4 sm:p-6">
              {/* Topup Option */}
              {noAccessPopup?.msg === "LB" && (
                <div className="mb-6">
                  <label className="cursor-pointer flex items-center gap-2 mb-3">
                    <input
                      type="radio"
                      value="topup_usd"
                      checked={selectedOption === "topup_usd"}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <span className="font-semibold text-base">
                      Top Up Your Account
                    </span>
                  </label>

                  <input
                    type="number"
                    placeholder="Credits"
                    value={data.credits}
                    onChange={(e) => handleCreditSystem(e, "credits")}
                    disabled={selectedOption !== "topup_usd"}
                    className="w-full sm:w-[362px] h-[64px] rounded-[14px] px-4
                                    focus:outline-none
                                    bg-gradient-to-r from-[#741CFF]/5 to-[#00C3FF]/5

                                    text-[#111111] font-semibold text-[24px] tracking-[-0.31px]

                                    placeholder:font-normal
                                    placeholder:text-[16px]
                                    placeholder:text-[#7B809A]

                                    [appearance:textfield]
                                    [&::-webkit-outer-spin-button]:appearance-none
                                    [&::-webkit-inner-spin-button]:appearance-none mb-2"
                  />

                  <div className="relative">
                    {data.usd_cost && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-xl">
                        $
                      </span>
                    )}
                    <input
                      type="number"
                      placeholder="USD Value"
                      value={data.usd_cost}
                      onChange={(e) => handleCreditSystem(e, "dollar_amount")}
                      disabled={selectedOption !== "topup_usd"}
                      className={`w-full sm:w-[362px] h-[64px] rounded-[14px]
                                    focus:outline-none
                                    bg-gradient-to-r from-[#741CFF]/5 to-[#00C3FF]/5

                                    text-[#111111] font-semibold text-[24px] tracking-[-0.31px]

                                    placeholder:font-normal
                                    placeholder:text-[16px]
                                    placeholder:text-[#7B809A]

                                    [appearance:textfield]
                                    [&::-webkit-outer-spin-button]:appearance-none
                                    [&::-webkit-inner-spin-button]:appearance-none ${
                                      data.credits ? "pl-8 pr-4" : "px-4"
                                    }`}
                    />
                  </div>
                </div>
              )}

              {/* Upgrade Option - CONTROLLED BY API MSG */}
              {noAccessPopup?.msg === "B" && (
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    value="upgrade"
                    checked={selectedOption === "upgrade"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="font-semibold text-base">
                    Upgrade Your Package
                  </span>
                </label>
              )}
            </div>

            {/* Button */}
            <button
              disabled={isLoading}
              onClick={handleGoClick}
              className="bg-[#00C3FF] text-[#051B1A] w-full sm:w-[414px] h-[48px] font-semibold text-lg rounded-[14px] mt-10"
            >
              Go
            </button>

            {showMinText && (
              <div className="text-red-500 text-center mt-3 font-semibold">
                Please add your preference.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccessCreditPopupUpdate;
