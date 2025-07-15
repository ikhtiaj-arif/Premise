import { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import { IoMdSend } from "react-icons/io";
import {
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseUserPictureQuery,
  useGetPremiseUserQuery,
} from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/Icons/crossIcon.png";
import newTabIcn from "../../img/Icons/newTabIcn.png";
import userImg from "../../img/Icons/userImg.png";
// import transCartQ from "../../../img/Icons/transCartQ.png";

// import backgroundImg from "../../img/Icons/download.jpg";
import { motion } from "framer-motion";
import { MdKeyboardBackspace } from "react-icons/md";
import { MyContext } from "../../App";
import {
  useGetSavedCharactersQuery,
  useSaveCharactersMutation,
} from "../../app/EndPoints/Characters/Characters";
import { useCreateReplyMutation } from "../../app/EndPoints/commentReply/reply";

import axios from "axios";
import CardHeadOptions from "../PremiseV2/Card/CardHeadOptions";
import AvailableForTranslationPop from "../PremiseV2/Popups/AvailableForTranslationPop";
import BankDetailsPop from "../PremiseV2/Popups/BankDetails/BankDetailsPop";
import MonetizePreferencePop from "../PremiseV2/Popups/MonetizePreferencePop";
import PaySalePopup from "../PremiseV2/Popups/PaySalePopup";
import ReqSalePop from "../PremiseV2/Popups/ReqSalePop";
import ReqTranslationPop from "../PremiseV2/Popups/ReqTranslationPop";

import NoPremisePop from "../PremiseV2/Popups/alerts/NoPremisePop";
import NotifyPopup from "../PremiseV2/Popups/alerts/NotifyPopup";
import SaleRequestedOwner from "../PremiseV2/Popups/SaleRequestedOwner";
import TransInOtherLang from "../PremiseV2/Popups/TransInOtherLang.pop";
import ViewTranslationPop from "../PremiseV2/Popups/ViewTranslation.pop";
import AddBeatTutorialPop from "../PremiseV2/sequalPopup/AddBeatTutorialPop";
import AfterFinalPostPremisePop from "../PremiseV2/sequalPopup/AfterFinalPostPremisePop";
import NoAccessLbPopUp from "../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";
import AskIda from "../SharedVersion/AskIda";
import PopupComment from "../SharedVersion/PopupComment";
import PopupPremiseText from "../SharedVersion/PopupPremiseText";
import PopupTextarea from "../SharedVersion/PopupTextarea";
import TypingLoader from "../TypingLoader";
import { baseURL, URL } from "../utils";
import AllComments from "./AllComments";
import CharacterEditablePop from "./Character/CharacterEditablePop";
import DeletePremise from "./DeletePremise";
import LikePremise from "./LikePremise";
import OwnerMail from "./OwnerMail";
import PopupSource from "./PopupSource";
import { hideUnhidePremise } from "./PreiseUtils";
import "./Premise.css";
import UserMail from "./UserMail";
import UserNamePopup from "./UserNamePopup";
import UserType from "./UserType";

const Popup = ({
  popClose,
  data,
  refetch,
  transText,
  viewText,
  handleVisibility,
  handleMonetizing,
  afterFinalPostPremiseDemoPop,
  setAfterFinalPostPremiseDemoPop,
}) => {
  const {
    bg_img,
    bg_color,
    stylings,
    dText,
    id,
    user,
    premiseOwner,
    handleUserMail,
    formattedTime,
    formattedDate,
    setHideDisable,
    project_id,
  } = data;
  // console.log("popData", data);
  const { data: characters, refetch: charRefetch, isCharLoading } =
    useGetSavedCharactersQuery(project_id);
  const [notifyPopup, setNotifyPopup] = useState(false);
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();

  const [characterArray, setCharacterArray] = useState([]);
  const [addPopup, setAddPopup] = useState(null);
  const [onlyAdd, setOnlyAdd] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(true);

  const [openTransOtherPop, setOpenTransOtherPop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAvailableForTranslationPop, setOpenAvailableForTranslationPop] =
    useState(false);
  const [openMonetizingPreferencesPop, setOpenMonetizingPreferencesPop] =
    useState(null);
  const [openViewTranslationsPop, setOpenViewTranslationsPop] = useState(false);
  const [noAccessLbPopUp, setNoAccessLbPopUp] = useState(null);
  const [saleId, setSaleId] = useState("");
  const [viewSale, setViewSale] = useState(false);
  const [saleRequestPop, setSaleRequestPop] = useState("");
  const [openPop, setOpenPop] = useState(false);
  const [userMail, setUserMail] = useState(null);
  const [ownerMail, setOwnerMail] = useState(false);
  const [openHidePop, setOpenHidePop] = useState(null);

  const [service, setService] = useState(null);
  const [noAccessPopup, setNoAccessPopup] = useState(null);

  useEffect(() => {
    if (characters) setCharacterArray(characters);
  }, [characters]);

  const handleUpdateSavedChar = async () => {
    setCharacterLoading(true);
    try {
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: project_id,
        // body: { char_data: charArr },
        body: { char_data: charArr, is_draft: false, premise_id: id },
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        // setCharSaveDisable(true);
        setCharacterLoading(false);
        // setOpenCharacterChart(false);
        charRefetch()

        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  const handleSaveAsDraft = async () => {
    setCharacterLoading(true);
    try {
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: project_id,
        body: { char_data: charArr, is_draft: true, premise_id: id },
        is_draft: true,
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);
        popClose();

        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };
  const lastCommentRef = useRef(null);

  const replyRef = useRef(null);

  const {
    allspProjectJSON,
    currentlyOpenedCommentID,
    setCurrentlyOpenedCommentID,
  } = useContext(MyContext);
  const [openDotMenu, setOpenDotMenu] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const [commentField, setCommentField] = useState(true);
  const [replyField, setReplyField] = useState(false);

  const [cValue, setCvalue] = useState(null);

  const [openReplyField, setOpenReplyField] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyToCommentID, setReplyToCommentID] = useState(null);
  const [openReplyFieldID, setOpenReplyFieldID] = useState(null);
  const [commentOwner, setCommentOwner] = useState("");

  const [openAllReplies, setOpenAllReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const replyResStat = isReplyResInfo?.status;
  const [openCharacterChart, setOpenCharacterChart] = useState(null);

  const [replyTextCount, setReplyTextCount] = useState(0);

  const handleClear = () => {
    // setText("");
  };

  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );
  // console.log("ALLPROJECT", project_id);

  const currentProjectName = currentProjectData?.name;
  const isProjectLocked = currentProjectData?.locked;
  const currentProjectOwner = currentProjectData?.owner;

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(premiseOwner?.id);

  const proImgUrl = baseURL.concat(profileImg?.[0]?.profile_photo);
  // console.log(stylings);

  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const premiseId = data?.id;

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(premiseId);
  // console.log("premiseId", premiseData?.available_for_sale);
  const [actOneThreshold, setActOneThreshold] = useState(null);
  const [actTwoEnd, setActTwoEnd] = useState(null);

  // console.log("premiseData?.visible_to",premiseData?.visible_to)

  useEffect(() => {
    if (!isPremiseLoading && premiseData?.setC) {
      // Step 1: Log premiseData.setC to verify it
      // console.log("premiseData setC:", premiseData?.setC); // Check what setC looks like

      try {
        const setCString = premiseData?.setC;

        // Step 2: Check if setC is already an object or a string
        if (typeof setCString === "string") {
          const setCObject = JSON.parse(setCString.replace(/'/g, '"')); // Parse if it's a string
          // console.log("Parsed setCObject:", setCObject); // Log parsed object to ensure it's correct

          const actOne = setCObject["Forward the Act One"];
          const actTwo = setCObject["Forward the Act Two"];

          // Step 3: Set the thresholds
          setActOneThreshold(actOne); // Last number of Act One
          setActTwoEnd(actTwo[actTwo.length - 1]); // Last number of Act Two

          // console.log("actOneThreshold:", actOne); // Check if actOneThreshold is being set correctly
          // console.log("actTwoEnd:", actTwo[actTwo.length - 1]); // Check if actTwoEnd is being set correctly
        } else {
          // If setC is already an object, handle it directly
          const setCObject = setCString; // No need to parse;

          const actOne = setCObject["Forward the Act One"];
          const actTwo = setCObject["Forward the Act Two"];

          setActOneThreshold(actOne[actOne.length - 1]); // Last number of Act One
          setActTwoEnd(actTwo[actTwo.length - 1]); // Last number of Act Two
        }
      } catch (error) {
        console.error("Error parsing setC or setting thresholds:", error);
      }
    }
  }, [isPremiseLoading, premiseData]); // Ensure premiseData is available before running the effect

  useEffect(() => {}, [actOneThreshold, actTwoEnd]);

  useEffect(() => {
    premiseRefetch();
  }, [premiseId]);

  const {
    data: commentsData,
    isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(premiseId);

  const finalCount = commentsData?.counts;

  const handleDelete = (id) => {
    setIsDelete(id);
  };

  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();

  const userName = `${userQuery?.first_name} ${userQuery?.last_name}`;
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  // useEffect(() => {
  //   setCvalue(parseInt(commentsData?.comments?.length) + 1);
  // }, [commentsData]);

  useEffect(() => {
    if (commentsData) {
      setLoading(false);
    }
  }, [commentsData]);

  useEffect(() => {
    // console.log(commentsData.comments.length);
    commentRefetch();
    const commentArray = commentsData?.comments?.length + 1;

    setCvalue(commentArray);
  }, [commentsData, commentRefetch]);

  const handleReplyTextChange = (event) => {
    const reply = event?.target?.value?.replace(/^\s+|\s+(?=\s)/g, "");
    // console.log("reply----->", reply);
    setReplyTextCount(reply.length);
    setReplyText(reply);
  };

  //submit reply
  const handlePostReplyToComment = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    const data = {
      reply: replyToCommentID,
      text: replyText,
    };
    const response = await createReplyMutation(data);
    if (response) {
      // refetch();
      // setOpenReplyField(null);
      e.target.reset();
      setReplyText("");
      commentRefetch();
      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setReplyLoading(false);
    }
  };
  // useEffect(() => {}, [openDotMenu]);

  const handleHideUnhidePremise = (id) => {
    hideUnhidePremise(id, setHideDisable, premiseRefetch, setOpenDotMenu);
  };

  const dotPopupRef = useRef();
  useEffect(() => {
    const closeMenu = (e) => {
      if (
        openDotMenu !== null && // Only close if a menu is open
        !dotPopupRef?.current?.contains(e.target) && // Allow clicks inside the dot menu
        !e.target.closest(".ellipsis-container") // Allow clicks inside the button
      ) {
        setOpenDotMenu(null);
      }
    };

    document.body.addEventListener("mousedown", closeMenu);
    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, [openDotMenu]);

  // console.log("commentsData", commentsData);
  const handleOpenSp = () => {
    // console.log("object", p);
    if (isProjectLocked) {
      window.open(`${baseURL}/scriptpad2/#/generated-scripts`);
    }
    window.open(
      `${baseURL}/scriptpad2/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  // dynamic setup conflict resolution
  const [headerText, setHeaderText] = useState("Setup");
  const commentsRef = useRef(null);

  useEffect(() => {}, [openDotMenu]);

  const handlePremiseOpenNewTab = (id) => {
    // let host = window.location.origin + `/#/new-tab/${id}`;
    // window.open(host, "_blank");

    // console.log(id);
    // // const url = `${baseURL}/new-tab/${id}`; // Use `id` if provided; fallback to current page URL
    const url = `${window.location.origin}/ideamall/#/new-tab/${id}`; // Use `id` if provided; fallback to current page URL

    // // Open the URL in a new tab
    window.open(url, "_blank");
  };

  const [translationRequestPop, setTranslationRequestPop] = useState("");

  const [viewTrnRequests, setViewTrnRequests] = useState("");
  const [viewSaleRequests, setViewSaleRequests] = useState("");

  const handleTranslationRequest = (id) => {
    setTranslationRequestPop(id);
    // console.log("trans id", id);
  };

  const [viewTransactionPId, setViewTransactionPId] = useState("");
  const handleViewTransaction = (id) => {
    // console.log(id);
    setViewTransactionPId(id);
    setOpenViewTranslationsPop(!openViewTranslationsPop);
    setOpenDotMenu(null);
  };

  const token = localStorage.getItem("accessToken");

  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const [saleRequestedOwner, setSaleRequestedOwner] = useState(true);
  const [names, setNames] = useState([]);
  const handleSaleRequestedOwner = async () => {
    try {
      // console.log(id);
      const data = await axios.get(
        `${URL}/ideamall/premise/request/${id}/Sale`,
        {
          headers: header,
        }
      );

      if (data?.data?.data?.length > 0) {
        setSaleRequestedOwner(true);
      }

      setNames((prevNames) => [data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenAllReplies = (id, commenterName) => {
    console.log("Open replyfield");
    setOpenAllReplies(true);
    setOpenReplyFieldID(id);
    setReplyToCommentID(id);
    // setReplyToCommentID(comments?.id);
    // setCurrentlyOpenedCommentID(comments?.id);
    setCurrentlyOpenedCommentID(id);
    setCommentOwner(commenterName);
  };

  const [openPopSource, setOpenPopSource] = useState(false);
  const [addBeatTutorialPop, setAddBeatTutorialPop] = useState(false);
  const [sourcePremiseNotAvailabl, setSourcePremiseNotAvailable] =
    useState(false);
  const [sourcePopData, setSourcePopData] = useState();
  const handleCheckPremiseData = async (id) => {
    try {
      const data = await axios.get(`${URL}/ideamall/api/v2/premise/${id}`, {
        headers: header,
      });
      const premiseData = data?.data;
      setSourcePopData("premiseData", premiseData);

      if (premiseData) {
        const formattedDate = new Date(
          premiseData?.created_at
        ).toLocaleDateString("en-US", {
          // timeZone: "GMT",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          // weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const formattedTime = new Date(
          premiseData?.created_at
        ).toLocaleTimeString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          hour: "numeric",
          minute: "numeric",
        });

        const data = {
          stylings: premiseData?.text?.includes("+")
            ? JSON.parse(premiseData?.text?.split("+")[0])
            : {}, // Default to an empty object if `text` is undefined or improperly formatted
          bg_color: premiseData?.bg_color || "",
          premiseOwner: premiseData?.premiseOwner,
          bg_img: premiseData?.bg_img || "",
          comments: premiseData?.comments || [],
          created_at: premiseData?.created_at || "",
          likes: premiseData?.likes || 0,
          id: premiseData?.id || "",
          source_language: premiseData?.source_language || "",
          updated_at: premiseData?.updated_at || "",
          dText: premiseData?.text?.includes("+")
            ? premiseData?.text?.split("+")[1]
            : "",
          // viewText: premiseData?.text?.includes("+")
          //   ? premiseData?.text?.split("+")[1]
          //   : "",
          project_id: premiseData?.project_id || "",
          m_value: premiseData?.m_value || "",
          formattedTime,
          formattedDate,
        };

        setSourcePopData(data);
      }

      if (premiseData?.premiseOwner?.id === user) {
        handlePremiseOpenNewTab(premiseData?.id);
      } else {
        setOpenPopSource(true);
      }
    } catch (error) {
      setSourcePremiseNotAvailable(true);
    }
  };

  if (isPremiseLoading) {
    return <>Loading...</>;
  } else
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
        <ToastContainer />
        <div className=" h-[100vh] lg:h-[554px] xl:h-[608px] mb-[20px] lg:mb-0 2xl:h-[673px] lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[1220px] xl:w-[1220px] md:mx-auto relative lg:rounded-[8px]">
          {/* close popup */}
          <img
            src={crossIcon}
            alt=""
            className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
            onClick={() => {
              popClose(false);
              refetch();
            }}
          />
          <MdKeyboardBackspace
            src={crossIcon}
            alt=""
            className="text-[#33B0CA] text-left text-[38px] my-[8px] mt-[30px] ml-[24px] z-[1] cursor-pointer lgHidden"
            onClick={() => {
              popClose(false);
              // setOpenReplyField(null);
              // setReplyToCommentID(null);
              //sdfdsfds
            }}
          />

          <div className="flex flex-col gap-[21px] lg:gap-[32px] lg my-auto lg:flex-row lg:justify-center ">
            {/* left div */}
            <div className="border border-[#eaeaea] relative bg-[#FAFAFA] shadow-lg w-[94%] sm:w-[80%] md:w-[36%] max-w-[377px] h-[33vh] lg:h-[500px] xl:h-[546px] 2xl:h-[610px] lg:mt-[26px] xl:mt-[32px]  mx-auto lg:mx-0 lg:ml-[32px] xl:ml-[32px] rounded-[8px]">
              {/* header */}
              <div className="flex justify-between items-center bg-[#FAFAFA] rounded-t-[8px] px-2 sm:px-[15px] pt-[15px] pb-[6px]">
                <div className="block max-w-[140px]">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      premiseOwner?.id === user
                        ? `${URL}/memberpage/#/personaldetails`
                        : `${URL}/memberpage/#/user/${premiseOwner?.id}/personaldetails`
                    }
                  >
                    <div className="flex-1 flex gap-1 items-center">
                      {profileImg?.[0]?.profile_photo ? (
                        <img
                          src={proImgUrl}
                          className="h-[35.9px] w-[36px] rounded-full object-cover border border-[#eaeaea]"
                          alt=""
                        />
                      ) : (
                        <img
                          src={userImg}
                          className="w-[36px] h-[35.9px] rounded-full border border-[#eaeaea]"
                          alt=""
                        />
                      )}
                      <div>
                        <div className="flex items-center">
                          <h4
                            className={`notranslate w-[75px] max-w-[110px] text-[#252525] font-[600] text-[14px] capitalize cursor-pointer hover:text-[#33B0CA] truncate `}
                            title={`${premiseOwner?.first_name} ${premiseOwner?.last_name}`}
                          >
                            {premiseOwner?.first_name} {premiseOwner?.last_name}
                          </h4>
                          <UserType
                            type={premiseOwner?.centraldatabase?.type}
                            user_type={premiseOwner?.centraldatabase?.user_type}
                          />
                        </div>
                        <p className="text-[#616161] text-[10px] flex flex-col font-[400] leading-[12px] min-w-[120px] mt-[-3px]">
                          <p>
                            {formattedDate}, {formattedTime}
                          </p>
                          {(premiseOwner?.id === user ||
                            premiseOwner?.id === currentProjectOwner) && (
                            <p
                              data-te-toggle="tooltip"
                              title={`${`${currentProjectName} `}`}
                              className="notranslate"
                            >
                              {/* {currentProjectName?.slice(0, 20)} */}
                              {currentProjectName?.length > 20
                                ? `${currentProjectName.slice(0, 20)}...`
                                : currentProjectName}
                            </p>
                          )}
                        </p>
                      </div>
                    </div>
                  </a>
                  {/* 
                <div className="text-[#616161] text-[12px] flex gap-[8px] font-[400]  ml-[36px] leading-3">
                  <p>
                    {formattedDate}, {formattedTime} GMT
                  </p>
                </div> */}
                </div>
                <div className="flex gap-[3px] items-center">
                  {premiseOwner?.id === user && (
                    <img
                      data-te-toggle="tooltip"
                      title="Open In New Tab"
                      src={newTabIcn}
                      className="w-7 h-7 cursor-pointer mt-[-8px]"
                      alt=""
                      onClick={() => handlePremiseOpenNewTab(premiseId)}
                    />
                  )}
                  <CardHeadOptions
                    // owner={owner}
                    // index={index}
                    refetch={premiseRefetch}
                    viewTrnRequests={viewTrnRequests}
                    setViewTrnRequests={setViewTrnRequests}
                    viewTransactionPId={viewTransactionPId}
                    setViewTransactionPId={setViewTransactionPId}
                    setViewSaleRequests={setViewSaleRequests}
                    openTransOtherPop={openTransOtherPop}
                    setOpenTransOtherPop={setOpenTransOtherPop}
                    handleDelete={handleDelete}
                    setOpenCharacterChart={setOpenCharacterChart}
                    openViewTranslationsPop={openViewTranslationsPop}
                    openAvailableForTranslationPop={
                      openAvailableForTranslationPop
                    }
                    setOpenAvailableForTranslationPop={
                      setOpenAvailableForTranslationPop
                    }
                    setOpenViewTranslationsPop={setOpenViewTranslationsPop}
                    setOpenMonetizingPreferencesPop={
                      setOpenMonetizingPreferencesPop
                    }
                    setNoAccessLbPopUp={setNoAccessLbPopUp}
                    // setUserMail={setUserMail}
                    setSaleId={setSaleId}
                    setViewSale={setViewSale}
                    setSaleRequestPop={setSaleRequestPop}
                    setTranslationRequestPop={setTranslationRequestPop}
                    isProjectLocked={isProjectLocked}
                    id={id}
                    premiseOwner={premiseOwner}
                    filter_flag={premiseData?.filter_flag}
                    visible_to={premiseData?.visible_to}
                    comment_filter_flag={premiseData?.comment_filter_flag}
                    project_id={project_id}
                    available_for_sale={premiseData?.available_for_sale}
                    available_for_translation={
                      premiseData?.available_for_translation
                    }
                    premise_source_id={premiseData?.premise_source_id}
                    translation_request_count={
                      premiseData?.translation_request_count
                    }
                    no_of_times_translated={premiseData?.no_of_times_translated}
                    sale_request_count={premiseData?.sale_request_count}
                    is_requested_for_sale={premiseData?.is_requested_for_sale}
                    is_translated_languages={
                      premiseData?.is_translated_languages
                    }
                    dotPopupRef={dotPopupRef}
                    setOpenDotMenu={setOpenDotMenu}
                    openDotMenu={openDotMenu}
                    setOpenHidePop={setOpenHidePop}
                    openHidePop={openHidePop}
                    setUserMail={setUserMail}
                    addPopup={addPopup}
                    setAddPopup={setAddPopup}
                    PremiseData={premiseData}
                    premiseRefetch={premiseRefetch}
                    notifyPopup={notifyPopup}
                    setNotifyPopup={setNotifyPopup}
                    is_read_only={premiseData?.is_read_only}
                    handleCheckPremiseData={handleCheckPremiseData}
                  />
                </div>
              </div>
              {/* image */}
              <PopupPremiseText
                {...{ data, bg_img, bg_color, stylings, viewText, dText }}
              />

              <div className="hidden md:flex   mt-[8px]  flex-col justify-between">
                {/* <div className="w-[90%] mx-auto bg-[#eaeaea] h-[2px] hidden md:block" /> */}
                {/* icons */}
                <div className="lg:ml-3 hidden lg:block py-[2px] ">
                  <div className=" flex gap-1 space-x-4 items-center px-3 ">
                    {/* like */}
                    {/* <PopupLike
                     {...{ user, id, premiseRefetch, premiseData }} 
                     /> */}

                    <LikePremise
                      data={{
                        user,
                        ...premiseData,
                      }}
                      refetch={premiseRefetch}
                    />
                    {/* comment */}
                    <PopupComment
                      {...{
                        setOpenReplyField,
                        setCommentField,
                        commentField,
                        finalCount,
                      }}
                    />
                  </div>
                </div>{" "}
              </div>
              <div className="hidden lg:block md:absolute bottom-3 w-full">
                <AskIda
                  id={premiseId}
                  source_language={premiseData?.source_language}
                  {...{
                    user,
                    premiseOwner,
                    commentRefetch,
                    setOpenAllReplies,
                    setOpenReplyFieldID,
                    lastCommentRef,
                    isLoading,
                    setIsLoading,
                    setNoAccessPopup,
                    setService,
                  }}
                />
                {/* textarea */}
                <PopupTextarea
                  {...{
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
                    isLoading,
                    setIsLoading,
                  }}
                />
              </div>
            </div>

            {/* right div */}
            <div
              data-reply
              className=" lg:border lg:mt-[26px] xl:mt-[32px]  bg-[#fff] lg:bg-[#fafafa] lg:shadow-lg border-[#eaeaea] w-[90%] sm:w-[68%] md:w-[68%] lg:w-[769px]  mx-auto lg:ml-0 h-[46vh] lg:h-[500px] xl:h-[546px] 2xl:h-[610px] rounded-[8px] flex flex-col gap-[5px] relative"
            >
              {/* Fixed dynamic heading */}
              {/* <div className="fixed w-[90%] sm:w-[68%] md:w-[70%] lg:w-[769px] z-50 rounded-t-[8px] bg-[#33B0CA] py-1 text-center text-white font-bold text-[20px]">
                {headerText}
              </div> */}
              <div
                ref={lastCommentRef}
                // ref={commentsRef}
                className="w-full h-[30vh] lg:h-[auto] py-[12px] overflow-x-hidden !overflow-y-auto lg:premiseScroll "
              >
                {loading ? (
                  <div className="z-[1] lg:mt-[160px] xl:mt-[200px]">
                    <TypingLoader />
                  </div>
                ) : commentsData?.comments?.length > 0 ? (
                  <div>
                    {[...(commentsData?.comments || [])] // Create a shallow copy of the array to avoid modifying the original
                      .sort((a, b) => a.c_value - b.c_value) // Sort comments by c_value in ascending order
                      .map((comment, index) => (
                        <motion.div
                          key={comment.id + index}
                          initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
                          animate={{ opacity: 1, y: 0 }} // Move to the final position
                          exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                          transition={{ duration: 0.5 }} // Adjust the duration as needed
                        >
                          <AllComments
                            handleOpenAllReplies={handleOpenAllReplies}
                            commentIdx={index + 1}
                            comments={comment}
                            data={data}
                            refetch={refetch}
                            openReplyField={openReplyField}
                            setOpenReplyField={setOpenReplyField}
                            replyToCommentID={replyToCommentID}
                            setReplyToCommentID={setReplyToCommentID}
                            replyResStat={replyResStat}
                            setCommentOwner={setCommentOwner}
                            setOpenAllReplies={setOpenAllReplies}
                            openAllReplies={openAllReplies}
                            commentRefetch={commentRefetch}
                            proImgUrl={proImgUrl}
                            setReplyField={setReplyField}
                            replyField={replyField}
                            // replyRef={replyRef}
                            handleReplyTextChange={handleReplyTextChange}
                            handlePostReplyToComment={handlePostReplyToComment}
                            replyLoading={replyLoading}
                            premiseData={premiseData}
                            replyTextCount={replyTextCount}
                            setReplyTextCount={setReplyTextCount}
                            // m_value={m_value}
                            actTwoEnd={actTwoEnd}
                            actOneThreshold={actOneThreshold}
                            openReplyFieldID={openReplyFieldID}
                            setOpenReplyFieldID={setOpenReplyFieldID}
                            project_id={project_id}
                            iconWidth={"w-[87%] md:w-[91%]"}
                            inpRightMargin={"mr-[47px] md:mr-[88px]"}
                            loading={loading}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            addBeatTutorialPop={addBeatTutorialPop}
                            setAddBeatTutorialPop={setAddBeatTutorialPop}
                          />
                        </motion.div>
                      ))}
                  </div>
                ) : commentsData?.counts > 0 &&
                  commentsData?.comments?.length === 0 ? (
                  <p className=" text-center my-4">Comments Are Private. </p>
                ) : (
                  <p className=" text-center my-4">No Comments Available </p>
                )}
              </div>

              {/* comment and reply div mobile */}
              <div className="lg:hidden h-[10vh] md:h-[116px] flex flex-col justify-between">
                <div className="w-[90%] mx-auto bg-[#eaeaea] h-[2px] hidden md:block" />{" "}
                <div className="fixed bottom-[18px] left-0 w-[100%] md:relative md:bottom-0 md:w-auto px-2 ">
                  <AskIda
                    id={premiseId}
                    source_language={premiseData?.source_language}
                    {...{
                      user,
                      premiseOwner,
                      commentRefetch,
                      setOpenAllReplies,
                      setOpenReplyFieldID,
                      lastCommentRef,
                      isLoading,
                      setIsLoading,
                      setNoAccessPopup,
                      setService,
                    }}
                  />
                  <PopupTextarea
                    {...{
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
                      setIsLoading,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isDelete && (
            <DeletePremise
              setIsDelete={setIsDelete}
              refetch={refetch}
              isDelete={isDelete}
              deleteId={project_id}
              projectName={currentProjectName?.slice(0, 20)}
              popClose={popClose}
            />
          )}
          {openTransOtherPop && (
            <TransInOtherLang
              refetch={refetch}
              popClose={setOpenTransOtherPop}
              id={id}
              user={user}
              source_language={premiseData?.source_language}
              project_id={project_id}
            />
          )}
          {openCharacterChart && (
            <CharacterEditablePop
              setCharacterEditPop={setOpenCharacterChart}
              characterArray={characterArray}
              currentProjectData={currentProjectData}
              setCharacterArray={setCharacterArray}
              onlyAdd={onlyAdd}
              handleUpdateSavedChar={handleUpdateSavedChar}
              // handleSaveAsDraft={handleSaveAsDraft}
              characterLoading={isCharLoading}
              project_id={project_id}
              source_language={premiseData?.source_language}
              setOpenCharacterChart={setOpenCharacterChart}
            />
          )}
          {openViewTranslationsPop && (
            <ViewTranslationPop
              popClose={setOpenViewTranslationsPop}
              premiseId={viewTransactionPId}
            />
          )}
          {userMail === "Yes" && (
            <UserMail
              recipient={premiseOwner}
              data={{ user, id, userFirstName, userLastName }}
              setUserMail={setUserMail}
            />
          )}
          {userMail?.msg === "ShowBecomePrivilege" && (
            <NoAccessPopUp
              noAccessPopup={userMail}
              setNoAccessPopup={setUserMail}
            />
          )}
          {ownerMail && (
            <OwnerMail data={{ user, id }} setOwnerMail={setOwnerMail} />
          )}
          {/* {openPop && (
        <Popup
          popClose={() => setOpenPop(false)}
          {...{
            handleVisibility,
            handleMonetizing,
            setIsLiked,
            refetch,
            viewText,
          }}
          data={popupData}
          p={p}
        />
      )} */}
          {openCharacterChart && (
            <CharacterEditablePop
              setCharacterEditPop={setOpenCharacterChart}
              characterArray={characterArray}
              currentProjectData={currentProjectData}
              setCharacterArray={setCharacterArray}
              onlyAdd={onlyAdd}
              handleUpdateSavedChar={handleUpdateSavedChar}
              handleSaveAsDraft={handleSaveAsDraft}
              characterLoading={isCharLoading}
              project_id={premiseData?.project_id}
              source_language={premiseData?.source_language}
              setOpenCharacterChart={setOpenCharacterChart}
            />
          )}
          {openTransOtherPop && (
            <TransInOtherLang
              refetch={refetch}
              popClose={setOpenTransOtherPop}
              id={id}
              user={user}
              source_language={premiseData?.source_language}
              project_id={project_id}
            />
          )}
          {openAvailableForTranslationPop && (
            <AvailableForTranslationPop
              popClose={setOpenAvailableForTranslationPop}
              id={id}
              user={user}
              source_language={premiseData?.source_language}
              project_id={project_id}
              refetch={refetch}
            />
          )}
          {openViewTranslationsPop && (
            <ViewTranslationPop
              popClose={setOpenViewTranslationsPop}
              premiseId={viewTransactionPId}
              popCloseCmnt={() => setOpenPop(false)}
              {...{
                handleVisibility,
                handleMonetizing,
                // setIsLiked,
                refetch,
                viewText,
              }}
            />
          )}
          {openMonetizingPreferencesPop?.msg === "ShowBecomePrivilege" ? (
            <NoAccessPopUp
              noAccessPopup={openMonetizingPreferencesPop}
              setNoAccessPopup={setOpenMonetizingPreferencesPop}
            />
          ) : openMonetizingPreferencesPop?.msg === "LB" ||
            openMonetizingPreferencesPop?.msg ===
              "ShowBuyPackage_and_Allacarte" ? (
            <NoAccessLbPopUp
              noAccessLbPopUp={openMonetizingPreferencesPop}
              setNoAccessPopup={setOpenMonetizingPreferencesPop}
              service="PP_Monitizes"
            />
          ) : (
            openMonetizingPreferencesPop === "Yes" &&
            premiseData && (
              <MonetizePreferencePop
                popClose={setOpenMonetizingPreferencesPop}
                id={id}
                user={user}
              />
            )
          )}
          {noAccessLbPopUp?.msg === "ShowBecomePrivilege" ? (
            <NoAccessPopUp
              noAccessPopup={noAccessLbPopUp}
              setNoAccessPopup={setNoAccessLbPopUp}
            />
          ) : (
            (noAccessLbPopUp?.msg === "LB" ||
              noAccessLbPopUp?.msg === "ShowBuyPackage_and_Allacarte") && (
              <NoAccessLbPopUp
                noAccessLbPopup={noAccessLbPopUp}
                setNoAccessPopup={setNoAccessLbPopUp}
                service="PP_interactions"
              />
            )
          )}
          {translationRequestPop && (
            <ReqTranslationPop
              popClose={setTranslationRequestPop}
              id={id}
              user={user}
              source_language={premiseData?.source_language}
              project_id={project_id}
            />
          )}
          {saleRequestPop && (
            <ReqSalePop
              popClose={setSaleRequestPop}
              id={id}
              user={user}
              source_language={premiseData?.source_language}
              project_id={project_id}
            />
          )}
          {viewTrnRequests && (
            <BankDetailsPop
              // translationRequest={translationRequest}
              popClose={setViewTrnRequests}
              premiseId={viewTrnRequests}
            />
          )}
          {viewSaleRequests && (
            <SaleRequestedOwner
              popClose={setViewSaleRequests}
              setSaleIcon={setSaleRequestedOwner}
              premiseId={id}
            />
          )}
          {viewSale && (
            <PaySalePopup
              refetch={refetch}
              premiseId={saleId}
              popClose={setViewSale}
              sellingValue={premiseData?.sellingPrice}
              Userid={user}
            />
          )}
          {addPopup === "noUserName" && (
            <UserNamePopup {...{ refetch, setAddPopup }} />
          )}

          {noAccessPopup?.msg === "ShowBecomePrivilege" ? (
            <NoAccessPopUp
              noAccessPopup={noAccessPopup}
              setNoAccessPopup={setNoAccessPopup}
            />
          ) : (
            (noAccessPopup?.msg === "ShowBuyPackage_and_Allacarte" ||
              noAccessPopup?.msg === "LB") && (
              <NoAccessLbPopUp
                noAccessLbPopup={noAccessPopup}
                setNoAccessPopup={setNoAccessPopup}
                service={
                  service === "PP_AllowBrainstoming"
                    ? "PP_Brainstrom"
                    : "PP_interactions"
                }
              />
            )
          )}
          {notifyPopup && (
            <NotifyPopup
              popClose={setNotifyPopup}
              premiseId={premiseId}
              title={`This is currently unavailable for sale as there is a pending sale request from another User. Would you like us to notify you when this becomes available?`}
            />
          )}
          {afterFinalPostPremiseDemoPop && (
            <AfterFinalPostPremisePop
              popClose={() => setAfterFinalPostPremiseDemoPop(false)}
            />
          )}
          {addBeatTutorialPop && (
            <AddBeatTutorialPop popClose={() => setAddBeatTutorialPop(false)} />
          )}
          {openPopSource && (
            <PopupSource
              popClose={() => setOpenPopSource(false)}
              refetch={refetch}
              data={sourcePopData}
              {...{
                handleVisibility,
                handleMonetizing,
              }}
            />
          )}

          {sourcePremiseNotAvailabl && (
            <NoPremisePop
              popClose={() => setSourcePremiseNotAvailable(false)}
            />
          )}
        </div>
      </div>
    );
};
export default Popup;
