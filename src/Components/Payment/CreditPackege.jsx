export const CreditPackage = ({ paymentData }) => {
  return (
    <div className="border-b border-b-[#0000001A] text-[#101828] font-[400] text-base mt-6 mb-10">
      <div className="bg-secondary text-[#0F0E13] px-5  py-3 mb-5">
        Package Details
      </div>
      <div className="p-5 bg-[#F9FAFB] border-b border-b-[#0000001A] ">
            <div className="flex justify-between items-center">
              <span className="text-[#4A5565]"> Credits</span>
              <span className="">{paymentData?.conversion_info?.credits_to_add}</span>
            </div>
      </div>
    </div>
  );
};