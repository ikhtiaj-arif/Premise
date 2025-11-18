import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import { useActivateFreeMutation } from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/croos_icon.png";
import oopsImg from "../../img/oopsImg.webp";
import welcomeImg from "../../img/welcome.webp";
import { URL } from "../utils";

const NoAccessPopUp = ({ setNoAccessPopup, noAccessPopup }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(MyContext);

  console.log("noAccessLbPopup", noAccessPopup);

  const [selectedOption, setSelectedOption] = useState("privileged");

  const [activateFree, { isLoading: isALoading }] = useActivateFreeMutation();

  useEffect(() => {
    setSelectedOption(
      noAccessPopup?.ShowFreeTrialActavation == "Yes"
        ? "activate"
        : "privileged"
    );
  }, [noAccessPopup]);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleGoClick = async () => {
    if (selectedOption === "privileged") {
      window.location.href = URL + "/pay/pricing/#privileges";
    } else if (selectedOption === "nextPackage") {
      window.location.href = URL + "/pay/pricing";
    } else if (selectedOption === "activate") {
      const data = {
        user: currentUser?.id,
      };
      const res = await activateFree(data);
      console.log("activateFree success", res);
      if (res?.data?.status == "success") {
        toast("Successfully activated Free Trial Package.");
        setNoAccessPopup(null);
        window.location.reload();
      }
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className=" md:static lg:mt-0 absolute bottom-0 bg-white rounded-[12px] w-[100%] md:w-[643px]">
        <div className="relative">
          <div className="absolute right-[45%] top-[-60px] md:top-[-10px] md:right-[-10px]">
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
                noAccessPopup?.ShowFreeTrialActavation === "Yes"
                  ? welcomeImg
                  : oopsImg
              }
              className="w-[160px] h-[150px] mx-auto"
              alt=""
            />

            <h1 className="text-[#252525] font-[600] leading-[36px] text-[16px] mt-4">
              You do not have sufficient privileges to use this functionality.
            </h1>

            <p className=" text-[#252525] text-[16px] font-[500] leading-6 mx-2 my-3">
              To carry on further :-
            </p>

            <div className="ml-2 block text-[#616161] text-[16px] leading-6 font-[400] no_access_input">
              {/* 1st option */}
              {noAccessPopup?.ShowFreeTrialActavation == "Yes" && (
                <div className="mb-1">
                  <label className="flex items-start gap-2 ">
                    <input
                      type="radio"
                      value="activate"
                      checked={selectedOption === "activate"}
                      onChange={handleRadioChange}
                      className="mt-1"
                    />
                    <span className=" flex-1"> Activate Free Trial</span>
                  </label>
                </div>
              )}
              {/* 1st option */}
              <div>
                <label className="flex items-start gap-2 mt-2">
                  <input
                    type="radio"
                    value="privileged"
                    checked={selectedOption === "privileged"}
                    onChange={handleRadioChange}
                    className="mt-1"
                  />
                  <span className=" flex-1 ">Become a Privileged member</span>
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
                  <span className=" flex-1 ">Buy a Juggernaut package.</span>
                </label>
              </div>
            </div>

            {/* button */}
            <div className="text-center">
              <button
                className="bg-[#00c3ff] w-[98px] h-[42px] text-center text-[#fafafa] font-semibold text-[16px] rounded-[4px] mt-4 mb-2 py-1 px-4"
                onClick={handleGoClick}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccessPopUp;
