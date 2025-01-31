import React from "react";

const TranslationRequestItem = ({ request }) => {
    console.log(request?.requestToLang);
    console.log(request?.user);
  return (
    <div className="grid grid-cols-12 gap-[18px] w-[100%] mx-auto mt-[4px]">
      <div className="col-span-2 flex justify-center items-center">
        <input type="checkbox" className="h-[20px] w-[20px]" />
      </div>
      <div className="col-span-4 flex items-center justify-center">
        <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
          language
        </p>
      </div>
      <div className="col-span-6 flex items-center justify-center">
        <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
          requestedBy
        </p>
      </div>
    </div>
  );
};

export default TranslationRequestItem;
