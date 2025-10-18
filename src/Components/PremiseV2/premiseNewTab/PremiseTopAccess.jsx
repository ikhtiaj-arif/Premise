// PremiseTopAccess Component
//
// Controls all high-level access, monetization, and visibility actions for a premise.
// This is the interactive “top bar” logic layer that connects the premise card to
// multiple popups (translation, sale, monetization, etc.) and access restrictions.
//
// ------------------------------------------------------------
// Overview
// ------------------------------------------------------------
// - Acts as a feature gateway for premise actions (delete, translate, sell, etc.).
// - Validates user privileges before allowing sensitive actions.
// - Connects with multiple RTK Query mutations and external access checks.
// - Manages over a dozen modal states for different user actions.
//
// ------------------------------------------------------------
// Core Responsibilities
// ------------------------------------------------------------
//
// 1. **Data & Context Setup**
//    - Fetches user info via `useGetPremiseUserQuery`.
//    - Retrieves character and project data through context (`MyContext`).
//    - Extracts styling, text, and metadata from `premiseData`.
//
// 2. **Access & Permission Handling**
//    - Uses `fetchUserAccess` to check privileges before sensitive actions like:
//        - Messaging owners (`PP_MessageOwner`)
//        - Monetizing (`PP_Monitize`)
//        - Changing visibility (`PP_Privacy`)
//    //! Important: These checks determine whether to show popups or block features.
//
// 3. **Character Management**
//    - Handles updating and saving characters for a project using `useSaveCharactersMutation`.
//    - Supports draft saving via `handleSaveAsDraft()` and full updates via `handleUpdateSavedChar()`.
//    - Provides a `CharacterEditablePop` modal for interactive editing.
//
// 4. **Premise Controls**
//    - Includes delete confirmation (`DeletePremise`), open-in-new-tab functionality,
//      and linked transaction views.
//    - Handles sale and translation requests using multiple popup states.
//
// 5. **UI Popups**
//    - Dynamically renders popups like:
//        - `AvailableForTranslationPop`, `MonetizePreferencePop`, `ReqSalePop`
//        - `NoAccessPopUp`, `NoAccessLbPopUp`, `UserMail`, `OwnerMail`
//    - All popups are conditionally rendered based on state flags and permission results.
//
// 6. **Error & Loading Safety**
//    - Wraps async logic (character save, premise fetch) in try/catch.
//    - Uses local loading states (`characterLoading`, `isLoading`) for UI safety.
//
// ------------------------------------------------------------
// Key Functions
// ------------------------------------------------------------
// - `handleUserMail()` → Checks if the user can message the owner.
// - `handleMonetizing()` → Opens monetization preference or privilege popup.
// - `handleVisibility()` → Toggles visibility settings with permission validation.
// - `handleCheckPremiseData()` → Fetches and validates premise source before viewing.
// - `handleUpdateSavedChar()` / `handleSaveAsDraft()` → Persists character data to backend.
//
// //! Critical: Many actions depend on access tokens and user privilege checks.
//    Missing or invalid permissions directly affect available features.
//
// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------
// `PremiseTopAccess` is the control hub for all user actions tied to a single premise.
// It manages stateful modals, verifies access rights, and ensures only privileged
// users can perform key operations like monetizing, deleting, or requesting translations.
//
// //! Key takeaway: This component links business-level permissions
//    with UI interactivity and backend synchronization.

import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useGetSavedCharactersQuery,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import {
  useDeletePremiseMutation,
  useGetPremiseUserQuery,
} from "../../../app/EndPoints/premisePoolApi";
import { baseURL } from "../../utils";
import { handlePremiseOpenNewTab } from "../utilityFuncitons/functions";

const PremiseTopAccess = ({
  user,
  premiseOwner,
  id,
  project_id,
  premiseData,
  premiseRefetch,
}) => {
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const [addPopup, setAddPopup] = useState(null);
  const { currentUser } = useContext(MyContext);
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  const [userMail, setUserMail] = useState(false);
  const [openDotMenu, setOpenDotMenu] = useState(false);
  const [openTransOtherPop, setOpenTransOtherPop] = useState(false);
  const [openMonetizingPreferencesPop, setOpenMonetizingPreferencesPop] =
    useState(false);
  const [openViewTranslationsPop, setOpenViewTranslationsPop] = useState(false);
  const [viewTransactionPId, setViewTransactionPId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [openHidePop, setOpenHidePop] = useState(null);
  const [characterArray, setCharacterArray] = useState([]);
  const [onlyAdd, setOnlyAdd] = useState(true);
  const splitText = premiseData?.text?.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const [viewText, setViewText] = useState(splitText[1]);
  const [deletePremise, { isLoading }] = useDeletePremiseMutation();
  const [characterLoading, setCharacterLoading] = useState(true);
  const { allspProjectJSON } = useContext(MyContext);
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();
  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );

  const [ownerMail, setOwnerMail] = useState(false);
  const { data: characters, isCharLoading } =
    useGetSavedCharactersQuery(project_id);
  const currentProjectName = currentProjectData?.name;
  const isProjectLocked = currentProjectData?.locked;

  //console.log("currentProjectName", currentProjectName, isProjectLocked);

  const dotPopupRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = (e) => {
      if (!dotPopupRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setOpenDotMenu(false);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

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

        body: { char_data: charArr, is_draft: false, premise_id: id },
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

  const handleViewTransaction = (id) => {
    // console.log(id);
    setViewTransactionPId(id);
    setOpenViewTranslationsPop(!openViewTranslationsPop);
    setOpenDotMenu(null);
  };
  const handleDelete = async (id) => {
    setIsDelete(id);
  };

  const handleOpenSp = () => {
    // console.log("object", p);
    if (isProjectLocked) {
      window.open(`${baseURL}/scriptpad/#/generated-scripts`);
    }
    window.open(
      `${baseURL}/scriptpad/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message res", res);
    if (res?.access === "No") {
      setUserMail(res);
    } else {
      setUserMail("Yes");
    }
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

  const handleVisibility = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);

    if (res?.access === "No") {
      setOpenHidePop(res);
    } else {
      setOpenHidePop("Yes");
    }
    setOpenDotMenu(null);
  };

  const [translationRequestPop, setTranslationRequestPop] = useState("");
  const [noAccessLbPopUp, setNoAccessLbPopUp] = useState(null);

  const [viewTrnRequests, setViewTrnRequests] = useState("");
  const [viewSaleRequests, setViewSaleRequests] = useState("");
  const [saleRequestedOwner, setSaleRequestedOwner] = useState(true);
  const [openCharacterChart, setOpenCharacterChart] = useState(null);
  const [openPop, setOpenPop] = useState(false);
  const [openAvailableForTranslationPop, setOpenAvailableForTranslationPop] =
    useState(false);
  const [saleId, setSaleId] = useState("");
  const [viewSale, setViewSale] = useState(false);

  const [saleRequestPop, setSaleRequestPop] = useState("");
  const token = localStorage.getItem("accessToken");

  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const [openPopSource, setOpenPopSource] = useState(false);
  const [previewAfterDraft, setPreviewAfterDraft] = useState(false);
  const [sourcePopData, setSourcePopData] = useState();
  const handleCheckPremiseData = async (id) => {
    try {
      const data = await axios.get(`${URL}/brainstorm/api/v2/premise/${id}`, {
        headers: header,
      });
      const premiseData = data?.data;
      // setSourcePopData(premiseData)

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
      console.log(error);
    }
  };

  return (
    <></>
    // <div className="flex gap-[3px] items-center justify-between pb-1 md:mt-2">
    //   <p className=" text-[16px] font-semibold leading-6 text-[#616161]"></p>

    //   <CardHeadOptionsUpdate
    //     owner={{ user, userFirstName, userLastName }}
    //     // index={index}
    //     refetch={premiseRefetch}
    //     viewTrnRequests={viewTrnRequests}
    //     setViewTrnRequests={setViewTrnRequests}
    //     viewTransactionPId={viewTransactionPId}
    //     setViewTransactionPId={setViewTransactionPId}
    //     setViewSaleRequests={setViewSaleRequests}
    //     openTransOtherPop={openTransOtherPop}
    //     setOpenTransOtherPop={setOpenTransOtherPop}
    //     handleDelete={handleDelete}
    //     setOpenCharacterChart={setOpenCharacterChart}
    //     openViewTranslationsPop={openViewTranslationsPop}
    //     openAvailableForTranslationPop={openAvailableForTranslationPop}
    //     setOpenAvailableForTranslationPop={setOpenAvailableForTranslationPop}
    //     setOpenViewTranslationsPop={setOpenViewTranslationsPop}
    //     setOpenMonetizingPreferencesPop={setOpenMonetizingPreferencesPop}
    //     setNoAccessLbPopUp={setNoAccessLbPopUp}
    //     setUserMail={setUserMail}
    //     setSaleId={setSaleId}
    //     setViewSale={setViewSale}
    //     setSaleRequestPop={setSaleRequestPop}
    //     setTranslationRequestPop={setTranslationRequestPop}
    //     isProjectLocked={isProjectLocked}
    //     id={id}
    //     premiseOwner={premiseOwner}
    //     filter_flag={premiseData?.filter_flag}
    //     visible_to={premiseData?.visible_to}
    //     comment_filter_flag={premiseData?.comment_filter_flag}
    //     project_id={project_id}
    //     available_for_sale={premiseData?.available_for_sale}
    //     available_for_translation={premiseData?.available_for_translation}
    //     premise_source_id={premiseData?.premise_source_id}
    //     translation_request_count={premiseData?.translation_request_count}
    //     no_of_times_translated={premiseData?.no_of_times_translated}
    //     sale_request_count={premiseData?.sale_request_count}
    //     is_requested_for_sale={premiseData?.is_requested_for_sale}
    //     is_translated_languages={premiseData?.is_translated_languages}
    //     dotPopupRef={dotPopupRef}
    //     setOpenDotMenu={setOpenDotMenu}
    //     openDotMenu={openDotMenu}
    //     setOpenHidePop={setOpenHidePop}
    //     openHidePop={openHidePop}
    //     addPopup={addPopup}
    //     setAddPopup={setAddPopup}
    //     is_read_only={premiseData?.is_read_only}
    //     handleCheckPremiseData={handleCheckPremiseData}
    //   />

    //   {openTransOtherPop && (
    //     <TransInOtherLang fromNew={true} popClose={setOpenTransOtherPop} />
    //   )}
    //   {/* {openViewTranslationsPop && (
    //     <ViewTranslationPop
    //       popClose={setOpenViewTranslationsPop}
    //       premiseId={id}
    //     />
    //   )} */}
    //   {openMonetizingPreferencesPop && premiseData && (
    //     <MonetizePreferencePop
    //       popClose={setOpenMonetizingPreferencesPop}
    //       id={id}
    //       user={user}
    //     />
    //   )}

    //   {isDelete && (
    //     <DeletePremise
    //       setIsDelete={setIsDelete}
    //       refetch={premiseRefetch}
    //       isDelete={isDelete}
    //       deleteId={project_id}
    //       projectName={currentProjectName?.slice(0, 20)}
    //       popClose={setIsDelete}
    //     />
    //   )}

    //   {openCharacterChart && (
    //     <CharacterEditablePop
    //       setCharacterEditPop={setOpenCharacterChart}
    //       characterArray={characterArray}
    //       currentProjectData={currentProjectData}
    //       setCharacterArray={setCharacterArray}
    //       onlyAdd={onlyAdd}
    //       handleUpdateSavedChar={handleUpdateSavedChar}
    //       characterLoading={isCharLoading}
    //       project_id={project_id}
    //       source_language={premiseData?.source_language}
    //     />
    //   )}
    //   {/* {openViewTranslationsPop && (
    //     <ViewTranslationPop
    //       popClose={setOpenViewTranslationsPop}
    //       premiseId={viewTransactionPId}
    //     />
    //   )} */}
    //   {userMail === "Yes" && (
    //     <UserMail
    //       recipient={premiseOwner}
    //       data={{ user, id, userFirstName, userLastName }}
    //       setUserMail={setUserMail}
    //     />
    //   )}
    //   {userMail?.msg === "ShowBecomePrivilege" && (
    //     <NoAccessPopUp
    //       noAccessPopup={userMail}
    //       setNoAccessPopup={setUserMail}
    //     />
    //   )}
    //   {ownerMail && (
    //     <OwnerMail data={{ user, id }} setOwnerMail={setOwnerMail} />
    //   )}
    //   {/* {openPop && (
    //     <Popup
    //       popClose={() => setOpenPop(false)}
    //       {...{
    //         handleVisibility,
    //         handleMonetizing,
    //         setIsLiked,
    //         refetch,
    //         viewText,
    //       }}
    //       data={popupData}
    //       p={p}
    //     />
    //   )} */}
    //   {openCharacterChart && (
    //     <CharacterEditablePop
    //       setCharacterEditPop={setOpenCharacterChart}
    //       characterArray={characterArray}
    //       currentProjectData={currentProjectData}
    //       setCharacterArray={setCharacterArray}
    //       onlyAdd={onlyAdd}
    //       handleUpdateSavedChar={handleUpdateSavedChar}
    //       characterLoading={isCharLoading}
    //       project_id={premiseData?.project_id}
    //       source_language={premiseData?.source_language}
    //     />
    //   )}
    //   {openTransOtherPop && (
    //     <TransInOtherLang
    //       refetch={premiseRefetch}
    //       popClose={setOpenTransOtherPop}
    //       id={id}
    //       user={user}
    //       source_language={premiseData?.source_language}
    //       project_id={project_id}
    //       fromNew={true}
    //     />
    //   )}
    //   {openAvailableForTranslationPop && (
    //     <AvailableForTranslationPop
    //       popClose={setOpenAvailableForTranslationPop}
    //       id={id}
    //       user={user}
    //       source_language={premiseData?.source_language}
    //       project_id={project_id}
    //       refetch={premiseRefetch}
    //     />
    //   )}
    //   {openViewTranslationsPop && (
    //     <ViewTranslationPop
    //       popClose={setOpenViewTranslationsPop}
    //       premiseId={viewTransactionPId}
    //       popCloseCmnt={() => setOpenPop(false)}
    //       {...{
    //         handleVisibility,
    //         handleMonetizing,
    //         // setIsLiked,
    //         premiseRefetch,
    //         viewText,
    //       }}
    //     />
    //   )}
    //   {openMonetizingPreferencesPop?.msg === "ShowBecomePrivilege" ? (
    //     <NoAccessPopUp
    //       noAccessPopup={openMonetizingPreferencesPop}
    //       setNoAccessPopup={setOpenMonetizingPreferencesPop}
    //     />
    //   ) : openMonetizingPreferencesPop?.msg === "LB" ||
    //     openMonetizingPreferencesPop?.msg === "ShowBuyPackage_and_Allacarte" ? (
    //     <NoAccessLbPopUp
    //       noAccessLbPopUp={openMonetizingPreferencesPop}
    //       setNoAccessPopup={setOpenMonetizingPreferencesPop}
    //       service="PP_Monitizes"
    //     />
    //   ) : (
    //     openMonetizingPreferencesPop === "Yes" &&
    //     premiseData && (
    //       <MonetizePreferencePop
    //         popClose={setOpenMonetizingPreferencesPop}
    //         id={id}
    //         user={user}
    //       />
    //     )
    //   )}
    //   {noAccessLbPopUp?.msg === "ShowBecomePrivilege" ? (
    //     <NoAccessPopUp
    //       noAccessPopup={noAccessLbPopUp}
    //       setNoAccessPopup={setNoAccessLbPopUp}
    //     />
    //   ) : (
    //     (noAccessLbPopUp?.msg === "LB" ||
    //       noAccessLbPopUp?.msg === "ShowBuyPackage_and_Allacarte") && (
    //       <NoAccessLbPopUp
    //         noAccessLbPopup={noAccessLbPopUp}
    //         setNoAccessPopup={setNoAccessLbPopUp}
    //         service="PP_interactions"
    //       />
    //     )
    //   )}
    //   {translationRequestPop && (
    //     <ReqTranslationPop
    //       popClose={setTranslationRequestPop}
    //       id={id}
    //       user={user}
    //       source_language={premiseData?.source_language}
    //       project_id={project_id}
    //     />
    //   )}
    //   {saleRequestPop && (
    //     <ReqSalePop
    //       popClose={setSaleRequestPop}
    //       id={id}
    //       user={user}
    //       source_language={premiseData?.source_language}
    //       project_id={project_id}
    //     />
    //   )}
    //   {viewTrnRequests && (
    //     <BankDetailsPop
    //       // translationRequest={translationRequest}
    //       popClose={setViewTrnRequests}
    //       premiseId={viewTrnRequests}
    //       user={user}
    //       fromNew={true}
    //     />
    //   )}
    //   {viewSaleRequests && (
    //     <SaleRequestedOwner
    //       popClose={setViewSaleRequests}
    //       setSaleIcon={setSaleRequestedOwner}
    //       premiseId={id}
    //       user={user}
    //       fromNew={true}
    //     />
    //   )}
    //   {viewSale && (
    //     <PaySalePopup
    //       refetch={premiseRefetch}
    //       premiseId={saleId}
    //       popClose={setViewSale}
    //       sellingValue={premiseData?.sellingPrice}
    //       Userid={user}
    //     />
    //   )}
    //   {addPopup === "noUserName" && (
    //     <UserNamePopup refetch={premiseRefetch} setAddPopup={setAddPopup} />
    //   )}
    // </div>
  );
};

export default PremiseTopAccess;
