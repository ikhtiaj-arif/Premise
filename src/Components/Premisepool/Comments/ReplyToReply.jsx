import { useContext, useRef, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosUndo, IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import {
  useCreateReplyMutation,
  useCreateSuggestedReplyMutation,
  useDeleteLikeOfReplyMutation,
  useUpdateLikeOfReplyMutation,
} from "../../../app/EndPoints/commentReply/reply";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../../features/TimeAgo";
// import forwardIcon from "../../../img/Icons/forwardIcon.png";
import { fetchUserAccess, MyContext } from "../../../App";

import userIcon from "../../../img/Icons/userImg.png";
import BtnLoading from "../../../shared/BtnLoading";
import CommentTranslator from "../../PremiseV2/components/CommentTranslator";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import { baseURL } from "../../utils";
import ReplyLikeUsersPop from "../ReplyLikeUsersPop";

import ReplyToReply2 from "./ReplyToReply2";

import { useTranslateCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import ConfirmationModal from "./ConfirmationModal";

const ReplyToReply = ({
  handleAddToBeat,
  fromNew,
  setCommentText,
  setBeatCommentText,
  childReply,
  childReplyIDNext,
  owner,
  user,
  replyRefetch,
  reply,
  replyToCommentID,
  commentIdx,
  depth = 0,
}) => {
  const replyBy = childReply?.user;
  const currentReplyId = childReply?.id;
  const createdTime = childReply?.created_at;
  const replyLikes = childReply?.likes;
  // console.log("childReply", replyLikes);
  const {
    selectedPremiseObj,
    selectedSpProjectID,
    createdSpProjectID,
    currentlyOpenedCommentID,
    setCurrentlyOpenedCommentID,
    currentUser,
  } = useContext(MyContext);
  const [openDltPop, setOpenDltPop] = useState(false);
  const [replyText, setReplyText] = useState(childReply?.text);
  const [replyTextPrefix, setReplyTextPrefix] = useState(
    childReply?.text_prefix
  );
  const [currentReply2Id, setCurrentReply2Id] = useState(childReply?.id);
  const [idToDlt, setIdToDlt] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [likePopup, setLikePopup] = useState(false);
  const [childReplyField, setChildReplyField] = useState(false);
  const [childReplies, setChildReplies] = useState(false);

  const [suggestDisable, setSuggestDisable] = useState(false);
  const [noAccessLbPopup, setNoAccessLbPopup] = useState(null);

  const [likeReply, likeReplyRes] = useUpdateLikeOfReplyMutation();
  const [deleteReply, deleteReplyRes] = useDeleteLikeOfReplyMutation();
  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const [translateComment, isTranslationCommentLoading] =
    useTranslateCommentMutation();
  const replyToReplyRef = useRef(null);
  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(replyBy?.id);

  const proImgUrl = baseURL.concat(profileImg?.[0]?.profile_photo);

  const handleDeleteReply = async (id) => {
    setDisableBtn(true);
    // console.log(id);
    const deleteData = {
      id,
    };
    const res = await deleteReply(deleteData);
    if (res?.data) {
      replyRefetch();
      toast.success("Comment Deleted!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableBtn(false);
    } else {
      toast.error("Failed to delete comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      replyRefetch();
      setDisableBtn(false);
    }
  };

  const handleRejectReply = async (id) => {
    setDisableBtn(true);
    // console.log(id);
    const deleteData = {
      id,
      isRejected: true,
    };

    const res = await deleteReply(deleteData);
    if (res?.data) {
      replyRefetch();
      toast.success("Comment Rejected!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableBtn(false);
    } else {
      toast.error("Failed to reject comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      replyRefetch();
      setDisableBtn(false);
    }
  };
  // console.log("childReply", childReply?.user?.id, "user", user, "owner", owner);
  const childReplyRef = useRef();
  const [replyChildTextCount, setReplyChildTextCount] = useState(0);
  const [childReplyText, setChildReplyText] = useState("");
  const [openReplyField, setOpenReplyField] = useState(false);

  const handlePostReplyToReply = async (e, isEnterKey = false) => {
    const childReplyText = childReplyRef.current.value;
    if (e) {
      e.preventDefault();
    }
    if (childReplyText.length === 0) {
      alert("You can't send an empty reply!");
      return;
    }

    setDisableBtn(true);
    let replyData = {
      // reply: replyToCommentID,
      reply: currentlyOpenedCommentID,
      text: childReplyText,
      parent: childReply?.id,
      C: commentIdx,
    };

    const response = await createReplyMutation(replyData);
    if (response) {
      childReplyRef.current.value = "";
      setReplyChildTextCount(0);
      setChildReplyText("");
      replyRefetch();
      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      // setOpenReplyField(false); // Close the input field
      setChildReplyField(false); // Open the child reply field
      setChildReplies(true);
    }
    setDisableBtn(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !disableBtn) {
      event.preventDefault(); // Prevents default form submission behavior
      handlePostReplyToReply(event, true);
      // replyToReplyRef.current.blur();
      childReplyRef.current.blur();
    }
  };

  const handleReplyTextChange = (event) => {
    const childReply = event.target.value.replace(/^\s+|\s+(?=\s)/g, "");
    setReplyChildTextCount(childReply?.length);
    setChildReplyText(childReply);
  };

  const [suggestion, suggestionRes] = useCreateSuggestedReplyMutation();

  const checkSuggestAllowance = async (text) => {
    setSuggestDisable(true);
    const res = await fetchUserAccess(`PP_AllowBrainstoming`);
    console.log(`PP_AllowBrainstoming res`, res);
    if (res?.access === "No") {
      setSuggestDisable(false);
      setNoAccessLbPopup(res);
    } else {
      handleSuggest(text);
    }
  };

  const handleSuggest = async (text) => {
    const cleanedText = text.includes(":") ? text.split(":")[1].trim() : text;
    console.log("suggestion text from reply", cleanedText);
    setSuggestDisable(true);

    const data = {
      // reply: replyToCommentID,
      reply: currentlyOpenedCommentID,
      ques_text: cleanedText,
      parent: childReply?.id,
      C: commentIdx,
    };
    const res = await suggestion(data);
    if (res) {
      replyRefetch();
      setSuggestDisable(false);
      setChildReplies(true);
      const creditRes = await fetchUserAccess(`PP_AllowBrainstoming`);
      const remainingCredits = creditRes?.remaining_credits ?? 0;
      const creditElement = document.getElementById("creditBalance");
      if (creditElement) {
        creditElement.textContent = remainingCredits;
      }
    }
  };

  const phrasesToBold = ["Do Think About:", "OR May be", "May be"];

  // const formatText = (text) => {
  //   const matchingPrefix = phrasesToBold.find((prefix) =>
  //     text.startsWith(prefix)
  //   );

  //   if (matchingPrefix) {
  //     const restOfText = text.slice(matchingPrefix.length);
  //     return (
  //       <>
  //         <span style={{ color: "#252525", fontWeight: 500 }}>
  //           {matchingPrefix}
  //         </span>
  //         {restOfText}
  //       </>
  //     );
  //   }
  //   return text;
  // };
  const formatText = (text, prefix) => {
    if (prefix) {
      // If there's a prefix, make it bold and show at the front
      return (
        <>
          <span style={{ color: "#252525", fontWeight: 600 }}>{prefix}: </span>
          {text}
        </>
      );
    }

    // Return the text as is if no prefix matches
    return text;
  };

  const handleChildReply = async () => {
    // console.log("reply child 2 comment", currentUser?.id, owner, reply);
    if (
      currentUser?.id !== owner &&
      (reply?.user?.id === 1 || reply?.user?.id === 79)
    ) {
      const res = await fetchUserAccess(`PP_ReplyAI`);
      if (res?.access === "No") {
        setNoAccessLbPopup(res);
      } else {
        setChildReplyField(!childReplyField);
      }
    } else {
      setChildReplyField(!childReplyField);
    }
  };

  return (
    <>
      <div
        className={`w-full ${
          fromNew ? "max-w-[96%]" : "max-w-[592px]"
        } ml-[0px]`}
      >
        <div className="flex gap-[8px]">
          <div className="flex flex-col items-center gap-1">
            <a
              // target="_blank"
              rel="noreferrer"
              href={
                replyBy?.id === user
                  ? `${baseURL}/memberpage/#/personaldetails`
                  : `${baseURL}/memberpage/#/user/${replyBy?.id}/personaldetails`
              }
            >
              <div>
                {profileImg?.[0]?.profile_photo ? (
                  <img
                    src={proImgUrl}
                    className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
                    alt=""
                  />
                ) : (
                  <img
                    src={userIcon}
                    className="h-[31.9px] w-[32px] mt-[6px]"
                    alt=""
                  />
                )}
              </div>
            </a>
          </div>
          <div className="border  w-full md:w-[86%] lg:w-[89%] border-[##EAEAEA] bg-[#f8f8f8] rounded-[8px] p-1 ">
            <div className="flex justify-between my-1 relative">
              <div className="text-[#1E1E1E] pl-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
                <a
                  // target="_blank"
                  rel="noreferrer"
                  href={
                    replyBy?.id === user
                      ? `${baseURL}/memberpage/#/personaldetails`
                      : `${baseURL}/memberpage/#/user/${replyBy?.id}/personaldetails`
                  }
                  className="flex items-center"
                >
                  {childReply?.user?.first_name ||
                  childReply?.user?.last_name ? (
                    <p className=" notranslate text-[14px] font-[500] hover:text-[#00c3ff]">
                      {childReply?.user?.first_name}{" "}
                      {childReply?.user?.last_name}{" "}
                    </p>
                  ) : (
                    <p className="text-[14px] font-[500] hover:text-[#00c3ff]">
                      {childReply?.user?.email.split("@")[0]}{" "}
                    </p>
                  )}
                  {replyBy?.id === 1 ? (
                    <></>
                  ) : (
                  <></>
                  )}
                </a>
              </div>

              <p className="text-[14px]  h-[15px] text-[#616161] font-[400]  leading-5  absolute top-[-9px] right-0">
                {" "}
                <TimeAgo timestamp={createdTime} />
              </p>
            </div>

            <p className="notranslate text-[#252525] text-[14px] lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
              {/* {childReply?.text} */}
              {/* {replyBy?.id === 1 && childReply?.text
                ? formatText(childReply?.text)
                : childReply?.text} */}
              {replyBy?.id === 1 && replyText && replyTextPrefix
                ? formatText(replyText, replyTextPrefix)
                : replyText}
            </p>
          </div>{" "}
          <div className="hidden lg:flex flex-row justify-center gap-1 items-center ">
            <CommentTranslator
              comment={childReply}
              translateComment={translateComment}
              loading={isTranslationCommentLoading}
              commentRefetch={replyRefetch}
              setCommentText={setReplyText}
              setCommentPrefix={setReplyTextPrefix}
            />

            {(owner === user || replyBy?.id === user) &&
            !childReply?.reject_button ? (
              <div className="flex gap-2 items-center pl-[2px]">
                <button
                  onClick={() => {
                    setIdToDlt(currentReplyId);
                    setOpenDltPop(true);
                  }}
                >
                  <FaRegTrashAlt className="h-5 w-5 text-[#909090]" />
                </button>
              </div>
            ) : (
              <div className={` 'cursor-default'}`}>
                <div className="" />
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex justify-between items-center w-[86%] lg:w-[89%] ${
            fromNew ? "md:mr-[66px] lg:mr-[48px]" : "sm:mr-[10px] md:mr-[35px]"
          } my-[2px] mt-[2px]  ml-auto mb-[2px] md:mb-[2px]`}
        >
          <div className="md:flex items-center hidden md:ml-[0px] gap-3 leading-[16px] mt-[2px] mb-[4px]">
            <>
              {childReply?.child_replies?.length > 0 && (
                <div className="flex items-center">
                  {!childReplies ? (
                    <button
                      onClick={() => {
                        setChildReplies(!childReplies);
                      }}
                      className="flex items-center gap-[2px]"
                    >
                      <BiPlusCircle className="text-[16px] font-[500] cursor-pointer text-[#252525]" />
                      <p className="text-[14px] text-[#616161] font-[400] leading-[14.52px] flex gap-[4px] ">
                        <span className=" md:hidden">
                          {" "}
                          {childReply?.child_replies?.length}{" "}
                        </span>
                        <span className="hidden md:block">
                          {childReply?.child_replies?.length}{" "}
                          {childReply?.child_replies?.length > 1
                            ? "Replies"
                            : "Reply"}
                        </span>
                      </p>
                    </button>
                  ) : (
                    <button
                      onClick={() => setChildReplies(!childReplies)}
                      className="flex items-center  gap-[2px]"
                    >
                      <BiMinusCircle className="text-[16px] font-[500] cursor-pointer text-[#252525] flex gap-[4px]" />
                      <p
                        className={`text-[14px]  text-[#00c3ff]   font-[400] leading-[14.52px] `}
                      >
                        <span className=" md:hidden">
                          {" "}
                          {childReply?.child_replies?.length}{" "}
                        </span>
                        <span className="hidden md:block">
                          {childReply?.child_replies?.length}{" "}
                          {childReply?.child_replies?.length > 1
                            ? "Replies"
                            : "Reply"}
                        </span>
                      </p>
                    </button>
                  )}
                </div>
              )}
              <div>
                <button
                  onClick={() => handleChildReply()}
                  className="flex items-center gap-1 "
                >
                  <IoIosUndo
                    className={`${
                      childReplyField ? "text-[#00c3ff]" : "text-[#252525]"
                    } text-[14px]`}
                  />
                  <p
                    className={`text-[14px] hidden md:block ${
                      childReplyField ? "text-[#00c3ff]" : "text-[#252525]"
                    } font-[400]  cursor-pointer`}
                  >
                    Reply
                  </p>
                </button>
              </div>
              <div className="hidden md:block">
                {owner === user &&
                  (childReply?.text?.includes("?") ||
                    childReply?.text?.includes("؟")) &&
                  childReply?.user?.id === 1 && (
                    <>
                      {childReply?.suggested ? (
                        <button className="px-2  rounded-[4px] pb-[4px] pt-[2px] bg-[linear-gradient(30deg,#b38bff,#99e6ff)] cursor-auto">
                          <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                            Suggested
                          </p>
                        </button>
                      ) : (
                        <>
                          {suggestDisable ? (
                            <button className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[linear-gradient(30deg,#741CFF,#00c3ff)] cursor-auto">
                              <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                                Suggesting...
                              </p>
                            </button>
                          ) : (
                            <button
                              className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[linear-gradient(30deg,#741CFF,#00c3ff)] cursor-pointer"
                              onClick={() => checkSuggestAllowance(reply?.text)}
                            >
                              <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                                Suggestion
                              </p>
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
              </div>

              {/* <ReplyLike
                reply={childReply}
                {...{ setLikePopup, replyRefetch }}
              /> */}
            </>
            <>
              {childReply?.reject_button &&
                (owner === user || childReply?.user?.id === user) && (
                  <button className=" cursor-auto w-[60px]">
                    <p
                      onClick={() => handleRejectReply(childReply?.id)}
                      className=" text-[14px]  bg-red-500 cursor-pointer py-[2px] rounded-[4px] text-[#fafafa] font-[400]   leading-[16.52px]    "
                    >
                      Reject
                    </p>
                  </button>
                )}
            </>
          </div>
          <div className="md:hidden flex items-center gap-3 mt-[2px] mb-[4px]">
            <>
              {childReply?.child_replies?.length > 0 && (
                <div className="flex items-center">
                  {!childReplies ? (
                    <button
                      onClick={() => {
                        setChildReplies(!childReplies);
                      }}
                      className="flex items-center gap-[2px]"
                    >
                      <BiPlusCircle className="text-[16px] font-[500] cursor-pointer text-[#252525]" />
                      <p className="text-[14px] text-[#616161] font-[400] leading-[14.52px] flex gap-[4px] ">
                        <span className=" md:hidden">
                          {" "}
                          {childReply?.child_replies?.length}{" "}
                        </span>
                        <span className="hidden md:block">
                          {childReply?.child_replies?.length}{" "}
                          {childReply?.child_replies?.length > 1
                            ? "Replies"
                            : "Reply"}
                        </span>
                      </p>
                    </button>
                  ) : (
                    <button
                      onClick={() => setChildReplies(!childReplies)}
                      className="flex items-center  gap-[2px]"
                    >
                      <BiMinusCircle className="text-[16px] font-[500] cursor-pointer text-[#252525] flex gap-[4px]" />
                      <p
                        className={`text-[14px]  text-[#00c3ff]   font-[400] leading-[16.52px] `}
                      >
                        <span className=" md:hidden">
                          {" "}
                          {childReply?.child_replies?.length}{" "}
                        </span>
                        <span className="hidden md:block">
                          {childReply?.child_replies?.length}{" "}
                          {childReply?.child_replies?.length > 1
                            ? "Replies"
                            : "Reply"}
                        </span>
                      </p>
                    </button>
                  )}
                </div>
              )}
              <div>
                <button
                  onClick={() => handleChildReply()}
                  className="flex items-center gap-1 "
                >
                  <IoIosUndo
                    className={`${
                      childReplyField ? "text-[#00c3ff]" : "text-[#252525]"
                    } text-[14px]`}
                  />
                  <p
                    className={`text-[14px] hidden md:block ${
                      childReplyField ? "text-[#00c3ff]" : "text-[#252525]"
                    } font-[400]  cursor-pointer`}
                  >
                    Reply
                  </p>
                </button>
              </div>
            </>

            <div className="flex items-center justify-end gap-[4px]">
              <div className="mt-[-4px] flex md:hidden">
                {/* <ReplyLike
                  reply={childReply}
                  {...{ setLikePopup, replyRefetch }}
                /> */}
              </div>
              <div className="md:hidden mt-[-6px]">
                {owner === user &&
                  (childReply?.text?.includes("?") ||
                    childReply?.text?.includes("؟")) &&
                  childReply?.user?.id === 1 && (
                    <>
                      {childReply?.suggested ? (
                        <button className="px-2  rounded-[4px] py-[2px] bg-[linear-gradient(30deg,#b38bff,#99e6ff)]">
                          <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                            Suggested
                          </p>
                        </button>
                      ) : (
                        <button
                          className="px-2  rounded-[4px] py-[2px] bg-[#00c3ff]"
                          onClick={() =>
                            checkSuggestAllowance(childReply?.text)
                          }
                        >
                          {suggestDisable ? (
                            <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                              Suggesting...
                            </p>
                          ) : (
                            <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                              Suggestion
                            </p>
                          )}
                        </button>
                      )}
                    </>
                  )}
              </div>
              <>
                {childReply?.reject_button &&
                  (owner === user || childReply?.user?.id === user) && (
                    <button className=" cursor-auto w-[60px]">
                      <p
                        onClick={() => handleRejectReply(childReply?.id)}
                        className=" text-[14px]  bg-red-500 cursor-pointer py-[2px] rounded-[4px] text-[#fafafa] font-[400]   leading-[16.52px]"
                      >
                        Reject
                      </p>
                    </button>
                  )}
              </>
              {/* {!(
                childReply?.text?.includes("?") ||
                childReply?.text?.includes("؟")
              ) && (
                <div className="mt-[0px]">
                  {childReply?.add_to_beat ? (
                    <>
                      {(owner === user || childReply?.user?.id === user) && (
                        <button className=" cursor-auto w-[89px]">
                          <p className="text-[14px] text-[#00c3ff] italic  font-[400] leading-[14.52px] ">
                            Added as Beat
                          </p>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {(owner === user || childReply?.user?.id === owner) &&
                        ![1, 2, 3].includes(commentIdx) && (
                          <button
                            onClick={() => {
                              handleAddToBeat(childReply);
                              setBeatCommentText(childReply?.text);
                              replyRefetch();
                            }}
                            className=" w-[74px]"
                          >
                            <p className="text-[14px] text-[#008000] hover:text-[#00c3ff] font-[400] leading-[14.52px] ">
                              Add as Beat
                            </p>
                          </button>
                        )}
                    </>
                  )}
                </div>
              )} */}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-end gap-[4px]">
            <div className="mt-[-4px] flex md:hidden">
              {/* <ReplyLike
                reply={childReply}
                {...{ setLikePopup, replyRefetch }}
              /> */}
            </div>
            <div className="md:hidden mt-[-6px]">
              {owner === user &&
                (childReply?.text?.includes("?") ||
                  childReply?.text?.includes("؟")) &&
                childReply?.user?.id === 1 && (
                  <>
                    {childReply?.suggested ? (
                      <button className="px-2  rounded-[4px] py-[2px] bg-[linear-gradient(30deg,#b38bff,#99e6ff)]">
                        <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                          Suggested
                        </p>
                      </button>
                    ) : (
                      <button
                        className="px-2  rounded-[4px] py-[2px] bg-[linear-gradient(30deg,#741CFF,#00c3ff)]"
                        onClick={() => checkSuggestAllowance(childReply?.text)}
                      >
                        {suggestDisable ? (
                          <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                            Suggesting...
                          </p>
                        ) : (
                          <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]   ">
                            Suggestion
                          </p>
                        )}
                      </button>
                    )}
                  </>
                )}
            </div>
            {/* <>
              {childReply?.reject_button &&
                (owner === user || childReply?.user?.id === user) && (
                  <button className=" cursor-auto w-[60px]">
                    <p
                      onClick={() => handleRejectReply(childReply?.id)}
                      className="text-[14px] bg-red-500 cursor-pointer py-[2px] rounded-[4px] text-[#fafafa] font-[400] leading-[14.52px] "
                    >
                      Reject
                    </p>
                  </button>
                )}
            </> */}
          </div>
          <div className=" flex  justify-center gap-2 items-center ">
            {!(
              childReply?.text?.includes("?") || childReply?.text?.includes("؟")
            ) && (
              <div className="mt-[-8px]">
                {childReply?.add_to_beat ? (
                  <>
                    {(owner === user || childReply?.user?.id === user) && (
                      <button className=" cursor-auto w-[109px]">
                        <p className="text-[14px] text-[#00c3ff] italic  font-[400] leading-[14.52px] ">
                          Added as Beat
                        </p>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {(owner === user || childReply?.user?.id === owner) &&
                      ![1, 2, 3].includes(commentIdx) && (
                        <button
                          onClick={() => {
                            handleAddToBeat(childReply);
                            setBeatCommentText(childReply?.text);
                            replyRefetch();
                          }}
                          className=" w-[88px]"
                        >
                          <p className="text-[14px] text-[#008000] hover:text-[#00c3ff] font-[400] leading-[16.52px]  ">
                            Add as Beat
                          </p>
                        </button>
                      )}
                  </>
                )}
              </div>
            )}
            <div className="lg:hidden flex items-center gap-1">
              {" "}
              <CommentTranslator
                comment={childReply}
                translateComment={translateComment}
                loading={isTranslationCommentLoading}
                commentRefetch={replyRefetch}
                setCommentText={setReplyText}
                setCommentPrefix={setReplyTextPrefix}
              />
              {(owner === user || replyBy?.id === user) &&
              !childReply?.reject_button ? (
                <div className="flex gap-2 items-center pl-[2px]">
                  <button
                    onClick={() => {
                      setIdToDlt(currentReplyId);
                      setOpenDltPop(true);
                    }}
                  >
                    <FaRegTrashAlt className="h-5 w-5 text-[#909090]" />
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {openDltPop && (
          <ConfirmationModal
            isOpen={openDltPop}
            onClose={() => setOpenDltPop(false)}
            onConfirm={() => handleDeleteReply(idToDlt)}
            title="Are you sure you want to delete this comment?"
            content="Are you sure you want to delete this item?"
          />
        )}
        {likePopup && (
          <ReplyLikeUsersPop setLikePopup={setLikePopup} userID={replyLikes} />
        )}
      </div>
      {childReplyField && (
        <div
          data-nest-reply
          className=" w-[87%]  mb-[8px] ml-auto mr-[6px] md:mr-[22px]"
        >
          <form
            onSubmit={async (e) => {
              await handlePostReplyToReply(e);
              // setChildReplyField(false);
              // setChildReplies(true);
            }}
            className="relative w-[85%] mr-[26px] md:w-[88%] md:mr-[28px] ml-auto text-[14px] 
              bg-[#fafafa] border rounded-[8px] border-[#eaeaea] focus:outline-none flex"
          >
            <textarea
              ref={childReplyRef}
              type="text"
              name="reply"
              maxLength={150}
              value={childReplyText}
              className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] px-[8px] w-[100%] h-[44.27px]  lg:h-[37px] focus:border-none focus:outline-none text-[14px] pr-[45px] font-[400]"
              placeholder="Enter your reply..."
              onChange={handleReplyTextChange}
              onKeyDown={handleKeyDown}
            />
            {disableBtn ? (
              <div className=" absolute right-[16px] bottom-[20%] ">
                <BtnLoading />
              </div>
            ) : (
              <button
                className="md:w-[21px] absolute right-[16px] bottom-[20%]"
                disabled={disableBtn}
                type="submit"
              >
                <IoMdSend className="text-[#00c3ff] w-6 h-6" />
              </button>
            )}
          </form>
          <div className=" text-right">
            <p className="text-[14px] font-[400] leading-[14px]  text-[#616161] mr-[33px]">
              {replyChildTextCount}/150
            </p>
          </div>
        </div>
      )}
      {childReplies && (
        <div className="w-[96%] md:w-[91%] mr-0 md:mr-[22px] mb-[8px] ml-auto">
          {childReply?.child_replies &&
            childReply?.child_replies
              ?.slice() // Create a shallow copy to avoid mutating the original array
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              ?.map(
                (childReply, idx) =>
                  depth < 2 && (
                    <ReplyToReply2
                      handleAddToBeat={handleAddToBeat}
                      key={childReply?.id + idx}
                      setCommentText={setCommentText}
                      setBeatCommentText={setBeatCommentText}
                      childReplyIDNext={childReply?.id}
                      childReply={childReply}
                      owner={owner}
                      user={user}
                      replyRefetch={replyRefetch}
                      reply={reply}
                      replyToCommentID={replyToCommentID}
                      commentIdx={commentIdx}
                      fromNew={fromNew}
                    />
                  )
              )}
        </div>
      )}

      {noAccessLbPopup?.msg === "ShowBecomePrivilege" && (
        <NoAccessPopUp
          noAccessPopup={noAccessLbPopup}
          setNoAccessPopup={setNoAccessLbPopup}
        />
      )}
      {(noAccessLbPopup?.msg === "LB" ||
        noAccessLbPopup?.msg === "ShowBuyPackage_and_Allacarte") && (
        <NoAccessLbPopUp
          noAccessLbPopup={noAccessLbPopup}
          setNoAccessPopup={setNoAccessLbPopup}
          service={`PP_Brainstrom`}
        />
      )}
    </>
  );
};

export default ReplyToReply;
