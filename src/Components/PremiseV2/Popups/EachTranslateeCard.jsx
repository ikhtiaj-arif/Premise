import React from "react";
import { useGetUserByUserIdQuery } from "../../../app/EndPoints/premisePoolApi";
import { getLanguageName } from "../utilityFuncitons/functions";

const EachTranslateeCard = ({ transaction }) => {
  const { data: userData, isLoading } = useGetUserByUserIdQuery(
    transaction?.translatedFor
  );
  const { data: allowedUserData, isAUserLoading } = useGetUserByUserIdQuery(
    transaction?.translationAllowedBy
  );
  
  const lang = getLanguageName(transaction?.translatedIn);

  return (
    <React.Fragment>
      {/* Translated In */}
      <div className="flex flex-col col-span-3">
        <h2 className="font-[500] text-[14px] leading-[21px] text-center my-[ px]">
          Translated In
        </h2>
        <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
        <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
          {lang}
        </div>
      </div>

      {/* Translation Allowed By */}
      <div className="flex flex-col col-span-4">
        <h2 className="font-[500] text-[14px] leading-[21px] text-center my-[ px]">
          Translation Allowed By
        </h2>
        <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
        <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
          {/* {allowedUserData?.firstName} {allowedUserData?.lastName}
           */}
          {transaction?.translationAllowedBy?.first_name}{" "}{transaction?.translationAllowedBy?.last_name}
        </div>
      </div>

      {/* Translated For */}
      <div className="flex flex-col col-span-3">
        <h2 className="font-[500] text-[14px] leading-[21px] text-center my-[ px]">
          Translated For
        </h2>
        <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" />
        <div className="font-[400] text-[14px] leading-[21px] text-[#616161] text-center my-[9px]">
          {/* {userData?.firstName} {userData?.lastName} */}
          {transaction?.translatedFor?.first_name}{" "}{transaction?.translatedFor?.last_name}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex flex-col">
        <div className="h-[21px]" />
        <div className="h-[2px] mt-[4px] w-[86%] mx-auto " />
        <div className="my-[4px] text-center">
          <button
            className={`bg-[#33B0CA] text-[#fafafa] rounded-[8px] leading-[24px] px-[18px] text-[12px] font-[700]`}
          >
            View
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EachTranslateeCard;
