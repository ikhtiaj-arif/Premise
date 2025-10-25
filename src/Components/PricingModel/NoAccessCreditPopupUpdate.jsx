import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useCreditToUsdMutation } from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/croos_icon.png";
import { baseURL } from "../utils";

const NoAccessCreditPopupUpdate = ({
  setNoAccessPopup,
  noAccessPopup,
  remaining_credits,
  credit_rate,
  service,
}) => {
  const navigate = useNavigate();
  const required_amount = credit_rate - remaining_credits;
  const { counts, setCounts, currentUser } = useContext(MyContext);
  const [creditToUsd, { isLoading: isALoading }] = useCreditToUsdMutation();
  const id = useParams();

  const [selectedOption, setSelectedOption] = useState("topup_usd");
  const [data, setData] = useState(0);

  const [showMinText, setShowMinText] = useState(false);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCreditSystem = async (event, field) => {
    const value = event.target.value;

    // Update local state first so UI is responsive
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If cleared or 0, reset both fields
    if (value === "" || Number(value) <= 0) {
      setData({
        credits: "",
        usd_cost: "",
      });
      setCounts(0);
      return;
    }

    try {
      // Call API to convert credits ↔ USD
      const res = await creditToUsd({ [field]: value });

      if (res?.data) {
        setData(res.data);
        setCounts(res.data.usd_cost);
      }
    } catch (err) {
      console.error("Conversion failed", err);
    }
  };

  const handleGoClick = async () => {
    if (selectedOption === "topup_usd") {
      if (data?.usd_cost > 0) {
        console.log("credit in go", data);
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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className=" md:static md:mt-0 absolute bottom-0 bg-white rounded-[12px] w-[100%] md:w-[550px]">
        <div className="relative">
          <div className="absolute right-[45%] top-[-60px] md:top-[-10px] md:right-[-10px]">
            <img
              src={crossIcon}
              alt=""
              className="w-[40px] h-[40px] z-[99999999] cursor-pointer"
              onClick={() => {
                setNoAccessPopup(false);
              }}
            />
          </div>

          <div className="px-10 py-5">
            <h1 className="text-[#252525] font-[500] leading-[36px] text-[16px] text-center ">
              {noAccessPopup?.detail ||
                `Insufficient credits to perform this action`}
            </h1>
            <p className="text-[#616161] text-[14px] font-[400] text-center mb-2">
              You need {required_amount} more credits for {service}
            </p>
            <div className="p-5 flex flex-col justify-center items-center text-[#00000] text-[16px] leading-6 font-[500] no_access_input border-t border-b border-[#EAEAEA]">
              <div>
                {/* 1st option */}
                <div className="">
                  <label className="flex items-start gap-2 ">
                    <input
                      type="radio"
                      value="topup_usd"
                      checked={selectedOption === "topup_usd"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    {/* ${selectedOption === "topup_usd" ? 'text-[#00c3ff]':'text-[#616161]'} */}
                    <p className={` flex flex-col text-left gap-1 `}>
                      <span className="text-[#000000]">
                        Top Up Your Account
                      </span>
                      <span className="text-[#616161] text-[14px] font-[400]">
                        <input
                          type="number"
                          placeholder="0"
                          value={data?.credits ?? ""}
                          onChange={(e) => handleCreditSystem(e, "credits")}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-[58px] h-[26px] border border-[#EAEAEA] rounded-[4px] p-1  text-center focus:outline-none  focus:border-2 focus:border-[#00c3ff]"
                          disabled={selectedOption == "upgrade"}
                        />{" "}
                        Credits
                      </span>
                      <span className="text-[#616161] text-[14px] font-[400]">
                        <input
                          type="text"
                          placeholder="0"
                          value={data?.usd_cost ?? ""}
                          onChange={(e) =>
                            handleCreditSystem(e, "dollar_amount")
                          }
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-[58px] h-[26px] border border-[#EAEAEA] text-[#00c3ff] rounded-[4px] p-1  text-center focus:outline-none  focus:border-2 focus:border-[#00c3ff]"
                          disabled={selectedOption == "upgrade"}
                        />{" "}
                        USD
                      </span>
                    </p>
                  </label>
                </div>
                {/* 2nd option */}
                <div>
                  <label className="flex items-start gap-2 mt-3">
                    <input
                      type="radio"
                      value="upgrade"
                      checked={selectedOption === "upgrade"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    {/* ${selectedOption === "upgrade" ? 'text-[#00c3ff]':'text-[#616161]'} */}
                    <span
                      className={` flex-1 capitalize text-left text-[#00000]`}
                    >
                      Upgrade Your Package
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* button */}
            <div className="text-center">
              <button
                disabled={isALoading}
                className="bg-[linear-gradient(30deg,#741CFF,#00c3ff)] hover:shadow-md shadow-[#252525]  w-[220px] h-[32px] text-center text-[#fafafa] font-semibold text-[16px] rounded-[8px] mt-5 mb-3 py-1 px-4"
                onClick={handleGoClick}
              >
                Go
              </button>
            </div>

            {showMinText && (
              <div className="text-red-500 text-center pb-2 font-semibold">
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
