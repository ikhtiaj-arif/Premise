import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetOnePremiseQuery } from "../../../app/EndPoints/premisePoolApi";
import Popup from "../../Premisepool/Popup";
import { getLanguageName } from "../utilityFuncitons/functions";
import NoPremisePop from "./alerts/NoPremisePop";

const EachTranslateeCard = ({
  transaction,
  popCloseCmnt,
  handleVisibility,
  handleMonetizing,
  refetch,
  viewText,
  project_id,
}) => {
  const user = useSelector((state) => state.user.id);
  // console.log("transaction", transaction);
  // const { data: userData, isLoading } = useGetUserByUserIdQuery(
  //   transaction?.translatedFor.id?.id
  // );
  // const { data: allowedUserData, isAUserLoading } = useGetUserByUserIdQuery(
  //   transaction?.translationAllowedBy?.id
  // );

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(transaction?.translatedToPremiseID);
  // console.log("object", premiseData);

  const lang = getLanguageName(transaction?.translatedIn);
  const [popup, setPopUp] = useState(false);
  const [noPremise, setNoPremise] = useState(false);

  const popClose = () => {
    setPopUp(false);
  };

  const formattedDate = new Date(premiseData?.created_at).toLocaleDateString(
    "en-US",
    {
      // timeZone: "GMT",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      // weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  const formattedTime = new Date(premiseData?.created_at).toLocaleTimeString(
    "en-US",
    {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: "numeric",
      minute: "numeric",
    }
  );

  const data = premiseData
    ? {
        stylings: premiseData?.text?.includes("+")
          ? JSON.parse(premiseData?.text?.split("+")[0])
          : {}, // Default to an empty object if `text` is undefined or improperly formatted
        bg_color: premiseData?.bg_color || "",
        premiseOwner: transaction?.translatedFor,
        bg_img: premiseData?.bg_img || "",
        comments: premiseData?.comments || [],
        created_at: premiseData?.created_at || "",
        likes: premiseData?.likes || 0,
        user,
        id: premiseData?.id || "",
        source_language: premiseData?.source_language || "",
        updated_at: premiseData?.updated_at || "",
        dText: premiseData?.text?.includes("+")
          ? premiseData?.text?.split("+")[1]
          : "",
        // viewText: premiseData?.text?.includes("+")
        //   ? premiseData?.text?.split("+")[1]
        //   : "",
        project_id: premiseData?.project_id || "",
        m_value: premiseData?.m_value || "",
        formattedTime,
        formattedDate,
      }
    : {};

  const handleViewPremise = () => {
    if (premiseData?.hidden || !premiseData) {
      if (user !== premiseData?.premiseOwner?.id) {
        setNoPremise(true);
      } else {
        setPopUp(true);
      }
    } else {
      setPopUp(true);
    }
  };
  return (
    <React.Fragment>
      {popup && premiseData && (
        <Popup
          refetch={premiseRefetch}
          {...{
            popClose,
            handleVisibility,
            handleMonetizing,
          }}
          data={data}
        />
        // : (
        //   <div className="fixed top-0 left-0 w-full h-full flex items-center lg:mt-[0px] bg-[#252525b0] justify-center z-[999]">
        //     <div
        //       className=" h-[30vh] lg:h-auto mb-[20px] px-[22px] lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]
        // md:w-[405px] md:mx-auto relative md:rounded-[8px]"
        //     >
        //       <div className="absolute top-[-76px] md:top-[-12px] right-[45%] ml-4 sm:ml-0 md:right-[-15px]">
        //         <button
        //           onClick={() => popClose(null)}
        //           className=" bg-[#EE3C4D] text-white rounded-full w-8 h-8  items-center justify-center shadow"
        //         >
        //           ✕
        //         </button>
        //       </div>
        //       <div className="px-[14px] md:px-[20px] py-12 md:py-[20px]">
        //         <h1 className="text-[14px] md:text-[16px] text-center">
        //           The requested premise has been deleted!
        //         </h1>
        //       </div>
        //     </div>
        //   </div>
        // )
      )}

      {noPremise && <NoPremisePop popClose={() => setNoPremise(false)} />}

      {/* Translated In */}
      <div className="flex flex-col col-span-2 md:col-span-3 h-7">
        {/* <h2 className="font-[500] text-[12px] md:text-[14px] leading-[14px] md:leading-[21px] text-center my-[ px]">
          Translated In
        </h2> */}
        {/* <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" /> */}
        <div className="font-[400] text-[12px] md:text-[14px] leading-[14px] md:leading-[21px] text-[#616161] text-center my-[9px]">
          {lang}
        </div>
      </div>

      {/* Translation Allowed By */}
      <div className="flex flex-col col-span-4 h-7">
        {/* <h2 className="font-[500] text-[12px] md:text-[14px] leading-[14px] md:leading-[21px] text-center ">
          Translation Allowed By
        </h2> */}
        {/* <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" /> */}
        <div className="font-[400] text-[12px] md:text-[14px] leading-[14px] md:leading-[21px] text-[#616161] text-center my-[9px]">
          {/* {allowedUserData?.firstName} {allowedUserData?.lastName}
           */}
          {transaction?.translationAllowedBy?.first_name}{" "}
          {transaction?.translationAllowedBy?.last_name}
        </div>
      </div>

      {/* Translated For */}
      <div className="flex flex-col col-span-3 h-7 ml-2 md:ml-0">
        {/* <h2 className="font-[500] text-[12px] md:text-[14px] leading-[14px] md:leading-[21px] text-center my-[ px]">
          Translated For
        </h2> */}
        {/* <div className="h-[2px] mt-[4px] w-[86%] mx-auto bg-[#a1a1a1]" /> */}
        <div className="font-[400] text-[12px] md:text-[14px] leading-[14px] md:leading-[21px] text-[#616161] text-center my-[9px]">
          {/* {userData?.firstName} {userData?.lastName} */}
          {transaction?.translatedFor?.first_name}{" "}
          {transaction?.translatedFor?.last_name}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex flex-col h-7 ml-2 md:ml-0">
        <div className="h-[21px]" />
        {/* <div className="h-[2px] mt-[4px] w-[86%] mx-auto " /> */}
        <div className="my-[4px] text-center ">
          <button
            onClick={handleViewPremise}
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
