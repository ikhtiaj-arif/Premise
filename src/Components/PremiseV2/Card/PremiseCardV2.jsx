import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import backgroundImg from "../../../img/Icons/download.jpg";
// import transCartQ from "../../../img/Icons/transCartQ.png";
import userImg from "../../../img/Icons/userImg.png";

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
import CharacterEditablePop from "../../Premisepool/Character/CharacterEditablePop";
import CommentPremise from "../../Premisepool/CommentPremise";
import AddPremise2 from "../../Premisepool/Components/AddPremise2";
import LikePremise from "../../Premisepool/LikePremise";
import OwnerMail from "../../Premisepool/OwnerMail";
import Popup from "../../Premisepool/Popup";
import { hideUnhidePremise } from "../../Premisepool/PreiseUtils";
import TranslatePremise from "../../Premisepool/TranslatePremise";
import UserMail from "../../Premisepool/UserMail";
import UserType from "../../Premisepool/UserType";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import { URL } from "../../utils";
import AvailableForTranslationPop from "../Popups/AvailableForTranslationPop";
import BankDetailsPop from "../Popups/BankDetails/BankDetailsPop";
import MonetizePreferencePop from "../Popups/MonetizePreferencePop";
import PaySalePopup from "../Popups/PaySalePopup";
import ReqSalePop from "../Popups/ReqSalePop";
import ReqTranslationPop from "../Popups/ReqTranslationPop";
import SaleRequestedOwner from "../Popups/SaleRequested_Owner";
import TransInOtherLang from "../Popups/TransInOtherLang.pop";
import ViewTranslationPop from "../Popups/ViewTranslation.pop";
import CardHeadOptions from "./CardHeadOptions";
import PremiseBadge from "./PremiseBadge";

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
    translation_request_count,
    sale_request_count,
    is_requested_for_sale,
    is_translated_languages,
  } = p;

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
  const [openAvailableForTranslationPop, setOpenAvailableForTranslationPop] =
    useState(false);
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

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, refetch, setOpenDotMenu);
  };

  const dotPopupRef = useRef();
  // useEffect(() => {
  //   const closeMenu = (e) => {
  //     if (!dotPopupRef?.current?.contains(e.target)) {
  //       if (!e.target.closest(".absolute")) {
  //         setOpenDotMenu(null);
  //       }
  //     }
  //   };
  //   document.body.addEventListener("mousedown", closeMenu);

  //   return () => document.body.removeEventListener("mousedown", closeMenu);
  // }, []);

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
    if (res?.access === "No") {
      setNoAccessLbPopUp(res);
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

  const [names, setNames] = useState([]);

  const data = {
    id,
    type: "Sale",
  };
  const { data: saleRequest, isTransLoading } =
    useGetSaleTranslationRequestQuery(data);

  const [saleId, setSaleId] = useState("");
  const [viewSale, setViewSale] = useState(false);

  const handleSale = async (id) => {
    setSaleId(id);
    setViewSale(true);
  };

  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message rs", res);
    if (res?.access === "No") {
      setUserMail(res);
    } else {
      setUserMail("Yes");
    }
  };
  const handleVisibility = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);

    if (res?.access === "No") {
      setOpenHidePop(res);
    } else {
      setOpenHidePop("Yes");
    }
    setOpenDotMenu(null);
  };

  const handleMonetizing = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Monitize`);

    if (res?.access === "No") {
      setOpenMonetizingPreferencesPop(res);
    } else {
      setOpenMonetizingPreferencesPop("Yes");
    }
    setOpenDotMenu(null);
  };

  let popupData = {
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
                  <h4
                    className="notranslate text-[#252525] font-[600] text-[14px] capitalize cursor-pointer hover:text-[#33B0CA] truncate w-full"
                    title={`${premiseOwner?.first_name} ${premiseOwner?.last_name}`}
                  >
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
                  {premiseOwner?.id === user ? (
                    <p className="notranslate text-[#252525] text-[12px]">
                      {currentProjectName?.slice(0, 20)}
                    </p>
                  ) : (
                    <br></br>
                  )}
                </div>
              </div>
            </div>
          </a>
        </div>

        <CardHeadOptions
          owner={owner}
          index={index}
          refetch={refetch}
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
          openAvailableForTranslationPop={openAvailableForTranslationPop}
          setOpenAvailableForTranslationPop={setOpenAvailableForTranslationPop}
          setOpenViewTranslationsPop={setOpenViewTranslationsPop}
          setOpenMonetizingPreferencesPop={setOpenMonetizingPreferencesPop}
          setNoAccessLbPopUp={setNoAccessLbPopUp}
          setUserMail={setUserMail}
          setSaleId={setSaleId}
          setViewSale={setViewSale}
          setSaleRequestPop={setSaleRequestPop}
          setTranslationRequestPop={setTranslationRequestPop}
          isProjectLocked={isProjectLocked}
          id={id}
          premiseOwner={premiseOwner}
          filter_flag={filter_flag}
          visible_to={visible_to}
          comment_filter_flag={comment_filter_flag}
          project_id={project_id}
          available_for_sale={available_for_sale}
          available_for_translation={available_for_translation}
          premise_source_id={premise_source_id}
          translation_request_count={translation_request_count}
          sale_request_count={sale_request_count}
          is_requested_for_sale={is_requested_for_sale}
          is_translated_languages={is_translated_languages}
          dotPopupRef={dotPopupRef}
          setOpenDotMenu={setOpenDotMenu}
          setOpenHidePop={setOpenHidePop}
          openHidePop={openHidePop}
          openDotMenu={openDotMenu}
        />
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
          data={popupData}
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
      {openAvailableForTranslationPop && (
        <AvailableForTranslationPop
          popClose={setOpenAvailableForTranslationPop}
          id={id}
          user={user}
          source_language={source_language}
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
            setIsLiked,
            refetch,
            viewText,
          }}
        />
      )}
      {openMonetizingPreferencesPop?.msg == "ShowBecomePrivilege" ? (
        <NoAccessPopUp
          noAccessPopup={openMonetizingPreferencesPop}
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
        />
      ) : openMonetizingPreferencesPop?.msg == "LB" ||
        openMonetizingPreferencesPop?.msg == "ShowBuyPackage_and_Allacarte" ? (
        <NoAccessLbPopUp
          noAccessLbPopUp={openMonetizingPreferencesPop}
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
          service="PP_Monitizes"
        />
      ) : (
        openMonetizingPreferencesPop == "Yes" && (
          <MonetizePreferencePop
            popClose={setOpenMonetizingPreferencesPop}
            id={id}
            user={user}
          />
        )
      )}
      {noAccessLbPopUp?.msg == "ShowBecomePrivilege" ? (
        <NoAccessPopUp
          noAccessPopup={noAccessLbPopUp}
          setNoAccessPopup={setNoAccessLbPopUp}
        />
      ) : (
        (noAccessLbPopUp?.msg == "LB" ||
          noAccessLbPopUp?.msg == "ShowBuyPackage_and_Allacarte") && (
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
          sellingValue={sellingPrice}
          Userid={user}
        />
      )}
    </div>
  );
};
export default PremiseCardV2;
