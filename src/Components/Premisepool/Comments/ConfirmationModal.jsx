function ConfirmationModal({ isOpen, onClose, onConfirm, title, content }) {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-screen flex items-center bg-[#252525b0] justify-center z-[21]">
      {isOpen && (
        <div className="modal_css ">
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
                  className=" font-[500] border !border-[#00c3ff] text-[#00c3ff] h-[34px] w-[99px] text-[14px] rounded-[8px]   hover:text-white hover:bg-[linear-gradient(30deg,#741CFF,#00c3ff)] "
                >
                  No
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="bg-[linear-gradient(30deg,#741CFF,#00c3ff)]  font-[500] text-white h-[34px] w-[99px] text-[14px] rounded-[8px] "
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
