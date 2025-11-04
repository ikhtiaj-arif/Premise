"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { MdReply } from "react-icons/md";
import { toast } from "react-toastify";
import { fetchUserAccess } from "../../../../App";
import {
  useCreateReplyMutation,
  useCreateSuggestedReplyMutation,
  useDeleteLikeOfReplyMutation,
} from "../../../../app/EndPoints/commentReply/reply";
import { useTranslateCommentMutation } from "../../../../app/EndPoints/comments/commentAPi";
import { useBeatSuggestionMutation } from "../../../../app/EndPoints/MemberPage/Buddies";
import {
  useCommentPremiseMutation,
  useDeleteCommentMutation,
  useGetPremiseUserQuery,
} from "../../../../app/EndPoints/premisePoolApi";
import { useGetMyAllProjectQuery } from "../../../../app/EndPoints/ScriptPad/project";
import BeatEditPop from "../../../Premisepool/AddToBeat/BeatEditPop";
import ConfirmationModal from "../../../Premisepool/Comments/ConfirmationModal";
import NoAccessCreditPopupUpdate from "../../../PricingModel/NoAccessCreditPopupUpdate";
import AskIda from "../../../SharedVersion/AskIda";
import TypingIndicator from "../../../TypingIndicator";
import { baseURL } from "../../../utils";
import CommentTranslator from "../../components/CommentTranslator";

const ChatArea = ({
  rawBackendData,
  premiseOwner,
  premiseId,
  commentRefetch,
  premiseData,
}) => {
  //! Mutations & Queries
  const [postComment, { isLoading: isPostLoading }] =
    useCommentPremiseMutation();
  const [beatSuggestions, isBeatSuggRes, isBeatSuggLoading] =
    useBeatSuggestionMutation();
  const {
    data: allspProjectJSON,
    isLoading: isSpProjectLoading,
    refetch: projectRefetch,
  } = useGetMyAllProjectQuery();
  const [deleteReply, deleteReplyRes] = useDeleteLikeOfReplyMutation();
  const [suggestion, suggestionRes] = useCreateSuggestedReplyMutation();
  const { data: userQuery, isLoading: isUserLoading } =
    useGetPremiseUserQuery();
  const user = userQuery?.id;
  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const [deleteComment, deleteCommentRes] = useDeleteCommentMutation();
  const [translateComment, isTranslationCommentLoading] =
    useTranslateCommentMutation();

  // const { data: profileImg } = useGetPremiseUserPictureQuery(user);
  // const proImgUrl = profileImg?.[0]?.profile_photo
  //   ? `${baseURL}${profileImg[0].profile_photo}`
  //   : null;

  /**
   * Transforms the backend data into a format that can be
   * used by the chat area component.
   */
  const [translatedText, setTranslatedText] = useState("");
  const [commentPrefix, setCommentPrefix] = useState("");
  const [translatedMessageId, setTranslatedMessageId] = useState(null);

  const transformBackendData = (data) => {
    if (!isUserLoading) {
      const currentUserId = user;
      return [...data]?.reverse()?.map((item) => ({
        id: item.id,
        text: item.text_prefix
          ? `${item.text_prefix}: ${item.text}`
          : item.text,
        text_prefix: item.text_prefix,
        plainText: item.text,
        sender: item.user.id === currentUserId ? "user" : "other",
        timestamp: new Date(item.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        replyingTo: item.reply || null,
        replyParent: item.parent || null,
        avatar: null,
        userId: item.user.id,
        name: item.user.username,
        askIda: item.ask_ida || false,
        rejectButton: item.reject_button || false,
        addToBeat: item.add_to_beat || false,
        suggested: item.suggested || false,
        c_value: item.c_value || null,
        type: item.type || null,
      }));
    }
  };

  //! States

  const [messages, setMessages] = useState(
    transformBackendData(rawBackendData)
  );
  const [textValue, setTextValue] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [suggestingId, setSuggestingId] = useState(null);
  const [sggestDisable, setSuggestDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentQuestion, setIsCommentQuestion] = useState(false);
  const [noAccessPopup, setNoAccessPopup] = useState(false);
  const [addBeatTutorialPop, setAddBeatTutorialPop] = useState(false);
  const [noAccessLbPopup, setNoAccessLbPopup] = useState(false);
  const [beatSuggLoading, setBeatSuggLoading] = useState(false);
  const [projectBeatOpen, setProjectBeatOpen] = useState(false);
  const [commentObj, setCommentObj] = useState(null);
  const [suggestedBeats, setSuggestedBeats] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const [profileImageCache, setProfileImageCache] = useState({});
  const [lastCValue, setLastCValue] = useState(null);
  const [openDltPop, setOpenDltPop] = useState(false);
  const [disableDelete, setDisableDelete] = useState(false);
  const [idToDlt, setIdToDlt] = useState({});
  const [typingSimulatedUser] = useState({
    name: "Ida",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  });

  //! Refs
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  //! SideEffects
  // Update message list with translated text
  useEffect(() => {
    if (translatedText && translatedMessageId) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === translatedMessageId
            ? { ...msg, translated: translatedText }
            : msg
        )
      );
    }
  }, [translatedText, translatedMessageId]);

  // useEffect runs *after render* → safe to call setState here
  useEffect(() => {
    if (!isUserLoading && rawBackendData?.length > 0) {
      const transformed = transformBackendData(rawBackendData, user);

      setMessages(transformed);

      // Find max c_value safely
      const maxCValue = Math.max(
        0,
        ...transformed.map((item) => item.c_value || 0)
      );

      setLastCValue(maxCValue + 1);
    }
  }, [rawBackendData, isUserLoading, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const allProject = allspProjectJSON?.projects;
    projectRefetch();
    const currentPremiseProject = allProject?.find(
      (p) => p?.pro_uuid === premiseData?.project_id
    );

    setSelectedProject(currentPremiseProject);
  }, [premiseData, allspProjectJSON]);

  useEffect(() => {
    if (rawBackendData && !isUserLoading) {
      const transformed = transformBackendData(rawBackendData);
      setMessages(transformed);
    }
  }, [rawBackendData, isUserLoading, user]);
  const token = localStorage.getItem("accessToken");
  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  useEffect(() => {
    const fetchProfileImages = async () => {
      const uniqueUserIds = [...new Set(messages.map((msg) => msg.userId))];

      for (const userId of uniqueUserIds) {
        // Skip if already cached
        if (profileImageCache[userId]) continue;

        try {
          const res = await axios.get(
            `${baseURL}/memberpage/profilepicture/${userId}`,
            {
              headers: header,
            }
          );
          const profilePhoto = res?.data?.[0]?.profile_photo; // Adjust according to your API response

          const avatarUrl = profilePhoto ? `${baseURL}${profilePhoto}` : null;

          // Update cache
          setProfileImageCache((prev) => ({ ...prev, [userId]: avatarUrl }));

          // Update messages with avatar
          setMessages((prev) =>
            prev.map((msg) =>
              msg.userId === userId ? { ...msg, avatar: avatarUrl } : msg
            )
          );
        } catch (error) {
          console.error(`Error fetching profile for user ${userId}:`, error);
          // Optional: fallback to null or a placeholder
          setProfileImageCache((prev) => ({ ...prev, [userId]: null }));
        }
      }
    };

    if (messages.length > 0) fetchProfileImages();
  }, [messages.length]);

  const handleSendMessage = async () => {
    await handleButtonClick();
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleScrollToOriginal = (messageId) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight-message");
      setTimeout(() => element.classList.remove("highlight-message"), 2000);
    }
  };

  const handleSuggestion = async (message) => {
    const res = await fetchUserAccess(`PP_AllowBrainstoming`);
    if (res?.access === "No") {
      setSuggestDisable(false);
      setNoAccessLbPopup(res);
    } else {
      setSuggestDisable(true); // Disable suggestion initially
      let data;
      if (message.type === "reply") {
        data = {
          reply: message?.replyingTo,
          parent: message?.id,
          ques_text: message.text,
          C: message?.c_value,
        };
      } else {
        data = {
          reply: message?.replyingTo,
          ques_text: message.text,
          C: message?.c_value,
        };
      }

      try {
        // Make the suggestion request
        const res = await suggestion(data);
        if (res) {
          await Promise.all([commentRefetch()]);

          // After both refetches, re-enable suggestions
          setSuggestDisable(false);
          const creditRes = await fetchUserAccess(`PP_AllowBrainstoming`);
          const remainingCredits = creditRes?.remaining_credits ?? 0;
          const creditElement = document.getElementById("creditBalance");
          if (creditElement) {
            creditElement.textContent = remainingCredits;
          }
        }
      } catch (error) {
        console.error("Error during the suggestion process:", error);
        setSuggestDisable(false); // Ensure to re-enable if there's an error
      }
    }
  };

  const getReplyingToMessage = (messageId) => {
    return messages?.find((msg) => msg.id === messageId);
  };

  const shouldShowSuggestion = (message) => {
    const hasQuestion =
      message.text.includes("?") || message.text.includes("؟");
    const isFromIdaOrUser79 = message.userId === 1 || message.userId === 79;
    return hasQuestion && isFromIdaOrUser79 && message.sender !== "user";
  };

  const charCount = textValue.length;
  const maxChars = 250;

  const checkAllowance = async (flag) => {
    try {
      const res = await fetchUserAccess(`${flag}`);
      if (res?.has_access === false) {
        setNoAccessPopup(res);
        return false;
      } else {
        await handleSubmitComment();
        return true;
      }
    } catch (error) {
      console.error("Error checking allowance:", error);
      return false;
    }
  };

  const handleSubmitComment = async () => {
    const trimmedText = textValue.trim();
    if (!trimmedText) {
      alert("You can't send an empty comment!");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    setIsLoading(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // 🟩 Handle reply separately
      if (replyingTo) {
        const replyData = {
          reply: replyingTo?.replyingTo,
          parent: replyingTo?.id,
          text: trimmedText,
          C: replyingTo?.c_value,
        };

        const res = await createReplyMutation(replyData);
        // Reset states after replying
        if (res?.data) {
          setTextValue("");
          setIsCommentQuestion(false);
          setReplyingTo(null);
          commentRefetch();
        } else {
          toast.error("Failed to reply. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 800,
          });
        }
      } else {
        // 🟩 Fetch current comment count
        const { data: commentData } = await axios.get(
          `${baseURL}/brainstorm/GetCommentAPInew/${premiseId}`,
          { headers }
        );

        const brainstormData = localStorage.getItem("BrainstormData");
        const parsedData = brainstormData ? JSON.parse(brainstormData) : {};
        const { premiseId: storedPremiseId, lastSceneNumber } = parsedData;

        // 🟩 Prepare body for new comment
        const body = {
          premise: premiseId,
          text: trimmedText,
          user,
          C: lastCValue,
          ...(storedPremiseId === premiseId && lastSceneNumber
            ? { C_from_scriptpad: lastSceneNumber }
            : {}),
          is_question: isCommentQuestion,
        };

        const res = await postComment(body);

        if (storedPremiseId === premiseId) {
          localStorage.removeItem("BrainstormData");
        }

        if (res?.data) {
          setTextValue("");
          setIsCommentQuestion(false);
          commentRefetch();
        }

        // 🟩 Update user credits
        const crdRes = await fetchUserAccess("PP_AllowBrainstoming");
        const remainingCredits = crdRes?.remaining_credits ?? 0;

        const creditElement = document.getElementById("creditBalance");
        if (creditElement) {
          creditElement.textContent = remainingCredits;
        }
      }
    } catch (error) {
      console.error("❌ Error posting comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      if (premiseOwner?.id === user) {
        await checkAllowance("PP_AllowBrainstoming");
      } else {
        await checkAllowance("PP_AllowInteraction");
      }
    } catch (error) {
      console.error("Error in button click:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToBeat = async (comment) => {
    const addBeatTutorialCheck = localStorage.getItem("addBeatTutorialPop");
    if (
      (!addBeatTutorialCheck || addBeatTutorialCheck === "false") &&
      !addBeatTutorialPop
    ) {
      setAddBeatTutorialPop(true);
    }
    const res = await fetchUserAccess(`SP_BeatSheet`);
    if (res?.has_access === false) {
      setNoAccessLbPopup(res);
    } else {
      submitAddToBeat(comment);
    }
  };

  const submitAddToBeat = async (comment) => {
    setCommentObj(comment);
    setBeatSuggLoading(true);
    setProjectBeatOpen(true);

    const data = {
      owner: user,
      premise_id: premiseId,
      user_beat: comment?.text,
      project_name: premiseData?.project_name,
    };

    try {
      const res = await beatSuggestions(data);

      if (res && res?.data && res?.data?.beats) {
        const beats = Object.values(res?.data?.beats);
        //console.log('beats',beats);
        const beatData = {
          one: comment?.text,
          two: beats[0],
          three: beats[1],
          four: beats[2],
        };

        setSuggestedBeats(beatData);

        setBeatSuggLoading(false);
      } else {
        // Handle case where no beats are returned
        setSuggestedBeats({
          one: comment.text,
          two: "",
          three: "",
          four: "",
        });
        setBeatSuggLoading(false);
        setProjectBeatOpen(false);

        toast.error(
          "An error occurred while fetching beat suggestions. Please try again.",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1600,
          }
        );
      }
    } catch (error) {
      // console.error("Error fetching beat suggestions:", error);
      toast.error(
        "An error occurred while fetching beat suggestions. Please try again.",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1600,
        }
      );
      setBeatSuggLoading(false);
      setProjectBeatOpen(false);
    }
  };

  //! Reject button functionality
  const handleReject = async (id) => {
    setDisableBtn(true);
    const deleteData = {
      id,
      isRejected: true,
    };
    const res = await deleteReply(deleteData);
    if (res?.data) {
      commentRefetch();
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

  const handleDeleteComment = async (id) => {
    setDisableDelete(true);
    const deleteData = {
      id,
      isRejected: true,
    };
    const res = await deleteReply(deleteData);
    if (res?.data) {
      commentRefetch();
      toast.success("Comment Deleted!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableDelete(false);

      commentRefetch();
    } else {
      toast.error("Failed to delete comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });

      setDisableDelete(false);
      commentRefetch();
    }
  };

  // console.log(rawBackendData);
  return (
    <div className="bg-[#F0F2F5] h-screen flex flex-col w-full rounded-lg">
      {/* Messages Container */}
      <div className="p-3 h-[calc(100vh-300px)]  lg:h-[calc(95vh-300px)] overflow-y-auto space-y-4">
        {messages?.map((message) => {
          const repliedToMessage = message.replyingTo
            ? getReplyingToMessage(message.replyingTo)
            : null;

          // const displayText =
          //   translatedMessageId === message.id && translatedText
          //     ? translatedText && commentPrefix
          //       ? `${commentPrefix}: ${translatedText}`
          //       : translatedText
          //     : message.text;

          const isTranslated =
            translatedMessageId === message.id && translatedText;

          const prefix =
            isTranslated && commentPrefix ? commentPrefix : message.text_prefix;
          const text = isTranslated ? translatedText : message.plainText;

          return (
            <div
              key={message.id}
              ref={(el) => {
                if (el) messageRefs.current[message.id] = el;
              }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`flex gap-2 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } max-w-[681px]`}
              >
                {/* Avatar */}
                {message.avatar ? (
                  <img
                    src={message.avatar || ""}
                    alt={message.name}
                    className={`w-12 h-12 rounded-full ${
                      message.sender === "user" && "border-2 border-[#00C3FF]"
                    } object-cover flex-shrink-0`}
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full bg-[#00C3FF3A] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 
                       border-2 border-[#00C3FF]
                    `}
                    title={message.name}
                  >
                    {(message.name || message.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`flex flex-col ${
                    message.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {/* Name and Time */}
                  <div
                    className={`text-xs text-gray-500 mb-1 ${
                      message.sender === "user"
                        ? "text-right flex gap-2 flex-row-reverse"
                        : "text-left"
                    }`}
                  >
                    <span className="font-semibold">
                      {message.sender === "user" ? "You" : message.name}
                    </span>
                    <span className="ml-2">{message.timestamp}</span>
                  </div>

                  {/* Reply Preview */}
                  {repliedToMessage && (
                    <div className="relative">
                      {message.sender === "user" ? (
                        <div>
                          <div
                            onClick={() =>
                              handleScrollToOriginal(repliedToMessage.id)
                            }
                            className={` p-2  bg-[linear-gradient(30deg,#741CFF_10%,#00C3FF)] text-white  rounded-tr-[6px] rounded-tl-[16px] border rounded-b-[16px]
                              cursor-pointer hover:opacity-80 transition-opacity max-w-[581px] shadow-lg`}
                          >
                            <div className="bg-[linear-gradient(30deg,#b48bff85,#99e6ff86)] m-2 p-3 rounded-[10px]">
                              <p className="text-sm  line-clamp-2">
                                {repliedToMessage.text}
                              </p>
                            </div>

                            <p className="text-[16px]  leading-relaxed px-3 py-1">
                              {/* {message.text} */}
                              {prefix ? (
                                <>
                                  <span className="font-bold">{prefix}:</span>{" "}
                                  {text}
                                </>
                              ) : (
                                text
                              )}
                            </p>
                            <button
                              className={`absolute ${
                                message.sender === "user"
                                  ? "top-[-10px] left-[-10px] bg-[#741CFF]"
                                  : "top-[-10px] right-[-10px] bg-[#741CFF1A]"
                              } h-6 w-6  rounded-full  
                          flex items-center justify-center opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 ease-in-out`}
                            >
                              <CommentTranslator
                                key={message.id}
                                comment={message}
                                translateComment={translateComment}
                                commentRefetch={commentRefetch}
                                setCommentPrefix={setCommentPrefix}
                                setCommentText={setTranslatedText}
                                setTranslatedMessageId={setTranslatedMessageId}
                              />
                            </button>
                          </div>{" "}
                        </div>
                      ) : (
                        <div>
                          <div
                            className={` p-2 bg-[#EFF6FF] text-[#0F0E13]  rounded-tl-[6px] rounded-tr-[16px] border rounded-b-[16px]
                           cursor-pointer hover transition-opacity max-w-[581px] shadow-lg`}
                          >
                            <p className="text-[16px]  leading-relaxed px-3 py-1">
                              {/* {message.text} */}
                              {prefix ? (
                                <>
                                  <span className="font-bold">{prefix}:</span>{" "}
                                  {text}
                                </>
                              ) : (
                                text
                              )}
                            </p>
                            <button
                              className={`absolute ${
                                message.sender === "user"
                                  ? "top-[-10px] left-[-10px] bg-[#741CFF]"
                                  : "top-[-10px] right-[-10px] bg-[#741CFF1A]"
                              } h-6 w-6  rounded-full  
                          flex items-center justify-center opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 ease-in-out`}
                            >
                              <CommentTranslator
                                key={message.id}
                                comment={message}
                                translateComment={translateComment}
                                commentRefetch={commentRefetch}
                                setCommentPrefix={setCommentPrefix}
                                setCommentText={setTranslatedText}
                                setTranslatedMessageId={setTranslatedMessageId}
                              />
                            </button>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Message */}
                  {!repliedToMessage && (
                    <div
                      className={`p-3   relative ${
                        message.sender === "user"
                          ? "text-white rounded-tr-[6px] rounded-tl-[16px] rounded-b-[16px]  bg-[linear-gradient(30deg,#741CFF_10%,#00C3FF)]"
                          : "bg-[#EFF6FF] text-[#0F0E13] text-[16px] border shadow-lg rounded-tl-[6px] rounded-tr-[16px] rounded-b-[16px]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {/* {message.text} */}
                        {prefix ? (
                          <>
                            <span className="font-bold">{prefix}:</span> {text}
                          </>
                        ) : (
                          text
                        )}
                      </p>

                      <button
                        className={`absolute ${
                          message.sender === "user"
                            ? "top-[-10px] left-[-10px] bg-[#741CFF]"
                            : "top-[-10px] right-[-10px] bg-[#741CFF1A]"
                        } h-6 w-6  rounded-full  
                          flex items-center justify-center opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 ease-in-out`}
                      >
                        <CommentTranslator
                          key={message.id}
                          comment={message}
                          translateComment={translateComment}
                          commentRefetch={commentRefetch}
                          setCommentPrefix={setCommentPrefix}
                          setCommentText={setTranslatedText}
                          setTranslatedMessageId={setTranslatedMessageId}
                        />
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}

                  {shouldShowSuggestion(message) ? (
                    <div className="w-[95%] mx-auto flex justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReply(message)}
                          className="w-4 h-4 rounded-full bg-[#00C3FF] flex items-center justify-center gap-1"
                        >
                          <MdReply className="text-black text-[15px]" />
                        </button>
                        <button
                          onClick={() => {
                            setIdToDlt(message.id);
                            setOpenDltPop(true);
                          }}
                          className="w-5 h-5 rounded-full bg-[#741CFF2A] flex items-center justify-center gap-1"
                        >
                          <FaRegTrashAlt className="text-[#4A5565] text-[12px]" />
                        </button>
                      </div>
                      {message.suggested ? (
                        <button
                          disabled
                          className="px-2 cursor-auto rounded-[4px] pt-[2px] pb-[3px] bg-[linear-gradient(30deg,#b38bff,#99e6ff)]"
                        >
                          <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]">
                            Suggested
                          </p>
                        </button>
                      ) : (
                        <button
                          disabled={suggestingId === message.id}
                          onClick={() => handleSuggestion(message)}
                          className=""
                        >
                          {/* <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]">
                            {suggestingId === message.id
                              ? "Suggesting..."
                              : "Suggestion"}
                          </p> */}
                          <h4 class="text-[14px]  font-[500] leading-[21px] w-full  bg-[linear-gradient(30deg,#741CFF,#00C3FF)] bg-clip-text text-transparent">
                            Suggestion
                          </h4>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-[95%] mx-auto flex justify-between items-center mt-1 ${
                        message.sender === "user" ? "hidden" : "flex-row"
                      }`}
                    >
                      <button
                        onClick={() => handleReply(message)}
                        className="w-4 h-4 rounded-full bg-[#00C3FF] flex items-center justify-center gap-1"
                      >
                        <MdReply className="text-black text-[15px]" />
                      </button>
                      <>
                        {message?.addToBeat ? (
                          <button
                            // onClick={() => handleAddToBeat(message)}
                            disabled
                            className="text-[#9810FA] italic text-sm"
                          >
                            Added as Beat
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 text-sm">
                            <button
                              onClick={() => handleAddToBeat(message)}
                              className="text-[#9810FA]"
                            >
                              + Add as Beat
                            </button>
                            <button
                              onClick={() => {
                                handleReject(message.id);
                              }}
                              className="text-[#FB2C36]"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </>
                      {/* <button>
                   
                    </button> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {(beatSuggLoading || suggestingId) && (
          <div className="flex justify-start group">
            <div className="flex gap-2 flex-row max-w-[681px]">
              {/* Avatar */}
              <img
                src={typingSimulatedUser.avatar || "/placeholder.svg"}
                alt={"Ida Avatar"}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />

              {/* Typing Indicator Content */}
              <div className="flex flex-col items-start">
                {/* Name and Time */}
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold">
                    {typingSimulatedUser.name}
                  </span>
                  <span className="ml-2">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Typing Indicator */}
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white flex-1 border border-[##E2E8F0] pt-2 px-2 md:pt-3 md:px-4">
        <div className={`relative bottom-0 w-full max-w-[937px] mx-auto`}>
          {/* Textarea Container */}
          <div
            className="p-[1px] rounded-[8px] bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] h-[134px] inline-block w-full
          mx-auto"
          >
            <div
              className={`bg-[#fff]
         relative  rounded-[8px] h-[132px] `}
            >
              {/* Reply Preview */}
              {replyingTo && (
                <div className="mb-2 h-[52px] overflow-y-auto p-2 bg-[linear-gradient(30deg,#b48bff62,#99e6ff5e)] rounded-lg rounded-b-none flex items-start justify-between">
                  <div className="flex-1 border-l-4 border-[#741CFF]">
                    <p className="text-sm text-gray-600 line-clamp-1 px-3">
                      {replyingTo.text}
                    </p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <IoMdCloseCircle />
                  </button>
                </div>
              )}
              <div className={`${replyingTo ? "flex" : "flex-col"} px-3 pt-1`}>
                <textarea
                  value={textValue}
                  onChange={(e) =>
                    setTextValue(e.target.value.slice(0, maxChars))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSendMessage();
                      event.currentTarget.blur();
                    }
                  }}
                  maxLength={maxChars}
                  disabled={isLoading}
                  className={`bg-[#fff] resize-none leading-[21px] rounded-[8px] ${
                    !replyingTo ? "w-[100%]" : "w-[100%]"
                  } h-[62.27px] focus:border-none focus:outline-none text-[14px] py-[2px] pr-[12px] font-[400] placeholder:text-[#7B809A] placeholder:italic`}
                  placeholder="Share an action taken by any character in pursuit of its want OR describe a situation in which the chosen characters interact OR write anything you have in mind."
                />

                <div
                  className={`flex ${
                    !replyingTo
                      ? "justify-between w-full items-center"
                      : "justify-end items-end w-[15%]"
                  } bottom-[2px] gap-3 pb-1`}
                >
                  {!replyingTo && (
                    <AskIda
                      {...{
                        id: premiseData?.id,
                        source_language: premiseData?.source_language,
                        user,
                        premiseOwner,
                        commentRefetch,
                        isLoading,
                        setIsLoading,
                        setNoAccessPopup,
                      }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {!isLoading && <TypingIndicator />}
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading}
                      className={`w-12 h-12 rounded-[14px] shadow-md ${
                        isLoading
                          ? "bg-[linear-gradient(30deg,#b38bff,#99e6ff)] cursor-default"
                          : " bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] hover:opacity-90"
                      } transition-opacity`}
                    >
                      <FiSend className="text-[#fff] ml-3 w-5 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Count */}
            <div className={`absolute bottom-[-16px] right-[14px]`}>
              <p
                className={`text-[12px] font-[400] leading-[14px] ${
                  charCount > maxChars * 0.9 ? "text-red-500" : "text-[#616161]"
                }`}
              >
                {charCount}/{maxChars}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes highlight {
          0% {
            background-color: rgba(116, 28, 255, 0.2);
          }
          100% {
            background-color: transparent;
          }
        }

        .highlight-message {
          animation: highlight 2s ease-out;
        }
      `}</style>
      {noAccessPopup?.has_access === false && (
        <NoAccessCreditPopupUpdate
          noAccessPopup={noAccessPopup}
          setNoAccessPopup={setNoAccessPopup}
          service={"Brainstorming"}
          credit_rate={noAccessPopup?.credit_rate}
          remaining_credits={noAccessPopup?.remaining_credits}
        />
      )}
      {/* BeatEditPop Component */}
      {projectBeatOpen && (
        <BeatEditPop
          project_id={premiseData?.project_id}
          popClose={() => setProjectBeatOpen(false)}
          commentText={commentObj?.textcomments?.replace(/^\s*\d+\.\s*/)}
          commentObj={commentObj}
          commentRefetch={commentRefetch}
          // replyRefetch={replyRefetch}
          data={messages}
          // refetch={refetch}
          premiseData={premiseData}
          suggestedBeats={suggestedBeats}
          isBeatSuggLoading={isBeatSuggLoading}
          // beatSuggestLoading={beatSuggestLoading}
          selectedProject={selectedProject}
          // setAddToBeatDisable={setAddToBeatDisable}
          // fromNew={fromNew}
          // currentPremiseProject={currentPremiseProject}
        />
      )}

      {openDltPop && (
        <ConfirmationModal
          isOpen={openDltPop}
          onClose={() => setOpenDltPop(false)}
          onConfirm={() => handleDeleteComment(idToDlt)}
          title="Are you sure you want to delete this comment?"
          content="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
};

export default ChatArea;
