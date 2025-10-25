import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosUndo, IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import {
    useCreateReplyMutation,
    useCreateSuggestedReplyMutation
} from "../../app/EndPoints/commentReply/reply";
import { useTranslateCommentMutation } from "../../app/EndPoints/comments/commentAPi";
import { useBeatSuggestionMutation } from "../../app/EndPoints/MemberPage/Buddies";
import {
    useDeleteCommentMutation,
    useGetPremiseUserPictureQuery,
} from "../../app/EndPoints/premisePoolApi";
import { useGetMyAllProjectQuery } from "../../app/EndPoints/ScriptPad/project";
import TimeAgo from "../../features/TimeAgo";
import userIcon from "../../img/Icons/userImg.png";
import BtnLoading from "../../shared/BtnLoading";
import CommentTranslator from "../PremiseV2/components/CommentTranslator";
import SameNamePop from "../PremiseV2/Popups/alerts/SameNamePop";
import NoAccessLbPopUp from "../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";
import CommentLike from "../SharedVersion/CommentLike";
import { URL } from "../utils";
import BeatEditPop from "./AddToBeat/BeatEditPop";
import CommentLikePopup from "./CommentLikePopup";
import ConfirmationModal from "./Comments/ConfirmationModal";
import ReplyDataOfComments from "./ReplyDataOfComments";
import UserType from "./UserType";

const AllComments = ({
  commentIdx,
  comments,
  data,
  refetch,
  fromNew,
  handleOpenAllReplies,
  setOpenReplyField,
  replyToCommentID,
  setReplyToCommentID,
  replyResStat,
  setCommentOwner,
  setOpenAllReplies,
  openAllReplies,
  commentRefetch,
  setReplyField,
  replyField,
  handleReplyTextChange,
  replyLoading,
  premiseData,
  replyTextCount,
  setReplyTextCount,
  project_id,
  openReplyFieldID,
  setOpenReplyFieldID,
  actOneThreshold,
  actTwoEnd,
  focusedCValue,
  iconWidth,
  inpRightMargin,
  loading,
  replyText,
  commentField,
  setCommentField,
  addBeatTutorialPop,
  setAddBeatTutorialPop,
  setReplyText,
}) => {
  // const actTwoStart = Math.floor(0.25 * m_value);

  // const resolutionStart = Math.floor(0.8 * m_value);

  const premiseID = data?.id;
  const user = useSelector((state) => state?.user?.id);

  const [selectedProject, setSelectedProject] = useState(null);
  const [noAccessLbPopup, setNoAccessLbPopup] = useState(null);

  const {
    selectedPremiseObj,
    selectedSpProjectID,
    createdSpProjectID,
    currentlyOpenedCommentID,
    currentUser,
    setCurrentlyOpenedCommentID,
  } = useContext(MyContext);

  const {
    data: allspProjectJSON,
    isLoading: isSpProjectLoading,
    refetch: projectRefetch,
  } = useGetMyAllProjectQuery();

  // console.log("allspProjectJSON", allspProjectJSON);
  // console.log("selectedSpProjectID", selectedSpProjectID);

  // console.log("selectedPremiseObj", selectedPremiseObj);

  useEffect(() => {
    const allProject = allspProjectJSON?.projects;

    // const allProject = allspProjectJSON?.projects?.filter(
    //   (item) => !item.locked
    // );

    projectRefetch();
    const currentPremiseProject = allProject?.find(
      (p) => p?.pro_uuid === project_id
    );

    setSelectedProject(currentPremiseProject);
  }, [project_id, allspProjectJSON]);
  // useEffect(() => {

  //   const allProject = allspProjectJSON?.projects

  //   // const allProject = allspProjectJSON?.projects?.filter(
  //   //   (item) => !item.locked
  //   // );

  //   if (selectedSpProjectID) {

  //     projectRefetch();
  //     const currentPremiseProject = allProject?.find(
  //       (p) => p?.pro_uuid === selectedSpProjectID
  //     );

  //     setSelectedProject(currentPremiseProject);

  //   } else if (createdSpProjectID) {

  //     projectRefetch();
  //     const currentPremiseProject = allProject?.find(
  //       (p) => p?.pro_uuid === createdSpProjectID
  //     );

  //     setSelectedProject(currentPremiseProject);

  //   } else if (selectedPremiseObj) {

  //     projectRefetch();
  //     const currentPremiseProject = allProject?.find(
  //       (p) => p?.pro_uuid === selectedPremiseObj?.project_id
  //     );

  //     setSelectedProject(currentPremiseProject);

  //   } else {

  //     projectRefetch();
  //     const currentPremiseProject = allProject?.find(
  //       (p) => p?.pro_uuid === project_id
  //     );
  //     setSelectedProject(currentPremiseProject);
  //   }
  // }, [
  //   allspProjectJSON,
  //   selectedPremiseObj,
  //   createdSpProjectID,
  //   selectedSpProjectID,
  // ]);

  const replyRef = useRef(null);
  const latestReplyRef = useRef(null);

  const [service, setService] = useState();
  const [suggestedBeats, setSuggestedBeats] = useState({});

  const [likePopup, setLikePopup] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disableD, setDisableD] = useState(false);
  const [suggestDisable, setSuggestDisable] = useState(false);
  const [projectBeatOpen, setProjectBeatOpen] = useState(false);
  const [commentText, setCommentText] = useState(
    comments?.text?.replace(/^\s*\d+\.\s*/, "")
  );
  const [beatCommentText, setBeatCommentText] = useState("");

  const [commentObj, setCommentObj] = useState({});
  const [openDltPop, setOpenDltPop] = useState(false);
  const [idToDlt, setIdToDlt] = useState({});
  const [commenterName, setCommenterName] = useState("");
  const commentLikes = comments?.likes?.length;
  const commentLikedBy = comments?.likes;
  const commentOwnerName = `${comments?.user?.first_name} ${comments?.user?.last_name}`;
  const createdTime = comments?.created_at;
  const commentOwnerMail = comments?.user?.email;
  const modifiedEmail = commentOwnerMail?.split("@")[0];
  const owner = data?.premiseOwner?.id;

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(comments?.user?.id);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  const [deleteComment, deleteCommentRes] = useDeleteCommentMutation();

  const [suggestion, suggestionRes] = useCreateSuggestedReplyMutation();

  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();

  const [beatSuggestions, isBeatSuggRes, isBeatSuggLoading] =
    useBeatSuggestionMutation();

  // const {
  //   data: replyData,
  //   isLoading: isReplyLoading,
  //   isError,
  //   refetch: replyRefetch,
  // } = useGetAllReplyOfACommentQuery(comments?.id);
  // console.log("replyData",replyData);

  useEffect(() => {
    if (replyField && replyRef.current) {
      replyRef.current.focus();
    }
  }, [replyField, replyToCommentID]);

  useEffect(() => {
    // replyRefetch();
  }, [replyResStat]);

  useEffect(() => {
    setReplyToCommentID(comments?.id);
    setCurrentlyOpenedCommentID(comments?.id);
  }, [comments]);

  //for comment

  useEffect(() => {
    if (commentOwnerName?.length > 1) {
      setCommenterName(commentOwnerName);
    } else {
      setCommenterName(modifiedEmail);
    }
  }, [commentOwnerName, modifiedEmail]);

  const handleDeleteComment = async (id) => {
    setDisableD(true);
    const res = await deleteComment(id);
    if (res?.data) {
      commentRefetch();
      toast.success("Comment Deleted!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisableD(false);
      setDisable(false);
      commentRefetch();
      setOpenAllReplies(false);
      setReplyField(false);
    } else {
      toast.error("Failed to delete comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setDisable(false);
      setDisableD(false);
      commentRefetch();
    }
  };

  const checkSuggestAllowance = async (text) => {
    setSuggestDisable(true);
    const res = await fetchUserAccess(
      `PP_AllowBrainstoming`
    );
    // console.log(`PP_AllowBrainstoming res`, res);
    if (res?.access === "No") {
      setSuggestDisable(false);
      setNoAccessLbPopup(res);
      setService("PP_Brainstrom");
    } else {
      handleSuggest(text);
    }
  };

  const handleSuggest = async (text) => {
    setSuggestDisable(true); // Disable suggestion initially

    const data = {
      reply: comments?.id,
      ques_text: text,
      C: comments?.c_value,
    };

    try {
      // Make the suggestion request
      const res = await suggestion(data);
      if (res) {
        setOpenAllReplies(true);
        setReplyField(false);
        setReplyToCommentID(comments?.id);
        setCurrentlyOpenedCommentID(comments?.id);
        setOpenReplyFieldID(comments?.id);
        setCommentOwner(commentOwnerName);

        // Wait for both refetch operations to complete
        await Promise.all([commentRefetch()
          //  replyRefetch()
          ]);

        // After both refetches, re-enable suggestions
        setSuggestDisable(false);
      }
    } catch (error) {
      console.error("Error during the suggestion process:", error);
      setSuggestDisable(false); // Ensure to re-enable if there's an error
    }
  };

  // console.log("suggestDisable", suggestDisable);
  const [alert, setAlert] = useState(false);
  const handlePostReplyToComment = async (e, isEnterKey = false) => {
    if (e) {
      e.preventDefault();
    }
    const replyText = replyRef?.current.value;

    if (replyText?.length === 0) {
      setAlert(true);
      // alert("You can't send an empty reply!");
      return;
    }
    setDisableD(true);

    const data = {
      reply: replyToCommentID,
      text: replyText,
      C: comments?.c_value,
    };

    try {
      const response = await createReplyMutation(data);

      if (response) {
        replyRef.current.value = ""; // Clear the textarea
        setReplyText("");
        setReplyTextCount(0);
        // replyRefetch();
        setOpenAllReplies(true);
        setReplyField(false);
        toast.success("Reply added!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      } else {
        // Handle case where response is not successful
        toast.error("Failed to add reply. Please try again.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      }
    } catch (error) {
      // console.error("Error posting reply:", error);
      toast.error(
        "An error occurred while adding the reply. Please try again.",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        }
      );
    } finally {
      setDisableD(false);
    }
  };

  const [beatSuggestLoading, setBeatSuggLoading] = useState(false);
  const [addToBeatDisable, setAddToBeatDisable] = useState(false);
  // console.log("comments",comments);
  const handleAddToBeat = async (comment) => {
    const addBeatTutorialCheck = localStorage.getItem("addBeatTutorialPop");
    if (
      (!addBeatTutorialCheck || addBeatTutorialCheck === "false") &&
      !addBeatTutorialPop
    ) {
      setAddBeatTutorialPop(true);
    }
    const res = await fetchUserAccess(`PP_BeatSheet`);
    // console.log("add to beat res", res);
    if (res?.access === "No") {
      setNoAccessLbPopup(res);
      setService("PP_Beats");
    } else {
      submitAddToBeat(comment);
    }
  };

  const submitAddToBeat = async (comment) => {
    // console.log("comment", comment);

    setCommentObj(comment);
    setBeatSuggLoading(true);
    setProjectBeatOpen(true);

    setBeatCommentText(comment?.text || "");

    const data = {
      owner: owner,
      premise_id: premiseID,
      user_beat: comment?.text,
      project_name: selectedProject?.name,
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

  const hasManyReplies = comments?.replies_count >= 3;
  console.log("hasManyReplies", hasManyReplies);

  // const hasAReply = replyData?.length >= 1;

  const handleReplyToggle = async (c, commentOwnerName) => {
    //console.log('reply comment',c,commentOwnerName,c?.user?.first_name==='Ida',currentUser,data?.premiseOwner);

    if (
      currentUser?.id !== data?.premiseOwner?.id &&
      (c?.user?.id === 1 || c?.user?.id === 79)
    ) {
      const res = await fetchUserAccess(`PP_ReplyAI`);
      // console.log("reply brainstorm res", res);
      if (res?.access === "No") {
        setNoAccessLbPopup(res);
      } else {
        applyReplyToggle(c, commentOwnerName);
      }
    } else {
      applyReplyToggle(c, commentOwnerName);
    }
  };
  const applyReplyToggle = (c, commentOwnerName) => {
    // Check if the current reply ID matches the clicked comment ID
    if (replyToCommentID === c?.id) {
      // If they match, hide the reply field
      setReplyField(false);
      setReplyToCommentID(null); // Optional: Clear the reply ID if you want
      setCurrentlyOpenedCommentID(null); // Optional: Clear the reply ID if you want
    } else {
      // If they don't match, show the reply field and set the new reply ID
      setReplyField(true);
      setReplyToCommentID(c?.id);
      setCurrentlyOpenedCommentID(c?.id);
      setCommentOwner(commentOwnerName);
    }
  };

  const [translateComment, isTranslationCommentLoading] =
    useTranslateCommentMutation();

  // console.log("single Comment", comments);
  // console.log(
  //   "Owner:",
  //   owner,
  //   "User:",
  //   user,
  //   "commentOwner:",
  //   comments?.user?.id
  // );

  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which comment's dropdown is open

  // Function to handle the dropdown toggle logic
  const handleDropdownToggle = (id) => {
    setOpenDropdownId((prevDropdownId) => (prevDropdownId === id ? null : id)); // Toggle dropdown visibility
  };

  return (
    <div className=" flex flex-col justify-end w-full relative ">
      <div className="md:ml-10">
        {!loading && actOneThreshold && actTwoEnd && (
          <>
            {commentIdx === 1 && (
              <p className="pl-[24px] mb-[-4px] text-[20px] text-[#00c3ff]  font-[500] setup-m">
                Setup:
              </p>
            )}
            {commentIdx === actOneThreshold + 1 && (
              <p className="pl-[24px] mb-[-4px] text-[20px] text-[#00c3ff]  font-[500] conflict-m">
                Conflict:
              </p>
            )}
            {commentIdx === actTwoEnd + 1 && (
              <p className="pl-[24px] mb-[-4px] text-[20px] text-[#00c3ff]  font-[500] resolution-m">
                Resolution:
              </p>
            )}
          </>
        )}

        {/* each comment  */}
        <div>
          <div
            className={` mt-[10px] w-[97%] ${
              fromNew ? "lg:w-[97%]" : "lg:w-[704px]"
            }  mx-auto  rounded-sm flex gap-1`}
          >
            {/* comment like */}

            <div className=" w-full relative">
              {/* <div className="flex flex-row-reverse"></div> */}
              <div className="flex  gap-[8px]">
                <a
                  data-reply
                  className="h-[31.9px] w-[32px]  mt-[6px]"
                  target="_blank"
                  rel="noreferrer"
                  href={
                    comments?.user?.id === user
                      ? `${URL}/memberpage/#/personaldetails`
                      : `${URL}/memberpage/#/user/${comments?.user?.id}/personaldetails`
                  }
                >
                  {profileImg?.[0]?.profile_photo ? (
                    <img
                      src={proImgUrl}
                      className="h-[31.9px] w-[32px] rounded-full object-cover border border-[#eaeaea]"
                      alt=""
                    />
                  ) : (
                    <img
                      src={userIcon}
                      className="h-[31.9px] w-[36px] "
                      alt=""
                    />
                  )}
                </a>

                <div
                  data-reply
                  className="border w-[78%] md:w-[86%] lg:w-[85.8%]  mr-auto bg-[#f8f8f8] border-[#EAEAEA]  rounded-[8px] p-1 "
                >
                  <div className="flex justify-between my-1 relative">
                    <div
                      className={`${
                        comments?.is_deleted
                          ? "text-[#a4a4a4]"
                          : "text-[#1E1E1E]"
                      } text-[#1E1E1E]  pl-[4px] pr-[4px] pt-[4px] h-[15px] flex gap-1 lg:gap-2 items-center`}
                    >
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          comments?.user?.id === user
                            ? `${URL}/memberpage/#/personaldetails`
                            : `${URL}/memberpage/#/user/${comments?.user?.id}/personaldetails`
                        }
                      >
                        <div className="flex items-center">
                          <p className="notranslate text-[14px] leading-[17px] font-[500] hover:text-[#00c3ff]">
                            {comments?.c_value}. {commenterName}
                          </p>
                          {comments?.user?.id === 1 ||
                          comments?.user?.id === 79 ? (
                            <></>
                          ) : (
                            <UserType
                              type={comments?.user?.centraldatabase?.type}
                              user_type={
                                comments?.user?.centraldatabase?.user_type
                              }
                            />
                          )}
                        </div>
                      </a>
                    </div>

                    {!comments?.is_deleted && (
                      <p className="text-[12px]  h-[15px] text-[#616161] font-[400]  leading-5  absolute top-[-9px] right-0">
                        {" "}
                        <TimeAgo timestamp={createdTime} />
                      </p>
                    )}
                  </div>
                  {comments?.is_deleted ? (
                    <div>
                      <p className="text-[#a4a4a4] text-[12px] italic lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                        Deleted
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="notranslate text-[#252525] text-[12px]  lg:text-[14px] font-[400] pl-[6px] pb-[4px] pr-[2px] leading-5 overflow-hidden break-words">
                        {commentText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {comments?.is_deleted ? (
                <div className="mb-[4px]" />
              ) : (
                <div
                  data-reply
                  className={`flex justify-between items-center ${iconWidth} my-[2px]`}
                >
                  <div className="  flex mb-[4px] items-center gap-[12px] text-sm ml-10 mt-[2px] leading-[20px]">
                    {/* {replyData?.length > 0 ? ( */}
                    {comments?.replies_count > 0 ? (
                      <>
                        {openAllReplies && openReplyFieldID === comments?.id ? (
                          <button
                            onClick={() => {
                              setOpenAllReplies(false);
                            }}
                            className="flex items-center  gap-[2px]"
                          >
                            <BiMinusCircle
                              className={`text-[16px] font-[500] cursor-pointer text-[#252525]`}
                            />
                            <p
                              className={`text-[12px] flex gap-[4px] ${
                                openAllReplies &&
                                openReplyFieldID === comments?.id
                                  ? "text-[#00c3ff]"
                                  : "text-[#252525]"
                              } font-[400] leading-[14.52px] `}
                            >
                              {comments?.replies_count}{" "}
                              <span className="hidden lg:block">
                                {comments?.replies_count > 1
                                  ? "Replies "
                                  : "Reply "}
                              </span>
                            </p>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleOpenAllReplies(
                                comments?.id,
                                commentOwnerName
                              );
                            }}
                            className="flex items-center gap-[2px]"
                          >
                            <BiPlusCircle
                              // onClick={() => setChildReplies(!childReplies)}
                              className="text-[16px] font-[500] cursor-pointer text-[#252525]"
                            />
                            <p className="text-[12px] text-[#616161] font-[400] leading-[14.52px] flex items-center gap-[4px]">
                              {comments?.replies_count}{" "}
                              <span className="hidden lg:block">
                                {comments?.replies_count > 1
                                  ? "Replies "
                                  : "Reply "}
                              </span>
                            </p>
                          </button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {commentIdx === 1 ? (
                      <div className="flex items-center gap-[8px]">
                        <button
                          onClick={() => {
                            // setReplyField(true);

                            // setReplyToCommentID(comments?.id);
                            // setCommentOwner(commentOwnerName);
                            handleReplyToggle(comments, commentOwnerName);
                          }}
                          className="flex items-center gap-1"
                        >
                          <IoIosUndo
                            className={`${
                              replyToCommentID === comments?.id && replyField
                                ? "text-[#00c3ff]"
                                : "text-[#252525]"
                            }`}
                          />
                          <p
                            className={`text-[12px] hidden lg:block ${
                              replyToCommentID === comments?.id && replyField
                                ? "text-[#00c3ff]"
                                : "text-[#252525]"
                            }  hidden md:block font-[400] leading-[14.52px] cursor-pointer`}
                          >
                            Reply
                          </p>
                        </button>

                        {data?.premiseOwner?.id === user &&
                          (comments?.text?.includes("?") ||
                            comments?.text?.includes("؟")) &&
                          (comments?.user?.id === 1 ||
                            comments?.user?.id === 79) && (
                            <div className=" flex items-center justify-between">
                              {comments?.c_value === 1 ? (
                                <>
                                  {comments?.replies_count === 0 ? (
                                    <>
                                      {comments?.suggested ? (
                                        <button
                                          disabled={suggestDisable}
                                          className="px-2 cursor-auto rounded-[4px] pt-[2px] pb-[3px] bg-[#616161]"
                                        >
                                          <p className="text-[12px] text-[#fafafa]  font-[400] leading-[14.52px] ">
                                            Suggested
                                          </p>
                                        </button>
                                      ) : (
                                        <button
                                          disabled={suggestDisable}
                                          onClick={() => {
                                            checkSuggestAllowance(
                                              comments?.text
                                            );
                                          }}
                                          className="px-2  rounded-[4px]  pt-[2px] pb-[3px] bg-[#00c3ff]"
                                        >
                                          {suggestDisable ? (
                                            <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                              Suggesting...
                                            </p>
                                          ) : (
                                            <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                              Suggestion
                                            </p>
                                          )}
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {comments?.suggested ? (
                                        <button
                                          disabled={suggestDisable}
                                          className="px-2 cursor-auto rounded-[4px] pt-[2px] pb-[3px] bg-[#616161]"
                                        >
                                          <p className="text-[12px] text-[#fafafa]  font-[400] leading-[14.52px] ">
                                            Suggested
                                          </p>
                                        </button>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {comments?.suggested ? (
                                    <button
                                      disabled={suggestDisable}
                                      className="px-2 cursor-auto rounded-[4px] pt-[2px] pb-[3px] bg-[#616161]"
                                    >
                                      <p className="text-[12px] text-[#fafafa]  font-[400] leading-[14.52px] ">
                                        Suggested
                                      </p>
                                    </button>
                                  ) : (
                                    <button
                                      disabled={suggestDisable}
                                      onClick={() => {
                                        checkSuggestAllowance(comments?.text);
                                      }}
                                      className="px-2  rounded-[4px]  pt-[2px] pb-[3px] bg-[#00c3ff]"
                                    >
                                      {suggestDisable ? (
                                        <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                          Suggesting...
                                        </p>
                                      ) : (
                                        <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                          Suggestion
                                        </p>
                                      )}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-[8px]">
                        {
                          <button
                            onClick={() => {
                              // setReplyField(true);

                              // setReplyToCommentID(comments?.id);
                              // setCommentField(false);
                              handleReplyToggle(comments, commentOwnerName);
                            }}
                            className="flex items-center gap-1"
                          >
                            <IoIosUndo
                              className={`${
                                replyToCommentID === comments?.id && replyField
                                  ? "text-[#00c3ff]"
                                  : "text-[#252525]"
                              }`}
                            />
                            <p
                              className={`text-[12px] hidden lg:block ${
                                replyToCommentID === comments?.id && replyField
                                  ? "text-[#00c3ff]"
                                  : "text-[#252525]"
                              }  hidden md:block font-[400] leading-[14.52px] cursor-pointer`}
                            >
                              Reply
                            </p>
                          </button>
                        }
                        {data?.premiseOwner?.id === user &&
                          (comments?.text?.includes("?") ||
                            comments?.text?.includes("؟")) &&
                          (comments?.user?.id === 1 ||
                            comments?.user?.id === 79) && (
                            <div className=" flex items-center justify-between">
                              {comments?.c_value === 1 ? (
                                <>
                                  {!comments?.replies_count >= 1 && (
                                    <button
                                      disabled={suggestDisable}
                                      onClick={() => {
                                        checkSuggestAllowance(comments?.text);
                                      }}
                                      className="px-2  rounded-[4px]  pt-[2px] pb-[4px] bg-[#00c3ff]"
                                    >
                                      {suggestDisable ? (
                                        <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                          Suggesting...
                                        </p>
                                      ) : (
                                        <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                          Suggestion
                                        </p>
                                      )}
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  {comments?.suggested ? (
                                    <button
                                      disabled={suggestDisable}
                                      className="px-2 cursor-auto rounded-[4px] pt-[2px] pb-[3px] bg-[#616161]"
                                    >
                                      <p className="text-[12px] text-[#fafafa]  font-[400] leading-[14.52px] ">
                                        Suggested
                                      </p>
                                    </button>
                                  ) : (
                                    <button
                                      disabled={suggestDisable}
                                      onClick={() => {
                                        checkSuggestAllowance(comments?.text);
                                      }}
                                      className="px-2  rounded-[4px]  pt-[2px] pb-[3px] bg-[#00c3ff]"
                                    >
                                      {suggestDisable ? (
                                        <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                          Suggesting...
                                        </p>
                                      ) : (
                                        <p className="text-[12px] text-[#fafafa] font-[400] leading-[14.52px] ">
                                          Suggestion
                                        </p>
                                      )}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                    <div className="hidden lg:block">
                      <CommentLike
                        {...{
                          disable,
                          comments,
                          setLikePopup,
                          commentLikes,
                          commentRefetch,
                          setDisable,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-[12px] items-center ">
                    <div className="lg:hidden">
                      <CommentLike
                        {...{
                          disable,
                          comments,
                          setLikePopup,
                          commentLikes,
                          commentRefetch,
                          setDisable,
                        }}
                      />
                    </div>

                    {!(
                      comments?.text?.includes("?") ||
                      comments?.text?.includes("؟")
                    ) && (
                      <>
                        {data?.premiseOwner?.id === user &&
                        comments?.add_to_beat ? (
                          <>
                            <button className="cursor-auto text-right">
                              <p
                                // onClick={() => handleAddToBeat(comments)}
                                className=" text-[12px] text-[#00c3ff] italic  font-[400] leading-[14.52px] "
                              >
                                Added as Beat
                              </p>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              disabled={addToBeatDisable}
                              className="text-right"
                            >
                              {data?.premiseOwner?.id === user && (
                                <p
                                  onClick={() => handleAddToBeat(comments)}
                                  className={` text-[12px] text-[#252525] hover:text-[#00c3ff] font-[400] leading-[14.52px] `}
                                >
                                  Add as Beat
                                </p>
                              )}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`absolute flex flex-col md:flex-row gap-2 items-center ${
                  fromNew ? "right-[8.5px] xl:right-[38.5px]" : "right-0"
                }  top-[18%] md:top-[28%]`}
              >
                <CommentTranslator
                  key={comments.id}
                  comment={comments}
                  translateComment={translateComment}
                  commentRefetch={commentRefetch}
                  setCommentText={setCommentText}
                />

                <>
                  {" "}
                  {comments?.is_deleted ? (
                    <div />
                  ) : (
                    <>
                      {(owner === user || comments?.user?.id === user) &&
                      comments?.user?.id !== 1 &&
                      comments?.user?.id !== 79 ? (
                        <div className="flex gap-2 items-center pl-[2px]">
                          <button
                            data-reply
                            disabled={disableD}
                            onClick={() => {
                              setIdToDlt(comments?.id);
                              setOpenDltPop(true);
                            }}
                            className={` ${
                              disableD ? "cursor-default" : "cursor-pointer"
                            }`}
                          >
                            <FaRegTrashAlt className="h-5 w-5 text-[#909090] " />
                          </button>
                        </div>
                      ) : (
                        <div className={`px-3 'cursor-default'}`}>
                          <div className="" />
                        </div>
                      )}
                    </>
                  )}
                </>
              </div>
            </div>
            {likePopup && (
              <CommentLikePopup
                setLikePopup={setLikePopup}
                allLikes={comments?.likes}
              />
            )}
          </div>
        </div>

        {/* comment reply */}
        {/* when theres reply present */}
        {replyToCommentID && replyToCommentID === comments?.id && (
          <div>
            {replyField && (
              <div
                className={`w-[70.6%] md:w-[73.6%]  ${inpRightMargin} ml-auto mb-[8px]`}
              >
                <motion.div
                  // data-reply
                  // ref={replyRef}
                  initial={{ opacity: 0, x: -70 }} // Start from slightly below the final position
                  animate={{ opacity: 1, x: 0 }} // Move to the final position
                  exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                  transition={{ duration: 0.5 }} // Adjust the duration as needed
                >
                  <form
                    data-reply
                    onSubmit={handlePostReplyToComment}
                    className="relative w-full text-[14px]
              bg-[#fafafa] border rounded-[8px] border-[#eaeaea] focus:outline-none  flex"
                  >
                    {owner === user ? (
                      <textarea
                        // data-reply
                        ref={replyRef}
                        type="text"
                        name="reply"
                        maxLength={250}
                        id=""
                        className="bg-[#F8F8F8] resize-none leading-[21px] px-[8px] w-[100%] h-[44.27px] rounded-[8px] lg:h-[37px]  focus:border-none focus:outline-none text-[14px] pr-[45px] font-[400]"
                        placeholder="Enter your reply..."
                        // required
                        onChange={handleReplyTextChange}
                        value={replyText}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !disableD) {
                            event.preventDefault(); // Prevents default form submission behavior
                            handlePostReplyToComment(event, true);
                            event.currentTarget.blur();
                          }
                        }}
                      />
                    ) : (
                      <textarea
                        // data-reply
                        ref={replyRef}
                        type="text"
                        name="reply"
                        maxLength={150}
                        id=""
                        className="bg-[#F8F8F8] resize-none leading-[21px] px-[8px] w-[100%] h-[44.27px]  lg:h-[37px] rounded-[8px]  focus:border-none focus:outline-none text-[14px] pr-[45px] font-[400]"
                        placeholder="Enter your reply..."
                        // required
                        value={replyText}
                        onChange={handleReplyTextChange}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !disableD) {
                            event.preventDefault();
                            handlePostReplyToComment(event, true);
                            event.currentTarget.blur();
                          }
                        }}
                      />
                    )}
                    {disableD ? (
                      <div className=" absolute right-[16px] bottom-[20%] ">
                        <BtnLoading />
                      </div>
                    ) : (
                      <button
                        className="md:w-[21px] absolute right-[16px] bottom-[20%]"
                        disabled={disableD}
                        type="submit"
                      >
                        <IoMdSend className="text-[#00c3ff] w-6 h-6" />
                      </button>
                    )}
                  </form>
                </motion.div>
                <div className=" text-right">
                  {owner === user ? (
                    <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
                      {replyTextCount}/250
                    </p>
                  ) : (
                    <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
                      {replyTextCount}/150
                    </p>
                  )}
                </div>
              </div>
            )}{" "}
          </div>
        )}
      </div>

      <div></div>

      {openAllReplies && openReplyFieldID === comments?.id && (
        // <div>
        //   {
        //     <div
        //       className={`${
        //         hasManyReplies
        //           ? "max-h-[40vh] overflow-y-auto pr-2 overflow-x-hidden"
        //           : ""
        //       }`}
        //     >
        //       {replyData?.replies
        //         ?.slice() // Create a shallow copy to avoid mutating the original array
        //         ?.sort(
        //           (a, b) => new Date(b.created_at) - new Date(a.created_at)
        //         )
        //         ?.map((reply, index) => (
        //           <motion.div
        //             // data-reply
        //             key={reply.id + index}
        //             ref={
        //               index === replyData?.replies?.length - 1 ? latestReplyRef : null
        //             }
        //             initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
        //             animate={{ opacity: 1, y: 0 }} // Move to the final position
        //             exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
        //             transition={{ duration: 0.5 }} // Adjust the duration as needed
        //           >
        //             <ReplyToComments
        //               fromNew={fromNew}
        //               commentIdx={comments?.c_value}
        //               // Make sure to provide a unique key when mapping over an array
        //               reply={reply}
        //               index={index}
        //               owner={owner}
        //               setProjectBeatOpen={setProjectBeatOpen}
        //               setCommentText={setCommentText}
        //               setBeatCommentText={setBeatCommentText}
        //               replyRefetch={replyRefetch}
        //               replyToCommentID={replyToCommentID}
        //               user={user}
        //               handleAddToBeat={handleAddToBeat}
        //               commentRefetch={commentRefetch}
        //             />
        //           </motion.div>
        //         ))}
        //     </div>
        //   }{" "}
        // </div>
        <ReplyDataOfComments
          comments={comments}
          hasManyReplies={hasManyReplies}
          latestReplyRef={latestReplyRef}
          fromNew={fromNew}
          owner={owner}
          user={user}
          handleAddToBeat={handleAddToBeat}
          setBeatCommentText={setBeatCommentText}
          setCommentText={setCommentText}
          setProjectBeatOpen={setProjectBeatOpen}
          replyToCommentID={replyToCommentID}
          commentRefetch={commentRefetch}
        />
      )}

      {/* when theres no reply */}
      {projectBeatOpen && (
        <BeatEditPop
          project_id={project_id}
          popClose={() => setProjectBeatOpen(false)}
          commentText={commentText}
          commentObj={commentObj}
          commentRefetch={commentRefetch}
         
          data={data}
          refetch={refetch}
          premiseData={premiseData}
          suggestedBeats={suggestedBeats}
          isBeatSuggLoading={isBeatSuggLoading}
          beatSuggestLoading={beatSuggestLoading}
          selectedProject={selectedProject}
          setAddToBeatDisable={setAddToBeatDisable}
          // currentPremiseProject={currentPremiseProject}
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
          service={service}
        />
      )}
      <div className="h-[1px] w-[88%] mx-auto bg-[#eaeaea] mb-[4px]" />
      {openDltPop && (
        <ConfirmationModal
          isOpen={openDltPop}
          onClose={() => setOpenDltPop(false)}
          onConfirm={() => handleDeleteComment(idToDlt)}
          title="Are you sure you want to delete this comment?"
          content="Are you sure you want to delete this item?"
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

export default AllComments;
