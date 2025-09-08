import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import {
  useActivateFreeMutation,
  useGetCalculateProductPriceQuery,
} from "../../app/EndPoints/premisePoolApi";
import congratsImg from "../../img/congratulations.webp";
import crossIcon from "../../img/croos_icon.png";
import oopsImg from "../../img/oopsImg.webp";
import welcomeImg from "../../img/welcome.webp";
import { URL } from "../utils";

const NoAccessLbPopUp = ({
  setNoAccessPopup,
  service,
  noAccessLbPopup,
  divId,
}) => {
  const { counts, setCounts, currentUser } = useContext(MyContext);

  console.log("Hello from lb");

  const {
    data: productPrice,
    isLoading,
    isError,
  } = useGetCalculateProductPriceQuery();
  const [activateFree, { isLoading: isALoading }] = useActivateFreeMutation();

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("generate");
  const [sceneCount, setSceneCount] = useState(0);
  const [PpData, setPpData] = useState(null);

  const [showMinText, setShowMinText] = useState(false);

  useEffect(() => {
    if (productPrice) {
      const updatedProductPrice = productPrice?.PP?.find(
        (p) => p?.service_name === service
      );
      console.log("Updated Product Price:", updatedProductPrice);
      setPpData(updatedProductPrice);
      setSelectedOption(
        noAccessLbPopup?.ShowFreeTrialActavation === "Yes"
          ? "activate"
          : service === "PP_Brainstrom"
          ? "generate"
          : "nextPackage"
      );
    }
  }, [productPrice, service, noAccessLbPopup]);

  // useEffect(() => {
  //   if (service !== "PP_Brainstrom") {
  //     setSelectedOption("nextPackage");
  //   }
  // }, [service]);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSceneCountChange = (event) => {
    setSceneCount(event.target.value);
    if (
      service === "PP_Premises" &&
      noAccessLbPopup?.LimitStatus?.ScriptPad === "No"
    ) {
      setCounts((prev) => ({
        ...prev,
        [PpData?.service_name]: event.target.value,
        SP_Projects: event.target.value,
      }));
    } else {
      setCounts((prev) => ({
        ...prev,
        [PpData?.service_name]: event.target.value,
      }));
    }
  };

  const handleGoClick = async () => {
    console.log("counts", counts);
    if (selectedOption === "generate") {
      if (sceneCount > 0) {
        sessionStorage.setItem("pp_limit_counts", JSON.stringify(counts));
        navigate(`/payment`);
      } else {
        setShowMinText(true);
      }
    } else if (selectedOption === "nextPackage") {
      window.location.href = URL + "/pay/pricing";
    } else if (selectedOption === "activate") {
      const data = {
        user: currentUser?.id,
      };
      const res = await activateFree(data);
      console.log("activateFree success", res);
      if (res?.data?.status === "success") {
        toast("Successfully activated Free Trial Package.");
        setNoAccessPopup(null);
        window.location.reload();
        if (divId) {
          document.getElementById(`${divId}`).click();
        }
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className=" md:static lg:mt-0 absolute bottom-30 bg-white rounded-[12px] w-[100%] max-w-[850px]">
        <div className="relative">
          <div className="absolute right-[45%] top-[-60px] md:top-[-12px] md:right-[-12px]">
            <img
              src={crossIcon}
              alt=""
              className="w-[40px] h-[40px] z-[99] cursor-pointer"
              onClick={() => {
                setNoAccessPopup(null);
              }}
            />
          </div>

          <div className="px-[20px] py-[10px]">
            <img
              src={
                noAccessLbPopup?.ShowFreeTrialActavation === "Yes"
                  ? welcomeImg
                  : service !== "PP_Brainstrom" &&
                    noAccessLbPopup?.ShowFreeTrialActavation !== "Yes"
                  ? oopsImg
                  : congratsImg
              }
              className={`${
                service !== "PP_Brainstrom" &&
                noAccessLbPopup?.ShowFreeTrialActavation !== "Yes"
                  ? "w-[160px] h-[150px]"
                  : "w-[160px] h-[150px]"
              }  mx-auto`}
              alt=""
            />
            {service === "PP_Brainstrom" && (
              <h1 className=" text-[#252525] text-[16px] font-[600] leading-6">
                You have
                {service === "PP_Brainstrom" ? " Completed " : " Generated "}
                {PpData?.current_usage}{" "}
                {service === "PP_Brainstrom"
                  ? " Brainstormings with Ida "
                  : " Premises "}{" "}
                in {PpData?.day_passed} days! That’s commendable!!
              </h1>
            )}
            <p className=" text-[#252525] text-[16px] font-[500] leading-6 mx-2 my-3">
              To carry on further :-
            </p>

            <div className="ml-2 block text-[#616161] text-[16px] leading-6 font-[400] no_access_input">
              {/* 1st option */}
              {noAccessLbPopup?.ShowFreeTrialActavation === "Yes" && (
                <div className="mb-1">
                  <label className="flex items-start gap-2 ">
                    <input
                      type="radio"
                      value="activate"
                      checked={selectedOption === "activate"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    <span
                      className={`${
                        selectedOption === "activate"
                          ? "text-[#33B0CA] flex-1 cursor-pointer"
                          : "text-[#252525] flex-1 cursor-pointer"
                      }`}
                    >
                      {" "}
                      Activate Free Trial
                    </span>
                  </label>
                </div>
              )}
              {/* 1st option */}
              {service === "PP_Brainstrom" && (
                <div className="">
                  <label className="flex items-start gap-2 ">
                    <input
                      type="radio"
                      value="generate"
                      checked={selectedOption === "generate"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    <span
                      className={`flex-1 ${
                        selectedOption === "generate"
                          ? "text-[#33B0CA] flex-1 cursor-pointer"
                          : "text-[#252525] flex-1 cursor-pointer"
                      }`}
                    >
                      {"Commit to "}
                      <input
                        type="text"
                        placeholder="0"
                        value={sceneCount}
                        onChange={handleSceneCountChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onKeyDown={(e) => {
                          if (
                            !/^\d$/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className="w-[58px] h-[26px] border border-[#EAEAEA] rounded-[4px] p-1 mx-2 text-center focus:outline-none"
                        disabled={selectedOption !== "generate"}
                      />{" "}
                      {" more Brainstormings "} for USD{" "}
                      {(sceneCount * PpData?.uint_value).toFixed(2)}
                    </span>
                  </label>
                </div>
              )}
              {/* 2nd option */}
              <div>
                <label className="flex items-start gap-2 mt-2">
                  {(noAccessLbPopup?.ShowFreeTrialActavation === "Yes" ||
                    service === "PP_Brainstrom") && (
                    <input
                      type="radio"
                      value="nextPackage"
                      checked={selectedOption === "nextPackage"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                  )}
                  <span
                    className={`${
                      selectedOption === "nextPackage"
                        ? "text-[#33B0CA] flex-1 cursor-pointer"
                        : "text-[#252525] flex-1 cursor-pointer"
                    }`}
                  >
                    Buy next Juggernaut Package (Please note that the unused
                    facilities of the existing package will be carried forward
                    in the next package).
                  </span>
                </label>
              </div>
            </div>

            {/* button */}
            <div className="text-center">
              <button
                className="bg-[#33b0ca] w-[98px] h-[42px] text-center text-[#fafafa] font-semibold text-[16px] rounded-[4px] mt-4 mb-2 py-1 px-4"
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

export default NoAccessLbPopUp;
