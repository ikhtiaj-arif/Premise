import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { allLanguages } from "../../Hooks/Languages";

const Dropdown = ({
  label,
  value,
  options,
  onSelect,
  selectedValue,
  placeholder,
  //   tooltipText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //   const LanguageDisplay = (language) => {
  //     return allLanguages[language];
  //   };
  return (
    <div className="" ref={dropdownRef}>
      <div className="pt-1 md:pt-4">
        {/* <label
          className="block text-[14px] text-[#252525] mb-1"
          htmlFor={label}
        >
          {label}
        </label> */}
        <div
          className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] w-full md:w-[221px] ${
            selectedValue ? "border-[#00c3ff]" : "border-[#EAEAEA]"
          }`}
        >
          <div
            onClick={toggleDropdown}
            className=" bg-[#fafafa] h-[27px] rounded-[4px] py-[5px] w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none cursor-pointer flex justify-between items-center"
          >
            <span>
              {" "}
              {value || placeholder}
              {/* {placeholder === "Select Language"
                ? LanguageDisplay(value) || placeholder
                : value || placeholder} */}
            </span>
            <span
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              style={{ fontSize: "16px", color: "#252525" }}
            >
              {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </div>

          {/* {tooltipText && (
            <Tooltip text={tooltipText} position="bottom">
              <span className="w-7 h-7 text-[#00c3ff] cursor-pointer"></span>
            </Tooltip>
          )} */}

          {isOpen && (
            <ul className="absolute  shadow-md w-full bg-[#fafafa] border-[1px] border-[#EAEAEA] rounded-[4px] max-h-[150px] overflow-y-auto z-10">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="text-[#252525] text-[14px] px-[8px] py-[4px] hover:bg-[#00c3ff] hover:text-[#fafafa] cursor-pointer"
                  onClick={() => handleSelectOption(option.value)}
                >
                  {option.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
