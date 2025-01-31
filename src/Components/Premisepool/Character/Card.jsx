import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmationModal from "../Comments/ConfirmationModal";

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
}) => {
  // console.log("character", character);

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

  return (
    <div className="flex text-[#252525]   h-[32px] gap-[3px] justify-between items-center w-full">
      <div className="">
        <p className="text-[12px] leading-[16.26px] font-[400]">
          {character?.role}:{" "}
          <span className="capitalize">{character?.name}</span>,{" "}
          {character?.gender}, {character?.age}
        </p>
        {/* <p className="text-[12px] font-[400]"></p>
        <p className="text-[12px] font-[400]"></p>
        <p className="text-[12px] font-[400]"></p> */}
      </div>
      <div className="flex items-center gap-[10px]">
        {!onlyAdd ? (
          <>
            {index === 0 && (
              <FaRegEye
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
          title="Are you sure you want to delete this comment?"
          content="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
};

export default CharacterShowCard;
