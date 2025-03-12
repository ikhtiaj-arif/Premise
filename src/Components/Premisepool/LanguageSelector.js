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
//  const options = [
//     "Filipino",
//     "Hindi",
//     "Burmese",
//     "English",
//     "Urdu",
//     "Arabic",
//     "Kannada",
//     "Tamil",
//     "Bulgarian",
//     "Bengali",
//     "Malayalam",
//     "Russian",
//     "Serbian",
//     "Ukrainian",
//     "Portugese",
//     "Croatian",
//     "Irish",
//     "Albanian",
//     "Marathi",
//     "Persian",
//     "Telugu",
//     "Turkish",
//     "Hungarian",
//     "Italian",
//     "Romanian",
//     "Punjabi",
//     "Gujarati",
//     "Oriya",
//     "Chinese-Simplified",
//     "Chinese-Traditional",
//     "Nepali",
//     "French",
//     "Spanish",
//     "Indonesian",
//     "Greek",
//     "Japanese",
//     "Javanese",
//     "Korean",
//     "Belarusian",
//     "Uzbek",
//     "Sindhi",
//     "Afrikaans",
//     "German",
//     "Icelandic",
//     "Igbo",
//     'Ukranian',
//     "Latin",
//     "Portuguese",
//     "Myanmar",
//     "Thai",
//     "Sundanese",
//     "Lao",
//     "Amharic",
//     "Sinhala",
//     "Azerbaijani",
//     "Kazakh",
//     "Macedonian",
//     "Bosnian",
//     "Pashto",
//     "Malagasy",
//     "Malay",
//     "Yoruba",
//     "Czech",
//     "Danish",
//     "Dutch",
//     "Tagalog",
//     "Norwegian",
//     "Slovenian",
//     "Swedish",
//     "Vietnamese",
//     "Welsh",
//     "Hebrew",
//     "Armenian",
//     "Khmer",
//     "Georgian",
//     "Mongolian",
//     "Kurdish",
//     "Kyrgyz",
//     "Turkmen",
//     "Finnish",
//     "Haitian Creole",
//     "Hawaiian",
//     "Lithuanian",
//     "Luxembourgish",
//     "Maltese",
//     "Polish",
//     "Esperanto",
//     "Tatar",
//     "Uyghur",
//     "Hausa",
//     "Somali",
//     "Swahili",
//     "Yiddish",
//     "Basque",
//     "Catalan",
//     "Cebuano",
//     "Corsican",
//     "Estonian",
//     "Frisian",
//     "Galician",
//     "Hmong",
//     "Kinyarwanda",
//     "Latvian",
//     "Maori",
//     "Samoan",
//     "Scots Gaelic",
//     "Sesotho",
//     "Shona",
//     "Slovak",
//     "Xhosa",
//     "Zulu",
//     "Nyanja"
//   ];
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setKeyboardVisible(true);
  };

  return (
    <select
      onChange={handleLanguageChange}
      value={selectedLanguage}
      className="notranslate bg-[#FAFAFA] border-none w-auto max-w-[99px] text-[14px] text-[#616161] font-[400] focus:outline-none"
      // className="border border-[#EAEAEA] p-1 rounded-[4px] w-3/4 text-[12px]"
    >
      {options?.map((option) => (
        <option  key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
