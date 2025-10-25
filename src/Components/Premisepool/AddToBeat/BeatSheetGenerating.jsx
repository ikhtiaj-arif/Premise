import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaKeyboard } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useTranslatePremiseMutation } from "../../../app/EndPoints/premisePoolApi";
import KeyboardB from "../KeyboardB";
import { keyboardOptions } from "../KeyboardOption";
import { sortedLanguages } from "../Languages";

// const BeatSheetGenerating = ({
//   popClose,
//   doNotShowBox,
//   setDoNotShowBox,
//   beatSheetObject,
//   beatGenIndex,
//   scriptObjects,
//   setShowBeat
// }) => {
const BeatSheetGenerating = ({ popClose, commentText, data, setIsLiked }) => {
  const [regardingOutput, setRegardingOutput] = useState("one");
  const [options, setOptions] = useState({
    one: commentText.text,
    two: "Option 1 Suggested by MNF",
    three: "Option 2 Suggested by MNF",
    four: "Option 3 Suggested by MNF",
  });
  const [doNotShowBox, setDoNotShowBox] = useState(false);

  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [sourcesLanguage, setSourcesLanguage] = useState("English");

  const inputRef = useRef();

  useEffect(() => {
    const preference = localStorage.getItem("doNotShowBox");
    if (preference) {
      setDoNotShowBox(JSON.parse(preference));
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("doNotShowBox");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputChange = (e, key) => {
    setOptions({ ...options, [key]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setDoNotShowBox(isChecked);
    localStorage.setItem("doNotShowBox", JSON.stringify(isChecked));
  };
  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current;
      textarea.focus();
      // Move cursor to the end of the text
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }
  }, [regardingOutput]);
  const [translatePremise] = useTranslatePremiseMutation();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedPop, setTranslatedPop] = useState(false);
  const handleOptionChange = async (e) => {
    const selectedLang = e.target.value;
    setSelectedLanguage(selectedLang);
    const beatText = options[regardingOutput];
    const body = {
      text: beatText,
      tar_lang: selectedLang,
    };

    const res = await translatePremise(body);
    if (res) {
      const trnsText = res.data.translated;

      setOptions((prevOptions) => ({
        ...prevOptions,
        [regardingOutput]: trnsText,
      }));

      setSelectedLanguage("");
    }
  };
  const [resDisable, setresDisable] = useState(false);

  return (
    <div>
      <div className="">
        <div className="modal_css z-10 top-26">
          <div
            className={`rounded-[8px] relative ${
              isSmallDevice && "overflow-y-scroll"
            } md:w-[920px] ${
              !doNotShowBox ? "h-full md:h-[547px]" : "h-[80%] md:h-[411px]"
            } bg-[#FAFAFA]`}
          >
            <button onClick={() => popClose(false)}>
              <IoIosArrowRoundBack className="text-[50px] block md:hidden text-[#00c3ff]" />
            </button>
            <div className="h-[27px]  md:block relative w-full md:w-[920px] rounded-t-xl font-[500] flex flex-row-reverse items-center px-3">
              <button
                onClick={() => popClose(false)}
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
              {!doNotShowBox && (
                <div>
                  <div className="">
                    <h5 className="text-[14px] font-[400] pb-[15px]">
                      <span className="pl-[20px]">A</span> beat describes a
                      moment or event which forwards to story or reveals
                      something significant about the characters or plot. It
                      clearly brings out who does what and defines the outcome
                      of the scene in a clear, impactful, and engaging way to
                      connect the audience with the characters and maintain
                      engagement and coherence in the narrative.
                    </h5>
                    <h5 className="text-[14px] font-[400]">
                      <span className="pl-[20px]">The</span> beat description is
                      in present continuous tense, concise, in active voice,
                      precisely detailing the trigger, subject, actions,
                      settings and emotions. To control the rhythm and pace,
                      Short and long sentences are used to increase tension or
                      provide details or reflection.
                    </h5>
                  </div>
                  <div className="pt-[7px] pb-[10px] pl-[11px] flex items-center gap-[10px]">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      onChange={handleCheckboxChange}
                    />
                    <span>Do not show this box again</span>
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-[14px] font-[600] pb-[13px]">
                  Select and Edit one of the following for Generating a Scene
                </h3>
              </div>
              <div>
                {Object?.keys(options).map((key) => (
                  <div
                    key={key}
                    className={`w-full md:w-[853px] mb-[5px] rounded-[6px] px-[16px] py-[10px] ${
                      regardingOutput === key
                        ? "bg-[#EAEAEA] h-[59px]"
                        : "bg-[#F8F8F8]"
                    } h-[42px] border flex items-center gap-[10px]`}
                  >
                    <input
                      onClick={() => setRegardingOutput(key)}
                      checked={regardingOutput === key}
                      type="radio"
                      name=""
                      id=""
                      className=""
                    />
                    {regardingOutput === key ? (
                      <textarea
                        maxLength={400}
                        type="text"
                        value={options[key]}
                        onChange={(e) => handleInputChange(e, key)}
                        className="resize-none outline-none bg-[#EAEAEA] w-full h-full text-[14px]"
                        ref={inputRef}
                      />
                    ) : (
                      <h3 className="resize-none outline-none bg-[#F8F8F8] text-[14px]">
                        {options[key]}
                      </h3>
                    )}

                    {showKeyboard && regardingOutput === key && (
                      <Draggable handle=".movable-handle">
                        <div className="absolute z-20 w-[650px] top-[400px] right-[30px] bg-white border border-gray-300 shadow-lg rounded">
                          <div className="grid grid-cols-12">
                            <div className="movable-handle col-span-11 bg-[#EAEAEA] text-[#616161]">
                              Drag me!! {sourcesLanguage} Language Keyboard Show
                            </div>
                            <div className="flex justify-center items-center w-full h-full cursor-pointer">
                              <button
                                onClick={() => setShowKeyboard(false)}
                                className="font-bold w-full h-full"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div className="p-2">
                            <KeyboardB
                              regardingOutput={regardingOutput}
                              setOptions={setOptions}
                              inputRef={inputRef}
                              sourcesLanguage={sourcesLanguage}
                            />
                          </div>
                        </div>
                      </Draggable>
                    )}
                  </div>
                ))}
              </div>
              <div
                className={`flex justify-end items-center gap-[16px] ${
                  doNotShowBox ? "mt-[45px]" : "mt-[20px]"
                } `}
              >
                {!translatedPop && (
                  <button onClick={() => setTranslatedPop(!translatedPop)}>
                    {/* <img src={languagesIcon} alt="" /> */}
                  </button>
                )}
                {translatedPop && (
                  <div className="border p-1 rounded-[4px] flex items-center justify-between">
                    <button onClick={() => setTranslatedPop(!translatedPop)}>
                      {/* <img src={languagesIcon} alt="" /> */}
                    </button>
                    <select
                      value={selectedLanguage}
                      onChange={handleOptionChange}
                      className="bg-[#FAFAFA] border-none w-[106px] text-[14px] text-[#616161] font-[400] focus:outline-none h-7"
                    >
                      {Object.entries(sortedLanguages).map(([key, name]) => (
                        <option key={key} value={key}>
                          <p className="bg-[#00c3ff]">{name}</p>
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {!showKeyboard && (
                  <button>
                    {/* <img
                      src={keyboardIcon}
                      alt=""
                      onClick={() => setShowKeyboard(!showKeyboard)}
                    /> */}
                    <FaKeyboard />
                  </button>
                )}
                {showKeyboard && (
                  <div className="border p-1 rounded-[4px] flex items-center justify-between">
                    <button>
                      {/* <img
                        src={keyboardIcon}
                        alt=""
                        onClick={() => setShowKeyboard(!showKeyboard)}
                      /> */}
                    </button>
                    <select
                      value={sourcesLanguage}
                      onChange={(e) => setSourcesLanguage(e.target.value)}
                      className="bg-[#FAFAFA] border-none w-full md:w-[110px] text-[14px] text-[#616161] font-[400] focus:outline-none h-7"
                    >
                      {Object.entries(keyboardOptions)
                        .sort(([, a], [, b]) => a.localeCompare(b))
                        .map(([code, name]) => (
                          <option key={code} value={name}>
                            {name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                <button
                  disabled={resDisable}
                  className="w-[69px] h-[32px] bg-[#00c3ff] text-white rounded-[4px] text-[14px] font-[600]"
                >
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
