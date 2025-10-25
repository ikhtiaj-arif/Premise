const PremiseBadge = ({ stamp, color }) => {
  return (
    <>
      {stamp ? (
        <div
          className={`absolute ${
            color || "bg-[#00c3ff]"
          } bottom-0 right-[12px]  rounded-[4px] text-[#fafafa] font-[700] text-[10px] leading-[12.1px] px-[3px] py-[2px]`}
        >
          {stamp}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PremiseBadge;
