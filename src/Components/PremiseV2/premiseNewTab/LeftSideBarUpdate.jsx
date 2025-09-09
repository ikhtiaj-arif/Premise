import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaPlus } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useDeleteCharacterMutation,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import { useGetPremiseUserQuery } from "../../../app/EndPoints/premisePoolApi";
import { GlobalContext } from "../../../app/Hooks/Global";
import { setUser } from "../../../app/Slices/userSlice";
import CharacterShowCard from "../../Premisepool/Character/Card";
import CharacterEditablePop from "../../Premisepool/Character/CharacterEditablePop";
import SingleCharacterAddNewTab from "../../Premisepool/Character/SingleCharacterAddNewTab";
import SingleCharacterEdit from "../../Premisepool/Character/SingleCharacterEdit";
import ConfirmationModal from "../../Premisepool/Comments/ConfirmationModal";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import DeletePremise from "../../Premisepool/DeletePremise";
import Keyboard from "../../Premisepool/Keyboard";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import AskIda from "../../SharedVersion/AskIda";
import NewTabTextArea from "../../SharedVersion/NewTabTextArea";
import { baseURL } from "../../utils";
import MonetizePreferencePop from "../Popups/MonetizePreferencePop";
import TransInOtherLang from "../Popups/TransInOtherLang.pop";
import ViewTranslationPop from "../Popups/ViewTranslation.pop";
import PremiseTopHeaderUpdate from "./PremiseTopHeaderUpdate";

const LeftSideBarUpdate = ({
  filteredCommentsData,
  premiseData,
  premiseRefetch,
  commentRefetch,
  commentsData,
  setOpenReplyField,
  replyField,
  lastCommentRef,
  setReplyField,
  setOpenReplyFieldID,
  setOpenAllReplies,
  replyRef,
  characters,
  isCharLoading,
  characterRefetch,
  handleSearch,
  currentCommentRef,
  handleOpenAllReplies,
  setSearchTerm,
  commentField,
  setCommentField,
}) => {
  const {
    bg_img,
    bg_color,
    text,
    last_worked_on,
    created_at,
    id,
    created_by,
    premiseOwner,
    stamp,
    filter_flag,
    visible_to,
    comments,
    comment_filter_flag,
    source_language,
    project_id,
    created_by_name,
  } = premiseData;

  const { charactersPopupMobile, setCharactersPopupMobile } =
    useContext(GlobalContext);
  const { currentUser, allspProjectJSON } = useContext(MyContext);
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const [deleteCharacter] = useDeleteCharacterMutation();
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();
  const [openHidePop, setOpenHidePop] = useState(null);
  const [transPopClose, setTransPopClose] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const finalCount = commentsData?.counts;
  const user = useSelector((state) => state?.user?.id);
  const dispatch = useDispatch();
  const [noAccessPopup, setNoAccessPopup] = useState(null);
  const [service, setService] = useState(null);
  // for characters
  const [characterArray, setCharacterArray] = useState(characters || []);
  const [editData, setEditData] = useState({});
  const [editIdx, setEditIdx] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteChar, setDeleteChar] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [onlyAdd, setOnlyAdd] = useState(true);
  const [addNewCharacter, setAddNewCharacter] = useState(null);
  const [openCharacterChart, setOpenCharacterChart] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef(null);

  const [addPopup, setAddPopup] = useState(null);

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
  console.log(isDelete);

  const [characterLoading, setCharacterLoading] = useState(true);

  const [ownerMail, setOwnerMail] = useState(false);

  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );

  const currentProjectName = currentProjectData?.name;
  const isProjectLocked = currentProjectData?.locked;

  const [translationRequestPop, setTranslationRequestPop] = useState("");
  const [noAccessLbPopUp, setNoAccessLbPopUp] = useState(null);

  const [viewTrnRequests, setViewTrnRequests] = useState("");
  const [viewSaleRequests, setViewSaleRequests] = useState("");
  const [saleRequestedOwner, setSaleRequestedOwner] = useState(true);
  const [openPop, setOpenPop] = useState(false);
  const [openAvailableForTranslationPop, setOpenAvailableForTranslationPop] =
    useState(false);
  const [saleId, setSaleId] = useState("");
  const [viewSale, setViewSale] = useState(false);

  const [saleRequestPop, setSaleRequestPop] = useState("");

  //console.log("currentProjectName", currentProjectName, isProjectLocked);

  const dotPopupRef = useRef();
  const navigate = useNavigate();

  // const lastCommentRef = useRef(null);

  useEffect(() => {
    if (characters) setCharacterArray(characters);
  }, [characters]);

  const characterOrder = [
    "Protagonist",
    "Antagonist",
    "Co-Star",
    "Antagonist's Right Hand",
    "Love Interest",
    "Rival",
    "Sidekick",
    "Comic Relief",
    "Narrator",
    "Mediator",
    "Confidant",
    "Foil",
    "Mentor",
    "Symbolic Character",
    "Suspect",
    "Family Member",
    "Instigator",
    "Authority Figure",
    "Activist",
    "Peer",
    "Seeker ",
    "Guardian",
    "Supporting Character",
    "Expert",
    "Arbiter",
  ];

  const sortedCharacters = characterOrder?.reduce((acc, role) => {
    const filteredChars =
      characterArray?.filter((char) => char.role === role) || [];
    return acc.concat(filteredChars);
  }, []);

  // Add characters with roles not in the roleOrder array
  const remainingCharacters = characterArray
    ? characterArray.filter((char) => !characterOrder?.includes(char.role))
    : [];

  // Concatenate the remaining characters to the sorted list
  const finalCharacters = [...sortedCharacters, ...remainingCharacters];

  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);

  const splitText = text.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const [viewText, setViewText] = useState(splitText[1]);
  // console.log(premiseData);

  // const [commonPopup, setCommonPopup] = useState(""); // For "Brainstorms" and "Engagements"
  // const [beatsPopup, setBeatsPopup] = useState(false); // For "Beats"

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  // for charc delete
  const deleteCharacterFun = async (character) => {
    console.log(character);
    const res = await deleteCharacter(character?.id);
    if (res) {
      characterRefetch();
    }
  };

  const handleDeleteCharacter = (idx) => {
    const updatedCharacters = characterArray.filter((char, i) => i !== idx);
    setCharacterArray(updatedCharacters);
    characterRefetch();
  };
  const handleSaveEditedCharacter = (updatedCharacter, index) => {
    const updatedCharacters = characterArray.map((char, i) =>
      i === index ? updatedCharacter : char
    );
    setCharacterArray(updatedCharacters);
    characterRefetch();
    setEditPopupOpen(false);
  };
  const handleAddNewCharacter = (newCharacter) => {
    const updatedCharacters = [...characterArray, newCharacter];
    // console.log("After Adding New Character:", updatedCharacters);
    setCharacterArray(updatedCharacters);
    characterRefetch();
  };
  const handleUpdateSavedChar = async () => {
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
        setOpenCharacterChart(false);
      }
      return response;
    } catch (error) {}
  };

  const handleSaveAsDraft = async () => {
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
        body: { char_data: charArr, is_draft: true, premise_id: id },
      };

      const response = await saveCharacter(data);

      if (response) {
        setOpenCharacterChart(false);
      }
      return response;
    } catch (error) {}
  };

  const handleAddNewChar = async () => {
    setCharactersPopupMobile(false);
    const res = await fetchUserAccess(`${currentUser?.id}/PP_AddCharacters`);

    if (res?.access === "No") {
      setAddNewCharacter(res);
    } else {
      setAddNewCharacter("Yes");
    }
  };

  const handleVisibility = async () => {
    setCharactersPopupMobile(false);
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);
    console.log("visibility res", res);
    if (res?.access === "No") {
      setOpenHidePop(res);
    } else {
      setOpenHidePop("Yes");
    }
  };

  const [hasUpdated, setHasUpdated] = useState(false);

  const handleUpdateCharNewTab = async () => {
    const res = await handleUpdateSavedChar();
    if (res) {
      characterRefetch();
    }
  };
  // console.log("source_language", source_language);
  // console.log("characters", characters);
  // console.log("finalCharacters", finalCharacters);

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
      window.open(`${baseURL}/scriptpad2/#/generated-scripts`);
    }
    window.open(
      `${baseURL}/scriptpad2/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message res", res);
    if (res?.access == "No") {
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

  return (
    <>
      <div className="fixed bg-[#fff] top-[85%] z-[1] w-[96%] mx-auto md:hidden">
        <NewTabTextArea
          fromNew
          premiseId={id}
          className="ls-textarea"
          className2="ls-textareainput"
          {...{
            premiseOwner,
            user,
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
            selectedLanguage,
            setSelectedLanguage,
            keyboardVisible,
            setKeyboardVisible,
            newComment,
            setNewComment,
            inputRef,
          }}
        />

        <div className="flex gap-1 items-center w-2/4 mt-[2px] mx-auto">
          <h3 className="text-[12px]">or,</h3>
          <AskIda
            {...{
              id,
              source_language,
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
        </div>
      </div>
      <div className="xl:w-[368px] w-full relative h-full shadow-md  rounded-md">
        {/* main div */}
        <div className="h-full lg:h-[80vh]  relative flex flex-col">
          <div className="flex-none px-3">
            {/* header */}
            <PremiseTopHeaderUpdate
              {...{ handleSearch, id, setSearchTerm }}
              owner={{ user, userFirstName, userLastName }}
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
              openAvailableForTranslationPop={openAvailableForTranslationPop}
              setOpenAvailableForTranslationPop={
                setOpenAvailableForTranslationPop
              }
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
              filter_flag={premiseData?.filter_flag}
              visible_to={premiseData?.visible_to}
              comment_filter_flag={premiseData?.comment_filter_flag}
              project_id={project_id}
              available_for_sale={premiseData?.available_for_sale}
              available_for_translation={premiseData?.available_for_translation}
              premise_source_id={premiseData?.premise_source_id}
              translation_request_count={premiseData?.translation_request_count}
              no_of_times_translated={premiseData?.no_of_times_translated}
              sale_request_count={premiseData?.sale_request_count}
              is_requested_for_sale={premiseData?.is_requested_for_sale}
              is_translated_languages={premiseData?.is_translated_languages}
              dotPopupRef={dotPopupRef}
              setOpenDotMenu={setOpenDotMenu}
              openDotMenu={openDotMenu}
              setOpenHidePop={setOpenHidePop}
              openHidePop={openHidePop}
              addPopup={addPopup}
              setAddPopup={setAddPopup}
              is_read_only={premiseData?.is_read_only}
            />
            <div>
              {/* premise card top */}

              {/* center */}
              {/* <div className="relative">
                <PopupPremiseText
                  {...{ bg_img, bg_color, stylings, dText, viewText }}
                  className="ls-contentbox"
                  className2="ls-contenttext"
                />
                <PremiseBadge stamp={stamp} />
              </div> */}
              {/* bottom */}
              {/* <div className="flex justify-between items-center  rounded-b-[8px] px-[4px] pb-[8px] pt-[4px] ">  
                <div className="flex gap-1 space-x-4 items-center">
                  <PopupLike {...{ user, id, premiseRefetch, premiseData }} />
                  <PopupComment
                    {...{
                      setOpenReplyField,
                      setCommentField,
                      commentField,
                      finalCount,
                    }}
                  />
                </div>

                <div className="ml-[15px] flex gap-2 items-center">
                  <TranslatePremiseNewTab
                    {...{ transPopClose, setTransPopClose, setViewText }}
                    data={{
                      id,
                      dText,
                      source_language,
                      project_id,
                    }}
                    className="premise-translate-wh-24"
                  />
                </div>
              </div> */}
            </div>
          </div>
          {/* Details scroll div */}
          <div className="flex-1 lg:pb-24 overflow-y-auto flex flex-col ">
            {
              <div className="bg-[#fff] px-3">
                <div>
                  {/* <div className="grid grid-cols-[40%_minmax(60%,_1fr)] items-center ">
                    {" "}
                    <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                      Created By
                    </h2>
                    <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                      : {created_by_name}
                    </p>
                  </div> */}
                  {/* <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center ">
                    {" "}
                    <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                      Created On
                    </h2>
                    <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                      : {formatDate(created_at)}
                    </p>
                  </div> */}
                  <div className=" flex items-center ">
                    <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                      Last Worked On
                    </h2>
                    <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                      : {formatDate(last_worked_on)}
                    </p>
                  </div>
                </div>

                {/* 
                <VisibilitySection
                  premiseOwner={premiseOwner}
                  user={user}
                  visible_to={visible_to}
                  currentUser={currentUser}
                  filter_flag={filter_flag}
                  handleVisibility={handleVisibility}
                /> */}

                {/* characters */}
                {premiseOwner?.id === user && (
                  <div className="mt-4">
                    <div className="  w-full flex justify-between items-center">
                      <p className="text-[#616161] font-[700] text-[16px] leading-6">
                        Characters
                      </p>
                      <div className=" flex gap-2 items-center ">
                        <FaPlus
                          className="text-[14px] cursor-pointer"
                          onClick={handleAddNewChar}
                        />
                        <MdOutlineEdit
                          onClick={() => {
                            setOpenCharacterChart(project_id);
                          }}
                          className="text-[#33B0CA] cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="bg-[#eaeaea] rounded-[6px] p-3 w-full h-auto max-h-[248px] lg:max-h-[313px] overflow-y-auto">
                      {finalCharacters?.map((character, index) => (
                        <CharacterShowCard
                          {...{
                            character,
                            index,
                            setEditData,
                            setEditIdx,
                            setDeleteIdx,
                            setEditPopupOpen,
                            setDeleteChar,
                            onlyAdd,
                            deleteCharacterFun,
                            source_language,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            }
            {/* ask ida desk */}
            <div className="hidden md:block px-3  w-full  mt-4">
              <NewTabTextArea
                fromNew
                premiseId={id}
                // className="ls-textarea"
                // className2="ls-textareainput"
                {...{
                  premiseOwner,
                  user,
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
                  selectedLanguage,
                  setSelectedLanguage,
                  keyboardVisible,
                  setKeyboardVisible,
                  newComment,
                  setNewComment,
                  inputRef,
                }}
              />

              <div className="flex gap-1 items-center w-3/5 mt-[-18px] mx-auto">
                <h3>or,</h3>
                <AskIda
                  {...{
                    id,
                    source_language,
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {openHidePop?.msg === "ShowBecomePrivilege" ? (
        <NoAccessPopUp
          noAccessPopup={openHidePop}
          setNoAccessPopup={setOpenHidePop}
        />
      ) : openHidePop?.msg === "LB" ||
        openHidePop?.msg === "ShowBuyPackage_and_Allacarte" ? (
        <NoAccessLbPopUp
          noAccessLbPopup={openHidePop}
          setNoAccessPopup={setOpenHidePop}
          service="PP_Private"
        />
      ) : (
        openHidePop === "Yes" && (
          <HideOptionPop
            {...{
              setOpenHidePop,
              id,
              user,
              filter_flag,
              comment_filter_flag,
              visible_to,
            }}
            refetch={premiseRefetch}
          />
        )
      )}

      {editPopupOpen && (
        <SingleCharacterEdit
          {...{
            setEditPopupOpen,
            editData,
            handleSaveEditedCharacter,
            characterArray,
            editIdx,
            editPopupOpen,
            source_language,
            onlyAdd,
          }}
        />
      )}
      {addNewCharacter?.msg === "ShowBecomePrivilege" && (
        <NoAccessPopUp
          noAccessPopup={addNewCharacter}
          setNoAccessPopup={setAddNewCharacter}
        />
      )}
      {addNewCharacter === "Yes" && (
        <SingleCharacterAddNewTab
          setCharacterEditPop={setOpenCharacterChart}
          setAddNewCharacter={setAddNewCharacter}
          characterArray={characterArray}
          currentProjectData={premiseData}
          setCharacterArray={setCharacterArray}
          onlyAdd={onlyAdd}
          handleUpdateSavedChar={handleUpdateSavedChar}
          characterLoading={isCharLoading}
          project_id={project_id}
          source_language={source_language}
          characterRefetch={characterRefetch}
        />
      )}
      {deleteChar && (
        <ConfirmationModal
          isOpen={deleteChar}
          onClose={setDeleteChar}
          onConfirm={() => handleDeleteCharacter(deleteIdx)}
          title={`Are you sure you want to Delete this Character?`}
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
          project_id={project_id}
          source_language={source_language}
        />
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

      {selectedLanguage && keyboardVisible && (
        <Draggable handle=".movable-handle">
          <div className="absolute z-20 w-[650px] top-[230px] right-0  bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
            <div className="grid grid-cols-12">
              <div className="movable-handle col-span-11 bg-[#f8f8f8] text-[#616161] cursor-move text-center text-[14px] font-[400]">
                Drag me!! <span className="font-[500]">{selectedLanguage}</span>{" "}
                Keyboard
              </div>
              <div className="flex justify-center items-center w-full h-full cursor-pointer">
                <button
                  onClick={() => {
                    setKeyboardVisible(false);
                    setSelectedLanguage("");
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

      {window.innerWidth < 1150 && charactersPopupMobile && (
        <div className="bg-[#fff] px-3 absolute top-[47px] right-[12px] w-[290px] rounded-[8px] p-[8px] z-30 shadow-[0px_0px_26px_0px_rgba(0,0,0,0.3)]">
          <div className="mt-[17px]">
            {/* <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center">
              {" "}
              <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                Created By
              </h2>
              <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                : {created_by_name}
              </p>
            </div>
            <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center">
              {" "}
              <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                Created On
              </h2>
              <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                : {formatDate(created_at)}
              </p>
            </div> */}
            <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center">
              <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                Last Worked On
              </h2>
              <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                : {formatDate(last_worked_on)}
              </p>
            </div>
          </div>

          {/* visible to  */}
          {premiseOwner?.id === user && (
            <div className="mt-1">
              <div className="  w-full  flex justify-between items-center">
                <p className="text-[#616161] font-[700] text-[16px] leading-6">
                  Visible to
                </p>

                <MdOutlineEdit
                  onClick={handleVisibility}
                  className="text-[#33B0CA] cursor-pointer"
                />
              </div>
              <div className="w-[96% mx-auto] bg-[#eaeaea] h-[1px] mt-1" />
              <p className="text-[#33B0CA] text-[16px] font-[500] leading-6 capitalize">
                {filter_flag === 0
                  ? "All Buddies"
                  : filter_flag === 1
                  ? "Only Me"
                  : filter_flag === 2
                  ? visible_to?.length > 0
                    ? visible_to
                        .filter((v) => v?.id !== currentUser?.id) // Exclude current user
                        .map((v) => `${v?.first_name} ${v?.last_name} `) // Format names properly
                        .join(", ")
                    : "No one"
                    ? filter_flag === 3
                    : "Everyone"
                  : "Everyone"}
              </p>
            </div>
          )}

          {/* characters */}
          {premiseOwner?.id === user && (
            <div className="mt-1">
              <div className="  w-full flex justify-between items-center">
                <p className="text-[#616161] font-[700] text-[16px] leading-6">
                  Characters
                </p>
                <div className=" flex gap-2 items-center ">
                  <FaPlus
                    className="text-[14px] cursor-pointer"
                    onClick={handleAddNewChar}
                  />
                  <MdOutlineEdit
                    onClick={() => {
                      setOpenCharacterChart(project_id);
                      setCharactersPopupMobile(false);
                    }}
                    className="text-[#33B0CA] cursor-pointer"
                  />
                </div>
              </div>
              <div className="bg-[#eaeaea] rounded-[6px] p-3 w-full lg:max-h-[83px] overflow-auto">
                {finalCharacters?.map((character, index) => (
                  <CharacterShowCard
                    {...{
                      character,
                      index,
                      setEditData,
                      setEditIdx,
                      setDeleteIdx,
                      setEditPopupOpen,
                      setDeleteChar,
                      onlyAdd,
                      deleteCharacterFun,
                      source_language,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {openTransOtherPop && (
        <TransInOtherLang
          refetch={premiseRefetch}
          popClose={setOpenTransOtherPop}
          id={id}
          user={user}
          source_language={source_language}
          project_id={project_id}
        />
      )}

      {openMonetizingPreferencesPop?.msg === "ShowBecomePrivilege" ? (
        <NoAccessPopUp
          noAccessPopup={openMonetizingPreferencesPop}
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
        />
      ) : openMonetizingPreferencesPop?.msg === "LB" ||
        openMonetizingPreferencesPop?.msg === "ShowBuyPackage_and_Allacarte" ? (
        <NoAccessLbPopUp
          noAccessLbPopUp={openMonetizingPreferencesPop}
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
          service="PP_Monitizes"
        />
      ) : (
        openMonetizingPreferencesPop === "Yes" && (
          <MonetizePreferencePop
            popClose={setOpenMonetizingPreferencesPop}
            id={id}
            user={user}
          />
        )
      )}
      {openViewTranslationsPop && (
        <ViewTranslationPop
          popClose={setOpenViewTranslationsPop}
          premiseId={viewTransactionPId}
          popupData
          refetch={premiseRefetch}
          popCloseCmnt={() => setOpenPop(false)}
          {...{
            handleVisibility,
            handleMonetizing,
            // setIsLiked,

            viewText,
          }}
        />
      )}
      {isDelete && (
        <DeletePremise
          setIsDelete={setIsDelete}
          refetch={premiseRefetch}
          hiddenCountRefetch={() => {
            navigate("/");
          }}
          deleteId={premiseData?.id}
          projectName={currentProjectName?.slice(0, 20)}
          isDelete={isDelete}
        />
      )}
    </>
  );
};

export default LeftSideBarUpdate;
