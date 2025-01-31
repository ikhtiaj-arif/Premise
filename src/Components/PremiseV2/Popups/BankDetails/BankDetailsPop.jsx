import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useGetSaleTranslationRequestQuery } from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import walletDoodle from "../../../../img/wallet_doodle.png";
import ApproveTranslationPop from "./ApproveTranslation";

const BankDetailsPop = ({ popClose, premiseId }) => {
  // console.log(premiseId);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showTransRequests, setShowTransRequests] = useState(false);

  const data = {
    id: premiseId,
    type: "Translation",
  };

  const { data: translationRequest, isTransLoading } =
    useGetSaleTranslationRequestQuery(data);
  console.log(translationRequest);

  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    account_holder: "",
    ifsc_code: "",
    swift_code: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleProceed = () => {
    setShowTransRequests(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
      <ToastContainer />
      <div
        className={` h-[100vh] ${
          showBankDetails ? " lg:h-[497px]" : " lg:h-[734px]"
        } mb-[20px] px-[22px] lg:mb-0 pt-[32px] lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff]   lg:w-[625px]  md:mx-auto relative lg:rounded-[8px]`}
      >
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />
        <div className="relative mx-auto w-[116px] ">
          <img
            // src={premiseImage}
            src={`https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png`}
            alt="premise doodle"
            className="w-[81.71px] h-[77.45px]  ml-[10px] md:ml-[0px]"
          />
          <img
            // src={premiseImage}
            src={walletDoodle}
            alt="premise doodle"
            className="w-[36.24px] h-[54.71px] absolute bottom-[3px] right-[8px]"
          />
        </div>
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Your Premise Project is Up for Monetizing
        </h2>
        <div className="h-[1px] mt-[8px] w-[52%] mx-auto bg-[#a1a1a1]" />
        {!showBankDetails ? (
          <div className="pr-[12px] mt-[17px] w-[542px]  ml-[40px]">
            <p className="text-left text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
              User name 1, 2, 3 is/are interested in copying this Premise
              Project in Language 1, 2, 3.
            </p>
            <p className="text-left text-[14px] leading-[21px]  font-[400] my-[2px] text-[#616161] ">
              If you allow translation of this Premise Project,
            </p>
            <ul className="ml-[24px]">
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                You will receive $PQRX2 / 3 for each translation
              </li>
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                All components of the Premise Project viz Premise, comments,
                replies, brainstorms, suggestions, etc will be translated in the
                requested Languages.
              </li>
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                The translated copy of the Premise Project will be posted in
                Premise Pool as translator's Premise.
              </li>
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                The translator will be able to
              </li>
              <ul className="ml-[24px] mt-[6px]">
                <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                  Reset the visibility settings of the Language Premise Project
                </li>
                <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                  Brainstorm further on the Language Premise and add comment etc
                  to the Beat Sheet.
                </li>
                <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                  Delete the Language Premise Project.
                </li>
                <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                  Make Copies of the Language Premise Project in other languages
                  and post them in the Premise Pool.
                </li>
                <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                  Monetize the translated Premise Project by allowing it’s
                  further translation at a higher price. (In such a case, you
                  will receive 15% of the incremental sale proceeds as royalty.)
                </li>
              </ul>
            </ul>
            <div className="mt-[10px]">
              {/* <p className="text-left text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
                If you are wiling to allow translation of the Premise Project,
                Please share your bank details bellow :
              </p> */}

              <div className="flex items-center mt-[20px]">
                <input className="h-[20px] w-[20px] mr-[6px]" type="checkbox" />
                <p className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                  Change my Monetizing Preferences and allow translation of this
                  Premise Project in other languages also.
                </p>
              </div>
              <div className="flex items-center gap-[18px] w-[320px] mx-auto mt-[42px]">
                <button
                  onClick={() => setShowBankDetails(true)}
                  className={`${"bg-[#33B0CA]"}  text-[#fafafa] rounded-[8px] leading-[24px] px-[20px] py-[2px] text-[13px] font-[600] `}
                >
                  Submit Details of bank account
                </button>
                <button
                  className={`${"text-[#33B0CA]"} border-b border-[#33B0CA]   leading-[24px] px-[20px] py-[2px] text-[13px] font-[600] `}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="bank_details"
            className="flex flex-col gap-[6px] mt-[8px] w-[386px] md:ml-[76px]"
          >
            <p className="text-[14px] leading-[16.8px] text-[#252525] font-[600] py-[12px]">
              Please provide your bank details below :
            </p>
            <div className="flex justify-between items-center">
              <label
                className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
                htmlFor="bank_name"
              >
                Bank Name:
              </label>
              <input
                name="bank_name"
                placeholder="bank name"
                type="text"
                value={bankDetails.bank_name}
                onChange={handleInputChange}
                className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
                htmlFor="account_holder"
              >
                Account Holder:
              </label>
              <input
                name="account_holder"
                placeholder="account holder"
                type="text"
                value={bankDetails.account_holder}
                onChange={handleInputChange}
                className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
                htmlFor="account_number"
              >
                Account Number:
              </label>
              <input
                name="account_number"
                placeholder="account number"
                type="text"
                value={bankDetails.account_number}
                onChange={handleInputChange}
                className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
                htmlFor="ifsc_code"
              >
                IFSC Code:
              </label>
              <input
                name="ifsc_code"
                placeholder="ifsc code"
                type="text"
                value={bankDetails.ifsc_code}
                onChange={handleInputChange}
                className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
                htmlFor="swift_code"
              >
                SWIFT Code:
              </label>
              <input
                name="swift_code"
                placeholder="swift code"
                type="text"
                value={bankDetails.swift_code}
                onChange={handleInputChange}
                className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
              />
            </div>
            <button
              onClick={handleProceed}
              className={`${"bg-[#33B0CA]"} w-[88px] mt-[20px] mx-auto text-[#fafafa] rounded-[8px] leading-[24px] px-[12px] py-[2px] text-[13px] font-[600] `}
            >
              Proceed
            </button>
          </div>
        )}
        {showTransRequests && !isTransLoading && (
          <ApproveTranslationPop
            popClose={setShowTransRequests}
            translationRequests={translationRequest?.data}
            bankDetails={bankDetails}
            premiseId={premiseId}
          />
        )}
      </div>
    </div>
  );
};

export default BankDetailsPop;
