import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useGetFilteredLangQuery } from "../../../app/EndPoints/premisePoolApi";

const animatedComponents = makeAnimated();
const RefineFilters = ({
  showRefine,
  setShowRefine,
  setSortOrder,
  setRefetching,
  refetch,
  setText,
  setQueryUser,
  setLanguage,
  languageFilter,
  handleFilterSubmit,
  user,
  selectedLanguages,
  setSelectedLanguages,
}) => {
  // const user = useSelector((state) => state.user.id);

  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();
  // console.log("languages", lang?.languages);

  const [searchText, setSearchText] = useState("");
  const [searchAuthor, setSearchAuthor] = useState(null);
  const [addByMe, setAddByMe] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const [checkDisable, setCheckDisabled] = useState(false);
  // const [selectedLanguages, setSelectedLanguages] = useState();

  // console.log(selectedLanguages);

  const handleLangFilterClear = () => {
    setLanguage("");
    setSelectedLanguages(null);
    refetch();
    setRefetching(true);
    setShowRefine(false);
  };

  const handleMe = (e) => {
    setAddByMe(e.target.checked);
    if (e.target.value) {
      setSearchAuthor(user);
      setAddByMe(!addByMe);
    } else {
      setAddByMe(false);
    }
  };

  useEffect(() => {
    if (searchText.length > 0 || addByMe || selectedLanguages) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [addByMe, searchText, selectedLanguages]);

  // const handleFilterSubmit = () => {
  //   applyFilter(searchText, searchAuthor, selectedLanguages?.value);
  //   addByMe && searchText?.length === 0 && setCheckDisabled(true);
  // };

  const applyFilter = (text, author, language) => {
    // console.log();
    setText(text);
    setQueryUser(author);
    setLanguage(language);
    refetch();
    setRefetching(true);
  };

  const mappedLanguages = lang?.languages?.map((languageObj) => {
    const key = Object.keys(languageObj)[0];
    const value = languageObj[key];

    return {
      value: key,
      label: value,
    };
  });

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px", // Adjust the font size as needed
      padding: "0px 5px", // Adjust the padding to increase the gap between options
      backgroundColor: state.isFocused ? "#1a73e8" : "#fafafa", // Change the background color on hover
      color: state.isFocused ? "#fff" : "#000000", // Change text color on hover
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "10px", // Adjust the gap between the label and the dropdown
    }),
  };
  return (
    <div
      className={` left-0 ${
        showRefine ? "visible" : "invisible"
      } bg-[#FAFAFA] px-[16px] py-[12px] rounded-[8px] w-[324px]  absolute left-[-142px] md:w-[405px] mx:left-[-18px] top-[50px] z-10 border border-[#eaeaea] shadow-lg shadow-[#9a9a9a] `}
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
            <label className="text-[14px] text-[#252525] font-[400] mb-2 ">
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
          {/* <div className="flex items-center">
            <input
              checked={addByMe}
              disabled={checkDisable}
              type="checkbox"
              onChange={handleMe}
              className={`mr-1  ${!checkDisable && " cursor-pointer"}`}
            />
            <label className=" font-[400] text-[14px] !mt-[7px]">
              Added by me
            </label>
          </div> */}
        </div>
        {/* <div>
          <p className="text-[#33B0CA] text-[14px] font-[400] mt-[8px] ml-3">
            Cards will be filtered only after clicking "Apply Filter" button
          </p>
        </div> */}
        <div className="flex flex-row-reverse gap-4 mt-[8px]">
          <button
            disabled={disabled}
            className={` px-4 py-[4px] text-[14px] font-[400] text-white rounded-[8px] ${
              disabled ? "bg-[#9A9A9A]" : "bg-[#33B0CA]"
            }`}
            onClick={() => {
              handleFilterSubmit();
              languageFilter(selectedLanguages?.value);
              setShowRefine(false);
            }}
          >
            Apply filter
          </button>
          <button
            disabled={disabled}
            className={`clear-m px-4 py-[2px] text-[14px] font-[400] rounded-[8px] ${
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

export default RefineFilters;
