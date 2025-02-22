import React from "react";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, content }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[21]">
      {isOpen && (
        <div className="modal_css fixed inset-0 flex items-center justify-center z-50">
          <div className="w-[90%] mx-auto max-w-[510px] bg-[#fafafa]  rounded-xl ">
            <div className="flex flex-col justify-between h-auto px-[18px]">
              <p className="text-[14px] lg:text-[24px] text-[#252525] text-center lg:leading-10 font-[500] mt-10">
                {title}
              </p>
              <div className="h-[93px] pb-[14px] flex items-center gap-10 justify-center px-[40px]">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className=" font-[500] border !border-[#33B0CA] text-[#33B0CA] h-[34px] w-[99px] text-[14px] rounded-[8px]   hover:text-white hover:bg-[#33B0CA] "
                >
                  No
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="bg-[#33B0CA]  font-[500] text-white h-[34px] w-[99px] text-[14px] rounded-[8px] "
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmationModal;
