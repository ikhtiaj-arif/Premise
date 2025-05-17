import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import crossIcon from "../../../img/Icons/crossIcon.png";
import premise_sr_01 from "../../../img/sr/addPremise/Image 2 variations 1.webp";
import premise_sr_02 from "../../../img/sr/addPremise/Image 2 variations 2.webp";
import premise_sr_03 from "../../../img/sr/addPremise/Image 2 variations 3.webp";

const AddPremiseNextTutorialPop = ({ setOpenAddPremiseNextPop }) => {
  const [dontShowPop, setDontShowPop] = useState(false);

  useEffect(() => {
    if (dontShowPop) localStorage.setItem("notOpenNextClickDemoPop", true);
    else localStorage.setItem("notOpenNextClickDemoPop", false);
  }, [dontShowPop]);

  console.log(dontShowPop);
  //   const {
  //     currentPopup,
  //     incrementPopup,
  //     setOpenSequalPop,
  //     setDoNotShowAgain,
  //     removeDoNotShowAgain,
  //     decrementPopup,
  //   } = useContext(MyContext);
  const [currentPopup, setCurrentPopup] = useState(1); // Default to popup 1
  const totalPopups = 4;

  useEffect(() => {
    const savedPopupNumber = parseInt(
      localStorage.getItem("AddPremiseNextPop"),
      2
    );

    if (savedPopupNumber && savedPopupNumber <= totalPopups) {
      setCurrentPopup(savedPopupNumber);
    }
  }, []);

  const [isChecked, setIsChecked] = useState(false);
  const incrementPopup = () => {
    const nextPopup = currentPopup + 1;
    if (nextPopup <= totalPopups) {
      localStorage.setItem("AddPremiseNextPop", nextPopup); // Store next popup number
      setCurrentPopup(nextPopup); // Update state
    }
  };
  const decrementPopup = () => {
    const nextPopup = currentPopup - 1;
    if (nextPopup >= 1) {
      // Ensure the popup number doesn't go below 1
      localStorage.setItem("AddPremiseNextPop", nextPopup); // Store next popup number
      setCurrentPopup(nextPopup); // Update state
    }
  };

  const handleNextPopup = () => {
    incrementPopup();
  };
  const handlePrevPopup = () => {
    decrementPopup();
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const handleClosePopup = () => {
    if (isChecked) {
      incrementPopup();
    }
    setOpenAddPremiseNextPop(false); // Close the popup in both cases
  };

  // Popup data array
  const popupData2 = [
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_01.webp`,
      message: "You can read Premise in the language of your choice. ",
      serialNo: 1,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_02.webp`,
      message:
        "You can view the Premises written in a particular language by applying the language filter. ",
      serialNo: 2,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_03.webp`,
      message: "You can sort the Premises from oldest to latest. ",
      serialNo: 3,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_04.webp`,
      message: "You can sort the Premises by Popularity. ",
      serialNo: 4,
    },
  ];

  const popupData = [
    {
      imgUrl: premise_sr_01,
      message: "You can read Premise in the language of your choice.",
      serialNo: 1,
    },
    {
      imgUrl: premise_sr_02,
      message:
        "You can view the Premises written in a particular language by applying the language filter.",
      serialNo: 2,
    },
    {
      imgUrl: premise_sr_03,
      message: "You can sort the Premises from oldest to latest.",
      serialNo: 3,
    },
  ];

  // Find the popup data that matches the current popup number
  const currentPopupData = popupData.find(
    (popup) => popup.serialNo === currentPopup
  );

  // If no data is found for the current popup, return null
  if (!currentPopupData) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className="lg:static absolute lg:mt-[50px] bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[643px]">
        <div className="relative rounded-[8px] py-8 bg-[#fff]">
          <div className="absolute right-[45%] top-[-90px] md:top-[-17px] md:right-[-18px]">
            <img
              src={crossIcon}
              onClick={handleClosePopup} // Use the handleClosePopup function here
              alt="close"
              className="w-[40px] h-[40px] z-[9] cursor-pointer"
            />
          </div>

          <div className="flex flex-col justify-center items-center px-2 md:px-8">
            <div className="flex flex-col items-center">
              <img
                src={`https://uidemos.s3.ap-south-1.amazonaws.com/smiley.jpg`}
                alt="Smile doodle"
                className="w-[110px] h-[98px]"
              />
              {/* <h1 className="absolute left-3">{currentPopup}</h1> */}
              <p className="text-center text-[16px] font-medium text-[#33b0ca] translate-y-3">
                Do You Know?
              </p>
            </div>

            <div className="flex flex-col items-center gap-[6px] mb-5 mt-1">
              <h2 className="text-[16px] font-medium text-[#252525] translate-y-3 text-center">
                {currentPopupData.message}
              </h2>

              <img
                src={currentPopupData.imgUrl}
                alt="Popup Image"
                className="max-w-[380.58px] max-h-[230px] shadow shadow-md rounded-md mt-4"
              />
            </div>

            <div className="flex flex-col items-center gap-[6px] mb-5 w-full">
              {currentPopup < 3 ? (
                <div className="flex items-center justify-around w-full">
                  {
                    <button
                      onClick={handlePrevPopup}
                      className={`w-[130px] h-[32px] ${
                        currentPopup === 1
                          ? "bg-[#33b1ca4c] cursor-default"
                          : "bg-[#33b0ca] cursor-pointer"
                      } bg-[#33b0ca] text-white rounded-[8px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center justify-center`}
                    >
                      <FaArrowLeft />
                      Previous
                    </button>
                  }
                  <button
                    onClick={handleNextPopup}
                    className="w-[130px] h-[32px]  bg-[#33b0ca] text-white rounded-[8px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center justify-center"
                  >
                    Next
                    <FaArrowRight />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleNextPopup}
                  className="w-[100px] h-[32px]  bg-[#33b0ca] text-white rounded-[8px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center justify-center"
                >
                  Let's start!
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="do-not-show"
                className="cursor-pointer"
                onChange={() => setDontShowPop(!dontShowPop)}
              />
              <label
                htmlFor="do-not-show"
                className="cursor-pointer text-sm text-gray-700"
              >
                Do not show this to me again.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPremiseNextTutorialPop;
