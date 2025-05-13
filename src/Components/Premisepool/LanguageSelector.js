import React from "react";
import Select from "react-select";
import { options } from "./options";

const LanguageSelector = ({
  setSelectedLanguage,
  setKeyboardVisible,
  selectedLanguage,premiseLanguage
}) => {
  // console.log(selectedLanguage);


  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setKeyboardVisible(true);
  };

  // Sort options alphabetically
  const sortedOptions = options?.sort((a, b) => a.localeCompare(b));

  return (
    // <select  disabled={premiseLanguage}
    //   onChange={handleLanguageChange}
    //   value={selectedLanguage}
    
    //   className="text-[14px] border-none bg-[#fafafa] text-[#616161] focus:outline-none border w-full"
    // >
    //   <option selected value="" disabled>Select Language</option>
    //   {sortedOptions?.map((option) => (
    //     <option key={option} value={option}>
    //       {option}
    //     </option>
    //   ))}
    // </select>
    <div className="w-full">
    <Select
      isDisabled={premiseLanguage}
      onChange={(selectedOption) => {
        handleLanguageChange({ target: { value: selectedOption?.value || "" } });
      }}
      value={sortedOptions?.map(option => ({
        value: option,
        label: option
      })).find(option => option.value === selectedLanguage) || null}
      options={sortedOptions?.map(option => ({
        value: option,
        label: option
      }))}
      placeholder="Select Language"
      menuPortalTarget={document.body}
      menuPosition="fixed"
      styles={{
        container: (base) => ({
          ...base,
          width: '100%', // Ensure container is full width
        }),
        control: (base) => ({
          ...base,
          minHeight: "unset",
          height: "auto",
          fontSize: "14px",
          border: "none",
          backgroundColor: "#fafafa",
          boxShadow: "none",
          padding: "0",
          margin: "0",
          width: '100%', // Ensure control is full width
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0",
          width: '100%', // Ensure value container is full width
        }),
        input: (base) => ({
          ...base,
          margin: "0",
          padding: "0",
          color: "#616161",
          width: '100%', // Ensure input is full width
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "auto",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: "0 8px",
        }),
        clearIndicator: (base) => ({
          ...base,
          padding: "0 8px",
        }),
        menu: (base) => ({
          ...base,
          fontSize: "14px",
          marginTop: "2px",
          zIndex: 9,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          width: '100%', // Ensure menu is full width
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9,
        }),
        option: (base, state) => ({
          ...base,
          fontSize: "14px",
          padding: "8px",
          borderRadius:"4px",
          marginTop: 0,
          backgroundColor: state.isFocused ? "#33b0ca" : "#fafafa",
          color: state.isFocused ? "#ffffff" : "#616161",
          cursor: "pointer",
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: "14px",
          color: "#616161",
        }),
        singleValue: (base) => ({
          ...base,
          fontSize: "14px",
          color: "#616161",
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          maxWidth: '100%', // Ensure text doesn't overflow
        }),
      }}
      className="w-full" // Add className for width
      classNamePrefix="language-select"
    />
  </div>
  );
};

export default LanguageSelector;
