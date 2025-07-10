const CharacterSaveAlert = ({
  popClose,
  handleDelete,
  handleSaveBeforeDelete,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center lg:mt-[0px] bg-[#252525b0] justify-center z-[999]">
      <div
        className=" h-[30vh] lg:h-auto mb-[20px] px-[22px] lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]
        md:w-[405px] md:mx-auto relative md:rounded-[8px]"
      >
        <div className="absolute top-[-76px] md:top-[-12px] right-[45%] ml-4 sm:ml-0 md:right-[-15px]">
          <button
            onClick={() => popClose(null)}
            className=" bg-[#EE3C4D] text-white rounded-full w-8 h-8  items-center justify-center shadow"
          >
            ✕
          </button>
        </div>
        <div className="px-[14px] md:px-[20px] py-12 md:py-[20px]">
          <h1 className="text-[14px] md:text-[16px] text-center">
            You have unsaved changes. Please save your work before deleting any
            character to avoid losing data.
          </h1>
          <div className="flex justify-center my-[20px] gap-4 mt-[20px]">
            <button
              onClick={() => {
                popClose();
                handleDelete();
              }}
              className="border border-[#33B0CA]  ml-[10px] font-[500] text-[#33B0CA] h-[30px] md:h-[34px] w-[100px] text-[14px] rounded-[8px] hover:shadow-md shadow-[#252525]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSaveBeforeDelete();
                popClose(null);
              }}
              className="bg-[#33B0CA]  ml-[10px] font-[500] text-white h-[30px] md:h-[34px] w-[100px] text-[14px] rounded-[8px] hover:shadow-md shadow-[#252525]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSaveAlert;
