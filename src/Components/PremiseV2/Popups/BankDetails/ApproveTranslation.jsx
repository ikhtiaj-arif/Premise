import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useUpdateRequestForSaleOrTranslateMutation } from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";

const ApproveTranslationPop = ({
  popClose,
  translationRequests,
  bankDetails,
  premiseId,
}) => {
  // console.log(translationRequests, bankDetails);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [updateTranslationSale] = useUpdateRequestForSaleOrTranslateMutation();
  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedRequests(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((reqId) => reqId !== id) // Deselect if already selected
          : [...prevSelected, id] // Add to selection
    );
  };

  // Handle Proceed button click
  const handleProceed = async () => {
    const data = {
      premise_id: premiseId,
      bank_details: JSON.stringify(bankDetails),
      request_ids: JSON.stringify(selectedRequests)
    };
    try {
      const res = await updateTranslationSale(data);
      console.log("Selected Requests:", res);
      popClose()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
      <ToastContainer />
      <div className=" h-[100vh] lg:h-[407px] mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[605px]  md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />
        <div className="h-[96px]">
          <h2 className="font-[500] text-[36px] pt-[40px]  text-center ">
            Doodle
          </h2>
        </div>
        <h2 className="font-[700] text-[14px] leading-[19.9px] text-center mt-[18px]">
          Your Premise Project is Up for Monetizing
        </h2>
        <div className="h-[1px] mt-[8px] w-[65%] mx-auto bg-[#a1a1a1]" />
        <div className="mt-[12px]">
          <p className="text-center text-[14px] leading-[21px]  font-[400]  text-[#616161] ">
            Tick the following request for allowing translation of this Premise
            Project.
          </p>

          <div className="w-[70%] mx-auto mt-[20px]">
            {/* Header */}

            {/* Table-like structure */}
            <div className="grid grid-cols-12 items-center gap-[18px]">
              {/* Header Row */}
              <div className="col-span-2"></div>
              <div className="col-span-4">
                <h2 className="font-[500] text-[14px] leading-[19.9px] text-center ">
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
              <div className="grid grid-cols-12 gap-[18px] w-[100%] mx-auto mt-[4px]">
                <div className="col-span-2 flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="h-[20px] w-[20px]"
                    value={request.id}
                    onChange={() => handleCheckboxChange(request.id)}
                  />
                </div>
                <div className="col-span-4 flex items-center justify-center">
                  <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
                    {request.user}
                  </p>
                </div>
                <div className="col-span-6 flex items-center justify-center">
                  <p className="text-center text-[14px] leading-[21px] font-[400] text-[#616161]">
                    {request.requestToLang}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" w-[88px] mx-auto mt-[72px]">
          <button
            onClick={handleProceed}
            className={`${"bg-[#33B0CA]"}  text-[#fafafa] rounded-[8px] leading-[24px] px-[20px] py-[2px] text-[13px] font-[600] `}
          >
            Proceed
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default ApproveTranslationPop;
