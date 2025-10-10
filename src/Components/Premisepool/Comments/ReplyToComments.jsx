import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosUndo, IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useCreateReplyMutation,
  useCreateSuggestedReplyMutation,
  useDeleteLikeOfReplyMutation,
} from "../../../app/EndPoints/commentReply/reply";
import { useTranslateCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../../features/TimeAgo";
import userIcon from "../../../img/Icons/userImg.png";
import BtnLoading from "../../../shared/BtnLoading";
import CommentTranslator from "../../PremiseV2/components/CommentTranslator";
import SameNamePop from "../../PremiseV2/Popups/alerts/SameNamePop";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import { URL } from "../../utils";
import ReplyLikeUsersPop from "../ReplyLikeUsersPop";
import UserType from "../UserType";
import ConfirmationModal from "./ConfirmationModal";
import ReplyLike from "./ReplyLike";
import ReplyToReply from "./ReplyToReply";

const ReplyToComments = ({
  commentIdx,
  fromNew,
  reply,
  owner,
  setProjectBeatOpen,
  setCommentText,
  setBeatCommentText,
  replyRefetch,
  user,
  replyToCommentID,
  handleAddToBeat,
  commentRefetch,
}) => {
  // console.log(" comments", reply);

  const { currentlyOpenedCommentID, currentUser } = useContext(MyContext);
  const [openDltPop, setOpenDltPop] = useState(false);
  const [replySubmitDisable, setReplySubmitDisable] = useState(false);
  const [idToDlt, setIdToDlt] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [likePopup, setLikePopup] = useState(false);
  const [childReplyField, setChildReplyField] = useState(false);
  const [openReplyField, setOpenReplyField] = useState(false);
  const [suggestDisable, setSuggestDisable] = useState(false);
  const [replyText, setReplyText] = useState(reply?.text);
  const [replyTextPrefix, setReplyTextPrefix] = useState(reply?.text_prefix);
  const [childReplyText, setChildReplyText] = useState("");
  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", childReplyText);
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);

  const [noAccessLbPopup, setNoAccessLbPopup] = useState(null);

  const latestReplyRef = useRef(null);
  const replyToReplyRef = useRef(null);

  const replyRef = useRef(null);
  const createdTime = reply?.created_at;

  const [deleteReply, deleteReplyRes] = useDeleteLikeOfReplyMutation();
  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const [suggestion, suggestionRes] = useCreateSuggestedReplyMutation();
  const [translateComment, isTranslationCommentLoading] =
    useTranslateCommentMutation();

  // console.log("reply", reply.add_to_beat);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(reply?.user?.id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  useEffect(() => {
    if (childReplyField && replyRef.current) {
      replyRef.current.focus();
    }
    // }, [childReplyField, replyToCommentID]);
  }, [childReplyField, currentlyOpenedCommentID]);

  // for reply

  // close tabs
  // useEffect(() => {
  //   const closeMenu = (e) => {
  //     if (
  //       !replyRef?.current?.contains(e.target) &&
  //       !e.target.closest("[data-nest-reply]")
  //     ) {
  //       if (!e.target.closest(".absolute")) {
  //         setChildReplyField(false);
  //       }
  //     }
  //   };
  //   document.body.addEventListener("mousedown", closeMenu);
  //   return () => document.body.removeEventListener("mousedown", closeMenu);
  // }, []);

  const [isFullDelete, setIsFullDelete] = useState(false);

  const handleDeleteReply = async (id) => {
    setDisableBtn(true);
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
      commentRefetch();
    } else {
      toast.error("Failed to delete comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableBtn(false);
      commentRefetch();
    }
  };

  const handleReject = async (id) => {
    setDisableBtn(true);
    setIsFullDelete(true);
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
      commentRefetch();
    } else {
      toast.error("Failed to reject comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableBtn(false);
      commentRefetch();
    }
  };

  const [replyChildTextCount, setReplyChildTextCount] = useState(0);

  const handleReplyTextChange = (event) => {
    const childReply = event.target.value.replace(/^\s+|\s+(?=\s)/g, "");
    setReplyChildTextCount(childReply?.length);
    setChildReplyText(childReply);
  };
  const [alert, setAlert] = useState(false);
  const handlePostReplyToReply = async (e, isEnterKey = false) => {
    const childReplyText = replyRef.current.value;
    if (e) {
      e.preventDefault();
    }
    if (childReplyText?.length === 0) {
      // alert("You can't send an empty reply!");
      setAlert(true);
      return;
    }

    setDisableBtn(true);
    const data = {
      // reply: replyToCommentID,
      reply: currentlyOpenedCommentID,
      text: childReplyText,
      parent: reply?.id,
      C: commentIdx,
    };

    const response = await createReplyMutation(data);
    if (response) {
      setChildReplyText("");
      replyRef.current.value = "";
      setReplyChildTextCount(0);
      replyRefetch();
      setOpenReplyField(false);
      setChildReplyField(true);
      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
    }
    setDisableBtn(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !disableBtn) {
      event.preventDefault(); // Prevents default form submission behavior
      handlePostReplyToReply(event, true);
      replyRef.current.blur();
    }
  };

  const checkSuggestAllowance = async (text) => {
    // console.log(text);
    setSuggestDisable(true);
    const res = await fetchUserAccess(
      `${currentUser?.id}/PP_AllowBrainstoming`
    );
    // console.log(`PP_AllowBrainstoming res`, res);
    if (res?.access === "No") {
      setSuggestDisable(false);
      setNoAccessLbPopup(res);
    } else {
      handleSuggest(text);
    }
  };

  const handleSuggest = async (text) => {
    setSuggestDisable(true);

    const data = {
      // reply: replyToCommentID,
      reply: currentlyOpenedCommentID,
      ques_text: text,
      parent: reply?.id,
      C: commentIdx,
    };
    const res = await suggestion(data);
    if (res) {
      replyRefetch();
      setSuggestDisable(false);
      setChildReplyField(true);
    }
  };
  const hasManyReplies = reply?.child_replies?.length >= 3;

  // const phrasesToBold = ["Do Think About:", "OR May be", "May be"];

  // const formatText = (text) => {
  //   // Find a matching prefix
  //   const matchingPrefix = phrasesToBold.find((prefix) =>
  //     text.startsWith(prefix)
  //   );

  //   if (matchingPrefix) {
  //     // Split the text into the bold prefix and the rest
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

  //   // Return the text as is if no prefix matches
  //   return text;
  // };

  const phrasesToBold = ["Do Think About:", "OR May be", "May be"];

  useEffect(() => {}, []);

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
    // console.log("reply child1 comment", currentUser?.id, owner, reply);
    if (
      currentUser?.id !== owner &&
      (reply?.user?.id === 1 || reply?.user?.id === 79)
    ) {
      const res = await fetchUserAccess(`${currentUser?.id}/PP_ReplyAI`);
      // console.log("reply child 1 brainstorm res", res);
      if (res?.access === "No") {
        setNoAccessLbPopup(res);
      } else {
        setOpenReplyField(!openReplyField);
      }
    } else {
      setOpenReplyField(!openReplyField);
    }
  };

  return (
    <div
      data-reply
      className={`w-full ${
        fromNew ? "w-[99%]" : ""
      }   md:pl-[47px]   rounded-sm flex items-center gap-1`}
    >
      <div className="w-full">
        <div
          className={`  relative  ${
            fromNew ? "w-[97%] md:ml-[13px]" : "xl:ml-[26px] xxl:ml-[43px]"
          }`}
        >
          <div
            className={`flex gap-[8px]  ${
              fromNew ? "w-[100%] md:w-[97.5%]" : "w-[100%] md:w-[100%] "
            }  `}
          >
            <a
              target="_blank"
              rel="noreferrer"
              // href={`${URL}/memberpage/#/user/${created_by?.id}`}

              href={
                reply?.id === user
                  ? `${URL}/memberpage/#/personaldetails`
                  : `${URL}/memberpage/#/user/${reply?.id}/personaldetails`
              }
            >
              {" "}
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
              </div>{" "}
            </a>

            <div className="border min-w-[256px] w-[96%]  md:w-[86%] lg:w-[88%] border-[##EAEAEA] bg-[#fafafa] rounded-[8px] p-1 ">
              <div className="flex w-full justify-between my-1 relative">
                <div className="text-[#1E1E1E] pl-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      reply?.id === user
                        ? `${URL}/memberpage/#/personaldetails`
                        : `${URL}/memberpage/#/user/${reply?.user?.id}/personaldetails`
                    }
                    className="flex items-center"
                  >
                    {reply?.user?.first_name || reply?.user?.last_name ? (
                      <p className="notranslate text-[14px] font-[500] hover:text-[#33b0ca] ">
                        {reply?.user?.first_name} {reply?.user?.last_name}
                      </p>
                    ) : (
                      <p className="text-[14px] font-[500] hover:text-[#33b0ca] ">
                        {reply?.user?.email.split("@")[0]}
                      </p>
                    )}
                    {reply?.user?.id === 1 ? (
                      <></>
                    ) : (
                      <UserType
                        type={reply?.user?.centraldatabase?.type}
                        user_type={reply?.user?.centraldatabase?.user_type}
                      />
                    )}
                  </a>
                </div>

                <p className=" text-[14px]   h-[15px] text-[#616161] font-[400]  leading-5  absolute top-[-9px] right-0">
                  {" "}
                  <TimeAgo timestamp={createdTime} />
                </p>
              </div>

              <p className="notranslate text-[#252525] text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                {/* {reply?.text} */}
                {/* {reply?.user?.id === 1 && reply?.text
                  ? formatText(reply?.text)
                  : reply?.text} */}
                {reply?.user?.id === 1 && replyText && replyTextPrefix
                  ? formatText(replyText, replyTextPrefix)
                  : replyText}
              </p>
            </div>
            <div className="hidden  lg:flex flex-col lg:flex-row justify-center gap-1 items-center right-[8.5px] md:right-[6.5px] top-[28%]">
              <CommentTranslator
                comment={reply}
                translateComment={translateComment}
                loading={isTranslationCommentLoading}
                commentRefetch={replyRefetch}
                setCommentText={setReplyText}
                setCommentPrefix={setReplyTextPrefix}
              />

              {(owner === user || reply?.user?.id === user) &&
              !reply?.reject_button &&
              commentIdx !== 1 ? (
                <div className="flex gap-2  items-center pl-[2px]">
                  {/* <button className={` "cursor-pointer"}`}>
                <img src={editIcon} alt=" " className={`h-5 w-7`} />
                </button> */}
                  <button
                    // disabled={disableD}
                    onClick={() => {
                      setIdToDlt(reply?.id);
                      setOpenDltPop(true);
                    }}
                    // className={` ${disableD ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <FaRegTrashAlt
                      disabled={disableBtn}
                      className="h-5 w-5 text-[#909090]"
                    />
                  </button>
                </div>
              ) : (
                <>
                  <div className="xl:pr-[24px] lg:pr-[16px]" />
                </>
              )}
            </div>
          </div>

          <div
            data-nest-reply
            className={`flex justify-between  max-w-[86%] ${
              fromNew ? "md:max-w-[84%]  mr-[0px] md:mr-[70px]" : " "
            }   items-center my-[2px] ml-[39px]  mt-[2px]`}
          >
            <div className=" flex items-center gap-3 text-sm leading-[16px] mt-[2px] mb-[4px]">
              {reply?.child_replies?.length > 0 && (
                <>
                  {!childReplyField ? (
                    <button
                      onClick={() => {
                        setChildReplyField(!childReplyField);
                      }}
                      className="flex items-center  md:gap-[2px]"
                    >
                      <BiPlusCircle
                        // onClick={() => setChildReplies(!childReplies)}
                        className="text-[16px] font-[500] cursor-pointer text-[#252525]"
                      />
                      <p
                        className={`   text-[14px]  text-[#616161] font-[400]   leading-[16.52px]  `}
                      >
                        <span className=" md:hidden">
                          {reply?.child_replies?.length}
                        </span>
                        <span className="hidden md:inline">
                          {reply?.child_replies?.length}{" "}
                          {reply?.child_replies?.length === 1
                            ? "Reply"
                            : "Replies"}
                        </span>
                      </p>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setChildReplyField(!childReplyField);
                      }}
                      className="flex items-center  gap-[2px]"
                    >
                      <BiMinusCircle className="  text-[16px] font-[500] cursor-pointer text-[#252525]" />
                      <p className="  text-[14px]  text-[#33B0CA] font-[400]    leading-[16.52px]   ">
                        <span className="md:hidden">
                          {reply?.child_replies?.length}
                        </span>
                        <span className="hidden md:inline">
                          {reply?.child_replies?.length}{" "}
                          {reply?.child_replies?.length === 1
                            ? "Reply"
                            : "Replies"}
                        </span>
                      </p>
                    </button>
                  )}
                </>
              )}
              <button
                className="flex items-center gap-1"
                // data-reply
                onClick={() => {
                  handleChildReply();
                  //setOpenReplyField(!openReplyField);
                }}
              >
                <IoIosUndo
                  className={`${
                    openReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                  }`}
                />
                <p
                  className={`${
                    openReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                  }  text-[14px]  hidden md:block font-[400]   leading-[16.52px]  `}
                >
                  Reply
                </p>
              </button>
              <div className="hidden md:block">
                {owner === user &&
                  (reply?.text?.includes("?") || reply?.text?.includes("؟")) &&
                  reply?.user?.id === 1 && (
                    <>
                      {reply?.suggested ? (
                        <button className="px-2  rounded-[4px] pb-[4px] pt-[2px] bg-[#616161] cursor-auto">
                          <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                            Suggested
                          </p>
                        </button>
                      ) : (
                        <>
                          {suggestDisable ? (
                            <button className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[#33B0CA] cursor-auto">
                              <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                                Suggesting...
                              </p>
                            </button>
                          ) : (
                            <button
                              className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[#33B0CA] cursor-pointer"
                              onClick={() => checkSuggestAllowance(reply?.text)}
                            >
                              <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                                Suggestion
                              </p>
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
              </div>
              <div className="hidden md:block ">
                <ReplyLike {...{ reply, setLikePopup, replyRefetch }} />
              </div>

              <div className="flex md:hidden">
                <ReplyLike {...{ reply, setLikePopup, replyRefetch }} />
              </div>

              {owner === user &&
                (reply?.text?.includes("?") || reply?.text?.includes("؟")) &&
                reply?.user?.id === 1 && (
                  <>
                    {reply?.suggested ? (
                      <button className="px-2 md:hidden  rounded-[4px] py-[2px] bg-[#616161]">
                        <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                          Suggested
                        </p>
                      </button>
                    ) : (
                      <button
                        className="px-2 md:hidden rounded-[4px] py-[2px] bg-[#33B0CA]"
                        onClick={() => checkSuggestAllowance(reply?.text)}
                      >
                        {suggestDisable ? (
                          <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                            Suggesting...
                          </p>
                        ) : (
                          <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                            Suggestion
                          </p>
                        )}
                      </button>
                    )}
                  </>
                )}

              <>
                {reply?.reject_button &&
                  (owner === user || reply?.user?.id === user) && (
                    <button className=" cursor-auto w-[60px]">
                      <p
                        onClick={() => handleReject(reply?.id)}
                        className=" text-[14px]  bg-red-500 cursor-pointer py-[2px] rounded-[4px] text-[#fafafa] font-[400]   leading-[16.52px]   "
                      >
                        Reject
                      </p>
                    </button>
                  )}
              </>
            </div>

            <div className="flex items-center  justify-end gap-[14px] leading-[16px] md:w-[30%] ">
              {/* <div className="flex md:hidden">
                <ReplyLike {...{ reply, setLikePopup, replyRefetch }} />
              </div> */}

              {/* {owner === user &&
                (reply?.text?.includes("?") || reply?.text?.includes("؟")) &&
                reply?.user?.id === 1 && (
                  <>
                    {reply?.suggested ? (
                      <button className="px-2 md:hidden  rounded-[4px] py-[2px] bg-[#616161]">
                        <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                          Suggested
                        </p>
                      </button>
                    ) : (
                      <button
                        className="px-2 md:hidden rounded-[4px] py-[2px] bg-[#33B0CA]"
                        onClick={() => checkSuggestAllowance(reply?.text)}
                      >
                        {suggestDisable ? (
                          <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                            Suggesting...
                          </p>
                        ) : (
                          <p className=" text-[14px]  text-[#fafafa] font-[400]   leading-[16.52px]    ">
                            Suggestion
                          </p>
                        )}
                      </button>
                    )}
                  </>
                )}

              <>
                {reply?.reject_button &&
                  (owner === user || reply?.user?.id === user) && (
                    <button className=" cursor-auto w-[60px]">
                      <p
                        onClick={() => handleReject(reply?.id)}
                        className=" text-[14px]  bg-red-500 cursor-pointer py-[2px] rounded-[4px] text-[#fafafa] font-[400]   leading-[16.52px]   "
                      >
                        Reject
                      </p>
                    </button>
                  )}
              </> */}

              {!(reply?.text?.includes("?") || reply?.text?.includes("؟")) && (
                <>
                  {reply?.add_to_beat ? (
                    <>
                      {(owner === user || reply?.user?.id === user) && (
                        <button className=" cursor-auto w-[89px]">
                          <p className=" text-[12px]  text-[#33B0CA] italic  font-[400]   leading-[16.52px]   ">
                            Added as Beat
                          </p>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {(owner === user || reply?.user?.id === owner) &&
                        ![1, 2, 3].includes(commentIdx) && (
                          <button
                            onClick={() => {
                              handleAddToBeat(reply);
                              setBeatCommentText(reply?.text);
                            }}
                            className="w-[88px]"
                          >
                            <p className="text-[14px] text-[#008000] hover:text-[#33B0CA] font-[400] leading-[16.52px]   ">
                              Add as Beat
                            </p>
                          </button>
                        )}
                    </>
                  )}
                </>
              )}
              <div className="  flex  lg:hidden justify-center gap-1 items-center ">
                <CommentTranslator
                  comment={reply}
                  translateComment={translateComment}
                  loading={isTranslationCommentLoading}
                  commentRefetch={replyRefetch}
                  setCommentText={setReplyText}
                  setCommentPrefix={setReplyTextPrefix}
                />

                {(owner === user || reply?.user?.id === user) &&
                !reply?.reject_button &&
                commentIdx !== 1 ? (
                  <div className="flex gap-2  items-center pl-[2px]">
                    {/* <button className={` "cursor-pointer"}`}>
                <img src={editIcon} alt=" " className={`h-5 w-7`} />
                </button> */}
                    <button
                      // disabled={disableD}
                      onClick={() => {
                        setIdToDlt(reply?.id);
                        setOpenDltPop(true);
                      }}
                      // className={` ${disableD ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <FaRegTrashAlt
                        disabled={disableBtn}
                        className="h-5 w-5 text-[#909090]"
                      />
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          {/* nested replies */}

          {openReplyField && (
            <div data-nest-reply className=" w-[89%]  mb-[8px] ml-[46px]">
              <motion.div
                // data-reply
                // ref={replyRef}
                initial={{ opacity: 0, x: -70 }} // Start from slightly below the final position
                animate={{ opacity: 1, x: 0 }} // Move to the final position
                exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                transition={{ duration: 0.5 }} // Adjust the duration as needed
              >
                <form
                  onSubmit={handlePostReplyToReply}
                  className="relative w-[84%] mr-[42px] md:w-[88.2%] md:mr-[37px] ml-auto text-[14px]
            bg-[#fafafa] border rounded-[8px] border-[#eaeaea] focus:outline-none flex"
                >
                  <textarea
                    // data-reply-reply
                    ref={replyRef}
                    type="text"
                    name="reply"
                    maxLength={150}
                    id=""
                    className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] px-[8px] w-[100%] h-[44.27px]  lg:h-[37px] focus:border-none focus:outline-none text-[14px] pr-[45px] font-[400]"
                    placeholder="Enter your reply..."
                    // required
                    value={childReplyText}
                    onChange={handleReplyTextChange}
                    onKeyDown={handleKeyDown}
                  />
                  {disableBtn ? (
                    <div className=" absolute right-[16px] bottom-[20%] ">
                      <BtnLoading />
                    </div>
                  ) : (
                    <button
                      // data-reply-reply
                      className="md:w-[21px] absolute right-[16px] bottom-[20%]"
                      disabled={disableBtn}
                      type="submit"
                      // onClick={handlePostReplyToReply}
                    >
                      <IoMdSend className="text-[#33B0CA] w-6 h-6" />
                    </button>
                  )}
                </form>
                <div className=" text-right">
                  <p className=" text-[14px]  font-[400] w-[86%] md:w-[94%] leading-[14px]  text-[#616161] md:mr-[13px]">
                    {replyChildTextCount}/150
                  </p>
                </div>
              </motion.div>
            </div>
          )}
          {childReplyField && (
            <div
              data-nest-reply
              className="w-[102%] md:w-[94%]  mb-[8px] md:ml-auto"
            >
              {/* <div className={``}> */}
              <div
                className={`${
                  hasManyReplies && !fromNew
                    ? "w-full max-h-[300px] overflow-y-auto pr-2"
                    : ""
                }`}
              >
                {reply?.child_replies &&
                  reply?.child_replies
                    ?.slice() // Create a shallow copy to avoid mutating the original array
                    ?.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    ?.map((childReply, idx) => (
                      <motion.div
                        // data-reply

                        key={idx + childReply.id}
                        initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
                        animate={{ opacity: 1, y: 0 }} // Move to the final position
                        exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                        transition={{ duration: 0.5 }} // Adjust the duration as needed
                      >
                        <div ref={latestReplyRef}>
                          <ReplyToReply
                            fromNew={fromNew}
                            // data-reply-reply
                            handleAddToBeat={handleAddToBeat}
                            key={idx + childReply.id}
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
                          />
                        </div>
                      </motion.div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {likePopup && (
        <ReplyLikeUsersPop setLikePopup={setLikePopup} userID={reply?.likes} />
      )}
      {openDltPop && (
        <ConfirmationModal
          isOpen={openDltPop}
          onClose={() => setOpenDltPop(false)}
          onConfirm={() => handleDeleteReply(idToDlt)}
          title="Are you sure you want to delete this comment?"
          content="Are you sure you want to delete this item?"
        />
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
      {alert && (
        <SameNamePop
          popClose={setAlert}
          title={`You can't send an empty reply!`}
        />
      )}
    </div>
  );
};

export default ReplyToComments;
