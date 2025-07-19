import { useEffect, useState } from "react";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import premise_sr_01 from "../../../../img/sr/addPremise/Ss_file/1.webp";

const AddPremiseTutorialPop = ({ popClose }) => {
  const [dontShowPop, setDontShowPop] = useState(false);

  const handleCheckboxChange = () => {
    localStorage.setItem("NotShowAddPremise", true);
  };

  useEffect(() => {
    if (dontShowPop) localStorage.setItem("NotShowAddPremise", true);
    else localStorage.setItem("NotShowAddPremise", false);
  }, [dontShowPop]);

  return (
    <div>
      <div className="fixed top-0  left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
        <div className="lg:static absolute lg:mt-[100px] bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[623px]">
          <div className="relative rounded-[8px] py-3  bg-[#fff] ">
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
                  className="w-[70px]"
                />
                {/* <h1 className="absolute left-3">{currentPopup}</h1> */}
                <p className="text-center text-[14px] md:text-[16px] font-medium text-[#33b0ca]">
                  Do You Know?
                </p>
              </div>

              <div className="flex flex-col items-center gap-[6px] mb-5 mt-1">
                <ul className="w-full pl-10 list-disc mt-2">
                  <li className="text-[12px] md:text-[14px] text-[#252525] leading-4 md:leading-5 ">
                    {" "}
                    Premise is the{" "}
                    <span className="font-[600]">Central Idea</span> of the
                    film.{" "}
                  </li>
                  <li className="text-[12px] md:text-[14px]  text-[#252525] leading-4 md:leading-5 ">
                    {" "}
                    Premise is stated in less than{" "}
                    <span className="font-[600]">30 words</span>.
                  </li>
                  <li className="text-[12px] md:text-[14px]  text-[#252525] leading-4 md:leading-5 ">
                    {" "}
                    Premise starts with{" "}
                    <span className="font-[600]">"What if..."</span> and creates
                    a<span className="font-[600]"> hypothetical situation</span>{" "}
                    in which different aspects of the film e.g. Plot and
                    Sub'plots, Characters and their Journeys, Scenes, Dialogues
                    etc. are generated.
                  </li>
                  <li className="text-[12px] md:text-[14px]  text-[#252525] leading-4 md:leading-5 ">
                    {" "}
                    You can choose the language of your Premise.
                  </li>
                </ul>{" "}
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
                <img
                  src={premise_sr_01}
                  alt="PopupImage"
                  className=" max-w-[200px]  shadow-md rounded-md mt-4"
                />
              </div>

              <button
                onClick={() => popClose(false)}
                className="w-[100px] h-[32px]  bg-[#33b0ca] text-white rounded-[8px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center justify-center"
              >
                Let's start!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPremiseTutorialPop;
