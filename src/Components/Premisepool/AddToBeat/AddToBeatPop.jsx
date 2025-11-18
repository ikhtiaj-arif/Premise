import { useState } from "react";
// import keyboardIcon from '../../../../images/keyboardIcon.png'
// import languagesIcon from '../../../../images/languagesIcon.png'
import { MdKeyboardBackspace } from "react-icons/md";
const BeatSheetGenerating = ({ setBeatSheetGenPop }) => {
  const [regardingOutput, setRegardingOutput] = useState("");

  return (
    <div>
      <div className="">
        <div className="modal_css z-10 top-26   ">
          <div className="rounded-[8px] w-[920px] h-[547px] bg-[#FAFAFA]">
            <div className="h-[27px] relative w-[920px] rounded-t-xl font-[500]  flex flex-row-reverse items-center px-3">
              <button
                onClick={() => setBeatSheetGenPop(false)}
                className="btn-sm hover:shadow-md shadow-[#252525] border-none text-white bg-[#EE3C4D] btn-circle absolute right-[-13px] top-[-13px]"
              >
                ✕
              </button>
            </div>
            <div className="pb-[15px]">
              <h1 className="text-[18px] font-[500] text-center">
                Generating a Scene from a Beat
              </h1>
            </div>
            <div className="px-[33px]">
              <div className="">
                <h5 className="text-[14px] font-[400] pb-[15px]">
                  <span className="pl-[20px]">A</span> beat describes a moment
                  or event which forwards to story or reveals something
                  significant about the characters or plot. It clearly brings
                  out who does what and defines the outcome of the scene in a
                  clear, impactful,and engaging way to connect the audience with
                  the characters and maintain engagement and coherence in the
                  narrative.
                </h5>
                <h5 className="text-[14px] font-[400]">
                  <span className="pl-[20px]">The</span> beat description is in
                  present continuous tense, concise, in active voice, precisely
                  detailing the trigger, subject, actions, settings and
                  emotions. To control the rhythm and pace, Short and long
                  sentences are used to increase tension or provide details or
                  reflection.
                </h5>
              </div>
              <div className="pt-[7px] pb-[10px] pl-[11px] flex items-center gap-[10px]">
                <input type="checkbox" name="" id="" />
                <span>Do not show this box again</span>
              </div>
              <div>
                <h3 className="text-[14px] font-[600] pb-[13px]">
                  Select and Edit one of the following for Generating a Scene
                </h3>
              </div>
              <div>
                <div className="w-[853px] mb-[5px] rounded-[6px] px-[16px] py-[10px] bg-[#EAEAEA] h-[42px] border flex items-center gap-[10px]">
                  <input
                    onClick={() => setRegardingOutput("one")}
                    checked={regardingOutput === "one"}
                    type="radio"
                    name=""
                    id=""
                    className=""
                  />
                  <textarea
                    maxLength={400}
                    type="text"
                    value="Repopulated original Editable Comment Display"
                    className="w-full  resize-none outline-none bg-[#EAEAEA] h-full text-[14px]"
                  />
                </div>
                <div className="w-[853px] mb-[5px] rounded-[6px] px-[16px] py-[10px] bg-[#F8F8F8] h-[42px] border flex items-center gap-[10px]">
                  <input
                    onClick={() => setRegardingOutput("two")}
                    checked={regardingOutput === "two"}
                    type="radio"
                    name=""
                    id=""
                    className=""
                  />
                  <h3
                    maxLength={400}
                    type="text"
                    className="w-full  resize-none outline-none bg-[#F8F8F8] text-[14px]"
                  >
                    Option 1 Suggested by <span className="mnff-m">MNF</span>
                  </h3>
                </div>
                <div className="w-[853px] mb-[5px] rounded-[6px] px-[16px] py-[10px] bg-[#F8F8F8] h-[42px] border flex items-center gap-[10px]">
                  <input
                    onClick={() => setRegardingOutput("three")}
                    checked={regardingOutput === "three"}
                    type="radio"
                    name=""
                    id=""
                    className=""
                  />
                  <h3
                    maxLength={400}
                    type="text"
                    className="w-full  resize-none outline-none bg-[#F8F8F8] text-[14px]"
                  >
                    Option 2 Suggested by <span className="mnff-m">MNF</span>
                  </h3>
                </div>
                <div className="w-[853px] mb-[5px] rounded-[6px] px-[16px] py-[10px] bg-[#F8F8F8] h-[42px] border flex items-center gap-[10px]">
                  <input
                    onClick={() => setRegardingOutput("four")}
                    checked={regardingOutput === "four"}
                    type="radio"
                    name=""
                    id=""
                    className=""
                  />
                  <h3
                    maxLength={400}
                    type="text"
                    className="w-full  resize-none outline-none bg-[#F8F8F8] text-[14px]"
                  >
                    Option 3 Suggested by <span className="mnff-m">MNF</span>
                  </h3>
                </div>
              </div>
              <div className="flex justify-end items-center gap-[16px] mt-[20px]">
                <button>
                  <MdKeyboardBackspace className="text-[#252525] ml-[20px] text-left text-[32px]  cursor-pointer mdHidden" />
                </button>
                <button>{/* <img src={keyboardIcon} alt="" /> */}</button>
                <button className="w-[69px] h-[32px] bg-[#00c3ff] text-white rounded-[4px] text-[14px] font-[600]">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatSheetGenerating;
