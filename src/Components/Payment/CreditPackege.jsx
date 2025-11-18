export const CreditPackage = ({ credit }) => {
  return (
    <div className="border-b border-b-[#0000001A] text-[#101828] font-[400] text-sm md:text-base mt-6 mb-10">
      <div className="bg-secondary  px-5  py-3 mb-5">Package Details</div>
      <div className="p-5 bg-[#F9FAFB] border-b border-b-[#0000001A] ">
        <div className="flex justify-between items-center">
          <span className="text-[#4A5565]"> Credits</span>
          <span className="">{credit}</span>
        </div>
      </div>
    </div>
  );
};
