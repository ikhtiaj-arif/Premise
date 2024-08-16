import React, { useState } from "react";
import { sortedLanguages } from "../Languages";

const TranslateDrop = ({
  source_language,
  selectedOption,
  setSelectedOption,
  handleOptionChange,
  loading,
}) => {
  const [showSelectBox, setShowSelectBox] = useState(false);

  const [transPopup, setTransPopup] = useState(false);
  const [transText, setTransText] = useState(false);

  // const sortedLanguages = Object.fromEntries(
  //   Object.entries(Languages).sort((a, b) => a[0].localeCompare(b[0]))
  // );

  if (loading) {
    return (
      <div className=" w-[106px]">
        <span className="loading loading-spinner mx-auto text-[14px] text-[#33B0CA] my-auto cursor-auto"></span>
      </div>
    );
  }
  return (
    <select
      value={selectedOption}
      onChange={handleOptionChange}
      // className="border border-[#EAEAEA] p-1 rounded-[4px] w-3/4 text-[12px]"
      className="bg-[#FAFAFA] border-none w-[106px] text-[14px] text-[#616161] font-[400] focus:outline-none h-7"
    >
      {Object.entries(sortedLanguages).map(
        ([key, name]) =>
          key !== source_language && (
            <option key={key} value={key}>
              <p className="bg-[#33B0CA]">{name}</p>
            </option>
          )
      )}
    </select>
    // <div className="absolute top-[20px] left-[-70px] z-90 w-[124px] h-[40vh] overflow-y-auto border bg-[#fafafa]">
    // {Object.entries(sortedLanguages)?.map(([key, name]) =>
    //       key !== source_language ? (
    //         <li onClick={()=> {
    //           setSelectedOption(key)

    //           }} className="cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b" key={key} value={key}>
    //           {name}
    //         </li>
    //    ) : null
    //    )}
    //   </div>
  );
};

export default TranslateDrop;
