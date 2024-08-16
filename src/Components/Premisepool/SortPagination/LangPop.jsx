import React from 'react';

const LangPop = ({showRefine,handleFilterSubmit
    ,setShowRefine,handleLangFilterClear}) => {
    return (
        <div
        className={` left-0 ${
          showRefine ? "visible" : "invisible"
        } bg-[#FAFAFA] px-[16px] py-[12px] rounded-[8px] md:w-[404px] absolute left-[-18px] top-[50px] z-10 border border-[#eaeaea] shadow-lg shadow-[#9a9a9a] `}
      >
        <div>
          {/* <p className="font-semibold mb-2">Search parameters</p> */}
          <div className="w-full r mx-3">
            {/* <div className="lg:w-2/5">
              <label className="text-[16px] text-[#252525] font-[600]  mb-2">
                Search parameters
              </label>
              <input
                type="search"
                className="w-full flex-1 border text-[#616161] bg-[#FAFAFA] border-[#EAEAEA] rounded-[8px] px-2 h-[42px] text-[14px] focus:outline-none"
                name=""
                id=""
                placeholder="Premise contains..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  // setSearchAuthor(e.target.value);
                }}
              />
            </div> */}
            <div className="w-[95%]">
              <label className="text-[14px] text-[#252525] font-[400]  mb-2 ">
                Choose A Language
              </label>
              <Select
                className={`${showRefine ? "visible" : "hidden"} text-[14px]`}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 8,
                  height: 42,
  
                  colors: {
                    ...theme.colors,
                    primary25: "#EAEAEA",
                    primary: "#EAEAEA",
                  },
                })}
                styles={customStyles}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={mappedLanguages}
                onChange={handleLanguageChange}
                value={selectedLanguages}
              />
            </div>
          
          </div>
         
          <div className="flex flex-row-reverse gap-4 mt-[8px]">
            <button
              disabled={disabled}
              className={` px-4 py-[4px] text-[14px] font-[400] text-white rounded-[8px] ${
                disabled ? "bg-[#9A9A9A]" : "bg-[#33B0CA]"
              }`}
              onClick={() => {
                handleFilterSubmit();
                setShowRefine(false);
              }}
            >
              Apply filter
            </button>
            <button
              disabled={disabled}
              className={` px-4 py-[2px] text-[14px] font-[400] rounded-[8px] ${
                disabled
                  ? "bg-[#9A9A9A] text-white"
                  : "bg-[#FAFAFA] text-[#33B0CA] border !border-[#33B0CA] "
              }`}
              onClick={handleLangFilterClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
};

export default LangPop;