import { forwardRef } from "react";
import { CgSearch } from "react-icons/cg";

const SearchInPremise = forwardRef(
  (
    { setSearchText, searchText, handleFilterSubmit, handleSearchChange },
    ref
  ) => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleFilterSubmit();
      }
    };
    // function for enter key press submission
    return (
      <div
        className={`flex border items-center border-[#B4B4B4] px-[14px] h-[32px] rounded-full`}
      >
        <input
          ref={ref}
          type="search"
          className="w-full flex-1 px-2 h-[30px] text-[14px] border border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none"
          name=""
          id=""
          placeholder="Premise contains"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            // handleFilterSubmit();
            handleSearchChange(e.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <>
          <CgSearch
            onClick={handleFilterSubmit}
            className="h-[20px] w-[20px] "
          />
        </>
      </div>
    );
  }
);

export default SearchInPremise;
