import React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import RefineFilters from "./RefineFilters";

const RefineButton = ({
  showRefine,
  setShowRefine,
  setSortOrder,
  setRefetching,
  refetch,
  setText,
  setQueryUser,
  setLanguage,
}) => {
  return (
    <div className="relative">
      {" "}
      <div
        className="w-[139px] flex justify-between  items-center bg-[#EAEAEA]  px-[4px] h-[32px] cursor-pointer rounded-[4px] "
        onClick={() => setShowRefine(!showRefine)}
      >
        <div className="text-[14px] pl-[3px] text-[#616161] text-left font-[400] ">
          Refine Results
        </div>
        {/* collapse part */}
        {showRefine ? (
          <FaAngleUp className="text-[#616161] text-[18px] font-[400]" />
        ) : (
          <FaAngleDown className="text-[#616161] text-[18px] font-[400]" />
        )}
      </div>
      <RefineFilters
        showRefine={showRefine}
        setSortOrder={setSortOrder}
        setRefetching={setRefetching}
        refetch={refetch}
        setText={setText}
        setQueryUser={setQueryUser}
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default RefineButton;
