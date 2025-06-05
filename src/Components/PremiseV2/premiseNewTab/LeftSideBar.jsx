import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaPlus } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
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
import Keyboard from "../../Premisepool/Keyboard";
import TranslatePremiseNewTab from "../../Premisepool/TranslatePremiseNewTab";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import AskIda from "../../SharedVersion/AskIda";
import NewTabTextArea from "../../SharedVersion/NewTabTextArea";
import PopupComment from "../../SharedVersion/PopupComment";
import PopupLike from "../../SharedVersion/PopupLike";
import PopupPremiseText from "../../SharedVersion/PopupPremiseText";
import PremiseBadge from "../Card/PremiseBadge";
import PremiseTopAccess from "./PremiseTopAccess";
import PremiseTopHeader from "./PremiseTopHeader";
import VisibilitySection from "./VisibilitySection";

const LeftSideBar = ({
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
  const [commentField, setCommentField] = useState(true);
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
        body: { char_data: charArr },
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
    console.log("add char res", res);
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
  console.log("source_language", source_language);
  // console.log("characters", characters);
  // console.log("finalCharacters", finalCharacters);
  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );

  return (
    <>
      <div className="fixed bottom-8 z-[1] w-[96%] mx-auto md:hidden">
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
      </div>
      <div className="lg:w-[368px] w-full relative h-full shadow-md  rounded-md">
        {/* main div */}
        <div className="h-full lg:h-[83vh] overflow-hidden relative flex flex-col">
          <div className="flex-none px-3">
            {/* header */}
            <PremiseTopHeader {...{ handleSearch, id, setSearchTerm }} />
            <div>
              {/* premise card top */}
              <PremiseTopAccess
                {...{
                  premiseOwner,
                  user,
                  id,
                  project_id,
                  premiseData,
                  premiseRefetch,
                }}
              />
              {/* center */}
              <div className="relative">
                <PopupPremiseText
                  {...{ bg_img, bg_color, stylings, dText, viewText }}
                  className="ls-contentbox"
                  className2="ls-contenttext"
                />
                <PremiseBadge stamp={stamp} />
              </div>
              {/* bottom */}
              <div className="flex justify-between items-center  rounded-b-[8px] px-[4px] pb-[8px] pt-[4px] ">
                {/* 1st div */}
                <div className="flex gap-1 space-x-4 items-center">
                  {/* like */}
                  <PopupLike {...{ user, id, premiseRefetch, premiseData }} />
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
              </div>
            </div>
          </div>
          {/* Details scroll div */}
          <div className="flex-1 pb-4 overflow-y-auto flex flex-col justify-between">
            {window.innerWidth > 1150 && (
              <div className="bg-[#fff] px-3">
                <div>
                  <div className="grid grid-cols-[40%_minmax(60%,_1fr)] items-center ">
                    {" "}
                    <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                      Created By
                    </h2>
                    <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                      : {created_by_name}
                    </p>
                  </div>
                  <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center ">
                    {" "}
                    <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                      Created On
                    </h2>
                    <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                      : {formatDate(created_at)}
                    </p>
                  </div>
                  <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center ">
                    <h2 className="text-[#616161] text-[14px] leading-[20px] font-[700]">
                      Last Worked On
                    </h2>
                    <p className="text-[#616161] text-[14px] leading-[20px] font-[400] pl-1">
                      : {formatDate(last_worked_on)}
                    </p>
                  </div>
                </div>

                {/* visible to  */}
                {/* {premiseOwner?.id === user && (
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
                    {(() => {
                      // Define meaningful labels for each filter flag
                      const getFilterLabel = () => {
                        if (filter_flag === 0) {
                          return "All Buddies";
                        } else if (filter_flag === 1) {
                          return "Only Me";
                        } else if (filter_flag === 2) {
                          // Get names of visible users, excluding the current user
                          const visibleUsers = visible_to?.filter(
                            (v) => v?.id !== currentUser?.id
                          );
                          if (visibleUsers?.length > 0) {
                            return visibleUsers
                              .map((v) => {
                                // Check if first_name exists, otherwise use the email split by @
                                if (v?.first_name) {
                                  return `${v?.first_name} ${v?.last_name}`;
                                } else {
                                  const emailParts = v?.email?.split("@");
                                  return emailParts
                                    ? emailParts[0]
                                    : "No Name Available";
                                }
                              })
                              .join(", ");
                          } else {
                            return "No one";
                          }
                        } else if (filter_flag === 3) {
                          return "Everyone";
                        } else {
                          return "Everyone";
                        }
                      };

                      return getFilterLabel();
                    })()}
                  </p>
                </div>
              )}
           */}

                <VisibilitySection
                  premiseOwner={premiseOwner}
                  user={user}
                  visible_to={visible_to}
                  currentUser={currentUser}
                  filter_flag={filter_flag}
                  handleVisibility={handleVisibility}
                />

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

            {/* ask ida desk */}
            <div className="hidden md:block px-3  w-full  mt-4">
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
          <div className="absolute z-20 w-[650px] top-[230px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
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
            <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] items-center">
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
            </div>
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
    </>
  );
};

export default LeftSideBar;
