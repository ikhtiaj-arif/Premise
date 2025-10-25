import { useState } from "react";
import crossIcon from "../../../img/Icons/crossIcon.png";

const PricingPopup = ({ setPricingPopup }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClosePopup = () => {
    setPricingPopup(false);
  };
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  // If no data is found for the current popup, return null
  //   if (!currentPopupData) {
  //     return null;
  //   }

  const [aiSceneValue, setAiSceneValue] = useState("");
  const [onePagerValue, setOnePagerValue] = useState("");
  const [pitchValue, setPitchValue] = useState("");

  const handleAiValueChange = (e) => {
    const input = e.target.value;
    if (/^$|^[1-9][0-9]*$/.test(input)) {
      setAiSceneValue(input);
    }
  };
  const handleOnePagerValueChange = (e) => {
    const input = e.target.value;
    if (/^$|^[1-9][0-9]*$/.test(input)) {
      setOnePagerValue(input);
    }
  };
  const handlePitchValueChange = (e) => {
    const input = e.target.value;
    if (/^$|^[1-9][0-9]*$/.test(input)) {
      setPitchValue(input);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className="lg:static absolute lg:mt-[90px] bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[666px] xl:w-[860px]">
        <div className="relative rounded-[8px]  bg-[#fff]">
          <div className="absolute right-[45%] top-[-60px] lg:top-[-17px] lg:right-[-18px]">
            <img
              src={crossIcon}
              onClick={handleClosePopup} // Use the handleClosePopup function here
              alt="close"
              className="w-[40px] h-[40px] z-[9] cursor-pointer"
            />
          </div>

          <div className="flex flex-col justify-center items-center px-2 md:px-8">
            <h3 className="bg-[#00c3ff] px-8 py-2 rounded-b-xl text-[#fafafa] font-bold text-[18px]">
              Const Estimate For {"{project name}"}
            </h3>
          </div>

          <div className="w-[90%] mx-auto mt-4">
            <h4 className="text-[#00c3ff] font-semibold text-left px-3 text-[16px]">
              Applicable Discounts
            </h4>
            {/* discount section */}
            <div className="mx-12 flex flex-col gap-2">
              <div className="text-[14px] flex items-center">
                <p className="min-w-[55%] text-[#616161]">
                  Early Bird Discount :-
                </p>
                <div className="flex items-center gap-1">
                  <input type="radio" />
                  <label htmlFor="" className="font-[500]">
                    30%
                  </label>
                </div>
              </div>

              <div className="text-[14px] flex items-center">
                <div className="min-w-[55%] text-[#616161]">
                  <p className=" ">MNF Team Discount :-</p>
                  <p className="text-[12px] leading-[16px] ">
                    (For Language Pair Partners, Messiahs and Ambassadors)
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <input type="radio" />
                  <label htmlFor="" className="font-[500]">
                    40%
                  </label>
                </div>
              </div>

              <div className="text-[14px] flex items-center">
                <p className="min-w-[55%] text-[#616161]">
                  Student Discount :-
                </p>
                <div className="flex items-center gap-1">
                  <input type="radio" />
                  <label htmlFor="" className="font-[500]">
                    40%
                  </label>
                </div>
              </div>

              <div className="text-[14px] flex items-center">
                <p className="min-w-[55%] text-[#616161]">
                  Membership Discount :- :-
                </p>
                <div className="flex items-center gap-12">
                  <div className="flex items-center gap-1">
                    <input type="radio" />
                    <label htmlFor="" className="font-[500]">
                      (Lifetime)20%
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input type="radio" />
                    <label htmlFor="" className="font-[500]">
                      (Annual)10%
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-[14px] flex items-center">
                <p className="min-w-[55%] text-[#616161]">
                  Referral Discount :-
                </p>
                <div className="flex items-center gap-1">
                  <input type="radio" />
                  <label htmlFor="" className="font-[500]">
                    15%
                  </label>
                </div>
              </div>

              {/* Group Discount */}
              <div className="text-[14px] flex items-center">
                <div className="min-w-[55%] text-[#616161]">
                  <p className="">Group Discount :-</p>
                  <p className="text-[12px] leading-[16px]">
                    (For 5 or more participants registering together)
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <input type="radio" />
                  <label htmlFor="" className="font-[500]">
                    25%
                  </label>
                </div>
              </div>
            </div>
            <h4 className="text-[#00c3ff] font-semibold text-left px-3 text-[16px] mt-4">
              Discounted Cost
            </h4>
            {/* table section */}
            <div>
              <div className="mx-12 flex flex-col gap-2 text-[14px] leading-5">
                <div className="px-2 pt-4">
                  <div className="flex items-center">
                    <div className="min-w-[50%]">
                      <p className="text-[#616161]">
                        Ida Assisted{" "}
                        <span className="font-[500] text-[#252525]">
                          Screenplay Generation
                        </span>{" "}
                        {/* {`No `} */}
                      </p>
                    </div>
                    <div className="min-w-[20%]">
                      {/* <p className="font-[500]"> No. of Scenes</p> */}
                    </div>
                    <div className="min-w-[15%]">
                      {/* <input
                        type="text"
                        onChange={handleAiValueChange}
                        value={aiSceneValue}
                        maxLength={10}
                        className="w-full border focus:outline-none px-2"
                        placeholder="0000"
                      /> */}
                    </div>
                    <div className="min-w-[15%] text-right ">
                      <p>
                        ${" "}
                        <span className="text-green-500 font-[500]">0.00</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-black" />
              </div>
              <div className="mx-12 flex flex-col gap-2 text-[14px] leading-5">
                <div className="px-2 pt-4">
                  <div className="flex items-center">
                    <div className="min-w-[50%]">
                      <p className="text-[#616161]">
                        Creating Logline & One Pager
                      </p>
                    </div>
                    <div className="min-w-[20%]">
                      <p className="font-[500]"></p>
                    </div>
                    <div className="min-w-[15%]">
                      {/* <input
                        type="text"
                        onChange={handleOnePagerValueChange}
                        value={onePagerValue}
                        maxLength={10}
                        className="w-full border focus:outline-none px-2"
                        placeholder="0000"
                      /> */}
                    </div>
                    <div className="min-w-[15%] text-right ">
                      <p>
                        ${" "}
                        <span className="text-green-500 font-[500]">0.00</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-black" />
              </div>

              <div className="mx-12 flex flex-col gap-2 text-[14px] leading-5">
                <div className="px-2 pt-4">
                  <div className="flex items-center">
                    <div className="min-w-[50%]">
                      <p className="text-[#616161]">
                        Generating Elevator Pitch
                      </p>
                    </div>
                    <div className="min-w-[20%]">
                      <p className="font-[500]"></p>
                    </div>
                    <div className="min-w-[15%]">
                      {/* <input
                        type="text"
                        onChange={handlePitchValueChange}
                        value={pitchValue}
                        maxLength={10}
                        className="w-full border focus:outline-none px-2"
                        placeholder="0000"
                      /> */}
                    </div>
                    <div className="min-w-[15%] text-right ">
                      <p>
                        ${" "}
                        <span className="text-green-500 font-[500]">0.00</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-black" />
              </div>

              <div className="mx-12 flex flex-col gap-2 text-[14px] leading-5">
                <div className="px-2 pt-4">
                  <div className="flex items-center">
                    <div className="min-w-[50%]">
                      <p className="text-[#616161]">
                        Display Script into ScriptStall
                      </p>
                    </div>
                    <div className="min-w-[20%]">
                      {/* <p className="font-[500]">No. of Pages</p> */}
                    </div>
                    <div className="min-w-[15%]">
                      {/* <input
                        type="text"
                        onChange={handlePitchValueChange}
                        value={pitchValue}
                        maxLength={10}
                        className="w-full border focus:outline-none px-2"
                        placeholder="0000"
                      /> */}
                    </div>
                    <div className="min-w-[15%] text-right ">
                      <p>
                        ${" "}
                        <span className="text-green-500 font-[500]">Free</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-black" />
              </div>
            </div>
            <div className="flex relative items-center w-full mt-4 mb-2  px-8 py-2 bg-[#00c3ff] rounded-b-xl">
              <h3 className="  text-[#fafafa] mx-auto text-center font-bold text-[18px]">
                Total Payable: $ 0.00
              </h3>
              <button className="absolute w-[100px] text-[12px] rounded-md bg-white text-[#00c3ff] right-12">
                Pay
              </button>
            </div>
            <h2 className="text-[18px] font-bold mb-2">
              {/* explore will be clickable */}
              You may get greater benefits in the{" "}
              <span className="text-[#00c3ff]">'Explore'</span> package
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPopup;

//       <div className="flex items-center justify-center gap-2">
//   <input
//     type="checkbox"
//     id="do-not-show"
//     className="cursor-pointer"
//     onChange={handleCheckboxChange}
//   />
//   <label
//     htmlFor="do-not-show"
//     className="cursor-pointer text-sm text-gray-700"
//   >
//     Do not show this to me again.
//   </label>
// </div>
