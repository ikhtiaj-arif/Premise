import React, { useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

import mailCart from "../../../img/Icons/mailCart.png";
// import transCartQ from "../../../img/Icons/transCartQ.png";

const CardHeader = ({
  user,
  premiseOwner,
  profileImg,
  proImgUrl,
  userImg,
  formattedDate,
  formattedTime,
  currentProjectName,
  translation_request_count,
  transReqQ,
  translateCart,
  sourceIcn,
  mailCartQ,
  saleRequestedOwner,
  sale_request_count,
  handleViewTransaction,
  handlePremiseOpenNewTab,
  setViewTrnRequests,
  setViewSaleRequests,
  handleVisibility,
  handleMonetizing,
  handleDelete,
  setOpenCharacterChart,
  handleOpenSp,
  checkAllowance,
  setTranslationRequestPop,
  setSaleRequestPop,
  available_for_translation,
  available_for_sale,
  handleSale,
  msgIcon,
  handleUserMail,
}) => {
  const [openDotMenu, setOpenDotMenu] = useState(null);
  const dotPopupRef = useRef(null);

  return (
    <div className="w-[358px] lg:w-[100%] mx-auto border border-[#EAEAEA] hover:shadow-lg rounded-[8px]">
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-t-[8px] px-[15px] pt-[15px] pb-[6px]">
        <div>
          <a
            target="_blank"
            rel="noreferrer"
            href={
              premiseOwner?.id === user
                ? `/memberpage/#/personaldetails`
                : `/memberpage/#/user/${premiseOwner?.id}/personaldetails`
            }
          >
            <div className="flex items-center gap-2">
              <img
                src={profileImg?.[0]?.profile_photo ? proImgUrl : userImg}
                className="w-[36px] h-[35.9px] border border-[#eaeaea] rounded-full object-cover"
                alt="Profile"
              />
              <div>
                <h4 className="text-[#252525] font-[600] text-[14px] capitalize cursor-pointer hover:text-[#33B0CA]">
                  {premiseOwner?.first_name} {premiseOwner?.last_name}
                </h4>
                <p className="text-[#616161] text-[10px] font-[400]">
                  {formattedDate}, {formattedTime}
                </p>
                {premiseOwner?.id === user && (
                  <p className="text-[#252525] text-[12px]">
                    {currentProjectName?.slice(0, 20)}
                  </p>
                )}
              </div>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {premiseOwner?.id === user ? (
            <>
              {translation_request_count > 0 && (
                <span>{translation_request_count}</span>
              )}
              <img
                src={transReqQ}
                className="w-8 h-8 cursor-pointer"
                alt="Translation Requests"
                onClick={() => setViewTrnRequests()}
              />
              <img
                src={translateCart}
                className="w-8 h-8 cursor-pointer"
                alt="Translated Languages"
                onClick={handleViewTransaction}
              />
              {saleRequestedOwner && sale_request_count > 0 && (
                <span>{sale_request_count}</span>
              )}
              <img
                src={mailCartQ}
                className="w-9 h-9 cursor-pointer"
                alt="Sale Requested"
                onClick={() => setViewSaleRequests(true)}
              />

              <FaEllipsisV
                className="w-5 h-5 cursor-pointer"
                onClick={() => setOpenDotMenu((prev) => !prev)}
              />

              {openDotMenu && (
                <div
                  ref={dotPopupRef}
                  className="absolute w-[197px] bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[3px] py-[8px] z-10"
                >
                  <button
                    onClick={handleVisibility}
                    className="block w-full text-left p-2 hover:text-[#33B0CA]"
                  >
                    Visibility Settings
                  </button>
                  <button
                    onClick={handleMonetizing}
                    className="block w-full text-left p-2 hover:text-[#33B0CA]"
                  >
                    Monetizing Preferences
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left p-2 hover:text-[#33B0CA]"
                  >
                    Delete Premise
                  </button>
                  <button
                    onClick={handleOpenSp}
                    className="block w-full text-left p-2 hover:text-[#33B0CA]"
                  >
                    Open Script Pad
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {available_for_translation ? (
                <img
                  src={translateCart}
                  className="w-8 h-8 cursor-pointer"
                  alt="Available for Translation"
                  onClick={() => setOpenDotMenu(!openDotMenu)}
                />
              ) : (
                <img
                  src={transReqQ}
                  className="w-8 h-8 cursor-pointer"
                  alt="Send Translation Request"
                  onClick={() => checkAllowance(setTranslationRequestPop)}
                />
              )}
              {available_for_sale ? (
                <img
                  src={mailCart}
                  className="w-8 h-8 cursor-pointer"
                  alt="Available for Sale"
                  onClick={handleSale}
                />
              ) : (
                <img
                  src={mailCartQ}
                  className="w-9 h-9 cursor-pointer"
                  alt="Send Sale Request"
                  onClick={() => checkAllowance(setSaleRequestPop)}
                />
              )}
              <img
                src={msgIcon}
                className="w-8 h-8 cursor-pointer"
                alt="Send Message"
                onClick={handleUserMail}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
