import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useGetSaleTranslationRequestQuery } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import walletDoodle from "../../../img/wallet_doodle.png";
import ApproveTranslationPop from "./BankDetails/ApproveTranslation";
import SaleDoodle from "../../../img/Icons/OwnerSaleDoodle.svg";
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
          showBankDetails ? " lg:h-[497px]" : " lg:h-[670px]"
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
            src={SaleDoodle}
            // src="../../../img/Icons/OwnerSaleDoodle.svg"
            alt="premise doodle"
            className="w-[81.71px] h-[77.45px]  ml-[10px] md:ml-[0px]"
          />
         
        </div>
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Your Premise Project is Up for Monetizing
        </h2>
        <div className="h-[1px] mt-[8px] w-[52%] mx-auto bg-[#a1a1a1]" />
        {!showBankDetails ? (
          <div className="pr-[12px] mt-[17px] w-[542px]  ml-[40px]">
            <p className="text-left text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
              Username Is interested in Buying this Premise Project. If you
              choose to sell this Premise Project
            </p>

            <ul className="ml-[24px]">
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                The ownership of the Premise Project will be transferred to the
                buyer.
              </li>
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                The Premise Project will be visible in Premise Pool as buyer’s
                Premise instead of you.
              </li>
              <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                The buyer will be able to
                <ul className=" w-[75%] ml-[30px] ">
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Reset the visibility settings
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Brainstorm further on the Premise and add comment etc to the
                    Beat Sheet.
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Delete it,
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Post its copies in the Premise Pool in several languages
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Monetize this Premise Project through sale or translation
                  </li>
                </ul>
              </li>
            </ul>
            <div className="mt-[10px]">
              {/* <p className="text-left text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
                If you are wiling to allow translation of the Premise Project,
                Please share your bank details bellow :
              </p> */}

              <div className="flex items-center mt-[20px] ">
                <p className="text-[14px] leading-[21px] font-[400]  text-[#616161]">
                  If you are Wiling to transfer the ownership of the Premise
                  Project to the interested buyer, please set a price for the
                  transaction below.{" "}
                </p>
              </div>
              <div className="flex items-center gap-[5px] w-[150px] ml-[150px] mt-[22px]">
                <p className="text-[14px]  leading-[15px] font-[400]  text-[#616161]">
                  ${" "}
                </p>
                <input
                  type="text"
                  placeholder="Please Quote"
                  className="flex-1 h-[22px] border rounded-[4px] px-[12px] text-[11px] font-[400]"
                />
              </div>
              
              <p className="text-[#616161] text-[13px] italic"> <span className="text-[17px] text-[#616161] italic">(</span>Please Note that the price shown to the prospective buyer will be 1.5 times the price quoted by you.<span className="text-[17px] text-[#616161] italic">)</span></p>

              <div className="flex items-center gap-[18px] w-[320px] mx-auto mt-[20px]">
                <button
                  onClick={() => setShowBankDetails(true)}
                  className={`${"bg-[#33B0CA]"}  text-[#fafafa] rounded-[8px] whitespace-nowrap leading-[24px] px-[20px] ml-[10px] py-[2px] text-[13px] font-[600] `}
                >
                  Submit Details of bank account
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
