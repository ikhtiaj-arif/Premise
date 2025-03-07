import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import walletDoodle from "../../../../img/wallet_doodle.png";
import { getLanguageName } from "../../utilityFuncitons/functions";
import CongratsPopup from "../CongratsPopup";

const ApproveTranslationPop = ({
  popClose,
  translationRequests,
  bankDetails,
  premiseId,
  parentClose,
  setSelectedRequests,
  selectedRequests,
  setCongratsPopup,
  congratsPopup,
  handleProceed,
  loading,
}) => {
  const [selectedUserNames, setSelectedUserNames] = useState([]);

  // Handle checkbox selection
  const handleCheckboxChange = (id, name) => {
    setSelectedRequests(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((reqId) => reqId !== id) // Deselect if already selected
          : [...prevSelected, id] // Add to selection
    );
    setSelectedUserNames((prevNames) =>
      prevNames.includes(name)
        ? prevNames.filter((userName) => userName !== name)
        : [...prevNames, name]
    );
  };

  // Close all popups
  const closeAllPopups = () => {
    parentClose(false);
    popClose(false);
  };

  console.log("object", translationRequests);
  // Handle Proceed button click

  return congratsPopup ? (
    <CongratsPopup
      popClose={closeAllPopups}
      selectedRequests={selectedRequests}
      selectedUserNames={selectedUserNames}
      requestType="translation"
    />
  ) : (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <ToastContainer />
      <div className="h-[100vh] lg:h-[407px] mb-[20px] px-[22px] lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA] lg:w-[605px] md:mx-auto relative lg:rounded-[8px]">
        {/* Close Popup */}
        <img
          src={crossIcon}
          alt="Close"
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer"
          onClick={() => popClose(false)}
        />
        <div className="h-[96px]">
          <div className="relative w-[100px] mx-auto mt-2">
            <img
              // src={premiseImage}
              src={`https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png`}
              alt="premise doodle"
              className="w-[103.07px] h-[103.72px] md:w-[115.07px] ml-[10px] md:ml-[0px]"
            />
            <img
              // src={premiseImage}
              src={walletDoodle}
              alt="premise doodle"
              className="w-[51px] h-[77px] absolute bottom-[3px] right-[-36px]"
            />
          </div>
        </div>
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Your Premise Project is Up for Monetizing
        </h2>
        <div className="h-[1px] mt-[8px] w-[65%] mx-auto bg-[#a1a1a1]" />
        <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
          Tick the following request for allowing translation of this Premise
          Project.
        </p>
        <div className="mt-[12px] h-[176px] overflow-y-auto">
          <div className="w-[70%] mx-auto mt-[20px]">
            {/* Header */}
            <div className="grid grid-cols-12 items-center gap-[18px]">
              <div className="col-span-2"></div>
              <div className="col-span-4">
                <h2 className="font-[500] text-[14px] leading-[19.9px] text-center">
                  Language
                </h2>
                <div className="h-[1px] mt-[4px] mb-[8px] w-[100%] mx-auto bg-[#a1a1a1]" />
              </div>
              <div className="col-span-6">
                <h2 className="font-[500] text-[14px] leading-[19.9px] text-center">
                  Translation Requested By
                </h2>
                <div className="h-[1px] mt-[4px] mb-[8px] w-[86%] mx-auto bg-[#a1a1a1]" />
              </div>
            </div>

            {/* Dynamic Rows */}
            {translationRequests?.map((request, index) => (
              <div
                className="grid grid-cols-12 gap-[18px] w-[100%] mx-auto mt-[4px]"
                key={request.id}
              >
                {/* Checkbox column */}
                <div className="col-span-2 flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="h-[20px] w-[20px]"
                    value={request.id}
                    checked={selectedRequests.includes(request.id)}
                    onChange={() =>
                      handleCheckboxChange(
                        request.id,
                        `${request.fromUser.first_name} ${request.fromUser.last_name}`
                      )
                    }
                  />
                </div>

                {/* Translation Requested By column */}
                <div className="col-span-4 flex items-center justify-center">
                  <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
                    <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
                      {/* Displaying the language name */}
                      {getLanguageName(request.requestToLang)}
                    </p>
                  </p>
                </div>

                {/* Language column */}
                <div className="col-span-6 flex items-center justify-center">
                  <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
                    {request.fromUser.first_name ? (
                      <>
                        {request.fromUser.first_name}{" "}
                        {request.fromUser.last_name}
                      </>
                    ) : (
                      <>{request.fromUser.email.split("@")[0]}</>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[88px] mx-auto  ">
          <button
            onClick={handleProceed}
            disabled={selectedRequests.length === 0 || loading}
            className={`${
              selectedRequests.length === 0 || loading
                ? "bg-[#ACDDE7] "
                : "bg-[#33B0CA] "
            } text-[#fafafa] rounded-[8px] leading-[24px] px-[20px] py-1 text-[13px] font-[600]`}
          >
            {loading ? "Processing..." : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveTranslationPop;
