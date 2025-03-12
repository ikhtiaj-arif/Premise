import React, { useContext, useEffect, useRef, useState } from "react";
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
import SingleCharacterAdd from "../../Premisepool/Character/SingleCharacterAdd";
import SingleCharacterEdit from "../../Premisepool/Character/SingleCharacterEdit";
import ConfirmationModal from "../../Premisepool/Comments/ConfirmationModal";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import TranslatePremise from "../../Premisepool/TranslatePremise";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import AskIda from "../../SharedVersion/AskIda";
import PopupComment from "../../SharedVersion/PopupComment";
import PopupLike from "../../SharedVersion/PopupLike";
import PopupPremiseText from "../../SharedVersion/PopupPremiseText";
import PopupTextarea from "../../SharedVersion/PopupTextarea";
import PremiseBadge from "../Card/PremiseBadge";
import PremiseTopAccess from "./PremiseTopAccess";
import PremiseTopHeader from "./PremiseTopHeader";
import VerticalBar from "./VerticalBar";

const LeftSideBar = ({
  filteredCommentsData,
  premiseData,
  premiseRefetch,
  commentRefetch,
  commentsData,
  setOpenReplyField,
  replyField,
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

  console.log("filteredCommentsData", filteredCommentsData);

  const { charactersPopupMobile } = useContext(GlobalContext);

  const { currentUser } = useContext(MyContext);

  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const [deleteCharacter] = useDeleteCharacterMutation();
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();

  const [openHidePop, setOpenHidePop] = useState(null);
  const [transPopClose, setTransPopClose] = useState({});

  const [commentField, setCommentField] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const finalCount = commentsData?.counts;

  const user = useSelector((state) => state?.user?.id);
  const dispatch = useDispatch();

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

  const lastCommentRef = useRef(null);

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
    "Supporting Character",
    "Confidant",
    "Foil",
    "Mentor",
    "Symbolic Character",
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
    const res = await fetchUserAccess(`${currentUser?.id}/PP_AddCharacters`);
    console.log("add char res", res);
    if (res?.access === "No") {
      setAddNewCharacter(res);
    } else {
      setAddNewCharacter("Yes");
    }
  };

  const handleVisibility = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);
    console.log("visibility res", res);
    if (res?.access === "No") {
      setOpenHidePop(res);
    } else {
      setOpenHidePop("Yes");
    }
  };

  return (
    <>
      <div className="fixed bottom-8  w-[96%] mx-auto md:hidden">
        <AskIda
          {...{
            id,
            user,
            premiseOwner,
            commentRefetch,
            setOpenAllReplies,
            setOpenReplyFieldID,
            lastCommentRef,
            isLoading,
            setIsLoading,
          }}
        />

        <PopupTextarea
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
          }}
        />
      </div>
      <div className="lg:w-[368px] w-full relative ">
        <div className="relative h-full shadow-md pl-3 rounded-md">
          <div className="lg:pr-12 h-full pb-12 overflow-y-scroll">
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
                  <TranslatePremise
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
            {/* Details */}

            {window.innerWidth < 1150 && charactersPopupMobile && (
              <div className="bg-[#fff] absolute top-[47px] right-[12px] w-[290px] rounded-[8px] p-[8px] z-30 shadow-[0px_0px_26px_0px_rgba(0,0,0,0.3)]">
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
                    <p className="text-[#33B0CA] text-[16px] font-[500] leading-6">
                      {filter_flag === 0
                        ? "All Buddies"
                        : filter_flag === 1
                        ? "Only Me"
                        : filter_flag === 2
                        ? "Names"
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
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {window.innerWidth > 1150 && (
              <div className="bg-[#fff]">
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
                    <p className="text-[#33B0CA] text-[16px] font-[500] leading-6">
                      {filter_flag === 0
                        ? "All Buddies"
                        : filter_flag === 1
                        ? "Only Me"
                        : filter_flag === 2
                        ? "Names"
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
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="hidden md:block fixed w-full max-w-[310px] bottom-8 ">
              <AskIda
                {...{
                  id,
                  user,
                  premiseOwner,
                  commentRefetch,
                  setOpenAllReplies,
                  setOpenReplyFieldID,
                  lastCommentRef,
                  isLoading,
                  setIsLoading,
                }}
              />

              <PopupTextarea
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
                }}
              />
            </div>
          </div>
          <VerticalBar
            replyRef={replyRef}
            comments={filteredCommentsData?.comments}
            currentCommentRef={currentCommentRef}
            handleOpenAllReplies={handleOpenAllReplies}
            // setReplyField={setReplyField}
            // replyField={replyField}
            // onFocusComment={handleFocusComment}
          />
        </div>

        {openHidePop?.msg == "ShowBecomePrivilege" ? (
          <NoAccessPopUp
            noAccessPopup={openHidePop}
            setNoAccessPopup={setOpenHidePop}
          />
        ) : openHidePop?.msg == "LB" ||
          openHidePop?.msg == "ShowBuyPackage_and_Allacarte" ? (
          <NoAccessLbPopUp
            noAccessLbPopup={openHidePop}
            setNoAccessPopup={setOpenHidePop}
            service="PP_Private"
          />
        ) : (
          openHidePop == "Yes" && (
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
        {addNewCharacter?.msg == "ShowBecomePrivilege" && (
          <NoAccessPopUp
            noAccessPopup={addNewCharacter}
            setNoAccessPopup={setAddNewCharacter}
          />
        )}
        {addNewCharacter == "Yes" && (
          <SingleCharacterAdd
            setAddNewCharacter={setAddNewCharacter}
            editData={editData}
            handleAddNewCharacter={handleAddNewCharacter}
            characterArray={characterArray}
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
            currentProjectData={premiseData}
            setCharacterArray={setCharacterArray}
            onlyAdd={onlyAdd}
            handleUpdateSavedChar={handleUpdateSavedChar}
            characterLoading={isCharLoading}
            project_id={project_id}
          />
        )}
      </div>
    </>
  );
};

export default LeftSideBar;
