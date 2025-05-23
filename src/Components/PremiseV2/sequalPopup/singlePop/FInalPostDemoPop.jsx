import { useEffect, useState } from "react";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import premise_sr_01 from "../../../../img/sr/addPremise/Ss_file/7-1-1.webp";

const FInalPostDemoPop = ({ popClose }) => {
  const [dontShowPop, setDontShowPop] = useState(false);

  const handleCheckboxChange = () => {
    localStorage.setItem("finalPostDemoPop", true);
  };

  useEffect(() => {
    if (dontShowPop) localStorage.setItem("finalPostDemoPop", true);
    else localStorage.setItem("finalPostDemoPop", false);
  }, [dontShowPop]);

  return (
    <div>
      <div className="fixed top-0  left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[3]">
        <div className="lg:static absolute lg:mt-[50px] bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[643px]">
          <div className="relative rounded-[8px] py-3 md:py-8 bg-[#fff] ">
            <div className="absolute right-[45%] top-[-70px] lg:top-[-17px] lg:right-[-18px]">
              <img
                src={crossIcon}
                onClick={() => popClose(false)} // Use the handleClosePopup function here
                alt="close"
                className="w-[40px] h-[40px] z-[9] cursor-pointer"
              />
            </div>

            <div className="flex flex-col justify-center items-center px-2 md:px-8">
              <div className="flex flex-col items-center">
                <img
                  src={`https://uidemos.s3.ap-south-1.amazonaws.com/smiley.jpg`}
                  alt="Smile doodle"
                  className="w-[90px] md:w-[110px] h-[78px] md:h-[98px]"
                />
                {/* <h1 className="absolute left-3">{currentPopup}</h1> */}
                <p className="text-center text-[14px] md:text-[16px] font-medium text-[#33b0ca] translate-y-2">
                  Do You Know?
                </p>
              </div>

              <div className="flex flex-col items-center gap-[6px] mb-5 mt-1">
                <ul className="w-full pl-10 list-disc mt-2">
                  <li className="text-[12px] md:text-[14px]  text-[#252525] leading-4 md:leading-5 ">
                    Brainstorming with Ida on this Premise will commence in a
                    new pop up.
                  </li>
                </ul>

                <img
                  src={premise_sr_01}
                  alt="Popup Image"
                  className=" max-w-[380.58px] h-[180px] max-h-[230px] shadow shadow-md rounded-md mt-4"
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="do-not-show"
                  className="cursor-pointer"
                  // onChange={handleCheckboxChange}
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
    </div>
  );
};

export default FInalPostDemoPop;
