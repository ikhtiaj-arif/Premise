import React from "react";
import "./Premise.css";

const LanguageSelector = ({
  setSelectedLanguage,
  setKeyboardVisible,
  selectedLanguage,
}) => {
  // console.log(selectedLanguage);

  const options = [
    "Arabic",
    "Assamese",
    "Bengali",
    "Burmese",
    "English",
    "Farsi",
    "Georgian",
    "Gilaki",
    "Greek",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Italian",
    "Japanese",
    "Kannada",
    "Korean",
    "Malayalam",
    "Nigerian",
    "Nko",
    "Norwegian",
    "Sindhi",
    "Spanish",
    "Thai",
    "Urdu",
    "Uyghur",
  ];

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setKeyboardVisible(true);
  };

  return (
    <select
      onChange={handleLanguageChange}
      value={selectedLanguage}
      className="notranslate bg-[#FAFAFA] border-none w-auto max-w-[89px] text-[14px] text-[#616161] font-[400] focus:outline-none"
      // className="border border-[#EAEAEA] p-1 rounded-[4px] w-3/4 text-[12px]"
    >
      {options?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
