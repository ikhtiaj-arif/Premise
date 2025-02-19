import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch } from "react-redux";

import backgroundImg from "../../../img/Icons/download.jpg";
import mailCart from "../../../img/Icons/mailCart.png";
import mailCartQ from "../../../img/Icons/mailCartQ.png";
// import transCartQ from "../../../img/Icons/transCartQ.png";
import msgIcon from "../../../img/Icons/msgIcon.png";
import sourceIcn from "../../../img/Icons/sourceIcn.png";
import transCartQ from "../../../img/Icons/transCartQ.png";
import translateCart from "../../../img/Icons/translateCart.png";
import transReqQ from "../../../img/Icons/transReqQ.png";
import userImg from "../../../img/Icons/userImg.png";

import axios from "axios";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useGetSavedCharactersQuery,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import {
  useGetPremiseUserPictureQuery,
  useGetSaleTranslationRequestQuery,
} from "../../../app/EndPoints/premisePoolApi";
import { setPremise } from "../../../app/Slices/premiseSlice";
import { setUser } from "../../../app/Slices/userSlice";
import CharacterEditablePop from "../../Premisepool/Character/CharacterEditablePop";
import CommentPremise from "../../Premisepool/CommentPremise";
import AddPremise2 from "../../Premisepool/Components/AddPremise2";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import LikePremise from "../../Premisepool/LikePremise";
import OwnerMail from "../../Premisepool/OwnerMail";
import Popup from "../../Premisepool/Popup";
import { hideUnhidePremise } from "../../Premisepool/PreiseUtils";
import TranslatePremise from "../../Premisepool/TranslatePremise";
import UserMail from "../../Premisepool/UserMail";
import UserType from "../../Premisepool/UserType";
import { URL } from "../../utils";
import BankDetailsPop from "../Popups/BankDetails/BankDetailsPop";
import MonetizePreferencePop from "../Popups/MonetizePreferencePop";
import PaySalePopup from "../Popups/PaySalePopup";
import ReqSalePop from "../Popups/ReqSalePop";
import ReqTranslationPop from "../Popups/ReqTranslationPop";
import SaleRequestedOwner from "../Popups/SaleRequested_Owner";
import TransInOtherLang from "../Popups/TransInOtherLang.pop";
import ViewTranslationPop from "../Popups/ViewTranslation.pop";
import PremiseBadge from "./PremiseBadge";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";

const PremiseCardV2 = ({
  setShowRefine,
  p,
  index,
  handleDelete,
  owner,
  userQuery,
  refetch,
  shouldBlink,
  activeSearch,
  transPopClose,
  setTransPopClose,
  isLiked,
  setIsLiked,
  hiddenCountRefetch,
}) => {
  const { user, userFirstName, userLastName } = owner;

  const {
    id,
    source_language,
    text,
    created_at,
    likes,
    comments,
    bg_img,
    bg_color,
    created_by,
    premiseOwner,
    hidden,
    filter_flag,
    visible_to,
    comment_filter_flag,
    m_value,
    project_id,
    sellingPrice,
    available_for_sale,
    available_for_translation,
    premise_source_id,
  } = p;
  // console.log(p);
  const { currentUser } = useContext(MyContext);

  const [actOneThreshold, setActOneThreshold] = useState();
  const [actTwoEnd, setActTwoEnd] = useState();

  // console.log("card actOneThreshold", actOneThreshold);

  useEffect(() => {
    setActOneThreshold(Math.floor(0.25 * m_value));

    setActTwoEnd(Math.floor(0.8 * m_value));
  }, [m_value]);

  const { data: characters, isCharLoading } =
    useGetSavedCharactersQuery(project_id);
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();

  const [characterArray, setCharacterArray] = useState([]);

  const [onlyAdd, setOnlyAdd] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(true);

  useEffect(() => {
    if (characters) setCharacterArray(characters);
  }, [characters]);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(premiseOwner?.id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  // console.log("xcvvdfawsedfdsfgfgd", p);
  const {
    setSelectedPremiseObj,
    setSelectedPremiseSpProjectId,
    setTransPopup,
    allspProjectJSON,
  } = useContext(MyContext);

  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );
  const currentProjectName = currentProjectData?.name;
  const isProjectLocked = currentProjectData?.locked;
  // console.log("object", currentProjectData);

  const splitText = text.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const [viewText, setViewText] = useState(splitText[1]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const [openDotMenu, setOpenDotMenu] = useState(null);
  const [openCharacterChart, setOpenCharacterChart] = useState(null);
  const [openHidePop, setOpenHidePop] = useState(null);
  // const [premiseOwner, setPremiseOwner] = useState(false);
  const [confirmOpenSp, setConfirmOpenSp] = useState(false);
  // const [isLiked, setIsLiked] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  // const {data: isHideUnhide, isLoading, refetch: hideUnhideRefetch} = useGetHideUnhidePremiseQuery(id)
  // console.log("isHideUnhide", isHideUnhide);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImg);
  const [editMode, setEditMode] = useState(false);
  const [userMail, setUserMail] = useState(null);
  const [ownerMail, setOwnerMail] = useState(false);
  const dispatch = useDispatch();
  const [openPop, setOpenPop] = useState(false);
  const [openTransOtherPop, setOpenTransOtherPop] = useState(false);
  const [openMonetizingPreferencesPop, setOpenMonetizingPreferencesPop] =
    useState(null);
  const [openViewTranslationsPop, setOpenViewTranslationsPop] = useState(false);

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // Format the created_date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    // timeZone: "GMT",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "numeric",
    minute: "numeric",
  });
  // console.log("formattedTime", Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [hideDisable, setHideDisable] = useState(false);

  // const {
  //   data: commentsData,
  //   isCommentLoading,
  //   refetch: commentRefetch,
  // } = useGetCommentByPremiseIdQuery(id);

  // //filter Deleted Comment count

  // const deletedCount = commentsData?.comments?.filter(comment => comment.is_deleted).length;

  // const finalCount = comments - deletedCount

  // console.log(hideDisable);

  // const handleHideUnhidePremise = async (id) => {
  //   setHideDisable(true);
  //   const accessToken = localStorage.getItem("accessToken");
  //   // console.log(accessToken);
  //   try {
  //     const response = await fetch(`${URL}/ideamall/hide-premise/${id}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",

  //         // Add any other headers if needed
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     if (data) {
  //       setHideDisable(false);
  //     }
  //     console.log(data);
  //     // Handle the data as needed
  //     refetch();
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setHideDisable(false);
  //     // Handle errors
  //   }
  // };

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, refetch, setOpenDotMenu);
  };

  const dotPopupRef = useRef();
  useEffect(() => {
    const closeMenu = (e) => {
      if (!dotPopupRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setOpenDotMenu(null);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleOpenSp = () => {
    // console.log("object", p);
    if (isProjectLocked) {
      window.open(`${URL}/scriptpad2/#/myscript`);
    }
    window.open(
      `${URL}/scriptpad2/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  const handleUpdateSavedChar = async () => {
    setCharacterLoading(true);
    try {
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: project_id,
        body: { char_data: charArr },
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);

        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  // console.log(created_by);
  const [translationRequestPop, setTranslationRequestPop] = useState("");
  const [noAccessLbPopUp, setNoAccessLbPopUp] = useState(null);

  const [viewTrnRequests, setViewTrnRequests] = useState("");
  const [viewSaleRequests, setViewSaleRequests] = useState("");

  const checkAllowance = async (state, id) => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_AllowInteraction`);
    console.log("AllowInteraction res", res);
    if (res?.access == "No" && res?.msg == "LB") {
      setNoAccessLbPopUp(true);
    } else {
      state(id);
    }
  };

  const [viewTransactionPId, setViewTransactionPId] = useState("");
  const handleViewTransaction = (id) => {
    // console.log(id);
    setViewTransactionPId(id);
    setOpenViewTranslationsPop(!openViewTranslationsPop);
    setOpenDotMenu(null);
  };

  const [saleRequestPop, setSaleRequestPop] = useState("");

  const [saleRequestedOwner, setSaleRequestedOwner] = useState(true);

  const token = localStorage.getItem("accessToken");

  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    handleSaleRequestedOwner();
  }, []);

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

  const data = {
    id,
    type: "Sale",
  };
  const { data: SaleRequest, isTransLoading } =
    useGetSaleTranslationRequestQuery(data);

  // console.log(SaleRequest)

  // if (SaleRequest?.data[0]?.requestApproved === true) {
  //   setForSale(true)
  //   setSaleRequestedOwner(false)

  // }

  const [saleId, setSaleId] = useState("");
  const [viewSale, setViewSale] = useState(false);

  const handleSale = async (id) => {
    setSaleId(id);
    setViewSale(true);
  };

  // useEffect(() => {
  //   if (translationRequest) {
  //     setForSale(true);
  //   }
  // }, []);

  const handlePremiseOpenNewTab = (id) => {
    console.log(id);
    // const url = `${baseURL}/new-tab/${id}`; // Use `id` if provided; fallback to current page URL
    const url = `${window.location.origin}/#/new-tab/${id}`; // Use `id` if provided; fallback to current page URL

    // Open the URL in a new tab
    window.open(url);
  };
  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message rs", res);
    if (res?.access == "No") {
      setUserMail("No");
    } else {
      setUserMail("Yes");
    }
  };
  const handleVisibility = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);
    console.log("visibility res", res);
    if (res?.access == "No" && res?.msg == "LB") {
      setOpenHidePop("No");
    } else {
      setOpenHidePop("Yes");
    }
    setOpenDotMenu(null);
  };
  const handleMonetizing = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Monitize`);
    console.log("visibility res", res);
    if (res?.access == "No" && res?.msg == "LB") {
      setOpenMonetizingPreferencesPop("No");
    } else {
      setOpenMonetizingPreferencesPop("Yes");
    }
    setOpenDotMenu(null);
  };

  return (
    <div className="w-[358px] lg:w-[100%] mx-auto border border-[#EAEAEA] hover:shadow-lg rounded-[8px]  ">
      {/* upper div */}
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-t-[8px] px-[15px] pt-[15px] pb-[6px]">
        <div className="block ">
          <a
            target="_blank"
            rel="noreferrer"
            // href={`${URL}/memberpage/#/user/${created_by?.id}`}

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
                  className="w-[36px] h-[35.9px] border
                border-[#eaeaea] rounded-full object-cover"
                  alt=""
                />
              ) : (
                <img
                  src={userImg}
                  className="w-[36px] h-[35.9px] rounded-full border
                border-[#eaeaea]"
                  alt=""
                />
              )}
              <div>
                <div className="flex items-center">
                  <h4 className="notranslate text-[#252525] font-[600] text-[14px] capitalize cursor-pointer hover:text-[#33B0CA]">
                    {premiseOwner?.first_name} {premiseOwner?.last_name}
                  </h4>
                  <UserType
                    type={premiseOwner?.centraldatabase?.type}
                    user_type={premiseOwner?.centraldatabase?.user_type}
                  />
                </div>
                <div className="text-[#616161] text-[10px] flex flex-col gap-[8px] font-[400] leading-[4px] mb-[12px]">
                  <p>
                    {formattedDate}, {formattedTime}
                  </p>
                  {premiseOwner?.id === user && (
                    <p className="notranslate text-[#252525] text-[12px]">
                      {currentProjectName?.slice(0, 20)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </a>
        </div>
        <div>
          {" "}
          {premiseOwner?.id === user ? (
            <div className="flex gap-[3px] items-center mt-[-13px] mr-[2px] relative ">
              <img
                data-te-toggle="tooltip"
                title="Translation Requests"
                src={transReqQ}
                className="w-8 h-8 cursor-pointer"
                alt=""
                onClick={() => setViewTrnRequests(id)}
              />
              <img
                data-te-toggle="tooltip"
                title="Translated Languages"
                src={translateCart}
                className="w-8 h-8 cursor-pointer"
                alt=""
                onClick={() => handleViewTransaction(id)}
              />
              {premise_source_id && (
                <img
                  data-te-toggle="tooltip"
                  title="View Source"
                  src={sourceIcn}
                  className="w-8 h-8 cursor-pointer"
                  alt=""
                  onClick={() => handlePremiseOpenNewTab(premise_source_id)}
                />
              )}
              {saleRequestedOwner && (
                <img
                  data-te-toggle="tooltip"
                  title="Sale Requested"
                  src={mailCartQ}
                  className="w-9 h-9 cursor-pointer"
                  alt=""
                  onClick={() => setViewSaleRequests(true)}
                />
              )}

              <FaEllipsisV
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setOpenDotMenu((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                }}
                className="w-5 h-5 cursor-pointer"
              />
              {openDotMenu === index && (
                <div
                  ref={dotPopupRef}
                  className="absolute flex flex-col w-[186.99px] font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[3px] py-[8px]  z-10"
                >
                  <button
                    onClick={handleVisibility}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      Visibility Settings
                    </p>{" "}
                  </button>

                  <button
                    onClick={() => {
                      setOpenTransOtherPop(!openTransOtherPop);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      Copy in new Language
                    </p>{" "}
                  </button>

                  <button
                    onClick={handleMonetizing}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      Monetizing Preferences
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      handleViewTransaction(id);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      View Translations
                    </p>{" "}
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(id);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] text-left hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Delete Premise
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      setOpenCharacterChart(project_id);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] text-left hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Characters and Roles
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      handleOpenSp();
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] text-left hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Open <span className="scriptpad-m">Script Pad</span>
                    </p>{" "}
                  </button>

                  {/* */}
                </div>
              )}
              {/* <FaEllipsisV
                onClick={() => setOpenHidePop(!openHidePop)}
                className="w-5 h-5 cursor-pointer"
              /> */}
              {openHidePop === "No" && (
                <NoAccessLbPopUp
                  setNoAccessPopup={setOpenHidePop}
                  service="PP_Private"
                />
              )}
              {openHidePop === "Yes" && (
                <HideOptionPop
                  setOpenHidePop={setOpenHidePop}
                  id={id}
                  refetch={refetch}
                  user={user}
                  filter_flag={filter_flag}
                  comment_filter_flag={comment_filter_flag}
                  visible_to={visible_to}
                />
              )}
            </div>
          ) : (
            <div className="flex gap-[3px] items-center  mr-[2px] relative ">
              {available_for_translation ? (
                <img
                  data-te-toggle="tooltip"
                  title="Available for Translation"
                  src={translateCart}
                  className="w-8 h-8 mt-[-13px] cursor-pointer"
                  alt=""
                  onClick={() => {
                    setOpenTransOtherPop(!openTransOtherPop);
                    setOpenDotMenu(null);
                  }}
                />
              ) : (
                <img
                  data-te-toggle="tooltip"
                  title="Send Translation Request"
                  src={transCartQ}
                  className="w-8 h-8 mt-[-13px] cursor-pointer"
                  alt=""
                  onClick={() => checkAllowance(setTranslationRequestPop, id)}
                />
              )}

              {available_for_sale ? (
                <img
                  data-te-toggle="tooltip"
                  title="Available for Sale"
                  src={mailCart}
                  className="w-8 h-8 mt-[-13px] cursor-pointer"
                  onClick={() => handleSale(id)}
                  alt="for sale"
                />
              ) : (
                <img
                  data-te-toggle="tooltip"
                  title="Send Sale Request"
                  src={mailCartQ}
                  className="w-9 h-9 mt-[-13px] cursor-pointer"
                  onClick={() => checkAllowance(setSaleRequestPop, id)}
                  alt="send sale request"
                />
              )}
              {premise_source_id && (
                <img
                  data-te-toggle="tooltip"
                  title="View Source"
                  src={sourceIcn}
                  className="w-8 h-8 mt-[-13px] cursor-pointer"
                  alt=""
                  onClick={() => handlePremiseOpenNewTab(premise_source_id)}
                />
              )}
              <img
                data-te-toggle="tooltip"
                title="Send Message"
                src={msgIcon}
                className="w-8 h-8 mt-[-13px] cursor-pointer"
                alt=""
                onClick={handleUserMail}
              />
            </div>
          )}
        </div>
      </div>
      {/* middle div */}
      <div className="bg-[#FAFAFA] h-[189px] border !border-[#f8f8f8] relative">
        <div
          className={` w-[93%] bg-[#FAFAFA]  h-[189px] rounded-[8px]  mx-auto   border border-[#eaeaea] relative
          ${
            imageLoaded && bg_img
              ? "premiseBg-loaded rounded-[8px]"
              : "rounded-[8px]"
          }`}
          style={
            bg_img
              ? {
                  backgroundImage: `url(${bg_img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "92%",
                  borderRadius: "8px",
                  // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }
              : { backgroundColor: bg_color }
          }
          onLoad={() => setImageLoaded(true)}
        >
          <div
            onClick={() => {
              setOpenPop(true);
              setShowRefine(false);
              setOpenDotMenu(null);
              setSelectedPremiseObj(p);
              dispatch(setPremise(p));
              setSelectedPremiseSpProjectId(project_id);
              setTransPopup(false);
            }}
            // className={`absolute inset-0 w-[100%] mx-auto backdrop-filter flex items-center justify-center backdrop-blur-sm px-[14px] text-[16px] rounded-[8px] text-[#616161] leading-5 font-[400] overflow-hidden `}
            className="absolute cursor-pointer inset-0  backdrop-blur-sm  text-[16px] leading-[19.83px] rounded-[8px] overflow-hidden break-words px-[14px] py-[12px]"
          >
            <p
              className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} notranslate`}
              style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              {viewText}
            </p>
          </div>
          <div></div>
        </div>
        <PremiseBadge stamp={p?.stamp} />
      </div>
      {/* lower div */}
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-b-[8px] px-[15px] pb-[15px] pt-[25px] ">
        {/* 1st div */}
        <div className="flex items-center">
          <LikePremise
            data={{
              likes,
              id,
              user,
            }}
            refetch={refetch}
          />
          <CommentPremise
            data={{
              // finalCount,
              comments,
              bg_color,
              bg_img,
              dText,
              premiseOwner,
              id,
              stylings,
              likes,
              isLiked,
              shouldBlink,
              source_language,
              user,
              setOpenDotMenu,
              handleUserMail,
              handleHideUnhidePremise,
              setOwnerMail,
              formattedTime,
              formattedDate,
              hidden,
              index,
              openDotMenu,
              setHideDisable,
              hideDisable,
              project_id,
            }}
            refetch={refetch}
            setIsLiked={setIsLiked}
            p={p}
          />
        </div>
        {/* 2nd div */}

        <div className="ml-[15px] flex gap-2 items-center">
          <TranslatePremise
            {...{ transPopClose, setTransPopClose, setViewText }}
            data={{
              id,
              dText,
              source_language,
              project_id,
            }}
          />
        </div>
      </div>

      {/* Background image selection */}
      <input
        type="file"
        accept="image/*"
        id="file-input-bg"
        style={{ display: "none" }}
        onChange={handleBackgroundChange}
      />
      {/* owner edit premise */}

      {editMode && (
        // <AddPremise
        //   id={id}
        //   modifiedText={modifiedText}
        //   bg_img={bg_img}
        //   bg_color={bg_color}
        //   setAddPopup={setEditMode}
        // />

        <AddPremise2
          data={{ dText, stylings, bg_img, bg_color, id }}
          setAddPopup={setEditMode}
          refetch={refetch}
        />
      )}
      {userMail == "Yes" && (
        <UserMail
          recipient={premiseOwner}
          data={{ user, id, userFirstName, userLastName }}
          setUserMail={setUserMail}
        />
      )}
      {userMail == "No" && <NoAccessPopUp setNoAccessPopup={setUserMail} />}
      {ownerMail && (
        <OwnerMail data={{ user, id }} setOwnerMail={setOwnerMail} />
      )}
      {openPop && (
        <Popup
          popClose={() => setOpenPop(false)}
          {...{
            handleVisibility,
            handleMonetizing,
            setIsLiked,
            refetch,
            viewText,
          }}
          data={{
            id,
            dText,
            bg_color,
            bg_img,
            likes,
            stylings,
            premiseOwner,
            isLiked,
            source_language,
            user,
            setOpenDotMenu,
            handleUserMail,
            handleHideUnhidePremise,
            setOwnerMail,
            formattedTime,
            formattedDate,
            hidden,
            index,
            openDotMenu,
            setHideDisable,
            hideDisable,
            hiddenCountRefetch,
            project_id,
            m_value: p?.m_value,
          }}
          p={p}
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
          characterLoading={isCharLoading}
          project_id={p?.project_id}
        />
      )}
      {openTransOtherPop && (
        <TransInOtherLang
          refetch={refetch}
          popClose={setOpenTransOtherPop}
          id={id}
          user={user}
          source_language={source_language}
          project_id={project_id}
        />
      )}
      {openViewTranslationsPop && (
        <ViewTranslationPop
          popClose={setOpenViewTranslationsPop}
          premiseId={viewTransactionPId}
        />
      )}
      {openMonetizingPreferencesPop == "No" && (
        <NoAccessLbPopUp
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
          service="PP_Monitizes"
        />
      )}
      {openMonetizingPreferencesPop == "Yes" && (
        <MonetizePreferencePop
          popClose={setOpenMonetizingPreferencesPop}
          id={id}
          user={user}
        />
      )}
      {noAccessLbPopUp && (
        <NoAccessLbPopUp
          setNoAccessPopup={setNoAccessLbPopUp}
          service="PP_interactions"
        />
      )}
      {translationRequestPop && (
        <ReqTranslationPop
          popClose={setTranslationRequestPop}
          id={id}
          user={user}
          source_language={source_language}
          project_id={project_id}
        />
      )}
      {saleRequestPop && (
        <ReqSalePop
          popClose={setSaleRequestPop}
          id={id}
          user={user}
          source_language={source_language}
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
      {viewSaleRequests && names.length > 0 && (
        <SaleRequestedOwner
          popClose={setViewSaleRequests}
          setSaleIcon={setSaleRequestedOwner}
          premiseId={id}
          Names={names}
        />
      )}
      {viewSale && (
        <PaySalePopup
          refetch={refetch}
          premiseId={saleId}
          popClose={setViewSale}
          sellingValue={sellingPrice}
          Userid={user}
        />
      )}
    </div>
  );
};
export default PremiseCardV2;
