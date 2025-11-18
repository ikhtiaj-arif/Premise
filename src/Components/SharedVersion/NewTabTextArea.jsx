import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaKeyboard } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useCommentPremiseMutation } from "../../app/EndPoints/premisePoolApi";
import BtnLoading from "../../shared/BtnLoading";
import LanguageSelector from "../Premisepool/LanguageSelector";
import NoAccessCreditPopupUpdate from "../PricingModel/NoAccessCreditPopupUpdate";
import { baseURL } from "../utils";

const NewTabTextArea = ({
  premiseOwner,
  user,
  premiseId,
  commentRefetch,
  setOpenAllReplies,
  setOpenReplyFieldID,
  lastCommentRef,
  commentField,
  setCommentField,
  setReplyField,
  replyField,
  replyRef,
  fromNew,
  className,
  className2,
  isLoading,
  setIsLoading,
  selectedLanguage,
  setSelectedLanguage,
  keyboardVisible,
  setKeyboardVisible,
  newComment,
  setNewComment,
  inputRef,
}) => {
  const [textCount, setTextCount] = useState(0);
  // const [newComment, setNewComment] = useState("");
  // const [keyboardVisible, setKeyboardVisible] = useState(false);
  // const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isCommentQuestion, setIsCommentQuestion] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [noAccessPopup, setNoAccessPopup] = useState(null);
  const [service, setService] = useState(null);

  const [postComment, { isLoading: isPostLoading }] =
    useCommentPremiseMutation();

  const { currentUser } = useContext(MyContext);

  // console.log('user from textarea',user);
  // console.log('user from textarea premise owner',premiseOwner);

  useEffect(() => {
    if (newComment?.endsWith("?")) {
      setIsCommentQuestion(true);
    } else {
      setIsCommentQuestion(false);
    }

    if (newComment?.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [newComment]);

  useEffect(() => {
    if (commentField && inputRef?.current) {
      inputRef?.current?.focus();
      setReplyField(false);
      setCommentField(false);
    }
    if (replyField && replyRef?.current) {
      replyRef?.current?.focus();
      setCommentField(false);
    }
  }, [replyField, commentField]);

  const handleTextareaChange = (event) => {
    const comment = event.target.value;
    setTextCount(comment.length);
    setNewComment(comment);
  };

  const token = localStorage.getItem("accessToken");
  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // const handleButtonClick = async () => {
  //   setIsLoading(true);
  //   if (premiseOwner?.id === currentUser?.id) {
  //     checkAllowance("PP_AllowBrainstoming");
  //   } else {
  //     checkAllowance("PP_AllowInteraction");
  //   }
  //   setIsLoading(false);
  // };

  // const checkAllowance = async (flag) => {
  //   const res = await fetchUserAccess(`${currentUser?.id}/${flag}`);
  //   console.log(`${flag} res`, res);
  //   if (res?.access === "No") {
  //     setNoAccessPopup(res);
  //     setService(flag);
  //   } else {
  //     handleSubmitComment();
  //   }
  // };
  const handleButtonClick = async () => {
    setIsLoading(true);
    if (premiseOwner?.id === currentUser?.id) {
      await checkAllowance("PP_AllowBrainstoming");
    } else {
      await checkAllowance("PP_AllowInteraction");
    }
    setIsLoading(false);
  };

  const checkAllowance = async (flag) => {
    const res = await fetchUserAccess(`${flag}`);
    if (res?.has_access === false) {
      setNoAccessPopup(res);
      setService(flag);
      return false; // ❌ no access
    } else {
      await handleSubmitComment(); // ✅ wait for comment submission
      return true;
    }
  };

  // const handleSubmitComment = async () => {
  //   if (newComment.length === 0) {
  //     alert("You can't send an empty comment!");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     // Fetch the existing comment data
  //     const response = await axios.get(
  //       `${baseURL}/brainstorm/GetCommentAPInew/${premiseId}`,
  //       {
  //         headers: header,
  //       }
  //     );

  //     const brainstormData = localStorage.getItem("BrainstormData");
  //     const sceneData = JSON.parse(brainstormData);

  //     const updatedPremiseId = sceneData?.premiseId;
  //     const lastSceneNumber = sceneData?.lastSceneNumber;

  //     let c_value = response?.data?.counts + 1;

  //     if (response) {
  //       const body = {
  //         premise: premiseId,
  //         text: newComment,
  //         user: user,
  //         C: c_value, // Update the comment count
  //         ...(updatedPremiseId === premiseId && lastSceneNumber
  //           ? { C_from_scriptpad: lastSceneNumber }
  //           : {}),
  //         is_question: isCommentQuestion,
  //       };

  //       // Post the new comment
  //       const res = await postComment(body);

  //       // if (res?.error) {
  //       //   toast.error("Failed to add comment. Please try again.", {
  //       //     position: toast.POSITION.TOP_CENTER,
  //       //     autoClose: 800,
  //       //   });
  //       //   setNewComment("");

  //       //   setIsLoading(false);
  //       //   setTextCount(0);
  //       // } else {
  //       setNewComment("");
  //       if (updatedPremiseId === premiseId) {
  //         localStorage.removeItem("BrainstormData");
  //       }
  //       setIsLoading(false);
  //       setTextCount(0);

  //       // here scroll all the way down to a div using ref
  //       setTimeout(() => {
  //         commentRefetch(); // Refetch the comments after adding the new one
  //         setOpenAllReplies(true);
  //         setOpenReplyFieldID(res?.data?.id);
  //       }, 1000);

  //       setTimeout(() => {
  //         console.log(lastCommentRef.current);
  //         if (lastCommentRef.current) {
  //           lastCommentRef.current.scrollTo({
  //             top: lastCommentRef.current.scrollHeight,
  //             behavior: "smooth",
  //           });
  //         }
  //         toast.success("Comment added!", {
  //           position: toast.POSITION.TOP_CENTER,
  //           autoClose: 1600,
  //         });
  //       }, 1100);
  //       // }
  //     }
  //   } catch (error) {
  //     toast.error("Failed to add comment. Please try again.", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 1600,
  //     });
  //     setNewComment("");
  //     localStorage.removeItem("BrainstormData");
  //     setIsLoading(false);
  //     setTextCount(0);
  //   }
  // };
  const handleSubmitComment = async () => {
    if (newComment.trim().length === 0) {
      alert("You can't send an empty comment!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${baseURL}/brainstorm/GetCommentAPInew/${premiseId}`,
        { headers: header }
      );

      const brainstormData = localStorage.getItem("BrainstormData");
      const sceneData = JSON.parse(brainstormData);

      const updatedPremiseId = sceneData?.premiseId;
      const lastSceneNumber = sceneData?.lastSceneNumber;

      let c_value = response?.data?.counts + 1;

      const body = {
        premise: premiseId,
        text: newComment,
        user: user,
        C: c_value,
        ...(updatedPremiseId === premiseId && lastSceneNumber
          ? { C_from_scriptpad: lastSceneNumber }
          : {}),
        is_question: isCommentQuestion,
      };

      const res = await postComment(body);

      if (updatedPremiseId === premiseId) {
        localStorage.removeItem("BrainstormData");
      }

      // ✅ Clear textarea right after success
      setNewComment("");
      setTextCount(0);
      if (updatedPremiseId === premiseId) {
        localStorage.removeItem("BrainstormData");
      }
      // other UI updates...
      setTimeout(() => {
        commentRefetch();
        setOpenAllReplies(true);
        setOpenReplyFieldID(res?.data?.id);
      }, 1000);

      setTimeout(() => {
        if (lastCommentRef.current) {
          lastCommentRef.current.scrollTo({
            top: lastCommentRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
        toast.success("Comment added!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1600,
        });
      }, 1100);
      const crdRes = await fetchUserAccess(`PP_AllowBrainstoming`);
      const remainingCredits = crdRes?.remaining_credits ?? 0;
      const creditElement = document.getElementById("creditBalance");
      if (creditElement) {
        creditElement.textContent = remainingCredits;
      }
    } catch (error) {
      toast.error("Failed to add comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1600,
      });
    } finally {
      // ✅ always reset
      setNewComment("");
      setTextCount(0);
      setIsLoading(false);
    }
  };

  const onClickKeyboard = () => {
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
    setKeyboardVisible(!keyboardVisible);
  };
  return (
    <div className={`relative  bottom-0 md:w-auto  ${className}`}>
      <div
        className={`${
          className ? "bg-[#fff]" : "bg-[#f8f8f8]"
        } relative md:mb-[16px] pl-3 md:flex-row ${
          fromNew ? "w-full" : "w-[90%]"
        }  mx-auto  border-2 border-[#616161] rounded-[8px] mt-[8px] md:h-[92px] lg:h-[144px]`}
      >
        {premiseOwner?.id === user ? (
          <textarea
            ref={inputRef}
            type="text"
            name=""
            maxLength={250}
            id=""
            className={`bg-[#f8f8f8] resize-none leading-[21px] rounded-[8px] w-[100%] h-[49.27px] lg:h-[108px] focus:border-none focus:outline-none text-[14px] py-[2px] pr-[12px] font-[400] placeholder:text-[#616161] placeholder:italic ${className2}`}
            placeholder="Share an action taken by any character in pursuit of its want OR describe a situation in which the chosen characters interact OR write anything you have in mind. "
            value={newComment}
            required
            onChange={handleTextareaChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleButtonClick();
                event.currentTarget.blur();
              }
            }}
          />
        ) : (
          <textarea
            ref={inputRef}
            type="text"
            name=""
            maxLength={150}
            id=""
            className={`${
              className ? "bg-[#fff]" : "bg-[#f8f8f8]"
            } resize-none leading-[21px] rounded-[8px] w-[100%] h-[49.27px] lg:h-[108px] focus:border-none focus:outline-none text-[14px] py-[2px] pr-[12px] font-[400] placeholder:font-[500] placeholder:text-[#00c3ff]`}
            placeholder="Share an action taken by any character in pursuit of its want OR describe a situation in which the chosen characters interact OR write anything you have in mind. "
            value={newComment}
            required
            onChange={handleTextareaChange}
            onKeyDown={(event) => {
              // console.log('Key pressed:', event.key);
              if (event.key === "Enter") {
                handleButtonClick();
                event.currentTarget.blur();
              }
            }}
          />
        )}
        <div className="absolute right-0 bottom-[2px] xl:bottom-1 flex gap-3 items-center justify-end pr-2 pb-1">
          <div className="md:flex gap-1 items-center hidden ">
            <FaKeyboard
              data-te-toggle="tooltip"
              title={`${!keyboardVisible ? "View Keyboard" : "Hide Keyboard"}`}
              className={`w-6 h-6 ${
                keyboardVisible && "text-[#00c3ff]"
              } cursor-pointer hover:text-[#00c3ff]`}
              onClick={onClickKeyboard}
            />
            <LanguageSelector
              setSelectedLanguage={setSelectedLanguage}
              selectedLanguage={selectedLanguage}
              setKeyboardVisible={setKeyboardVisible}
            />
          </div>

          {isLoading ? (
            <div className=" ">
              <BtnLoading />
            </div>
          ) : (
            <button className="md:w-[21px]" onClick={handleButtonClick}>
              <IoMdSend className="text-[#00c3ff] w-6 h-6" />
              {/* <img
                            src={forwardIcon}
                            alt=""
                            className=" w-full my-auto cursor-pointer lg:!mt-[32px]"
                          /> */}
            </button>
          )}
        </div>
      </div>
      <div
        className={` absolute bottom-[-16px]  ${
          fromNew ? "" : " right-[26px]"
        } right-[12px]`}
      >
        {premiseOwner?.id === user ? (
          <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
            {textCount}/250
          </p>
        ) : (
          <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
            {textCount}/150
          </p>
        )}
      </div>

      {/* <>
        {selectedLanguage && keyboardVisible && (
          <Draggable handle=".movable-handle">
            <div className="absolute z-20 w-[650px] top-[4px] right-[-85px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
              <div className="grid grid-cols-12">
                <div className="movable-handle col-span-11 bg-[#f8f8f8] text-[#616161] cursor-move text-center text-[14px] font-[400]">
                  Drag me!!{" "}
                  <span className="font-[500]">{selectedLanguage}</span>{" "}
                  Keyboard
                </div>
                <div className="flex justify-center items-center w-full h-full cursor-pointer">
                  <button
                    onClick={() => {
                      setKeyboardVisible(false)
                      setSelectedLanguage('')
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
                  setText={setNewComment}
                  inputRef={inputRef}
                />
              </div>
            </div>
          </Draggable>
        )}
      </> */}

      {noAccessPopup?.has_access === false && (
        <NoAccessCreditPopupUpdate
          noAccessPopup={noAccessPopup}
          setNoAccessPopup={setNoAccessPopup}
          service={"Brainstorming"}
          credit_rate={noAccessPopup?.credit_rate}
          remaining_credits={noAccessPopup?.remaining_credits}
        />
      )}
    </div>
  );
};

export default NewTabTextArea;
