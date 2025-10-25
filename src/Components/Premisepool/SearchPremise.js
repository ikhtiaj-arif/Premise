import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useGetFilteredLangQuery } from "../../app/EndPoints/premisePoolApi";
import "./Premise.css";

const animatedComponents = makeAnimated();

const SearchPremise = ({
  setText,
  setQueryUser,
  setLanguage,
  refetch,
  setRefetching,
}) => {
  const user = useSelector((state) => state.user.id);

  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();

  const [searchText, setSearchText] = useState("");
  const [searchAuthor, setSearchAuthor] = useState(null);
  const [addByMe, setAddByMe] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [checkDisable, setCheckDisabled] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState();

  // console.log(lang);

  const handleFilterClear = () => {
    setAddByMe(false);
    setText("");
    setSearchAuthor(null);
    setSearchText("");
    setLanguage("");
    setSelectedLanguages(null);
    setQueryUser(null);
    setCheckDisabled(false);
    refetch();
    setRefetching(true);
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

  const handleFilterSubmit = () => {
    applyFilter(searchText, searchAuthor, selectedLanguages?.value);
    addByMe && searchText?.length === 0 && setCheckDisabled(true);
  };

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
  //console.log(lang);
  return (
    <div className={`${showRefine ? "h-[auto]" : "h-14"}`}>
      <div
        className="flex justify-between  items-center bg-[#EAEAEA] h-[44px] px-[18px] cursor-pointer rounded-[8px] mb-[10px]"
        onClick={() => setShowRefine(!showRefine)}
      >
        <div className="text-[14px] text-[#252525] text-left font-[600] ">
          Refine Results
        </div>
        {/* collapse part */}
        {showRefine ? <FaAngleUp /> : <FaAngleDown />}
      </div>

      <div
        className={` ${
          showRefine ? "visible" : "invisible"
        } bg-[#FAFAFA] px-[36px] py-[12px] rounded-[8px]`}
      >
        {/* <p className="font-semibold mb-2">Search parameters</p> */}
        <div className="lg:flex w-full gap-[30px] xl:gap-[50px] items-center mx-3">
          <div className="lg:w-2/5">
            <label className="text-[16px] text-[#252525] font-[600]  mb-2">
              Search parameters
            </label>
            <input
              type="search"
              className="w-full flex-1 border border-[#EAEAEA]  focus:border-[#00c3ff] focus:outline-none text-[#616161] bg-[#FAFAFA]  rounded-[8px] px-2 h-[42px] text-[14px] "
              name=""
              id=""
              placeholder="Premise contains..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                // setSearchAuthor(e.target.value);
              }}
            />
          </div>
          <div className="lg:w-2/5">
            <label className="text-[14px] text-[#252525] font-[600]  mb-2 ">
              Choose A Language
            </label>
            <Select
          
              className={`${showRefine ? "visible" : "hidden"}`}
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
          <div className="!mt-[26px] flex items-center">
            <input
              checked={addByMe}
              disabled={checkDisable}
              type="checkbox"
              onChange={handleMe}
              className={`mr-1  ${!checkDisable && " cursor-pointer"}`}
            />
            <label className=" font-[600] text-[14px] !mt-[7px]">Added by me</label>
          </div>
        </div>
        <div>
          <p className="text-[#00c3ff] text-[14px] font-[400] mt-[8px] ml-3">
            Cards will be filtered only after clicking "Apply Filter" button
          </p>
        </div>
        <div className="flex flex-row-reverse gap-4 mt-[8px]">
          <button
            disabled={disabled}
            className={` px-4 py-[2px] text-[14px] font-[400] text-white rounded-[8px] ${
              disabled  ? "bg-[#ACDDE7] "
                : "bg-[#00c3ff] "
            }`}
            onClick={handleFilterSubmit}
          >
            Apply filter
          </button>
          <button
            disabled={disabled}
            className={` px-4 py-[2px] text-[14px] font-[400] rounded-[8px] ${
              disabled
                ? "bg-[#ACDDE7] "
                : "bg-[#FAFAFA] text-[#00c3ff] border border-[#00c3ff] "
            }`}
            onClick={handleFilterClear}
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPremise;
