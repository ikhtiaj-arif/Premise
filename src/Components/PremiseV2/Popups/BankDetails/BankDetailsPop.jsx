import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  useGetBankDetailsQuery,
  useGetSaleTranslationRequestQuery,
  useUpdateRequestForSaleOrTranslateMutation,
} from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import walletDoodle from "../../../../img/wallet_doodle.png";
import TypingLoader from "../../../TypingLoader";
import { getLanguageName } from "../../utilityFuncitons/functions";
import ApproveTranslationPop from "./ApproveTranslation";

const BankDetailsPop = ({ popClose, premiseId, user }) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showTransRequests, setShowTransRequests] = useState(false);
  const [congratsPopup, setCongratsPopup] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    account_holder: "",
    ifsc_code: "",
    swift_code: "",
  });

  const { data: bankDetailsAvailable, isLoading: bankDetailsLoading } =
    useGetBankDetailsQuery(user);
  console.log(bankDetailsAvailable);

  const data = {
    id: premiseId,
    type: "Translation",
  };

  const { data: translationRequest, isTransLoading } =
    useGetSaleTranslationRequestQuery(data);

  // Check if all mandatory fields are filled
  const isFormValid =
    bankDetails.bank_name &&
    bankDetails.account_holder &&
    bankDetails.account_number &&
    bankDetails.ifsc_code;

  useEffect(() => {
    if (bankDetailsAvailable?.data) {
      // If bank details are available, pre-fill the form
      setBankDetails({
        bank_name: bankDetailsAvailable?.data.bank_name || "",
        account_number: bankDetailsAvailable?.data.account_number || "",
        account_holder: bankDetailsAvailable?.data.account_holder || "",
        ifsc_code: bankDetailsAvailable?.data.ifsc_code || "",
        swift_code: bankDetailsAvailable?.data.swift_code || "",
      });
    }
  }, [bankDetailsAvailable]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [updateTranslationSale] = useUpdateRequestForSaleOrTranslateMutation();

  const handleProceed = async () => {
    if (!selectedRequests.length) {
      setShowTransRequests(true);
    } else {
      if (loading || selectedRequests.length === 0) return;

      setLoading(true); // Start loading

      const data = {
        premise_id: premiseId,
        bank_details: JSON.stringify(bankDetails),
        request_ids: JSON.stringify(selectedRequests),
      };

      try {
        const res = await updateTranslationSale(data);
        if (res?.data) {
          toast.success("Request Approved!");
          setCongratsPopup(true);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (isTransLoading || isTransLoading) return <TypingLoader />;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div
        className={`h-[60vh] ${
          showBankDetails ? " lg:h-[497px]" : " lg:h-[734px] max-h-[80vh]"
        } mb-[20px] px-[22px] lg:mb-0 pt-2 lg:mt-[80px] xl:mt-[85px] w-full bg-[#fff] lg:w-[625px]  md:mx-auto relative lg:rounded-[8px] pb-3`}
      >
        {/* close popup */}
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
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

        <div className="overflow-x-hidden overflow-y-auto h-[calc(100%-125px)]">
          {!showBankDetails ? (
            <div className="pr-[12px] mt-[17px] w-[542px]  ml-[40px]">
              <p className="text-left text-[14px] leading-[21px] font-[400] text-[#616161]">
                <span>
                  {translationRequest?.data
                    ?.filter((request) => request.requestApproved === false)
                    ?.map((request) => {
                      const { first_name, last_name, username } =
                        request.fromUser;
                      const displayName = first_name
                        ? `${first_name} ${last_name || ""}`.trim()
                        : username?.split("@")[0]; // Extracts part before "@"
                      return displayName;
                    })
                    .join(", ")}
                </span>{" "}
                {translationRequest?.data?.length === 1 ? "is" : "are"}{" "}
                interested in copying this Premise Project in{" "}
                <span>
                  {translationRequest?.data
                    ?.filter((request) => request.requestApproved === false)
                    ?.map((request) => getLanguageName(request?.requestToLang))
                    .join(", ")}
                </span>
                .
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
                  replies, brainstorms, suggestions, etc will be translated in
                  the requested Languages.
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
                    Reset the visibility settings of the Language Premise
                    Project
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Brainstorm further on the Language Premise and add comment
                    etc to the Beat Sheet.
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Delete the Language Premise Project.
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Make Copies of the Language Premise Project in other
                    languages and post them in the Premise Pool.
                  </li>
                  <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Monetize the translated Premise Project by allowing it’s
                    further translation at a higher price. (In such a case, you
                    will receive 15% of the incremental sale proceeds as
                    royalty.)
                  </li>
                </ul>
              </ul>
              <div className="mt-[10px]">
                {/* <p className="text-left text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
                If you are wiling to allow translation of the Premise Project,
                Please share your bank details bellow :
              </p> */}

                <div className="flex items-center mt-[20px]">
                  <input
                    className="h-[20px] w-[20px] mr-[6px]"
                    type="checkbox"
                  />
                  <p className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                    Change my Monetizing Preferences and allow translation of
                    this Premise Project in other languages also.
                  </p>
                </div>
                <div className="flex justify-center items-center gap-[18px] mx-auto mt-[16px]">
                  <button
                    onClick={() => setShowBankDetails(true)}
                    className={`${"bg-[#33B0CA]"} text-[#fafafa] rounded-[4px] leading-[24px] px-[20px] py-[2px] text-[14px] font-[600]`}
                  >
                    Submit Details of bank account
                  </button>
                  <button
                    onClick={() => setShowTransRequests(true)}
                    className={`${"text-[#33B0CA]"} border-b border-[#33B0CA]   leading-[24px] px-[20px] py-[2px] text-[13px] font-[600] w-fit`}
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
              {[
                { label: "Bank Name", name: "bank_name", required: true },
                {
                  label: "Account Holder",
                  name: "account_holder",
                  required: true,
                },
                {
                  label: "Account Number",
                  name: "account_number",
                  required: true,
                },
                { label: "IFSC Code", name: "ifsc_code", required: true },
                { label: "SWIFT Code", name: "swift_code", required: false },
              ].map(({ label, name, required }) => (
                <div className="flex justify-between items-center" key={name}>
                  <label
                    className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
                    htmlFor={name}
                  >
                    {label}
                    {required && (
                      <>
                        :<span className="text-red-500"> *</span>
                      </>
                    )}
                  </label>
                  <input
                    name={name}
                    placeholder={label.toLowerCase()}
                    type="text"
                    value={bankDetails[name] || ""}
                    onChange={handleInputChange}
                    className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
                    maxLength={name === "ifsc_code" ? 11 : undefined}
                    pattern="[A-Za-z0-9]*"
                    title={
                      name === "ifsc_code"
                        ? "IFSC Code must be exactly 11 alphanumeric characters"
                        : "Only alphanumeric characters are allowed"
                    }
                    required={required}
                  />
                </div>
              ))}
              <button
                onClick={handleProceed}
                disabled={!isFormValid}
                className={`${
                  !isFormValid
                    ? "bg-[#ACDDE7]  cursor-not-allowed"
                    : "bg-[#33B0CA]"
                } w-[88px] mt-[20px] mx-auto text-[#fafafa] rounded-[8px] leading-[24px] px-[12px] py-[2px] text-[13px] font-[600]`}
              >
                Proceed
              </button>
            </div>
          )}
          {showTransRequests && !isTransLoading && (
            <ApproveTranslationPop
              popClose={setShowTransRequests}
              parentClose={popClose}
              translationRequests={translationRequest?.data}
              bankDetails={bankDetails}
              premiseId={premiseId}
              setSelectedRequests={setSelectedRequests}
              selectedRequests={selectedRequests}
              setCongratsPopup={setCongratsPopup}
              congratsPopup={congratsPopup}
              handleProceed={handleProceed}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPop;
