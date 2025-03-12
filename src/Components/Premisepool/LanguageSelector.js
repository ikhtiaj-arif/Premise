import React from "react";
import { options } from "./options";

const LanguageSelector = ({
  setSelectedLanguage,
  setKeyboardVisible,
  selectedLanguage,
}) => {

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setKeyboardVisible(true);
  };

  // Sort options alphabetically
  const sortedOptions = options?.sort((a, b) => a.localeCompare(b));

  return (
    <select
      onChange={handleLanguageChange}
      value={selectedLanguage}
      className="text-[14px] border-none text-[#616161] focus:outline-none border w-3/4"
    >
      {/* <option selected value="" disabled>Select Language</option> */}
      {sortedOptions?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
