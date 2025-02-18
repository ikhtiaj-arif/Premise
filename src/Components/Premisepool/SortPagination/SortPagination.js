import { useContext, useEffect, useRef, useState } from "react";
import { BsFire } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { ImCross, ImUserCheck } from "react-icons/im";
import { useSelector } from "react-redux";
import { useGetFilteredLangQuery } from "../../../app/EndPoints/premisePoolApi";
// import activeLangIcon from "../../../img/Icons/activeLangIcon.png";
// import langIcon from "../../../img/Icons/langIcon.png";
import { MyContext } from "../../../App";
import calB from "../../../img/Icons/calB.png";
import calG from "../../../img/Icons/calG.png";
import langB from "../../../img/Icons/langB.png";
import langG from "../../../img/Icons/langG.png";
import "../Premise.css";
import RefineFilters from "./RefineFilters";
import "./SortPagi.css";

const SortPagination = ({
  data,
  setCurrentPage,
  setItemsToShow,
  setSortedData,
  setSortOrder,
  setRefetching,
  refetch,
  setText,
  setQueryUser,
  setLanguage,
  sortOrder,
  sortedData,
  language,
  activeSearch,
  setActiveSearch,
  showRefine,
  setShowRefine,
  dataCount,
  hiddenCountRes,

  // activeAddedByMe, setActiveAddedByMe
}) => {
  const { totalPages, currentPage, next, pre } = data;
  const {
    activeAddedByMe,
    setActiveAddedByMe,
    addedByMeCondition,
    setAddedByMeCondition,
    searchText,
    setSearchText,
    searchAuthor,
    setSearchAuthor,
  } = useContext(MyContext);

  const searchInputRef = useRef(null);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
    setRefetching(true);
  };

  const handleOrder = () => {
    setSortOrder("ascending");

    setRefetching(true);
  };
  const [byDateSort, setByDateSort] = useState(false);
  const [clearDate, setClearDate] = useState(false);
  const [byPopuSort, setByPopuSort] = useState(false);
  const [clearPopu, setClearPopu] = useState(false);
  const [addByMe, setAddByMe] = useState(false);
  const { selectedLanguages, setSelectedLanguages } = useContext(MyContext);
  const [filter, setFilter] = useState("");

  const sortBy = () => {
    if (byDateSort) {
      setSortedData("date");
    }
    if (byPopuSort) {
      setSortedData("popularity");
    }
    if (byDateSort && byPopuSort) {
      setSortedData("date&popularity");
      // console.log("date&popularity");
    }
    // setSortedData(e.target.value);
    setRefetching(true);
  };

  const languageFilter = (lang) => {
    setLanguage(lang);
  };

  const handleShow = (e) => {
    setItemsToShow(parseInt(e.target.value));
    setCurrentPage(1);
    setRefetching(true);
  };

  // const [searchAuthor, setSearchAuthor] = useState(null);
  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();
  // console.log("languages", lang);
  const user = useSelector((state) => state?.user?.id);

  const handleFilterSubmit = () => {
    // console.log("xxxxxxx",searchText, searchAuthor, addByMe);
    applyFilter(searchText, searchAuthor, selectedLanguages?.value);
    // addByMe && searchText?.length === 0 && setCheckDisabled(true);
  };

  const [notifyText, setNotifyText] = useState("");
  const handleSearchSubmit = (e) => {
    // Ensure e is defined before calling preventDefault
    if (e) {
      e.preventDefault();
    }
    if (searchText.length < 3) {
      return;
    }
    applyFilter(searchText, searchAuthor, selectedLanguages?.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e); // Pass the event object to handleSearchSubmit
    }
  };
  // const handleSearchChange = (value) => {
  //   // console.log('value', value);
  //   if (value === "") {
  //     handleFilterClear();
  //   } else {
  //     handleFilterSubmit();
  //   }
  // };
  const [textLen, setTextLen] = useState(null);

  useEffect(() => {
    if (textLen > 0 && textLen < 3) {
      setNotifyText("Minimum 3 characters");
    } else {
      setNotifyText("");
    }
  }, [textLen]);

  const handleSearchChange = (value) => {
    setTextLen(value.length);
    setSearchText(value);
    if (value === "") {
      handleSearchClear();
    } else {
      // handleSearchSubmit()
      // handleFilterSubmit(); // Optionally, you can call handleFilterSubmit here if needed
    }
  };

  const applyFilter = (text, author, language) => {
    // console.log();
    setText(text);
    setQueryUser(author);
    setLanguage(language);
    refetch();
    setRefetching(true);
  };

  const handleOwnerClear = () => {
    setSearchAuthor(null);
    setAddByMe(false);
    setQueryUser(null);
    refetch();
    setRefetching(true);
    setAddedByMeCondition(false);
  };

  const handleSearchClear = () => {
    setText("");
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

  // const [activeAddedByMe, setActiveAddedByMe] = useState(false);
  const [clearActiveMe, setClearActiveMe] = useState(false);
  // const [activeSearch, setActiveSearch] = useState(false);

  const handleButtonClick = () => {
    setActiveSearch(!activeSearch);

    // searchInputRef?.current?.focus();
  };

  useEffect(() => {
    if (activeSearch) {
      searchInputRef?.current?.focus();
    }
  }, [activeSearch]);
  // console.log(activeSearch);

  // added by owner
  useEffect(() => {
    if (activeAddedByMe && user) {
      setSearchAuthor(user);
      handleFilterSubmit();
      setClearActiveMe(true);
    } else if (clearActiveMe && !activeAddedByMe) {
      // console.log("byme clear")
      handleOwnerClear();
      setClearActiveMe(false);
    }
    // console.log("activeAddedByMe", activeAddedByMe);
  }, [activeAddedByMe, clearActiveMe]);

  // useEffect(()=>{
  //   if(searchAuthor){
  //     handleFilterSubmit();

  //   }
  // },[searchAuthor])

  // date
  useEffect(() => {
    if (byDateSort) {
      sortBy();
      handleOrder();
      setClearDate(true);
    } else if (clearDate && !byDateSort) {
      // console.log("Date clear");
      handleDateClear();
      setClearDate(false);
    }
    // console.log("activeAddedByMe", activeAddedByMe)
  }, [clearDate, byDateSort]);

  // popu
  useEffect(() => {
    if (byPopuSort) {
      sortBy();
      setClearPopu(true);
    } else if (clearPopu && !byPopuSort) {
      handlePopularityClear();
      setClearPopu(false);
    }
  }, [byPopuSort, byPopuSort]);

  const handlePopularityClear = () => {
    if (byDateSort) {
      setSortedData("date");
      refetch();
      setRefetching(true);
    } else {
      setSortedData("");
      refetch();
      setRefetching(true);
    }
  };
  const handleDateClear = () => {
    if (byPopuSort) {
      setSortedData("popularity");
      refetch();
      setRefetching(true);
    } else {
      setSortedData("");
      refetch();
      setRefetching(true);
    }
  };

  const langBtnRef = useRef();

  useEffect(() => {
    const closeMenu = (e) => {
      if (!langBtnRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setShowRefine(null);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className={``}>
      <div className="flex gap-[16px] w-full lg:w-[94%] xl:w-full xl:justify-end items-center  lg:mt-[-37px] ">
        {
          <p className=" hidden md:flex w-[233px]  items-center text-[14px] text-[#252525] h-[32px] font-[500]">
            {hiddenCountRes?.total_premises === 1 ? (
              <p>
                {hiddenCountRes?.total_premises}{" "}
                <span className="premise-m">Premise</span>
              </p>
            ) : (
              <p>
                {hiddenCountRes?.total_premises}{" "}
                <span className="premises-m">Premises</span>
              </p>
            )}
            ,{" ("}
            {hiddenCountRes?.hidden_count} Private{")"}
          </p>
        }

        {/* <img src={premiseImage} alt="premise image" className="w-[103.07px] md:w-[115.07px]"/> */}
        <div
          className={`flex relative items-center gap-[16px] w-full md:w-[72%] justify-end py-2 md:bg-none  ${
            activeSearch ? "bg-none" : "bg-[#EAEAEA] md:bg-[#fff]"
          }`}
        >
          <div
            className={`flex items-center gap-[16px] justify-end py-2 ${
              activeSearch ? "hidden" : " block"
            }`}
          >
            {/* <p className=" md:hidden text-[14px] text-[#252525] h-[32px] font-[500]">
              {dataCount} Premises
            </p> */}

         
            <button
              data-te-toggle="tooltip"
              title="Added by me"
              className={`h-[32px] w-[32px] rounded-full ${
                !activeAddedByMe ? "bg-[#252525]" : "bg-[#33B0CA]"
              }`}
              onClick={() => setActiveAddedByMe(!activeAddedByMe)}
            >
              <ImUserCheck className="text-[#fafafa] mx-auto" />
            </button>

            <div
              data-te-toggle="tooltip"
              title="Sort by language"
              className="relative"
            >
              <div
                ref={langBtnRef}
                className={`h-[32px] w-[32px] rounded-full cursor-pointer
             ${!selectedLanguages ? "bg-[#252525]" : "bg-[#33B0CA]"}`}
                onClick={() => setShowRefine(!showRefine)}
              >
                {!selectedLanguages ? (
                  <img
                    src={langB}
                    alt=""
                    className="h-[22px] w-[20px] mx-auto mt-[3px] absolute top-[1px] left-[6px]"
                  />
                ) : (
                  <img
                    src={langG}
                    alt=""
                    className="h-[22px] w-[20px] mx-auto mt-[3px] absolute top-[1px] left-[6px]"
                  />
                )}
              </div>

              <RefineFilters
                user={user}
                showRefine={showRefine}
                setShowRefine={setShowRefine}
                setSortOrder={setSortOrder}
                setRefetching={setRefetching}
                refetch={refetch}
                setText={setText}
                setQueryUser={setQueryUser}
                setLanguage={setLanguage}
                languageFilter={languageFilter}
                handleFilterSubmit={handleFilterSubmit}
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
              />
            </div>

            {/* <button
              className={`h-[32px] w-[32px] rounded-full ${
                !byDateSort ? "bg-[#252525]" : "bg-[#33B0CA]"
              }`}
              onClick={() => setByDateSort(!byDateSort)}
            >
              <FaRegCalendarAlt className="text-[#fafafa] mx-auto" />
            </button> */}
            <div
              data-te-toggle="tooltip"
              title="Sort by date"
              onClick={() => {
                setShowRefine(null);
                setByDateSort(!byDateSort);
              }}
              className={`h-[32px] w-[32px] rounded-full cursor-pointer relative ${
                !byDateSort ? "bg-[#252525]" : "bg-[#33B0CA]"
              }`}
            >
              {!byDateSort ? (
                <img
                  src={calB}
                  alt=""
                  className="h-[16px] w-[21px] mx-auto absolute top-[7px] left-[7px] "
                />
              ) : (
                <img
                  src={calG}
                  alt=""
                  className="h-[17px] w-[21px] mx-auto absolute top-[6px] left-[7px] "
                />
              )}
            </div>

            <button
              data-te-toggle="tooltip"
              title="Popularity"
              className={`h-[32px] w-[32px] rounded-full ${
                !byPopuSort ? "bg-[#252525]" : "bg-[#33B0CA]"
              }`}
              onClick={() => {
                setByPopuSort(!byPopuSort);
              }}
            >
              <BsFire className="text-[#fafafa] mx-auto" />
            </button>

            <button
              className={`custom-searchBtn h-[32px] w-[32px] rounded-full 
             bg-[#252525] 
            `}
              onClick={() => handleButtonClick()}
              // onBlur={() =>  setActiveSearch(false)}
            >
              <FiSearch className="text-[#fafafa] mx-auto w-full" />
            </button>
          </div>

          <div className={`${activeSearch ? "w-full" : ""}`}>
            {activeSearch && (
              <div
                className={`flex border items-center border-[#B4B4B4] w-[80%] mx-auto px-[14px] h-[42px] my-2 rounded-full`}
              >
                <form
                  className="flex items-center w-full"
                  onSubmit={handleSearchSubmit}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full flex-1 px-2 h-[40px] text-[14px] focus:outline-none"
                    name="search"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown} // Handle Enter key press
                  />
                  {searchText.length >= 1 && (
                    <ImCross
                      className="text-[10px] cursor-pointer"
                      onClick={() => {
                        setSearchText("");
                        handleSearchClear();
                      }}
                    />
                  )}
                  <button type="submit" className="ml-2">
                    <FiSearch className="h-[20px] w-[20px]" />
                  </button>
                </form>
              </div>

              // <SearchInPremise
              // ref={searchInputRef}
              // onBlur={() => setActiveSearch(false)}
              // setSearchText={setSearchText}
              // searchText={searchText}
              // handleFilterSubmit={handleFilterSubmit}
              // handleOnfocus={handleOnfocus}
              // handleSearchChange={handleSearchChange}
              // />
            )}
            <div
              className={`custom-srch_input border  border-[#B4B4B4] mx-auto px-[14px] h-[32px] my-2 rounded-full`}
            >
              <form className="flex items-center" onSubmit={handleSearchSubmit}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full flex-1 px-2  h-[28px] text-[14px] focus:outline-none"
                  name="search"
                  id=""
                  maxLength="30"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                  onBlur={() => setActiveSearch(false)} // You can handle onBlur as needed
                />
                {searchText.length >= 1 && (
                  <ImCross
                    className="text-[10px] cursor-pointer"
                    onClick={() => {
                      setSearchText("");
                      handleSearchClear();
                    }}
                  />
                )}
                <button type="submit" className="ml-2">
                  <FiSearch className="h-[20px] w-[20px]" />
                </button>
              </form>
            </div>
            <p className="absolute top-[58px] md:top-[48px] right-[46px] lg:right-0 text-[12px] leading-[14px] text-red-500">
              {notifyText}
            </p>
          </div>
        </div>

        {/* <div className="mb-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center border bg-[#EAEAEA] px-[8px] h-[32px] rounded-[10px]">
              <p className=" text-[14px] font-[600] text-[#252525] mr-[4px]">
                Page
              </p>
              <ReactPaginate
                previousLabel={
                  <FaChevronLeft
                    className={
                      pre === null &&
                      "cursor-disabled-PremisePool text-[12px] text-[#9a9797]"
                    }
                  />
                }
                nextLabel={
                  <FaChevronRight
                    className={
                      next === null &&
                      "cursor-disabled-PremisePool text-[#9a9797]"
                    }
                  />
                }
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination-premise"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SortPagination;
