export const CreditPackage = ({ credit }) => {
  return (
    <div className="w-full lg:w-[80%] h-full">
      <p
        style={{
          clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 0% 50%)",
          maxWidth: "70%",
          padding: "0.3rem 25px 0.3rem 0",
        }}
        className="bg-[#00c3ff] text-[#fafafa] text-center lg:text-[22px] text-[16px] font-[600]  relative border-none lg:bottom-[-22px] bottom-[-17px]"
      >
        Package Details
      </p>

      <div className=" border-2 rounded-[8px] min-h-[285px] border-[#ccc] w-full p-5 ">
        <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] font-[400] text-[#616161]">
          <h3 className="">Credit</h3>
          <p className="text-right font-semibold text-[#252525]">{credit}</p>
        </div>
      </div>
    </div>
  );
};
