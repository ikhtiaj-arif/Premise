import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { PiShareFat } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useGetPremiseUserQuery } from "../../../app/EndPoints/premisePoolApi";
import { setUser } from "../../../app/Slices/userSlice";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import TranslatePremise from "../../Premisepool/TranslatePremise";
import PopupComment from "../../SharedVersion/PopupComment";
import PopupLike from "../../SharedVersion/PopupLike";
import PopupPremiseText from "../../SharedVersion/PopupPremiseText";
import PopupTextarea from "../../SharedVersion/PopupTextarea";
import PremiseBadge from "../Card/PremiseBadge";
import CharacterShowCard from "../../Premisepool/Character/Card";
import {
  useDeleteCharacterMutation,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import SingleCharacterAdd from "../../Premisepool/Character/SingleCharacterAdd";
import SingleCharacterEdit from "../../Premisepool/Character/SingleCharacterEdit";
import ConfirmationModal from "../../Premisepool/Comments/ConfirmationModal";
import { FaPlus } from "react-icons/fa";
import CharacterEditablePop from "../../Premisepool/Character/CharacterEditablePop";
import PremiseTopAccess from "./PremiseTopAccess";
import PremiseTopHeader from "./PremiseTopHeader";
import { useFindCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import AskIda from "../../SharedVersion/AskIda";

const LeftSideBar = ({
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

  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const [deleteCharacter] = useDeleteCharacterMutation();
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();

  const [openHidePop, setOpenHidePop] = useState(false);
  const [transPopClose, setTransPopClose] = useState({});

  const [commentField, setCommentField] = useState(false);

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
  const [addNewCharacter, setAddNewCharacter] = useState(false);
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

  return (
    <div className="w-full pr-3">
      {/* header */}
      <PremiseTopHeader {...{ handleSearch, id }} />
      <div>
        {/* premise card top */}
        <PremiseTopAccess {...{ premiseOwner, user, id, project_id }} />
        {/* center */}
        <div className=" relative">
          <PopupPremiseText
            {...{ bg_img, bg_color, stylings, dText, viewText }}
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
            />
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="mt-[17px] w-[75%] ">
        <div className="flex items-center justify-between">
          {" "}
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Created By
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {created_by_name}
            </p>
          </div>
        </div>
        <div className="flex items-center  justify-between">
          {" "}
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Created On
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {formatDate(created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center  justify-between">
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Last Worked On
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {formatDate(last_worked_on)}
            </p>
          </div>
        </div>
      </div>

      {/* visible to  */}
      {premiseOwner?.id == user && (
        <div className="mt-4">
          <div className="heading w-full  flex justify-between items-center">
            <p className="text-[#616161] font-[600] text-[16pxS]">Visible to</p>

            <MdOutlineEdit
              onClick={() => setOpenHidePop(!openHidePop)}
              className="text-[#33B0CA] cursor-pointer"
            />
          </div>
          <div className="w-[96% mx-auto] bg-[#eaeaea] h-[1px] mt-1" />
          <p className="text-[#33B0CA] text-[16px] font-[500]">
            {filter_flag == 0
              ? "All Buddies"
              : filter_flag == 1
              ? "Only Me"
              : filter_flag == 2
              ? "Names"
                ? filter_flag == 3
                : "Everyone"
              : "Everyone"}
          </p>
        </div>
      )}

      {/* characters */}
      {premiseOwner?.id == user && (
        <div className=" mt-4">
          <div className="heading w-full flex justify-between items-center">
            <p className="text-[#616161] font-[600] text-[16pxS]">Characters</p>
            <div className=" flex gap-2 items-center ">
              <FaPlus
                className="text-[14px] cursor-pointer"
                onClick={(e) => setAddNewCharacter(true)}
              />
              <MdOutlineEdit
                onClick={() => {
                  setOpenCharacterChart(project_id);
                }}
                className="text-[#33B0CA] cursor-pointer"
              />
            </div>
          </div>
          <div className="bg-[#eaeaea] rounded-[8px] p-3 w-full h-[160px] overflow-auto">
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

      <AskIda
        {...{
          id,
          user,
          commentRefetch,
          setOpenAllReplies,
          setOpenReplyFieldID,
          lastCommentRef,
        }}
      />

      <div className=" mb-10">
        <PopupTextarea
          fromNew
          premiseId={id}
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
          }}
        />
      </div>
      <div className="h-[100px]" />

      {openHidePop && (
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
      {addNewCharacter && (
        <SingleCharacterAdd
          {...{
            setAddNewCharacter,
            editData,
            handleAddNewCharacter,
            characterArray,
          }}
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
  );
};

export default LeftSideBar;
