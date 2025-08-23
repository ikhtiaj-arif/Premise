import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useDeleteCharacterMutation,
  useGetSavedCharactersQuery,
} from "../../../app/EndPoints/Characters/Characters";
import AddCharDemoPop from "../../PremiseV2/sequalPopup/singlePop/AddCharDemoPop";
import { getTextFromValue } from "../../PremiseV2/utilityFuncitons/functions";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import CharacterShowCard from "./Card";
import SingleCharacterAdd from "./SingleCharacterAdd";
import SingleCharacterEdit from "./SingleCharacterEdit";
import SingleCharacterAddNewTab from "./SingleCharacterAddNewTab";

const CharacterEditablePop = ({
  setCharacterEditPop,
  characterArray,
  currentProjectData,
  // characters,
  // setCharacters,
  handleUpdateSavedChar,
  handleSaveAsDraft,
  setCharacterArray,
  characterLoading,
  onlyAdd,
  project_id,
  source_language,
  isOldProject,
  openOnSaveCharactersDemoPop,
  setOpenOnSaveCharactersDemoPop,
  is_draft,
  setPreviewAfterDraft,
  setOpenCharacterChart,
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
  const [saveCheckUser, setSaveCheckUser] = useState(false);

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

  const finalAICharacters = [
    ...sortedCharacters,
    ...remainingCharacters,
  ].filter((char) => char?.is_ai_generated);
  const finalByMeCharacters = [
    ...sortedCharacters,
    ...remainingCharacters,
  ].filter((char) => !char?.is_ai_generated);

  const {
    data: characters,
    isCharLoading,
    isError,
    refetch: characterRefetch,
  } = useGetSavedCharactersQuery(project_id, {
    skip: isOldProject,
  });

  useEffect(() => {
    if (characters) {
      setCharacterArray(characters);
      setDuplicateCharacterArray(characters);
    }
  }, [characters]);

  useEffect(() => {
    if (!isOldProject && project_id) {
      characterRefetch();
    }
  }, [project_id, isOldProject]);

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

  const handleDeleteCharacter = (role) => {
    console.log(role);

    const updatedCharacters = characterArray.filter(
      (char) => char.role !== role
    );
    setCharacterArray(updatedCharacters);
    // console.log("After Deletion:", updatedCharacters);
  };

  const handleAddNewCharacter = (newCharacter) => {
    const updatedCharacters = [...characterArray, newCharacter];
    // console.log("After Adding New Character:", updatedCharacters);
    setCharacterArray(updatedCharacters);
  };

  // const options = {
  //   "Short film": [
  //     { text: "About 2 Minutes", value: "Upto 2 Minutes" },
  //     { text: "About 5 Minutes", value: "2 to 4 Minutes" },
  //     { text: "About 15 Minutes", value: "5 to 14 Minutes" },
  //     { text: "About 25 Minutes", value: "15 to 29 Minutes" },
  //     { text: "About 30 Minutes", value: "30 Minutes" },
  //   ],
  //   "Feature film": [
  //     { text: "About 1 Hour", value: "1 Hour" },
  //     { text: "About 2 Hours", value: "2 Hours" },
  //     { text: "About 3 Hours", value: "3 Hours" },
  //   ],
  // };

  // const getTextFromValue = (value) => {
  //   for (const category in options) {
  //     const foundOption = options[category].find(
  //       (option) => option.value === value
  //     );
  //     if (foundOption) {
  //       return foundOption.text;
  //     }
  //   }
  //   return value;
  // };

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
    console.log("ddddddddddd", character);
    const res = await deleteCharacter(character?.id);
    if (res) {
      characterRefetch();
    }
  };

  const [openAddCharDemoPop, setOpenAddCharDemoPop] = useState(false);

  const handleAddNewChar = async () => {
    const addCharDemoPop = localStorage.getItem("addNewCharDemoPop");
    if (
      (!addCharDemoPop || addCharDemoPop === "false") &&
      !openAddCharDemoPop
    ) {
      setOpenAddCharDemoPop(true);
    }
    const res = await fetchUserAccess(`${currentUser?.id}/PP_AddCharacters`);

    if (res?.access === "No") {
      setAddNewCharacter(res);
    } else {
      setAddNewCharacter("Yes");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2]">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-[#fafafa] py-8 md:rounded-lg shadow-lg w-full sm:w-[90%] lg:w-[950px] h-[91vh] sm:h-[500px] mt-[65px] ">
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

        <h3 className="text-[16px] font-semibold mb-[20px] px-6 md:px-[56px]">
          {!onlyAdd && "Proposed"} Characters in about{" "}
          <span className="">
            {getTextFromValue(currentProjectData?.duration)}
          </span>{" "}
          <span className="">{currentProjectData?.nature_project}</span>{" "}
          <span
            data-te-toggle="tooltip"
            title={`${`${currentProjectData?.name} `}`}
            className="notranslate"
          >
            {currentProjectData?.name?.slice(0, 20)}
            {/* {currentProjectData?.name.length > 20
              ? `${currentProjectData?.name.slice(0, 20)}...`
              : currentProjectData} */}
          </span>
        </h3>

        {/* 3 Column Layout */}
        <div className="h-[37vh] xxs:h-[51vh] overflow-auto md:h-auto md:max-h-[312px] px-6 md:px-[56px]">
          {finalAICharacters?.length > 0 && (
            <p className=" text-[#252525] text-[16px] font-[600] mb-2">
              Generated By Ida
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[54px] gap-y-[8px] justify-center">
            {finalAICharacters?.map((character, index) => (
              <CharacterShowCard
                key={index + character?.id}
                index={index + finalAICharacters?.length}
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
                  isAddedByMe: false,
                  source_language,
                  is_draft,
                  duplicateCharacterArray,
                  characterArray,
                  handleUpdateSavedChar,
                }}
              />
            ))}
          </div>

          {finalByMeCharacters?.length > 0 && (
            <p className=" text-[#33B0CA] text-[16px] font-[600] mt-3 mb-2">
              Added By Me
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[54px] gap-y-[8px] justify-center ">
            {finalByMeCharacters?.map((character, index) => (
              <CharacterShowCard
                key={index + character?.id}
                index={index + finalAICharacters?.length}
                {...{
                  character,
                  setEditData,
                  setEditIdx,
                  setDeleteIdx,
                  setEditPopupOpen,
                  setDeleteChar,
                  onlyAdd,
                  deleteCharacterFun,
                  isAddedByMe: true,
                  source_language,
                  is_draft,
                  duplicateCharacterArray,
                  characterArray,
                  handleUpdateSavedChar,
                }}
              />
            ))}
          </div>
        </div>
        {/* {console.log(characterArray)} */}
        {!onlyAdd && (
          <div className="flex md:mx-10 justify-between pl-2 gap-[16px] absolute right-[30px] bottom-[65px] md:bottom-[15px]">
            <label className="flex custom-checkbox items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCheckUser}
                onChange={() => setSaveCheckUser(!saveCheckUser)}
                className="w-4 h-4 mt-1 shrink-0 noAccessRadio"
              />
              <span className="text-[12px] leading-snug md:w-[58%]">
                I understand that after saving this character list: <br />
                1. I will not be able to edit these characters.
                <br />
                2. I will, however, be able to view or delete any character and
                also add more characters (This can be done from the 'Show
                Characters' icon on the script pad or Brainstorm page of the
                associated Premise).
              </span>
            </label>
          </div>
        )}

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
          {!onlyAdd ? (
            <>
              {saveCheckUser ? (
                <>
                  {is_draft ? (
                    <button
                      disabled={!saveCheckUser || characterLoading}
                      onClick={async () => {
                        await handleUpdateSavedChar();
                        setPreviewAfterDraft(true);
                        // setOpenCharacterChart(false);
                      }}
                      className={`${
                        saveCheckUser ? "bg-[#33B0CA]" : "bg-[#ACDDE7]"
                      } text-white w-[69px] h-[32px] text-[14px] font-[600] rounded-[8px]`}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      disabled={!saveCheckUser || characterLoading}
                      onClick={async () => {
                        await handleUpdateSavedChar();
                        setOpenCharacterChart(false);
                      }}
                      className={`${
                        saveCheckUser ? "bg-[#33B0CA]" : "bg-[#ACDDE7]"
                      } text-white w-[69px] h-[32px] text-[14px] font-[600] rounded-[8px]`}
                    >
                      Save
                    </button>
                  )}
                </>
              ) : (
                <button
                  // disabled={saveCheckUser || characterLoading}
                  onClick={() => {
                    handleSaveAsDraft();
                  }}
                  className={`${
                    !saveCheckUser ? "bg-[#33B0CA]" : "bg-[#ACDDE7]"
                  } text-white w-[119px] h-[32px] text-[14px] font-[600] rounded-[8px]`}
                >
                  Save As Draft
                </button>
              )}
            </>
          ) : (
            <button
              disabled={characterLoading}
              onClick={async () => {
                await handleUpdateSavedChar();
                // setOpenCharacterChart(false);
              }}
              className={`${
                !characterLoading ? "bg-[#33B0CA]" : "bg-[#ACDDE7]"
              } text-white w-[69px] h-[32px] text-[14px] font-[600] rounded-[8px]`}
            >
              Save
            </button>
          )}
          {/* {!onlyAdd ? (
            <button
              disabled={!saveCheckUser || characterLoading}
              onClick={() => {
                handleUpdateSavedChar();
              }}
              className={`${
                saveCheckUser ? "bg-[#33B0CA]" : "bg-[#ACDDE7]"
              } text-white w-[69px] h-[32px] text-[14px] font-[600] rounded-[8px]`}
            >
              Save
            </button>
          ) : (
            <button
              disabled={characterLoading}
              onClick={() => {
                handleUpdateSavedChar();
              }}
              className={`${
                !characterLoading ? "bg-[#33B0CA]" : "bg-[#ACDDE7]"
              } text-white w-[69px] h-[32px] text-[14px] font-[600] rounded-[8px]`}
            >
              Save
            </button>
          )} */}
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
            source_language={source_language}
          />
        )}
      </div>
      <div>
        {addNewCharacter?.msg === "ShowBecomePrivilege" && (
          <NoAccessPopUp
            noAccessPopup={addNewCharacter}
            setNoAccessPopup={setAddNewCharacter}
          />
        )}
        {addNewCharacter === "Yes" && (
          // <SingleCharacterAdd
          //   setAddNewCharacter={setAddNewCharacter}
          //   editData={editData}
          //   handleAddNewCharacter={handleAddNewCharacter}
          //   characterArray={characterArray}
          //   source_language={source_language}
          // />
               <SingleCharacterAddNewTab
                    setCharacterEditPop={setOpenCharacterChart}
                    setAddNewCharacter={setAddNewCharacter}
                    characterArray={characterArray}
                    // currentProjectData={premiseData}
                    setCharacterArray={setCharacterArray}
                    onlyAdd={onlyAdd}
                    handleUpdateSavedChar={handleUpdateSavedChar}
                    characterLoading={isCharLoading}
                    project_id={project_id}
                    source_language={source_language}
                    characterRefetch={characterRefetch}
                  />
        )}
      </div>
      {/* {deleteChar && (
        <ConfirmationModal
          isOpen={deleteChar}
          onClose={setDeleteChar}
          onConfirm={() => handleDeleteCharacter(deleteChar)}
          // onConfirm={() => handleDeleteCharacter(deleteIdx)}
          title={`Are you sure you want to Delete this Character 111?`}
        />
      )} */}

      {openAddCharDemoPop && (
        <AddCharDemoPop popClose={() => setOpenAddCharDemoPop(false)} />
      )}
    </div>
  );
};

export default CharacterEditablePop;
