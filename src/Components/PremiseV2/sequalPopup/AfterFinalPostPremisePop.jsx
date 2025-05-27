import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import crossIcon from "../../../img/Icons/crossIcon.png";
import premise_sr_07 from "../../../img/sr/addPremise/Ss_file/10-1.webp";
import premise_sr_08 from "../../../img/sr/addPremise/Ss_file/10-2.webp";
import premise_sr_09 from "../../../img/sr/addPremise/Ss_file/10-3.webp";
import premise_sr_11 from "../../../img/sr/addPremise/Ss_file/11- 2.webp";
import premise_sr_12 from "../../../img/sr/addPremise/Ss_file/11- 3.webp";
import premise_sr_10 from "../../../img/sr/addPremise/Ss_file/11-1.webp";
import premise_sr_15 from "../../../img/sr/addPremise/Ss_file/12 - 3.webp";
import premise_sr_13 from "../../../img/sr/addPremise/Ss_file/12 -1.webp";
import premise_sr_14 from "../../../img/sr/addPremise/Ss_file/12 -2.webp";
import premise_sr_01 from "../../../img/sr/addPremise/Ss_file/8-1.webp";
import premise_sr_02 from "../../../img/sr/addPremise/Ss_file/8-2.webp";
import premise_sr_03 from "../../../img/sr/addPremise/Ss_file/8-3.webp";
import premise_sr_04 from "../../../img/sr/addPremise/Ss_file/9-1.webp";
import premise_sr_05 from "../../../img/sr/addPremise/Ss_file/9-2.webp";
import premise_sr_06 from "../../../img/sr/addPremise/Ss_file/9-3.webp";

const AfterFinalPostPremisePop = ({ popClose }) => {
  const [dontShowPop, setDontShowPop] = useState(false);

  useEffect(() => {
    if (dontShowPop) localStorage.setItem("afterFinalPostPremise", true);
    else localStorage.setItem("afterFinalPostPremise", false);
  }, [dontShowPop]);


  //   const {
  //     currentPopup,
  //     incrementPopup,
  //     setOpenSequalPop,
  //     setDoNotShowAgain,
  //     removeDoNotShowAgain,
  //     decrementPopup,
  //   } = useContext(MyContext);
  const [currentPopup, setCurrentPopup] = useState(1); // Default to popup 1
  const totalPopups = 16;

  useEffect(() => {
    const savedPopupNumber = parseInt(
      localStorage.getItem("afterFinalPostPremiseNo"),
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
      localStorage.setItem("afterFinalPostPremiseNo", nextPopup); // Store next popup number
      setCurrentPopup(nextPopup); // Update state
    }
  };
  const decrementPopup = () => {
    const nextPopup = currentPopup - 1;
    if (nextPopup >= 1) {
      // Ensure the popup number doesn't go below 1
      localStorage.setItem("afterFinalPostPremiseNo", nextPopup); // Store next popup number
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
    popClose(); // Close the popup in both cases
  };

  // Popup data array

  const popupData = [
    {
      imgUrl: premise_sr_01,
      message:
        "By opening it in a new tab, you can view the Premise and Brainstorms more clearly and with more information. ",
      serialNo: 1,
    },
    {
      imgUrl: premise_sr_02,
      message:
        "By changing the Visibility Settings of this Premise, you can control the privacy of this project.",
      serialNo: 2,
    },
    {
      imgUrl: premise_sr_03,
      message:
        "You can View and Delete Characters and add new Roles and Characters.",
      serialNo: 3,
    },
    {
      imgUrl: premise_sr_04,
      message: "You can copy this entire project in many other languages.",
      serialNo: 4,
    },
    {
      imgUrl: premise_sr_05,
      message:
        "By opening this project in Script pad, you can start generating Scenes etc.",
      serialNo: 5,
    },
    {
      imgUrl: premise_sr_06,
      message:
        "By setting the Monetizing Preferences of this project, you can make it available for Sale and Translation.",
      serialNo: 6,
    },
    {
      imgUrl: premise_sr_07,
      message:
        " You can read your inputs and Ida's responses in available languages.",
      serialNo: 7,
    },
    {
      imgUrl: premise_sr_08,
      message:
        "You can reply to all Brainstorms and keep expanding the thought. Ida will continue Brainstorming till 4 stages.",
      serialNo: 8,
    },
    {
      imgUrl: premise_sr_09,
      message: "You can seek suggestions for questions asked by Ida.",
      serialNo: 9,
    },
    {
      imgUrl: premise_sr_10,
      message:
        " You can view or hide the Brainstorms on any comment or it's sub thread.",
      serialNo: 10,
    },
    {
      imgUrl: premise_sr_11,
      message: " You can reject an ida suggestion.",
      serialNo: 11,
    },
    {
      imgUrl: premise_sr_12,
      message:
        "You can add any Brainstorms as a beat in the beat sheet and it will reflect in the Script pad.",
      serialNo: 12,
    },
    {
      imgUrl: premise_sr_13,
      message:
        "You can input a new thought and continue Brainstorming with Ida.",
      serialNo: 13,
    },
    {
      imgUrl: premise_sr_14,
      message:
        "You can input your thoughts in any language by using virtual keyboard. Ida will however respond in the language of the project.",
      serialNo: 14,
    },
    {
      imgUrl: premise_sr_15,
      message:
        "If you are unsure about what new thought to input, you can simply ask ida for more.",
      serialNo: 15,
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
      <div className="lg:static absolute lg:mt-[90px] bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[623px]">
        <div className="relative rounded-[8px] py-3   bg-[#fff]">
          <div className="absolute right-[45%] top-[-70px] lg:top-[-17px] lg:right-[-18px]">
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
                className="w-[70px] "
              />
              {/* <h1 className="absolute left-3">{currentPopup}</h1> */}
              <p className="text-center text-[14px] md:text-[16px] font-medium text-[#33b0ca] ">
                Do You Know?
              </p>
            </div>

            <div className="flex flex-col items-center gap-[6px] mb-5 mt-1">
              {currentPopupData?.multiMessage ? (
                <ul className="w-full pl-10 list-disc mt-2 pr-2">
                  {currentPopupData?.multiMessage.map((message) => (
                    <li className="text-[12px] md:text-[14px]  text-[#252525] leading-4 md:leading-5 ">
                      {message}
                    </li>
                  ))}
                </ul>
              ) : (
                <h2 className="text-[12px] md:text-[14px] leading-4 md:leading-5 px-2 font-medium text-[#252525]  text-center">
                  {currentPopupData.message}
                </h2>
              )}

              <img
                src={currentPopupData.imgUrl}
                alt="Popup-Image"
                className="max-w-[230px] shado shadow-md rounded-md mt-4"
              />
            </div>

            <div className="flex flex-col items-center gap-[6px] mb-2 w-full">
              {currentPopup < 15 ? (
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
                className="cursor-pointer text-[12px] md:text-sm text-gray-700"
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

export default AfterFinalPostPremisePop;
