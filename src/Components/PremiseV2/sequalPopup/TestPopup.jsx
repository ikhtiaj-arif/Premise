import React, { useContext, useState } from "react";
import { MyContext } from "../../../App";
import arrowRight from "../../../img/Icons/ArrowRicon.png";
import crossIcon from "../../../img/Icons/crossIcon.png";
import dummy from "../../../img/sr/Image0000000png.png";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";

const TestPopup = () => {
  const {
    currentPopup,
    incrementPopup,
    setOpenSequalPop,
    setDoNotShowAgain,
    removeDoNotShowAgain,decrementPopup
  } = useContext(MyContext);

  const [isChecked, setIsChecked] = useState(false);

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
    setOpenSequalPop(false); // Close the popup in both cases
  };

  // Popup data array
  const popupData = [
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_01.png`,
      message: "You can read Premise in the language of your choice. 📖",
      serialNo: 1,
    },
    {
      imgUrl: dummy,
      message:
        "You can view the Premises written in a particular language by applying the language filter. 🌐",
      serialNo: 2,
    },
    // {
    //   imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_02.png`,
    //   message:
    //     "You can view the Premises written in a particular language by applying the language filter. 🌐",
    //   serialNo: 2,
    // },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_03.png`,
      message: "You can sort the Premises from oldest to latest. ⏳",
      serialNo: 3,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_04.png`,
      message: "You can sort the Premises by Popularity. ⭐",
      serialNo: 4,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_05.png`,
      message: "You can apply multiple filters simultaneously. 🔄",
      serialNo: 5,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_06.png`,
      message:
        "You can see only the Premises added by you and shared with you. 👤",
      serialNo: 6,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_07.png`,
      message:
        "You can search the Premise by name of the owner or content of the Premise. 🔍",
      serialNo: 7,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_08.png`,
      message:
        "You can view all Brainstormings on a Premise by clicking on the Premise card. 💭",
      serialNo: 8,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_09.png`,
      message:
        "You can view source Premise if the Premise you are viewing is translated from another language. 🔄🌍",
      serialNo: 9,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_10.png`,
      message: "You can add a new Premise ➕",
      serialNo: 10,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_11.png`,
      message:
        "You can filter the Premise Projects available for translations! 🌍📚",
      serialNo: 11,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_12.png`,
      message: "You can filter the Premise Projects available for sale! 💸",
      serialNo: 12,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_13.png`,
      message: "You can send message to the Premise Project owner! 📩",
      serialNo: 13,
    },
    {
      imgUrl: `https://uidemos.s3.ap-south-1.amazonaws.com/premise_sr_14.png`,
      message: "You can view Premise Project owner's profile! 👤",
      serialNo: 14,
    },

    // Add more popup data here as needed
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
                className="w-[130px] h-[118px]"
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
                className="max-w-[380.58px] max-h-[300px] shadow shadow-md rounded-md mt-4"
              />
            </div>

            <div className="flex flex-col items-center gap-[6px] mb-5 w-full">
              {currentPopup < 14 ? (
                <div className="flex items-center justify-around w-full">
                  <button
                    onClick={handlePrevPopup}
                    className="w-[130px] h-[32px]  bg-[#33b0ca] text-white rounded-[8px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center justify-center"
                  >
                    <FaArrowLeft />
                    Previous
                  </button>
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
                onChange={handleCheckboxChange}
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

export default TestPopup;
