import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaKeyboard } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
import arrowRight from "../../../img/Icons/ArrowRicon.png";
import crossIcon from "../../../img/Icons/crossIcon.png";
import { autoCorrectText } from "../../../shared/utils/AutoCorrect";
import { useCohereSuggest } from "../../../shared/utils/useCohereSuggest";
import AddPremiseNextTutorialPop from "../../PremiseV2/sequalPopup/AddPremiseNextTutorialPop";
import AddPremiseTutorialPop from "../../PremiseV2/sequalPopup/singlePop/AddPremiseTutorialPop";
import Keyboard from "../Keyboard";
import LanguageSelector from "../LanguageSelector";
import "../Premise.css";
import { getWhatIfPhrase } from "./ConvertWhat";
import PremisePreview2 from "./PremisePreview2";

const AddPremise2 = ({
  setAddPopup,
  data,
  refetch,
  checkedAddPremise,
  setCheckedAddPremise,
}) => {
  const [preview, setPreview] = useState(false);
  const [newText, setNewText] = useState("");
  const [text, setText] = useState(data?.dText);
  const [correctedText, setCorrectedText] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [boldStyle, setBoldStyle] = useState("");
  const [italicStyle, setItalicStyle] = useState("");
  const [underlineStyle, setUnderlineStyle] = useState("");
  const inputRef = useRef(null);
  const [openPop, setOpenPop] = useState(false);
  const [finalEdit, setFinalEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBoldStyle(data?.stylings?.boldStyle);
    setItalicStyle(data?.stylings?.italicStyle);
    setUnderlineStyle(data?.stylings?.underlineStyle);
  }, [data?.stylings]);
  useEffect(() => {
    // console.log(text?.length, "text");

    if (text?.length >= 20) {
      setConfirmDisable(false);
    } else {
      setConfirmDisable(true);
    }
  }, [text]);
  const [openAddPremiseNextPop, setOpenAddPremiseNextPop] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const notOpenNextClickDemoPop = localStorage.getItem(
      "notOpenNextClickDemoPop"
    );
    if (
      (!notOpenNextClickDemoPop || notOpenNextClickDemoPop === "false") &&
      !openAddPremiseNextPop
    ) {
      setOpenAddPremiseNextPop(true);
    }

    // const text = event.target.text.value;
    let modifiedText = text;
    modifiedText = modifiedText.replace(
      new RegExp(getWhatIfPhrase(selectedLanguage), "gi"),
      ""
    );

    modifiedText = modifiedText.replace(/[!?.]+/g, "");

    modifiedText = `${getWhatIfPhrase(
      selectedLanguage
    )} ${modifiedText.trim()}?`;

    setNewText(modifiedText);
    setPreview(true);
  };
  // const { suggestion } = useSmartSuggest(text);
  const suggestion = useCohereSuggest(text);

  const handleTextChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\s{2,}/g, " ");
    setText(value);
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      setText((prev) => prev + suggestion.replace(prev, ""));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
  };

  const handleAutoCorrect = async () => {
    const corrected = await autoCorrectText(text);
    setText(corrected);
  };

  //   const suggestion = await autoCompleteSentence(text);
  //   console.log("suggestion",suggestion);
  //   setText((prev) => prev + " " + suggestion);
  // };
  // const handleGrammarCheck = async () => {
  //   const corrected = await checkGrammar(text);
  //   setText(corrected);
  // };

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
    <div className="fixed top-[75px] md:top-0 left-0 w-full h-full flex items-center  lg:mt-[0px] justify-center bg-[#252525b0] z-[1] ">
      <div
        className={`w-full  ${
          !preview ? "md:w-[480px]" : "md:w-[676px]"
        } mt-[-67px] md:mt-[90px] relative`}
      >
        <div
          className={`bg-[#ffffff] lg:bg-[#FAFAFA] w-full ${
            !preview
              ? " h-[93vh] pt-[18px]  md:w-[450px] md:h-auto"
              : `md:w-[646px] ${
                  isLoading
                    ? "h-[120px]"
                    : " h-[93vh] pt-[18px] md:h-auto md:max-h-[81vh]"
                }`
          } mx-auto md:rounded-[8px] shadow-lg h-[100vh] overflow-y-auto  overflow-x-hidden`}
        >
          {!isLoading && !finalEdit && (
            <img
              src={crossIcon}
              alt="cross icon"
              className={`text-red-500 barSm-hidden  w-8 h-8 cursor-pointer absolute top-[-12px] right-0 z-1`}
              onClick={() => setAddPopup(null)}
            />
          )}

          <div className="">
            <div className="pr-2">
              <div className="text-center flex items-center mx-auto  mb-2 xl:mt-0">
                {!isLoading && !finalEdit && (
                  <MdKeyboardBackspace
                    src={crossIcon}
                    alt=""
                    className={`text-[#252525]  ml-[20px] text-left text-[32px] cursor-pointer mdHidden ${
                      preview && "mt-3"
                    }`}
                    onClick={() => {
                      setAddPopup(null);
                      setOpenPop(false);
                      // setOpenReplyField(null);
                      // setReplyToCommentID(null);
                    }}
                  />
                )}
                {!isLoading && (
                  <>
                    {!preview ? (
                      <p className="text-[16px] leading-[23px] w-[88%]  mx-auto text-center  font-[500] text-[#252525] pt-4">
                        Describe your Imagination In Any Language
                      </p>
                    ) : (
                      <p className="block text-[16px] pt-4 leading-[23px] text-center mx-auto font-[500] text-[#252525]">
                        Preview your Imagination
                      </p>
                    )}
                  </>
                )}
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
                finalEdit={finalEdit}
                setFinalEdit={setFinalEdit}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                premiseLanguage={selectedLanguage}
                //setIsAddNew={setIsAddNew}
              />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-1 md:mt-0 xl:mt-[18px] h-[80vh] md:h-auto flex flex-col justify-between"
              >
                <div>
                  <div className="bg-[#FAFAFA] my-1 h-[38px] md:h-[32px] xl:h-[38px] border border-[#EAEAEA] shadow-sm rounded-[8px] px-[8px] hidden lg:flex items-center mx-[28px] ">
                    <div className="flex justify-end gap-3  w-full ">
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
                  <div className="bg-[#FAFAFA] my-1 h-[38px] md:h-[32px] xl:h-[38px] border border-[#EAEAEA] shadow-sm rounded-[8px] px-[8px] lg:hidden flex items-center mx-[28px] ">
                    <div className="flex justify-end gap-3  w-full ">
                      {/* <FaKeyboard
                        data-te-toggle="tooltip"
                        title={`${
                          !keyboardVisible ? "View Keyboard" : "Hide Keyboard"
                        }`}
                        className={`w-7 h-7 ${
                          keyboardVisible && "text-[#33B0CA]"
                        } cursor-pointer hover:text-[#33B0CA]`}
                        onClick={onClickKeyboard}
                      /> */}
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
                      className={`${boldStyle} ${italicStyle} ${underlineStyle} text-[16px] leading-[24px] md:leading-[28px] bg-[#fafafa] border border-[#eaeaea] shadow-md rounded-[8px] w-full md: h-[170px] xl:h-[200px] resize-none text-[#616161]  focus:outline-none px-[20px] py-[12px] overflow-hidden break-words`}
                      maxLength="200"
                      value={text}
                    />

                    {/* <GrammarChecker
                      text={text}
                      setText={setText}
                      correctedText={correctedText}
                      setCorrectedText={setCorrectedText}
                      inputRef={inputRef}
                    /> */}
                    {/* <textarea
                          onChange={handleTextChange}
                          onKeyDown={handleKeyDown}
                          ref={inputRef}
                          name="text"
                          className="text-[16px] leading-[24px] md:leading-[28px] bg-transparent border border-[#eaeaea] shadow-md rounded-[8px] w-full h-[170px] xl:h-[200px] resize-none text-[#616161] focus:outline-none px-[20px] py-[12px] overflow-hidden break-words relative z-10"
                          maxLength={200}
                          value={text}
                          spellCheck={true}
                          // placeholder="Start typing..."
                        /> */}

                    {/* <div className="text-[14px] leading-[18px] md:text-[12px] md:leading-[16px]  xl:text-[14px] xl:leading-[18px] font-[400] mt-[-4px]">
                    
                      <div className="flex flex-row-reverse  items-center gap-5 mt-[-7px]">
                        <p className="text-right pt-[10px] md:pt-[1.5px]">
                          {text?.length || 0}/200
                        </p>
                        {text?.length > 20 ? (
                          <p className="text-right text-[#EE3C4D] pt-[10px] md:pt-[1.5px]">
                            Maximum 200 characters
                          </p>
                        ) : (
                          <p className="text-right text-[#EE3C4D] pt-[10px] md:pt-[1.5px]">
                            Minimum 20 characters
                          </p>
                        )}
                      </div>
                    </div> */}
                  </div>
                  <div className="md:bg-[#FAFAFA] flex gap-4 justify-end  my-[8px] text-center mx-[28px]">
                    <button
                      type="reset"
                      onClick={handleClear}
                      className="clear-m bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600] "
                    >
                      Clear
                    </button>
                    {!data?.id ? (
                      <button
                        disabled={confirmDisable}
                        type="submit"
                        className={`${
                          confirmDisable ? "bg-[#ACDDE7]" : "bg-[#33B0CA]"
                        }  text-white rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center `}
                      >
                        Next <img src={arrowRight} alt="" />
                      </button>
                    ) : (
                      <button
                        disabled={confirmDisable}
                        type="submit"
                        className={`${
                          confirmDisable ? "bg-[#ACDDE7]" : "bg-[#33B0CA]"
                        }  text-white rounded-[8px] h-[32px] px-[23px] text-[14px] font-[600] flex gap-[12px] items-center `}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  {selectedLanguage && keyboardVisible && (
                    <Draggable handle=".movable-handle">
                      <div className="absolute z-20 w-[650px] top-[194px] right-[-85px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded  hidden lg:block">
                        <div className="grid grid-cols-12">
                          <div className="movable-handle col-span-11 bg-[#f8f8f8] text-[#616161] cursor-move text-center text-[14px] font-[400]">
                            Drag me!!{" "}
                            <span className="font-[500]">
                              {selectedLanguage}
                            </span>{" "}
                            Keyboard
                          </div>
                          <div className="flex justify-center items-center w-full h-full cursor-pointer">
                            <button
                              onClick={() => {
                                setKeyboardVisible(false);
                                // setSelectedLanguage('')
                              }}
                              className="font-bold w-full h-full"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="p-2">
                          <Keyboard
                            selectedLanguage={selectedLanguage}
                            setText={setText}
                            inputRef={inputRef}
                          />
                        </div>
                      </div>
                    </Draggable>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {checkedAddPremise && (
        <AddPremiseTutorialPop popClose={setCheckedAddPremise} />
      )}
      {openAddPremiseNextPop && (
        <AddPremiseNextTutorialPop
          setOpenAddPremiseNextPop={setOpenAddPremiseNextPop}
        />
      )}
    </div>
  );
};
export default AddPremise2;
