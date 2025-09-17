import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRejectPurchaseRequestMutation } from "../../../app/EndPoints/Characters/Characters";
import {
  useEditPremiseMutation,
  useGetBankDetailsQuery,
  useGetOnePremiseQuery,
  useGetSaleTranslationRequestQuery,
  useUpdateRequestForSaleOrTranslateMutation,
} from "../../../app/EndPoints/premisePoolApi";
import Congrats from "../../../img/Icons/CongratsSaleDoodle.svg";
import crossIcon from "../../../img/Icons/crossIcon.png";
import SaleDoodle from "../../../img/Icons/OwnerSaleDoodle.svg";

const SaleRequestedOwner = ({ popClose, premiseId, user }) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [sale, setSale] = useState(false);

  const [updateSaleRequests, { isLoading: isSaleLoading }] =
    useUpdateRequestForSaleOrTranslateMutation();

  const { data: bankDetailsAvailable, isLoading: bankDetailsLoading } =
    useGetBankDetailsQuery(user);

  const data = {
    id: premiseId,
    type: "Sale",
  };

  const { data: saleRequest, isTransLoading } =
    useGetSaleTranslationRequestQuery(data);

  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    account_holder: "",
    ifsc_code: "",
    swift_code: "",
  });

  // If bankDetailsAvailable exists, pre-fill the bank details
  useEffect(() => {
    if (bankDetailsAvailable?.data) {
      setBankDetails({
        bank_name: bankDetailsAvailable.data.bank_name || "",
        account_number: bankDetailsAvailable.data.account_number || "",
        account_holder: bankDetailsAvailable.data.account_holder || "",
        ifsc_code: bankDetailsAvailable.data.ifsc_code || "",
        swift_code: bankDetailsAvailable.data.swift_code || "",
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

  const request = saleRequest?.data[0];
  const requestId = request?.id;
  const fromUser = request?.fromUser;

  const handleProceed = async () => {
    const data = {
      premise_id: premiseId,
      bank_details: JSON.stringify(bankDetails),
      request_ids: JSON.stringify([requestId]),
    };
    try {
      const res = await updateSaleRequests(data);
      setSale(true);
      console.log("Sale Requests:", res);
      setShowCongratsPopup(true);
    } catch (err) {
      console.log(err);
    }
  };

  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectRequest] = useRejectPurchaseRequestMutation();
  const handleReject = async () => {
    const data = {
      premise_id: premiseId,
    };

    setRejectLoading(true);
    try {
      const result = await rejectRequest(data);
      if (result) {
        toast.success("Purchase request rejected!");
        setRejectLoading(false);
        popClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to reject the request!");
      setRejectLoading(false);
    }
  };

  const [updatePremise, { isLoading: isUpdateLoading }] =
    useEditPremiseMutation();

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(premiseId);

  const [sellingPr, setSellingPr] = useState(premiseData?.sellingPrice);

  const isFormValid =
    bankDetails.bank_name &&
    bankDetails.account_holder &&
    bankDetails.account_number &&
    bankDetails.ifsc_code;

  const handleInputChangePrice = (e) => {
    setSellingPr(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sellingPr) {
      return;
    }
    updatePremise({
      id: premiseId,
      body: { sellingPrice: parseInt(sellingPr) },
    })
      .then((response) => {
        console.log(response);
        setShowBankDetails(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-end sm:items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />

      <div
        className={`h-[86vh] ${
          showCongratsPopup
            ? "lg:h-auto "
            : showBankDetails
            ? " sm:h-[497px]"
            : "sm:h-[670px] max-h-[86vh]"
        } mb-[20px] px-[22px] lg:mb-0 pt-2 lg:mt-[80px] xl:mt-[85px] w-full bg-[#fff] sm:w-[625px] md:mx-auto relative sm:rounded-[8px]`}
      >
        <div className="absolute top-[-56px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt="cross icon"
            className="w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        {!showCongratsPopup && (
          <>
            <div className="hidden sm:block">
              <div className="mx-auto w-[116px]">
                <img
                  src={SaleDoodle}
                  alt="premise doodle"
                  className="w-[81.71px] h-[77.45px] ml-[10px] md:ml-[0px]"
                />
              </div>
              <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
                Your Premise Project is Up for Monetizing
              </h2>
              <div className="h-[1px] mt-[8px] w-[52%] mx-auto bg-[#a1a1a1]" />
            </div>
            <div className="sm:hidden flex gap-2 justify-start w-3/4">
              <div className="mx-auto w-[64px]">
                <img
                  src={SaleDoodle}
                  alt="premise doodle"
                  className="w-[81.71px] h-[77.45px] ml-[10px] md:ml-[0px]"
                />
              </div>
              <div className="w-[75%] mr-auto">
                <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
                  Your Premise Project is Up for Monetizing
                </h2>
                <div className="h-[1px] mt-[8px] w-[82%] mx-auto bg-[#a1a1a1]" />
              </div>
            </div>
          </>
        )}
        <div className="overflow-x-hidden overflow-y-auto h-[calc(100%-125px)]">
          {!showBankDetails ? (
            <div className="sm:pr-[12px] sm:pl-4 mt-2 md:mt-[17px] w-full sm:w-[542px] md:ml-[40px]">
              <p className="text-left text-[14px] leading-[21px] font-[400] text-[#616161]">
                {fromUser?.first_name
                  ? `${fromUser.first_name} ${fromUser?.last_name || ""}`
                  : fromUser?.email?.split("@")[0]}{" "}
                is interested in buying this Premise Project. If you choose to
                sell this Premise Project
              </p>
              <ul className="ml-[24px]">
                <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                  The ownership of the Premise Project will be transferred to
                  the buyer.
                </li>
                <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                  The Premise Project will be visible in Premise Pool as buyer’s
                  Premise instead of you.
                </li>
                <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                  The buyer will be able to:
                  <ul className="w-[80%] ml-[30px]">
                    <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                      Reset the visibility settings
                    </li>
                    <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                      Brainstorm further on the Premise and add comment etc., to
                      the Beat Sheet.
                    </li>
                    <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                      Delete it
                    </li>
                    <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                      Post its copies in the Premise Pool in several languages
                    </li>
                    <li className="text-left text-[14px] leading-[21px] font-[400] text-[#616161] list-disc">
                      Monetize this Premise Project through sale or translation
                    </li>
                  </ul>
                </li>
              </ul>
              <form onSubmit={handleSubmit} className="mt-[10px]">
                <div className="flex items-center mt-2 md:mt-[20px]">
                  <p className="text-[14px] leading-[21px] font-[400] text-[#616161]">
                    If you are willing to transfer the ownership of the Premise
                    Project to the interested buyer, please set a price for the
                    transaction below.
                  </p>
                </div>
                <div className="flex items-center gap-[5px] w-[153px] md:w-[150px] mx-auto mt-2 md:mt-4 md:mb-2">
                  <p className="text-[14px] leading-[15px] font-[400] text-[#616161]">
                    ${" "}
                  </p>
                  <input
                    required
                    type="number"
                    placeholder="Please Quote"
                    className="flex-1 w-full h-[22px] border rounded-[4px] px-[12px] text-[11px] font-[400]  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none"
                    value={sellingPr}
                    onChange={handleInputChangePrice}
                  />
                </div>
                <p className="text-[#616161] text-[13px] italic leading-4 mt-2">
                  <span className="text-[17px] text-[#616161] italic"></span>
                  (Please Note that the price shown to the prospective buyer
                  will be 1.5 times the price quoted by you.)
                  <span className="text-[17px] text-[#616161] italic"></span>
                </p>
                <div className="flex flex-col md:flex-row pb-4 items-center gap-[12px] w-[100%] md:w-[377px] mx-auto mt-[20px]">
                  <button
                    type="submit"
                    disabled={!sellingPr || isUpdateLoading}
                    className={`${
                      !sellingPr || isUpdateLoading
                        ? "bg-[#ACDDE7]"
                        : "bg-[#33B0CA] "
                    } text-[#fafafa] ml-2 rounded-[4px] whitespace-nowrap leading-[24px] w-[80%]  px-[20px]  py-[2px] text-[13px] font-[600]`}
                  >
                    Submit Details of bank account
                  </button>
                  <button
                    disabled={rejectLoading}
                    onClick={handleReject}
                    className={` text-[#33B0CA] border border-[#33B0CA] bg-[#fafafa] rounded-[4px] whitespace-nowrap leading-[24px] w-[80%] px-[20px] ml-[10px] py-[2px] text-[13px] font-[600]`}
                  >
                    Reject Request
                  </button>
                </div>
              </form>
            </div>
          ) : !showCongratsPopup ? (
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
                    className="w-[252px] h-[30px] border border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none rounded-[4px] px-[12px] text-[14px] font-[400]"
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
          ) : (
            <div className="text-[#252525]">
              <div className="flex items-center justify-center">
                <img className="w-[100px] " src={Congrats} alt="Congrats" />
              </div>
              <h2 className="font-[600] text-[16px] text-center">
                Your Premise Project is Up for Monetizing
              </h2>
              <div className="h-[1px] mt-[4px] w-[340px] mx-auto bg-[#a1a1a1]" />
              <div className="text-left text-[14px] leading-[21px] font-[400] px-4 pt-6 pb-20">
                <p>
                  The monetizing preferences of the Premise Project are updated
                  and
                  {" " + fromUser?.first_name + " " + fromUser?.last_name} has
                  been informed
                </p>
                <p>
                  Your share of the sale proceeds will be transferred to your
                  bank account as soon as the sale is effected.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleRequestedOwner;
