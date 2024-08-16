import React, { useEffect, useRef, useState } from "react";
import { FaKeyboard } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
import arrowRight from "../../../img/Icons/ArrowRicon.png";
import crossIcon from "../../../img/Icons/crossIcon.png";
import Keyboard from "../Keyboard";
import LanguageSelector from "../LanguageSelector";
import "../Premise.css";
import { getWhatIfPhrase } from "./ConvertWhat";
import PremisePreview2 from "./PremisePreview2";

const AddPremise2 = ({ setAddPopup, data, refetch }) => {
  const [preview, setPreview] = useState(false);
  const [newText, setNewText] = useState("");
  const [text, setText] = useState(data?.dText);
  const [confirmDisable, setConfirmDisable] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [boldStyle, setBoldStyle] = useState("");
  const [italicStyle, setItalicStyle] = useState("");
  const [underlineStyle, setUnderlineStyle] = useState("");
  const inputRef = useRef(null);
  const [openPop, setOpenPop] = useState(false);

  useEffect(() => {
    setBoldStyle(data?.stylings?.boldStyle);
    setItalicStyle(data?.stylings?.italicStyle);
    setUnderlineStyle(data?.stylings?.underlineStyle);
  }, [data?.stylings]);
  useEffect(() => {
    // console.log(text?.length, "text");
    const wordCount = text
      ?.trim()
      .split(/\s+/)
      .filter((word) => word !== "").length;
    if (text?.length >= 20) {
      setConfirmDisable(false);
    } else {
      setConfirmDisable(true);
    }
  }, [text]);
  const handleSubmit = (event) => {
    event.preventDefault();
    // const text = event.target.text.value;
    let modifiedText = text;
    modifiedText = modifiedText.replace(/what if/gi, "");
    modifiedText = modifiedText.replace(/[!?.]+/g, "");
    modifiedText = `${getWhatIfPhrase(
      selectedLanguage
    )} ${modifiedText.trim()}?`;
    setNewText(modifiedText);
    setPreview(true);
    // console.log("data sbmt", selectedLanguage);
  };
  const handleTextChange = (event) => {
    const value = event.target.value;
    const trimmedValue = value.replace(/^\s+/, ""); // Remove leading spaces
    const regex = /^[A-Za-z ]*$/;
   
    // if (regex.test(trimmedValue)) {
      //   setText(trimmedValue);
      // }
      setText(trimmedValue)
  };

  const handleGoBack = () => {
    setNewText("");
    setPreview(false);
  };

  // keyboard clicked
  const onClickKeyboard = () => {
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
    setKeyboardVisible(!keyboardVisible);
  };
  const handleClear = () => {
    setText("");
  };
  return (
    <div className="fixed top-[80px] md:top-0 left-0 w-full h-full flex items-center mt-80px] lg:mt-[0px] justify-center bg-[#252525b0] z-[1] ">
      <div
        className={`w-full  ${
          !preview ? "md:w-[480px]" : "md:w-[666px]"
        }  md:mt-[90px] relative`}
      >
        <div
          className={`bg-[#ffffff] lg:bg-[#FAFAFA] w-full ${
            !preview ? "md:w-[450px] md:h-[500px] xl:h-auto" : "md:w-[636px] md:h-[524.16px]"
          } mx-auto pt-[18px] md:rounded-[8px] shadow-lg h-[100vh]  overflow-y-auto premiseScroll overflow-x-hidden`}
        >
          <img
            src={crossIcon}
            alt="cross icon"
            className=" text-red-500 barSm-hidden z- w-8 h-8 cursor-pointer absolute top-[-12px] right-[0px]"
            onClick={() => setAddPopup(false)}
          />

          <div className="">
            <div className="pr-2">
              <div className="text-center  mx-auto md:mt-[-12px] xl:mt-0">
                <MdKeyboardBackspace
                  src={crossIcon}
                  alt=""
                  className="text-[#33B0CA] ml-[20px] text-left text-[38px] z-[1] absolute cursor-pointer mdHidden"
                  onClick={() => {
                    setAddPopup(false);
                    setOpenPop(false);
                    // setOpenReplyField(null);
                    // setReplyToCommentID(null);
                  }}
                />
                <p className=" text-[16px] w-[242px] sm:w-full mx-auto font-[500] text-[#252525]">
                  {!preview && "Describe your Imagination In Any Language"}
                </p>
              </div>
              <div className="text-right flex justify-end"></div>
            </div>
            {preview ? (
              <PremisePreview2
                data={data}
                newText={newText}
                setAddPopup={setAddPopup}
                handleGoBack={handleGoBack}
                refetch={refetch}
                setOpenPop={setOpenPop}
                openPop={openPop}

                //setIsAddNew={setIsAddNew}
              />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-[18px] md:mt-0 xl:mt-[18px] h-[80vh] md:h-auto flex flex-col justify-between"
              >
                <div>
                  <div className="bg-[#FAFAFA] h-[38px] md:h-[32px] xl:h-[38px] border border-[#EAEAEA] shadow-sm rounded-[8px] px-[8px] hidden lg:flex items-center mx-[28px] ">
                    <div className="flex gap-3  w-full ">
                      <FaKeyboard
                        data-te-toggle="tooltip"
                        title={`${
                          !keyboardVisible ? "View Keyboard" : "Hide Keyboard"
                        }`}
                        className={`w-7 h-7 ${
                          keyboardVisible && "text-[#33B0CA]"
                        } cursor-pointer hover:text-[#33B0CA]`}
                        onClick={onClickKeyboard}
                      />
                      <LanguageSelector
                        setSelectedLanguage={setSelectedLanguage}
                        selectedLanguage={selectedLanguage}
                        setKeyboardVisible={setKeyboardVisible}
                      />
                    </div>
                  </div>
                  <div className="mx-[28px]">
                    <p className="font-[400] leading-[21px] text-[#252525] text-[14px] pt-[4px] pb-[3.5px]">
                      {getWhatIfPhrase(selectedLanguage)}
                      <span className=" text-[#616161]">
                        {" "}
                        (your typed text will come here)
                      </span>
                      ?
                    </p>
                    <textarea
                      onChange={handleTextChange}
                      ref={inputRef}
                      name="text"
                      className={`${boldStyle} ${italicStyle} ${underlineStyle} text-[16px] bg-[#fafafa] border border-[#eaeaea] shadow-md rounded-[8px] w-full md: h-[170px] xl:h-[200px] resize-none text-[#616161]  focus:outline-none px-[20px] py-[12px] overflow-hidden break-words`}
                      maxLength="200"
                      value={text}
                    />
                    <div className="text-[14px] leading-[18px] md:text-[12px] md:leading-[16px]  xl:text-[14px] xl:leading-[18px] font-[400] mt-[-4px]">
                      {/* <p className="text-right">?</p> */}
                      <div className="flex flex-row-reverse  items-center gap-5 mt-[-7px]">
                        <p className="text-right pt-[1.5px]">
                          {text?.length || 0}/200
                        </p>
                        {text?.length > 20 ? (
                          <p className="text-right text-[#EE3C4D] pt-[1.5px]">
                            Maximum 200 characters
                          </p>
                        ) : (
                          <p className="text-right text-[#EE3C4D] pt-[1.5px]">
                            Minimum 20 characters
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:bg-[#FAFAFA] flex gap-5 justify-end  my-[8px] text-center mx-[28px]">
                    <button
                      type="reset"
                      onClick={handleClear}
                      className="bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600] "
                    >
                      Clear
                    </button>
                    {!data?.id ? (
                      <button
                        disabled={confirmDisable}
                        type="submit"
                        className={`${
                          confirmDisable ? "bg-[#616161]" : "bg-[#33B0CA]"
                        }  text-white rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center `}
                      >
                        Next <img src={arrowRight} alt="" />
                      </button>
                    ) : (
                      <button
                        disabled={confirmDisable}
                        type="submit"
                        className={`${
                          confirmDisable ? "bg-[#616161]" : "bg-[#33B0CA]"
                        }  text-white rounded-[8px] h-[32px] px-[23px] text-[14px] font-[600] flex gap-[12px] items-center `}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  {selectedLanguage && keyboardVisible && (
                    <Keyboard
                      selectedLanguage={selectedLanguage}
                      setText={setText}
                      inputRef={inputRef}
                    />
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddPremise2;
