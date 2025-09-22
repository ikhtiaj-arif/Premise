import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  useEditPremiseMutation,
  useGetOnePremiseQuery,
} from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import SameNamePop from "./alerts/SameNamePop";

const MonetizePreferencePop = ({ popClose, id, user }) => {
  const [updatePremise, { isLoading }] = useEditPremiseMutation();
  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

  useEffect(() => {
    if (id) premiseRefetch();
  }, [id]);

  const [formData, setFormData] = useState({
    allowTranslation: false,
    transferOwnership: false,
    price: "",
  });

  const priceInputRef = useRef(null); // Reference for the price input field

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Focus on price input when the second checkbox is selected
  useEffect(() => {
    if (formData.transferOwnership && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [formData.transferOwnership]);
  const [alert, setAlert] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { allowTranslation, transferOwnership, price } = formData;

    if (transferOwnership && !price) {
      setAlert(true);
      // alert("Please provide a price for transferring ownership.");
      return;
    }

    if (formData.transferOwnership && formData.price.trim() !== "") {
      const data = {
        id,
        body: { sellingPrice: price },
      };

      const res = await updatePremise(data);

      if (res?.data) {
        popClose(null);
        toast.success(`Your Premise Project is Up for Monetizing!`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else if (allowTranslation) {
      const updateBody = {
        ...premiseData,
        monitize_translation_flag: allowTranslation, // this sets it to true or false
      };
      const data = {
        id,
        body: updateBody,
      };

      const res = await updatePremise(data);

      if (res?.data) {
        popClose(null);
        toast.success(`Your Premise Project is Up for Monetizing!`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      popClose(null);
      toast.success(`Your Premise Project is Up for Monetizing!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-screen flex items-end sm:items-center  bg-[#252525b0] justify-center z-[21]">
      {/* <ToastContainer /> */}
      <div className="px-[22px] pb-16 sm:pb-4 bg-white rounded-[8px] w-[100%] sm:w-[623px]">
        {/* close popup */}
        <div className="relative">
          <img
            src={crossIcon}
            alt=""
            className=" absolute right-[45%] top-[-60px] sm:top-[-12px] sm:right-[-34px]"
            onClick={() => popClose(null)}
          />
        </div>

        <h2 className="font-[600] text-[16px] leading-[21px] text-center mt-[18px]">
          Monetizing Preferences
        </h2>
        <p className="text-center text-[14px] mt-[8px] leading-[18px]  font-[400]  text-[#616161] ">
          How would you want to Monetize the Premise Project?
        </p>
        <div className="h-[1px] mt-[3px] w-[77%] mx-auto bg-[#a1a1a1]" />

        <form onSubmit={handleSubmit}>
          <div className="ml-[8px] mt-[27px] flex flex-col gap-[20px]">
            <div className="flex">
              <div className="mr-[12px]">
                <input
                  name="allowTranslation"
                  className="h-[20px] w-[20px]"
                  type="checkbox"
                  checked={formData.allowTranslation}
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-left !text-[14px] !leading-[21px] font-[400] text-[#616161]">
                  By allowing translation of the Premise Project in a language
                  to MNF users for a price of $
                  {premiseData?.pqr_value?.toFixed(2)}.
                </p>
                <p className="text-left !text-[12px] mt-[8px] !leading-[18px] italic font-[400] text-[#616161]">
                  (Please Note that 1/3 of the amount received for translating
                  the Premise project will be retained by MNF.)
                </p>
              </div>
            </div>
          </div>
          <div className="ml-[8px] mt-[27px] flex flex-col gap-[20px]">
            <div className="flex">
              <div className="mr-[12px]">
                <input
                  name="transferOwnership"
                  className="h-[20px] w-[20px]"
                  type="checkbox"
                  checked={formData.transferOwnership}
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-left !text-[14px] !leading-[21px] font-[400] text-[#616161]">
                  By transferring the ownership of the Premise Project
                  <span className="flex">
                    to the interested buyer for a price of $
                    <input
                      ref={priceInputRef}
                      name="price"
                      type="text"
                      placeholder="Please Quote"
                      inputMode="decimal"
                      pattern="^\d*\.?\d*$"
                      className={`max-w-[89px] text-[11px] border border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none rounded-[4px] px-2 ml-2 appearance-none ${
                        formData.transferOwnership
                          ? "cursor-text"
                          : "cursor-not-allowed"
                      }`}
                      value={formData.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleChange(e);
                        }
                      }}
                      disabled={!formData.transferOwnership} // Disable input if transferOwnership is not selected
                    />
                  </span>
                </p>
                <p className="text-left !text-[12px] mt-[8px] !leading-[18px] italic font-[400] text-[#616161]">
                  (Please Note that the price shown to the prospective buyer
                  will be 1.5 times the price quoted by you.)
                </p>
              </div>
            </div>
          </div>
          <div className="w-[88px] mx-auto mt-[12px]">
            <button
              disabled={
                isLoading ||
                !(
                  formData.allowTranslation ||
                  (formData.transferOwnership && formData.price.trim() !== "")
                )
              }
              type="submit"
              className={`${
                isLoading ||
                !(
                  formData.allowTranslation ||
                  (formData.transferOwnership && formData.price.trim() !== "")
                )
                  ? "bg-[#ACDDE7] "
                  : "bg-[#33B0CA]"
              } text-[#fafafa] rounded-[8px] leading-[24px] px-[20px] h-[32px] text-[13px] font-[600]`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
      {alert && (
        <SameNamePop
          popClose={setAlert}
          title={`Please provide a price for transferring ownership.`}
        />
      )}
    </div>
  );
};

export default MonetizePreferencePop;
