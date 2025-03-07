import React, { useContext, useEffect, useRef, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { FaRegTrashAlt, FaThumbsUp } from "react-icons/fa";
import { IoIosUndo, IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useCreateReplyMutation,
  useCreateSuggestedReplyMutation,
  useDeleteLikeOfReplyMutation,
  useUpdateLikeOfReplyMutation,
} from "../../../app/EndPoints/commentReply/reply";
import { useGetPremiseUserPictureQuery } from "../../../app/EndPoints/premisePoolApi";
import TimeAgo from "../../../features/TimeAgo";
import userIcon from "../../../img/Icons/userImg.png";
import BtnLoading from "../../../shared/BtnLoading";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import { URL } from "../../utils";
import ReplyLikeUsersPop from "../ReplyLikeUsersPop";
import UserType from "../UserType";
import ConfirmationModal from "./ConfirmationModal";
import ReplyToReply3 from "./ReplyToReply3";
import ReplyLike from "./ReplyLike";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";

const ReplyToReply2 = ({
  handleAddToBeat,
  setCommentText,
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
  const replyToReplyRef = useRef(null);
  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(replyBy?.id);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  const handleDeleteReply = async (id) => {
    const deleteData = {
      id,
    };
    setDisableBtn(true);
    // console.log(id);
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
    const deleteData = {
      id,
      isRejected: true,
    };
    setDisableBtn(true);
    // console.log(id);
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
      // setReplyChildTextCount(0);
      replyRefetch();

      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setChildReplyField(false);
      setChildReplies(true);
    }
    setDisableBtn(false);
  };
  const [replyChildTextCount, setReplyChildTextCount] = useState(0);
  const [childReplyText, setChildReplyText] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !disableBtn) {
      event.preventDefault(); // Prevents default form submission behavior
      handlePostReplyToReply(event, true);
      // replyToReplyRef.current.blur();
      childReplyRef.current.blur();
    }
  };

  const handleReplyTextChange = (event) => {
    const childReply = event.target.value;
    setReplyChildTextCount(childReply?.length);
    setChildReplyText(childReply);
  };

  const [suggestion, suggestionRes] = useCreateSuggestedReplyMutation();

  const checkSuggestAllowance = async (text) => {
    setSuggestDisable(true);
    const res = await fetchUserAccess(
      `${currentUser?.id}/PP_AllowBrainstoming`
    );
    console.log(`PP_AllowBrainstoming res`, res);
    if (res?.access == "No") {
      setSuggestDisable(false);
      setNoAccessLbPopup(res);
    } else {
      handleSuggest(text);
    }
  };

  const handleSuggest = async (text) => {
    const cleanedText = text.includes(":") ? text.split(":")[1].trim() : text;
    console.log("suggestion text from reply 2", cleanedText);
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
    }
  };

  const phrasesToBold = ["Do Think About:", "OR May be", "May be"];

  const formatText = (text) => {
    // Find a matching prefix
    const matchingPrefix = phrasesToBold.find((prefix) =>
      text.startsWith(prefix)
    );

    if (matchingPrefix) {
      // Split the text into the bold prefix and the rest
      const restOfText = text.slice(matchingPrefix.length);
      return (
        <>
          <span style={{ color: "#252525", fontWeight: 500 }}>
            {matchingPrefix}
          </span>
          {restOfText}
        </>
      );
    }

    // Return the text as is if no prefix matches
    return text;
  };

  const lastChildReplies = childReply?.child_replies?.filter(
    (childReply) =>
      !(childReply?.text?.includes("?") && childReply?.user?.id === 1) // Exclude replies matching the conditions
  );

  const handleChildReply = async () => {
    console.log("reply child comment", currentUser?.id, owner, reply);
    if (currentUser?.id !== owner && reply?.user?.first_name == "Ida") {
      const res = await fetchUserAccess(`${currentUser?.id}/PP_ReplyAI`);
      console.log("reply child 1 brainstorm res", res);
      if (res?.access == "No") {
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
      <div className="w-full max-w-[593px] ml-[0px]">
        <div className="flex gap-[8px]">
          <div className="flex flex-col items-center gap-1">
            {replyBy?.id === 1 ? (
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
            ) : (
              <a
                // data-reply-reply
                target="_blank"
                rel="noreferrer"
                // href={`${URL}/memberpage/#/user/${created_by?.id}`}

                href={
                  replyBy?.id === user
                    ? `${URL}/memberpage/#/personaldetails`
                    : `${URL}/memberpage/#/user/${replyBy?.id}/personaldetails`
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
            )}
          </div>
          <div className="border w-[78%] md:w-[86%] lg:w-[89%] border-[##EAEAEA] bg-[#f8f8f8] rounded-[8px] p-1 ">
            <div className="flex justify-between my-1 relative">
              <div className="text-[#1E1E1E] pl-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center">
                {replyBy?.id === 1 ? (
                  <p className="notranslate text-[14px] font-[500] ">
                    {childReply?.user?.first_name} {childReply?.user?.last_name}
                  </p>
                ) : (
                  <a
                    // data-reply-reply
                    target="_blank"
                    rel="noreferrer"
                    // href={`${URL}/memberpage/#/user/${created_by?.id}`}

                    href={
                      replyBy?.id === user
                        ? `${URL}/memberpage/#/personaldetails`
                        : `${URL}/memberpage/#/user/${replyBy?.id}/personaldetails`
                    }
                    className="flex items-center"
                  >
                    {childReply?.user?.first_name &&
                    childReply?.user?.last_name ? (
                      <p className="notranslate text-[14px] font-[500] hover:text-[#33b0ca]">
                        {childReply?.user?.first_name}{" "}
                        {childReply?.user?.last_name}
                      </p>
                    ) : (
                      <p className="text-[14px] font-[500] hover:text-[#33b0ca]">
                        {childReply?.user?.email.split("@")[0]}{" "}
                      </p>
                    )}
                    <UserType
                      type={childReply?.user?.centraldatabase?.type}
                      user_type={childReply?.user?.centraldatabase?.user_type}
                    />
                  </a>
                )}
              </div>

              <p className="text-[12px]  h-[15px] text-[#616161] font-[400]  leading-5  absolute top-[-9px] right-0">
                {" "}
                <TimeAgo timestamp={createdTime} />
              </p>
            </div>

            <p className="notranslate text-[#252525] text-[12px] lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
              {/* {childReply?.text} */}
              {replyBy?.id === 1 && childReply?.text
                ? formatText(childReply?.text)
                : childReply?.text}
            </p>
          </div>{" "}
          {(owner === user || replyBy?.id === user) &&
          !childReply?.reject_button ? (
            <div className="flex gap-2 items-center pl-[2px]">
              <button
                // data-reply-reply
                // disabled={disableD}
                onClick={() => {
                  setIdToDlt(currentReplyId);
                  setOpenDltPop(true);
                }}
              >
                <FaRegTrashAlt
                  //   disabled={disableBtn}
                  className="h-5 w-5 text-[#909090]"
                />
              </button>
            </div>
          ) : (
            <div className={`px-3 'cursor-default'}`}>
              <div className="" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center w-[81%] mr-[24px] md:mr-[29px] ml-auto mb-[2px] md:mb-[2px]   ">
          <div className="md:flex items-center hidden md:ml-[-40px] gap-3 leading-[16px] mt-[2px] mb-[4px]">
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
                      <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px] flex gap-[4px] ">
                        <span className=" md:hidden">
                          {" "}
                          {lastChildReplies?.length}{" "}
                        </span>
                        <span className="hidden md:block">
                          {lastChildReplies?.length}{" "}
                          {lastChildReplies?.length > 1 ? "Replies" : "Reply"}
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
                        className={`text-[12px]  text-[#33B0CA]   font-[400] leading-[14.52px] `}
                      >
                        <span className=" md:hidden">
                          {" "}
                          {lastChildReplies?.length}{" "}
                        </span>
                        <span className="hidden md:block">
                          {lastChildReplies?.length}{" "}
                          {lastChildReplies?.length > 1 ? "Replies" : "Reply"}
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
                      childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                    } text-[14px]`}
                  />
                  <p
                    className={`text-[12px] hidden md:block ${
                      childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                    } font-[400]  cursor-pointer`}
                  >
                    Reply
                  </p>
                </button>
              </div>

              <div className="hidden md:block">
                {owner === user &&
                  childReply?.text?.includes("?") &&
                  childReply?.user?.id === 1 && (
                    <>
                      {childReply?.suggested ? (
                        <button className="px-2  rounded-[4px] pb-[4px] pt-[2px] bg-[#616161] cursor-auto">
                          <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                            Suggested
                          </p>
                        </button>
                      ) : (
                        <>
                          {suggestDisable ? (
                            <button className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[#33B0CA] cursor-auto">
                              <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                                Suggesting...
                              </p>
                            </button>
                          ) : (
                            <button
                              className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[#33B0CA] cursor-pointer"
                              onClick={() => checkSuggestAllowance(reply?.text)}
                            >
                              <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                                Suggestion
                              </p>
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
              </div>

              <ReplyLike
                reply={childReply}
                {...{ setLikePopup, replyRefetch }}
              />
            </>
          </div>
          <div className="md:hidden flex  md:ml-[-40px] items-center gap-3 text-sm leading-[16px] mt-[2px] mb-[4px] ">
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
                      <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px] flex gap-[4px] ">
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
                        className={`text-[12px]  text-[#33B0CA]   font-[400] leading-[14.52px] `}
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
                      childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                    } text-[14px]`}
                  />
                  <p
                    className={`text-[12px] hidden md:block ${
                      childReplyField ? "text-[#33B0CA]" : "text-[#252525]"
                    } font-[400]  cursor-pointer`}
                  >
                    Reply
                  </p>
                </button>
              </div>
            </>
          </div>
          <div className="flex md:hidden">
            <ReplyLike reply={childReply} {...{ setLikePopup, replyRefetch }} />
          </div>

          <div className="md:hidden ml-[6px] mt-[-8px]">
            {owner === user &&
              childReply?.text?.includes("?") &&
              childReply?.user?.id === 1 && (
                <>
                  {childReply?.suggested ? (
                    <button className="px-2  rounded-[4px] pb-[4px] pt-[2px] bg-[#616161] cursor-auto">
                      <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                        Suggested
                      </p>
                    </button>
                  ) : (
                    <>
                      {suggestDisable ? (
                        <button className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[#33B0CA] cursor-auto">
                          <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                            Suggesting...
                          </p>
                        </button>
                      ) : (
                        <button
                          className="px-2  rounded-[4px]  pb-[4px] pt-[2px] bg-[#33B0CA] cursor-pointer"
                          onClick={() => checkSuggestAllowance(reply?.text)}
                        >
                          <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px]  ">
                            Suggestion
                          </p>
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
          </div>

          <div className="flex gap-[4px] items-center mt-[2px] justify-end">
            {childReply?.reject_button &&
              (owner === user || childReply?.user?.id === user) && (
                <button className=" cursor-auto w-[60px]">
                  <p
                    onClick={() => handleRejectReply(childReply?.id)}
                    className="text-[12px] bg-red-500 cursor-pointer py-[2px] rounded-[4px] text-[#fafafa] font-[400] leading-[14.52px] "
                  >
                    Reject
                  </p>
                </button>
              )}

            {childReply?.add_to_beat ? (
              <>
                {(owner === user || childReply?.user?.id === user) && (
                  <button className="w-[89px] cursor-auto ">
                    <p className="text-[12px] text-[#33B0CA] italic  font-[400] leading-[14.52px] ">
                      Added as Beat
                    </p>
                  </button>
                )}
              </>
            ) : (
              <>
                {(owner === user || childReply?.user?.id === user) && (
                  <button
                    onClick={() => {
                      handleAddToBeat(childReply);
                      setCommentText(childReply);
                      replyRefetch();
                    }}
                    className="w-[74px]"
                  >
                    <p className="text-[12px] text-[#252525] hover:text-[#33B0CA] font-[400] leading-[14.52px] ">
                      Add as Beat
                    </p>
                  </button>
                )}
              </>
            )}
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
        <div data-nest-reply className=" w-[91%]  mb-[8px] ml-auto">
          <form
            onSubmit={handlePostReplyToReply}
            className="relative w-[75%] md:w-[86%] mr-[30px] ml-auto text-[14px] 
              bg-[#fafafa] border rounded-[8px] border-[#eaeaea] focus:outline-none flex"
          >
            <textarea
              // data-reply-reply
              ref={childReplyRef}
              type="text"
              name="reply"
              maxLength={150}
              id=""
              className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] px-[8px] w-[100%] h-[44.27px]  lg:h-[37px] focus:border-none focus:outline-none text-[14px] pr-[45px] font-[400]"
              placeholder="Enter your reply..."
              // required
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
            <p className="text-[12px] font-[400] leading-[14px]  text-[#616161] mr-[33px]">
              {replyChildTextCount}/150
              {/* 0/150 */}
            </p>
          </div>
        </div>
      )}
      {childReplies && (
        <div className="w-[96%] md:w-[91%] mb-[8px] ml-auto ">
          {" "}
          {childReply?.child_replies &&
            lastChildReplies?.map(
              (childReply, idx) =>
                depth < 2 && ( // Limit the recursion depth to 2
                  <ReplyToReply3
                    // data-reply-reply
                    commentIdx={commentIdx}
                    replyToCommentID={replyToCommentID}
                    childReply={childReply}
                    currentReplyId={currentReplyId}
                    handleAddToBeat={handleAddToBeat}
                    setCommentText={setCommentText}
                    owner={owner}
                    user={user}
                    replyRefetch={replyRefetch}
                    depth={depth + 1} // Increment the depth
                  />
                )
            )}
        </div>
      )}
      {noAccessLbPopup?.msg == "ShowBecomePrivilege" && (
        <NoAccessPopUp
          noAccessPopup={noAccessLbPopup}
          setNoAccessPopup={setNoAccessLbPopup}
        />
      )}
      {(noAccessLbPopup?.msg == "LB" ||
        noAccessLbPopup?.msg == "ShowBuyPackage_and_Allacarte") && (
        <NoAccessLbPopUp
          noAccessLbPopup={noAccessLbPopup}
          setNoAccessPopup={setNoAccessLbPopup}
          service={`PP_Brainstrom`}
        />
      )}
    </>
  );
};

export default ReplyToReply2;
