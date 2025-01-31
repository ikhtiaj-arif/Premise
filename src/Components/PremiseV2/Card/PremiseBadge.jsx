import React from "react";

const PremiseBadge = ({ stamp }) => {
  return (
    <>
      {stamp ? (
        <div className="absolute bottom-0 right-[12px] bg-[#33b0ca] rounded-[4px] text-[#fafafa] font-[700] text-[10px] leading-[12.1px] px-[3px] py-[2px]">
          {stamp}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PremiseBadge;
