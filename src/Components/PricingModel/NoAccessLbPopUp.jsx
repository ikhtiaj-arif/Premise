import React, { useContext, useEffect, useState } from "react";
import crossIcon from "../../img/croos_icon.png";
import congratsImg from "../../img/congratulations.png";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { URL } from "../utils";
import { useGetCalculateProductPriceQuery } from "../../app/EndPoints/premisePoolApi";

const NoAccessLbPopUp = ({ setNoAccessPopup, service, scriptId }) => {
  const { counts, setCounts } = useContext(MyContext);

  const {
    data: productPrice,
    isLoading,
    isError,
  } = useGetCalculateProductPriceQuery();

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("generate");
  const [sceneCount, setSceneCount] = useState(0);
  const [PdData, setPdData] = useState(null);

  const [showMinText, setShowMinText] = useState(false);

  useEffect(() => {
    if (productPrice) {
      const updatedProductPrice = productPrice?.PD?.find(
        (p) => p?.service_name == service
      );
      console.log("Updated Product Price:", updatedProductPrice);
      setPdData(updatedProductPrice);
    }
  }, [productPrice, service]);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSceneCountChange = (event) => {
    setSceneCount(event.target.value);
    setCounts((prev) => ({
      ...prev,
      [PdData?.service_name]: event.target.value,
    }));
  };

  const handleGoClick = () => {
    if (selectedOption === "generate") {
      if (sceneCount > 0) {
        sessionStorage.setItem("limit_counts", JSON.stringify(counts));
        navigate(`/payment`);
      } else {
        setShowMinText(true);
      }
    } else if (selectedOption === "nextPackage") {
      window.location.href = URL + "/pay/pricing";
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className=" lg:static lg:mt-0 absolute bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[850px]">
        <div className="relative">
          <div className="absolute right-[45%] top-[-60px] md:top-[-12px] md:right-[-12px]">
            <img
              src={crossIcon}
              alt=""
              className="w-[40px] h-[40px] z-[99999999] cursor-pointer"
              onClick={() => {
                setNoAccessPopup(false);
                if (scriptId) {
                  navigate(`/${scriptId}`);
                }
              }}
            />
          </div>

          <div className="md:p-10 p-2">
            <img
              src={congratsImg}
              className="w-[192px] h-[280px] mx-auto"
              alt=""
            />

            <h1 className=" text-[#252525] text-[16px] font-[600] leading-6">
              You have
              {service == "PD_OnePagers"
                ? " Generated One Pager for "
                : service == "PD_Pitches"
                ? " Created Elevator Pitch for "
                : " Generated Logline for "}
              {PdData?.current_usage} Projects in {PdData?.day_passed} days!
              That’s commendable!!
            </h1>
            <p className=" text-[#252525] text-[16px] font-[500] leading-6 mx-2 my-3">
              To carry on further :-
            </p>
            {service === "PD_loglines" ? (
              <p className=" text-center text-[#616161] text-[16px] leading-6 font-[400]">
                Buy next Juggernaut Package (Please note that the unused
                facilities of the existing Juggernaut package will be carried
                forward in the next package).
              </p>
            ) : (
              <div className="ml-2 block text-[#616161] text-[16px] leading-6 font-[400] no_access_input">
                {/* 1st option */}
                <div className="">
                  <label className="flex items-start gap-2 ">
                    <input
                      type="radio"
                      value="generate"
                      checked={selectedOption === "generate"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    <span className=" flex-1">
                      {service == "PD_OnePagers"
                        ? "Generate One Pager of "
                        : "Create Elevator Pitch of "}
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
                      {" Projects "} for USD{" "}
                      {(sceneCount * PdData?.uint_value).toFixed(2)}
                    </span>
                  </label>
                </div>
                {/* 2nd option */}
                <div>
                  <label className="flex items-start gap-2 mt-2">
                    <input
                      type="radio"
                      value="nextPackage"
                      checked={selectedOption === "nextPackage"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    <span className=" flex-1 ">
                      Buy next Juggernaut Package (Please note that the unused
                      facilities of the existing package will be carried forward
                      in the next package).
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* button */}
            <div className="text-center">
              <button
                className="bg-[#33b0ca] w-[98px] h-[42px] text-center text-[#fafafa] font-semibold text-[16px] rounded-[4px] mt-5 mb-3 py-1 px-4"
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
