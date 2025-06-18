import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { getLanguageName } from "../../PremiseV2/utilityFuncitons/functions";
import ConfirmationModal from "../Comments/ConfirmationModal";
import { inanimateObject } from "./inanimateObject";

const CharacterShowCard = ({
  character,
  index,
  setEditPopupOpen,
  setEditData,
  setEditIdx,
  setDeleteIdx,
  setDeleteChar,
  onlyAdd,
  deleteCharacterFun,
  isAddedByMe,
  source_language,
  is_draft,
}) => {
  //console.log("character", character?.is_ai_generated,index);
  const sourceLanguageName = getLanguageName(source_language);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // console.log(onlyAdd);
  const handleDeleteClick = () => {
    if (onlyAdd && character?.id) {
      setConfirmDelete(true);
    } else {
      setDeleteChar(character.role);
      setDeleteIdx(index);
    }
  };

  const inanimateObjectOptions = (language) => {
    if (inanimateObject[language]) {
      return Object.values(inanimateObject[language])[0]; // Get the first value
    }
    return null; // Return null if no value is found
  };

  // console.log(
  //   onlyAdd,

  //   is_draft
  // );
  // console.log("iiiiiii",source_language, inanimateObjectOptions(sourceLanguageName));

  return (
    <div className="flex text-[#252525] h-auto max-h-[36px] gap-[3px] justify-between items-center my-1 w-full">
      <div className="">
        <p className="text-[12px] leading-[16.26px] font-[400]">
          {character?.role}:{" "}
          <span className={`capitalize ${isAddedByMe ? "text-[#33B0CA]" : ""}`}>
            {character?.name}
          </span>
          , {character?.gender}
          {character?.gender !== inanimateObjectOptions(sourceLanguageName) &&
            character?.age &&
            `, ${character?.age}`}
        </p>

        {/* <p className="text-[12px] font-[400]"></p>
        <p className="text-[12px] font-[400]"></p>
        <p className="text-[12px] font-[400]"></p> */}
      </div>
      <div className="flex items-center gap-[10px]">
        {!onlyAdd || is_draft ? (
          <>
            {index === 0 && (
              <FaRegEye
                data-te-toggle="tooltip"
                title={`${`View`}`}
                onClick={() => {
                  setEditPopupOpen(true);
                  setEditData(character);
                  setEditIdx(index);
                }}
                className="h-[16px] w-[16px] text-[#616161] cursor-pointer"
              />
            )}
            {index >= 1 && (
              <MdOutlineEdit
                data-te-toggle="tooltip"
                title={`${`Edit`}`}
                onClick={() => {
                  setEditPopupOpen(true);
                  setEditData(character);
                  setEditIdx(index);
                }}
                className="h-[16px] w-[16px] cursor-pointer text-[#616161]"
              />
            )}
          </>
        ) : (
          <>
            <FaRegEye
              data-te-toggle="tooltip"
              title={`${`View`}`}
              onClick={() => {
                setEditPopupOpen(true);
                setEditData(character);
                setEditIdx(index);
              }}
              className="h-[16px] w-[16px] text-[#616161] cursor-pointer"
            />
          </>
        )}

        {index >= 2 ? (
          <RiDeleteBinLine
            data-te-toggle="tooltip"
            title={`${`Delete`}`}
            onClick={() => {
              handleDeleteClick();
            }}
            className="h-[20px] text-[#616161] w-[16px] cursor-pointer"
          />
        ) : (
          <div className=" w-[16px]" />
        )}
      </div>
      {confirmDelete && (
        <ConfirmationModal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => deleteCharacterFun(character)}
          title="Are you sure you want to delete this Character?"
          content="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
};

export default CharacterShowCard;
