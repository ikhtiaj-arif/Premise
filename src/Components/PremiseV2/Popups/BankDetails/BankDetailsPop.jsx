import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetBankDetailsQuery,
  useGetOnePremiseQuery,
  useGetSaleTranslationRequestQuery,
  useUpdateRequestForSaleOrTranslateMutation,
} from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import walletDoodle from "../../../../img/wallet_doodle.webp";
import TypingLoader from "../../../TypingLoader";
import { getLanguageName } from "../../utilityFuncitons/functions";
import ApproveTranslationPop from "./ApproveTranslation";

const BankDetailsPop = ({ popClose, premiseId, user, fromNew }) => {
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

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(premiseId);

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
    // <div className="fixed top-0 left-0 bottom-0 w-full h-full flex items-end sm:items-center   bg-[#252525b0] justify-center z-[21] ">
    //   {/* <ToastContainer /> */}
    //   <div
    //     className={`h-[77vh] ${
    //       showBankDetails ? " sm:h-[497px]" : "sm:h-[540px] xxl:h-[734px] "
    //     } px-[22px] lg:mb-0 pt-2 md:pt-8 ${
    //       fromNew ? "lg:mt-[-20px]" : "lg:mt-[85px]"
    //     } xl:mt-[85px] w-full bg-[#fff] max-w-[625px]  mx-auto relative rounded-[8px] pb-3 `}
    //   >
    //     {/* close popup */}
    //     <div className="absolute top-[-49px] sm:top-[-12px] right-[45%] ml-4 lg:ml-0 sm:right-[-15px]">
    //       <img
    //         src={crossIcon}
    //         alt=""
    //         className=" text-red-500  w-8 h-8 cursor-pointer"
    //         onClick={() => popClose(null)}
    //       />
    //     </div>
    //     <div className="relative mx-auto w-[96px] md:w-[116px] ">
    //       <img
    //         // src={premiseImage}
    //         src={`https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png`}
    //         alt="premise doodle"
    //         className=" w-[61.71px] md:w-[81.71px]  h-[57.45px]  md:h-[77.45px]  ml-[10px] md:ml-[0px]"
    //       />
    //       <img
    //         // src={premiseImage}
    //         src={walletDoodle}
    //         alt="premise doodle"
    //         className="w-[26.24px] h-[44.71px] md:w-[36.24px] md:h-[54.71px] absolute bottom-[3px] right-[8px]"
    //       />
    //     </div>

    //     <h2 className="font-[600] text-[14px] md:text-[16px] leading-[16.6px] md:leading-[19.9px] text-center mt-[18px]">
    //       Your Premise Project is Up for Monetizing
    //     </h2>
    //     <div className="h-[1px] mt-[8px] w-[52%] mx-auto bg-[#a1a1a1]" />

    //     <div className="overflow-x-hidden  h-[calc(100%-125px)]">
    //       {!showBankDetails ? (
    //         <div className="pr-[12px] mt-[17px] w-[100%] mx-auto max-w-[542px]  md:ml-[40px]">
    //           <div className="overflow-y-auto h-[calc(80%-125px)]">
    //             <p className="text-left text-[14px] leading-[21px] font-[400] text-[#616161]">
    //               <span>
    //                 {translationRequest?.data
    //                   ?.filter((request) => request.requestApproved === false)
    //                   ?.map((request) => {
    //                     const { first_name, last_name, username } =
    //                       request.fromUser;
    //                     const displayName = first_name
    //                       ? `${first_name} ${last_name || ""}`.trim()
    //                       : username?.split("@")[0]; // Extracts part before "@"
    //                     return displayName;
    //                   })
    //                   .join(", ")}
    //               </span>{" "}
    //               {translationRequest?.data?.length === 1 ? "is" : "are"}{" "}
    //               interested in copying this Premise Project in{" "}
    //               <span>
    //                 {translationRequest?.data
    //                   ?.filter((request) => request.requestApproved === false)
    //                   ?.map((request) =>
    //                     getLanguageName(request?.requestToLang)
    //                   )
    //                   .join(", ")}
    //               </span>
    //               .
    //             </p>
    //             <p className="text-left text-[14px] leading-[21px]  font-[400] my-[2px] text-[#616161] ">
    //               If you allow translation of this Premise Project,
    //             </p>
    //             <ul className="ml-[24px]">
    //               <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                 You will receive $
    //                 <span>{premiseData?.pqr_value?.toFixed(2)}</span> for each
    //                 translation
    //               </li>
    //               <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                 All components of the Premise Project viz Premise, comments,
    //                 replies, brainstorms, suggestions, etc will be translated in
    //                 the requested Languages.
    //               </li>
    //               <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                 The translated copy of the Premise Project will be posted in
    //                 Premise Pool as translator's Premise.
    //               </li>
    //               <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                 The translator will be able to
    //               </li>
    //               <ul className="ml-[24px] mt-[6px]">
    //                 <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                   Reset the visibility settings of the Language Premise
    //                   Project
    //                 </li>
    //                 <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                   Brainstorm further on the Language Premise and add comment
    //                   etc to the Beat Sheet.
    //                 </li>
    //                 <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                   Delete the Language Premise Project.
    //                 </li>
    //                 <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                   Make Copies of the Language Premise Project in other
    //                   languages and post them in the Premise Pool.
    //                 </li>
    //                 <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                   Monetize the translated Premise Project by allowing it’s
    //                   further translation at a higher price. (In such a case,
    //                   you will receive 15% of the incremental sale proceeds as
    //                   royalty.)
    //                 </li>
    //               </ul>
    //             </ul>
    //           </div>
    //           <div className="mt-[10px]">
    //             {/* <p className="text-left text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
    //             If you are wiling to allow translation of the Premise Project,
    //             Please share your bank details bellow :
    //           </p> */}

    //             <div className="flex items-center gap-2 mt-[20px]">
    //               <div>
    //                 <input
    //                   className="h-[20px] w-[20px] cursor-pointer"
    //                   type="checkbox"
    //                 />
    //               </div>
    //               <p className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
    //                 Change my Monetizing Preferences and allow translation of
    //                 this Premise Project in other languages also.
    //               </p>
    //             </div>
    //             <div className="flex justify-center items-center gap-[18px] mx-auto mt-[16px]">
    //               <button
    //                 onClick={() => setShowBankDetails(true)}
    //                 className={`${"bg-[#33B0CA]"} text-[#fafafa] rounded-[4px] leading-[18px] md:leading-[24px] px-[20px] py-[2px]  text-[12px] md:text-[14px] font-[600]`}
    //               >
    //                 Submit details of bank account
    //               </button>
    //               {bankDetailsAvailable?.data && (
    //                 <button
    //                   onClick={() => setShowTransRequests(true)}
    //                   className={`${"text-[#33B0CA]"} border-b border-[#33B0CA] leading-[18px]  md:leading-[24px] px-[20px] py-[2px] text-[12px] md:text-[14px] font-[600] w-fit`}
    //                 >
    //                   Select
    //                 </button>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div
    //           id="bank_details"
    //           className="flex flex-col gap-[6px] mt-[8px] w-[386px] md:ml-[76px]"
    //         >
    //           <p className="text-[14px] leading-[16.8px] text-[#252525] font-[600] py-[12px]">
    //             Please provide your bank details below :
    //           </p>
    //           {[
    //             { label: "Bank Name", name: "bank_name", required: true },
    //             {
    //               label: "Account Holder",
    //               name: "account_holder",
    //               required: true,
    //             },
    //             {
    //               label: "Account Number",
    //               name: "account_number",
    //               required: true,
    //             },
    //             { label: "IFSC Code", name: "ifsc_code", required: true },
    //             { label: "SWIFT Code", name: "swift_code", required: false },
    //           ].map(({ label, name, required }) => (
    //             <div className="flex justify-between items-center" key={name}>
    //               <label
    //                 className="text-[14px] leading-[16.8px] text-[#252525] font-[500]"
    //                 htmlFor={name}
    //               >
    //                 {label}
    //                 {required && (
    //                   <>
    //                     :<span className="text-red-500"> *</span>
    //                   </>
    //                 )}
    //               </label>
    //               <input
    //                 name={name}
    //                 placeholder={label.toLowerCase()}
    //                 type="text"
    //                 value={bankDetails[name] || ""}
    //                 onChange={handleInputChange}
    //                 className="w-[252px] h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
    //                 maxLength={name === "ifsc_code" ? 11 : undefined}
    //                 pattern="[A-Za-z0-9]*"
    //                 title={
    //                   name === "ifsc_code"
    //                     ? "IFSC Code must be exactly 11 alphanumeric characters"
    //                     : "Only alphanumeric characters are allowed"
    //                 }
    //                 required={required}
    //               />
    //             </div>
    //           ))}
    //           <button
    //             onClick={handleProceed}
    //             disabled={!isFormValid}
    //             className={`${
    //               !isFormValid
    //                 ? "bg-[#ACDDE7]  cursor-not-allowed"
    //                 : "bg-[#33B0CA]"
    //             } w-[88px] mt-[20px] mx-auto text-[#fafafa] rounded-[8px] leading-[24px] px-[12px] py-[2px] text-[13px] font-[600]`}
    //           >
    //             Proceed
    //           </button>
    //         </div>
    //       )}
    //       {showTransRequests && !isTransLoading && (
    //         <ApproveTranslationPop
    //           popClose={setShowTransRequests}
    //           parentClose={popClose}
    //           translationRequests={translationRequest?.data}
    //           bankDetails={bankDetails}
    //           premiseId={premiseId}
    //           setSelectedRequests={setSelectedRequests}
    //           selectedRequests={selectedRequests}
    //           setCongratsPopup={setCongratsPopup}
    //           congratsPopup={congratsPopup}
    //           handleProceed={handleProceed}
    //           loading={loading}
    //         />
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 w-full h-full flex items-end sm:items-center  justify-center bg-[#252525b0] z-[21]">
      <div className="relative sm:mt-20">
        {/* close button */}
        <div className="absolute z-20 top-[-49px] sm:top-[-12px] right-[45%] ml-4 lg:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <div
          className={`
      w-full max-w-[625px] 
      h-[77vh]  max-h-[663px] 
      bg-white rounded-t-[12px] sm:rounded-[12px] 
      overflow-hidden relative flex flex-col
      mx-auto 
      transition-all
    `}
        >
          {/* header doodle */}
          <div className="relative mx-auto mt-8 sm:mt-6 w-[90px] md:w-[116px]">
            <img
              src="https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png"
              alt="premise doodle"
              className="w-[65px] md:w-[82px] h-[60px] md:h-[78px] mx-auto"
            />
            <img
              src={walletDoodle}
              alt="wallet doodle"
              className="w-[28px] h-[45px] md:w-[36px] md:h-[55px] absolute bottom-[2px] right-[5px]"
            />
          </div>

          {/* title */}
          <h2 className="text-center font-semibold text-[15px] md:text-[17px] mt-3 px-4">
            Your Premise Project is Up for Monetizing
          </h2>
          <div className="h-[1px] w-1/2 mx-auto bg-gray-300 my-2" />

          {/* scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-20">
            {!showBankDetails ? (
              <>
                {/* translation request text */}
                <div className="text-sm text-gray-600 leading-6 ">
                  <p>
                    <span>
                      {translationRequest?.data
                        ?.filter((r) => !r.requestApproved)
                        ?.map((r) => {
                          const { first_name, last_name, username } =
                            r.fromUser;
                          return first_name
                            ? `${first_name} ${last_name || ""}`.trim()
                            : username?.split("@")[0];
                        })
                        .join(", ")}
                    </span>{" "}
                    {translationRequest?.data?.length === 1 ? "is" : "are"}{" "}
                    interested in copying this Premise Project in{" "}
                    <span>
                      {translationRequest?.data
                        ?.filter((r) => !r.requestApproved)
                        ?.map((r) => getLanguageName(r?.requestToLang))
                        .join(", ")}
                    </span>
                    .
                  </p>

                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                      You will receive $
                      <span>{premiseData?.pqr_value?.toFixed(2)}</span> for each
                      translation
                    </li>
                    <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                      All components of the Premise Project viz Premise,
                      comments, replies, brainstorms, suggestions, etc will be
                      translated in the requested Languages.
                    </li>
                    <li className="text-left text-[14px] leading-[21px] font-[400]  text-[#616161] list-disc">
                      The translated copy of the Premise Project will be posted
                      in Premise Pool as translator's Premise.
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
                        Brainstorm further on the Language Premise and add
                        comment etc to the Beat Sheet.
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
                        further translation at a higher price. (In such a case,
                        you will receive 15% of the incremental sale proceeds as
                        royalty.)
                      </li>
                    </ul>
                  </ul>
                </div>

                {/* buttons */}
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setShowBankDetails(true)}
                    className="bg-[#33B0CA] text-white rounded-md px-4 py-2 text-sm font-semibold"
                  >
                    Submit bank details
                  </button>
                  {bankDetailsAvailable?.data && (
                    <button
                      onClick={() => setShowTransRequests(true)}
                      className="text-[#33B0CA] border-b border-[#33B0CA] text-sm font-semibold"
                    >
                      Select
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-3 flex flex-col gap-[6px]  w-[386px] sm:mx-20">
                <p className="text-sm font-semibold text-gray-800">
                  Please provide your bank details below:
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
                  <div
                    key={name}
                    className="flex  items-center justify-between gap-1"
                  >
                    <label className="text-sm font-medium text-gray-700">
                      {label}
                      {required && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      name={name}
                      value={bankDetails[name] || ""}
                      onChange={handleInputChange}
                      placeholder={label}
                      className="w-full max-w-[252px] border rounded-md px-3 py-2  text-sm"
                      // className=" h-[30px] border rounded-[4px] px-[12px] text-[14px] font-[400]"
                    />
                  </div>
                ))}
                <button
                  onClick={handleProceed}
                  disabled={!isFormValid}
                  className={`w-full max-w-[252px] mx-auto mt-4 rounded-md py-2 text-sm font-semibold ${
                    !isFormValid
                      ? "bg-[#ACDDE7] cursor-not-allowed text-white"
                      : "bg-[#33B0CA] text-white"
                  }`}
                >
                  Proceed
                </button>
              </div>
            )}

            {/* child popup */}
            {showTransRequests && (
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
    </div>
  );
};

export default BankDetailsPop;
