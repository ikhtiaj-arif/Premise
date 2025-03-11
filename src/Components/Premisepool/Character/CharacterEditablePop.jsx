import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useDeleteCharacterMutation,
  useGetSavedCharactersQuery,
} from "../../../app/EndPoints/Characters/Characters";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import ConfirmationModal from "../Comments/ConfirmationModal";
import CharacterShowCard from "./Card";
import SingleCharacterAdd from "./SingleCharacterAdd";
import SingleCharacterEdit from "./SingleCharacterEdit";

const CharacterEditablePop = ({
  setCharacterEditPop,
  characterArray,
  currentProjectData,
  // characters,
  // setCharacters,
  handleUpdateSavedChar,
  setCharacterArray,
  characterLoading,
  onlyAdd,
  project_id,
}) => {
  const [modifiedCharacters, setModifiedCharacters] = useState([]);

  const { currentUser } = useContext(MyContext);

  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [addNewCharacter, setAddNewCharacter] = useState(null);
  const [editData, setEditData] = useState({});
  const [editIdx, setEditIdx] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteChar, setDeleteChar] = useState(null);
  const [duplicateCharacterArray, setDuplicateCharacterArray] = useState([]);

  const [deleteCharacter] = useDeleteCharacterMutation();

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

  const {
    data: characters,
    isCharLoading,
    isError,
    refetch: characterRefetch,
  } = useGetSavedCharactersQuery(project_id);

  useEffect(() => {
    if (characters) {
      setCharacterArray(characters);
      setDuplicateCharacterArray(characters);
    }
  }, [characters]);

  useEffect(() => {
    if (project_id) {
      characterRefetch();
    }
  }, [project_id]);

  const handleEditClick = (character) => {
    setEditPopupOpen(true);
    setEditData(character);
  };

  const handleSaveEditedCharacter = (updatedCharacter, index) => {
    const updatedCharacters = characterArray.map((char, i) =>
      i === index ? updatedCharacter : char
    );
    setCharacterArray(updatedCharacters);
    // console.log(updatedCharacters);
    setEditPopupOpen(false); // Close the popup after saving
  };

  // const handleDeleteCharacter = () => {
  //   const updatedCharacters = characterArray.filter(
  //     (char) => char.role !== deleteChar
  //   );
  //   setCharacterArray(updatedCharacters);
  //   console.log("After Deletion:", updatedCharacters);
  // };

  const handleDeleteCharacter = (idx) => {
    const updatedCharacters = characterArray.filter((char, i) => i !== idx);
    setCharacterArray(updatedCharacters);
    // console.log("After Deletion:", updatedCharacters);
  };

  const handleAddNewCharacter = (newCharacter) => {
    const updatedCharacters = [...characterArray, newCharacter];
    // console.log("After Adding New Character:", updatedCharacters);
    setCharacterArray(updatedCharacters);
  };

  const options = {
    "Short film": [
      { text: "About 2 Minutes", value: "Upto 2 Minutes" },
      { text: "About 5 Minutes", value: "2 to 4 Minutes" },
      { text: "About 15 Minutes", value: "5 to 14 Minutes" },
      { text: "About 25 Minutes", value: "15 to 29 Minutes" },
      { text: "About 30 Minutes", value: "30 Minutes" },
    ],
    "Feature film": [
      { text: "About 1 Hour", value: "1 Hour" },
      { text: "About 2 Hours", value: "2 Hours" },
      { text: "About 3 Hours", value: "3 Hours" },
    ],
  };
  const getTextFromValue = (value) => {
    for (const category in options) {
      const foundOption = options[category].find(
        (option) => option.value === value
      );
      if (foundOption) {
        return foundOption.text;
      }
    }
    return value;
  };

  const handleClosePopup = () => {
    if (characterArray > duplicateCharacterArray) {
      const confirm = window.confirm("Your changes may not be saved!");
      if (confirm) {
        setCharacterEditPop(false);
      } else {
        return;
      }
    } else {
      setCharacterEditPop(false);
    }
  };

  const deleteCharacterFun = async (character) => {
    console.log(character);
    const res = await deleteCharacter(character?.id);
    if (res) {
      characterRefetch();
    }
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-[#fafafa] py-8 px-[56px] rounded-lg shadow-lg w-full lg:w-[950px] h-[89vh] md:h-[396px] mt-[85px] ">
        <button
          onClick={handleClosePopup}
          className="absolute hidden md:block right-[-13px] top-[-13px] bg-[#EE3C4D] text-white rounded-full w-8 h-8  items-center justify-center shadow"
        >
          ✕
        </button>
        <div className="mb-[17px]  md:hidden">
          <h3 className="text-center flex items-center gap-[9px] font-[500]">
            <MdOutlineKeyboardBackspace
              onClick={() => setCharacterEditPop(false)}
              className=" md:hidden text-[#33B0CA] cursor-pointer h-[36px] w-[36px]"
            />{" "}
            <span className="text-[16px] md:text-[14px]">
              Scene Generation from Beat{" "}
            </span>
          </h3>
        </div>

        <h3 className="text-[16px] font-semibold mb-[20px]">
          {!onlyAdd && "Proposed"} Characters in{" "}
          <span className="">
            {getTextFromValue(currentProjectData?.duration)}
          </span>{" "}
          <span className="">{currentProjectData?.nature_project}</span>{" "}
          <span className="">{currentProjectData?.name}</span>
        </h3>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[54px] gap-y-[8px] justify-center max-h-[68vh] overflow-auto md:h-auto">
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
        {/* {console.log(characterArray)} */}

        {/* Bottom Buttons */}
        <div className="absolute right-[30px] bottom-[30px] flex justify-end gap-[16px] mt-[38px]">
          {finalCharacters?.length <= 17 && (
            <button
              onClick={handleAddNewChar}
              className="bg-[#fafafa] flex items-center gap-[10px] justify-center text-[14px] text-[#33B0CA] border border-[#33B0CA] w-[145px] h-[32px] rounded-[8px] "
            >
              <FaPlus /> <span>Add Character</span>
            </button>
          )}
          <button
            disabled={characterLoading}
            onClick={() => {
              handleUpdateSavedChar();
            }}
            className="bg-[#33B0CA] text-white w-[69px] h-[32px] text-[14px] font-[600] rounded-[8px] "
          >
            Save
          </button>
        </div>
      </div>
      <div>
        {editPopupOpen && (
          <SingleCharacterEdit
            setEditPopupOpen={setEditPopupOpen}
            editData={editData}
            editIdx={editIdx}
            onSave={handleSaveEditedCharacter}
            characterArray={characterArray}
            onlyAdd={onlyAdd}
            isEditPopupOpen={editPopupOpen}
          />
        )}
      </div>
      <div>
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
      </div>
      {deleteChar && (
        <ConfirmationModal
          isOpen={deleteChar}
          onClose={setDeleteChar}
          onConfirm={() => handleDeleteCharacter(deleteIdx)}
          title={`Are you sure you want to Delete this Character?`}
        />
      )}
    </div>
  );
};

export default CharacterEditablePop;
